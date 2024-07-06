function EffectTinder({ swiper, on }) {
  let isTouching,
    isTinderEffect,
    previousActiveIndex,
    isAnimating,
    isSlideChangePending,
    currentTouchOffsetX;

  swiper.tinder = {
    no() {
      swiper.touches.currentX = 0;
      swiper.touches.startX = swiper.size / 2;

      const activeSlide = swiper.slides[swiper.activeIndex];

      activeSlide.translateY = 0;
      activeSlide.style.transformOrigin = "center bottom";
      activeSlide.transformOrigin = "bottom";

      swiper.slideNext();
      swiper.animating = false;
    },

    yes() {
      swiper.touches.currentX = swiper.size;
      swiper.touches.startX = swiper.size / 2;

      const activeSlide = swiper.slides[swiper.activeIndex];

      activeSlide.translateY = 0;
      activeSlide.style.transformOrigin = "center bottom";
      activeSlide.transformOrigin = "bottom";

      swiper.slideNext();
      swiper.animating = false;
    },
  };

  const setTransformOriginForSlides = (
    transformOriginStyle,
    transformOriginValue
  ) => {
    swiper.slides.forEach((slide, index) => {
      if (index < swiper.activeIndex) {
        return;
      }

      slide.style.transformOrigin = transformOriginStyle;
      slide.transformOrigin = transformOriginValue;
    });
  };

  on("beforeInit", () => {
    if (swiper.params.effect !== "tinder") return;

    swiper.classNames.push(`${swiper.params.containerModifierClass}tinder`);
    swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

    const tinderEffectParams = {
      watchSlidesProgress: true,
      virtualTranslate: true,
      longSwipesRatio: 0.1,
      oneWayMovement: true,
    };

    Object.assign(swiper.params, tinderEffectParams);
    Object.assign(swiper.originalParams, tinderEffectParams);
  });

  on("touchStart", (event, touchEvent) => {
    if (swiper.params.effect !== "tinder") return;

    isTinderEffect = true;
    isAnimating = true;
    isSlideChangePending = true;

    const { clientY: clientYPosition } = touchEvent;

    const { top: elementTop, height: elementHeight } =
      swiper.el.getBoundingClientRect();

    isTouching = false;

    const closestSlide = touchEvent.target.closest(
      ".swiper-slide, swiper-slide"
    );
    if (
      closestSlide &&
      closestSlide.classList.contains("swiper-slide-active")
    ) {
      previousActiveIndex = swiper.activeIndex;

      if (clientYPosition - elementTop > elementHeight / 2) {
        setTransformOriginForSlides("center top", "top");
      } else {
        setTransformOriginForSlides("center bottom", "bottom");
      }
    }
  });

  on("touchEnd", () => {
    if (swiper.params.effect === "tinder") {
      isTouching = false;
      isAnimating = false;

      requestAnimationFrame(() => {
        isTouching = false;
      });
    }
  });

  on("setTransition", (swiper, duration) => {
    if (swiper.params.effect === "tinder") {
      swiper.slides.forEach((slide) => {
        slide.style.transitionDuration = `${duration}ms`;
      });
    }
  });

  on("slideChange", () => {
    if (!isAnimating) {
      isSlideChangePending = false;
      swiper.emit("tinderSwipe", currentTouchOffsetX < 0 ? "left" : "right");
    }
  });

  on("transitionStart", () => {
    if (isSlideChangePending && swiper.activeIndex !== previousActiveIndex) {
      isSlideChangePending = false;
      swiper.emit("tinderSwipe", currentTouchOffsetX < 0 ? "left" : "right");
    }
  });

  on("setTranslate", (swiperInstance, translate) => {
    // Check if the effect is "tinder"
    if (swiper.params.effect !== "tinder") return;
    if (isTouching) return;

    // Check if the swiper is animating and previousActiveIndex is defined
    if (
      isAnimating &&
      previousActiveIndex !== undefined &&
      swiper.snapGrid[previousActiveIndex + 1] !== undefined
    ) {
      // Calculate the maximum allowable translate value
      const startTranslate = Math.abs(swiper.snapGrid[previousActiveIndex]);
      const maxTranslate = Math.abs(startTranslate + swiper.size) - 8;

      // If the translate value exceeds the maximum, set it to the maximum
      if (Math.abs(translate) > maxTranslate) {
        swiper.setTranslate(-maxTranslate);
        return;
      }
    }

    // Calculate the current touch offset in the X direction
    const currentXOffset = swiper.touches.currentX - swiper.touches.startX;
    currentTouchOffsetX = currentXOffset;

    // Get the slides and check if the active index is the last slide
    const { slides } = swiper;

    // Iterate through each slide to set its transform and opacity based on progress
    slides.forEach((slide, index) => {
      const progress = slide.progress;
      const clampedProgress = Math.min(Math.max(progress, -2), 2);

      let translateX = -slide.swiperSlideOffset;
      let translateY = 0;
      let translateZ = 100 * clampedProgress;
      let rotateZ = 0;
      let opacity = 1;

      // Set transform values based on progress and touch offset
      if (clampedProgress > 0 || (clampedProgress === 0 && isTinderEffect)) {
        translateZ = 0;
        rotateZ = 45 * clampedProgress * (currentXOffset < 0 ? -1 : 1);
        translateX +=
          swiper.size * (currentXOffset < 0 ? -1 : 1) * clampedProgress;

        if (slide.translateY !== undefined) {
          translateY = slide.translateY;
        }
      }

      // Reverse rotation for slides with top transform origin
      if (slide.transformOrigin === "top") {
        rotateZ = -rotateZ;
      }

      // Adjust opacity for slides with progress greater than 1
      if (clampedProgress > 1) {
        opacity = 5 * (1.2 - clampedProgress);
      }

      // Generate transform string
      const transformString = `
        translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
        rotateZ(${rotateZ}deg)
      `;

      // Cache transform for the current slide
      if (clampedProgress >= 1 && !slide.tinderTransform) {
        slide.tinderTransform = transformString;
        slide.tinderTransformSlideIndex = index;
      }

      // Apply transform and opacity to the slide
      if (
        (slide.tinderTransform && slide.tinderTransformSlideIndex !== index) ||
        !isTinderEffect
      ) {
        slide.tinderTransform = "";
      }

      slide.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
      slide.style.transform = slide.tinderTransform || transformString;
      // slide.style.opacity = opacity;
    });
  });
}

export { EffectTinder };
