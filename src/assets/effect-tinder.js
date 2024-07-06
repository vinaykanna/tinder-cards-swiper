function EffectTinder({ swiper, on }) {
  let isTouching, isAnimating, previousActiveIndex;

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

  on("touchStart", (_, touch) => {
    if (swiper.params.effect !== "tinder") return;

    isAnimating = true;
    isTouching = true;

    const closestSlide = touch.target.closest(".swiper-slide, swiper-slide");

    if (
      closestSlide &&
      closestSlide.classList.contains("swiper-slide-active")
    ) {
      previousActiveIndex = swiper.activeIndex;
      setTransformOriginForSlides("center bottom", "bottom");
    }
  });

  on("touchEnd", () => {
    if (swiper.params.effect === "tinder") {
      isAnimating = false;

      requestAnimationFrame(() => {
        isTouching = false;

        if (swiper.activeIndex) {
          const currentSlide = swiper.slides[0];
          swiper.removeSlide(0);
          swiper.appendSlide(currentSlide);
        }
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

  on("setTranslate", (_, translate) => {
    if (swiper.params.effect !== "tinder") return;

    if (
      isAnimating &&
      previousActiveIndex !== undefined &&
      swiper.snapGrid[previousActiveIndex + 1] !== undefined
    ) {
      const startTranslate = Math.abs(swiper.snapGrid[previousActiveIndex]);
      const maxTranslate = Math.abs(startTranslate + swiper.size) - 8;

      if (Math.abs(translate) > maxTranslate) {
        swiper.setTranslate(-maxTranslate);
        return;
      }
    }

    const currentXOffset = swiper.touches.currentX - swiper.touches.startX;

    const { slides } = swiper;

    slides.forEach((slide, index) => {
      const progress = slide.progress;
      const clampedProgress = Math.min(Math.max(progress, -2), 2);

      let translateX = -slide.swiperSlideOffset;
      let translateY = (index + 1) * 15;
      let translateZ = (index + 1) * 15 * clampedProgress;
      let rotateZ = 0;

      if (clampedProgress > 0 || (clampedProgress === 0 && isTouching)) {
        translateZ = 0;
        rotateZ = 45 * clampedProgress * (currentXOffset < 0 ? -1 : 1);
        translateX +=
          swiper.size * (currentXOffset < 0 ? -1 : 1) * clampedProgress;
      }

      const transformString = `
        translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
        rotateZ(${rotateZ}deg)
      `;

      if (clampedProgress >= 1 && !slide.tinderTransform) {
        slide.tinderTransform = transformString;
        slide.tinderTransformSlideIndex = index;
      }

      if (
        (slide.tinderTransform && slide.tinderTransformSlideIndex !== index) ||
        !isTouching
      ) {
        slide.tinderTransform = "";
      }

      slide.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
      slide.style.transform = slide.tinderTransform || transformString;
      if (index > 2) {
        slide.style.opacity = 0;
      } else {
        slide.style.opacity = 1;
      }
    });
  });
}

export { EffectTinder };
