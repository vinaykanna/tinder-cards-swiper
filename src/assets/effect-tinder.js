function EffectTinder({ swiper, on }) {
  let currentSlideElement,
    isTouching,
    isTinderEffect,
    previousActiveIndex,
    isAnimating,
    isSlideChangePending,
    currentTouchOffsetX;

  swiper.tinder = {
    no() {
      // Reset current touch position and set start position to half the swiper size
      swiper.touches.currentX = 0;
      swiper.touches.startX = swiper.size / 2;

      // Get the current active slide
      const activeSlide = swiper.slides[swiper.activeIndex];

      // Reset the translateY value and set transform origin
      activeSlide.translateY = 0;
      activeSlide.style.transformOrigin = "center bottom";
      activeSlide.transformOrigin = "bottom";

      // Move to the next slide and stop any ongoing animation
      swiper.slideNext();
      swiper.animating = false;
    },

    yes() {
      // Set current touch position to the swiper size and start position to half the swiper size
      swiper.touches.currentX = swiper.size;
      swiper.touches.startX = swiper.size / 2;

      // Get the current active slide
      const activeSlide = swiper.slides[swiper.activeIndex];

      // Reset the translateY value and set transform origin
      activeSlide.translateY = 0;
      activeSlide.style.transformOrigin = "center bottom";
      activeSlide.transformOrigin = "bottom";

      // Move to the next slide and stop any ongoing animation
      swiper.slideNext();
      swiper.animating = false;
    },
  };

  const setTransformOriginForSlides = (
    transformOriginStyle,
    transformOriginValue
  ) => {
    swiper.slides.forEach((slide, index) => {
      // If the slide index is less than the active index, skip to the next iteration
      if (index < swiper.activeIndex) {
        return;
      }

      // Set the transform origin style and value for the slide
      slide.style.transformOrigin = transformOriginStyle;
      slide.transformOrigin = transformOriginValue;
    });
  };

  on("beforeInit", () => {
    // Check if the effect is "tinder"
    if (swiper.params.effect !== "tinder") return;

    // Add custom class names for the tinder effect
    swiper.classNames.push(`${swiper.params.containerModifierClass}tinder`);
    swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

    // Define additional parameters for the tinder effect
    const tinderEffectParams = {
      watchSlidesProgress: true,
      virtualTranslate: true,
      longSwipesRatio: 0.1,
      oneWayMovement: true,
    };

    // Assign the new parameters to swiper's current and original parameters
    Object.assign(swiper.params, tinderEffectParams);
    Object.assign(swiper.originalParams, tinderEffectParams);
  });

  on("touchStart", (event, touchEvent) => {
    // Check if the swiper effect is "tinder"
    if (swiper.params.effect !== "tinder") return;

    // Set flags to indicate touch and animation states
    isTinderEffect = true;
    isAnimating = true;
    isSlideChangePending = true;

    // Extract client Y position from touch event
    const { clientY: clientYPosition } = touchEvent;

    // Get bounding rect information of swiper element
    const { top: elementTop, height: elementHeight } =
      swiper.el.getBoundingClientRect();

    // Reset touch flag
    isTouching = false;

    // Find the closest swiper slide that is active
    const closestSlide = touchEvent.target.closest(
      ".swiper-slide, swiper-slide"
    );
    if (
      closestSlide &&
      closestSlide.classList.contains("swiper-slide-active")
    ) {
      // Store the current active slide and its index
      currentSlideElement = closestSlide;
      previousActiveIndex = swiper.activeIndex;

      // Determine the transform origin based on touch position
      if (clientYPosition - elementTop > elementHeight / 2) {
        // Set transform origin to center top if touch is in upper half of swiper element
        setTransformOriginForSlides("center top", "top");
      } else {
        // Otherwise, set transform origin to center bottom
        setTransformOriginForSlides("center bottom", "bottom");
      }
    }
  });

  on("touchEnd", () => {
    // Check if the effect is "tinder"
    if (swiper.params.effect === "tinder") {
      // Reset touch and animation flags
      isTouching = false;
      isAnimating = false;

      // Reset swiper animation frame flag
      requestAnimationFrame(() => {
        isTouching = false;
      });
    }
  });

  on("setTransition", (swiper, duration) => {
    // Check if the effect is "tinder"
    if (swiper.params.effect === "tinder") {
      swiper.slides.forEach((slide) => {
        // Set transition duration for each slide
        slide.style.transitionDuration = `${duration}ms`;
      });
    }
  });

  on("slideChange", () => {
    // Check if not in touch mode
    if (!isAnimating) {
      // Reset flag and emit tinderSwipe event based on direction
      isSlideChangePending = false;
      swiper.emit("tinderSwipe", currentTouchOffsetX < 0 ? "left" : "right");
    }
  });

  on("transitionStart", () => {
    // Check if in swipe mode and the active index has changed
    if (isSlideChangePending && swiper.activeIndex !== previousActiveIndex) {
      // Reset flag and emit tinderSwipe event based on direction
      isSlideChangePending = false;
      swiper.emit("tinderSwipe", currentTouchOffsetX < 0 ? "left" : "right");
    }
  });

  on("setTranslate", (t, r) => {
    if ("tinder" !== swiper.params.effect) return;
    if (isTouching) return;
    if (
      isAnimating &&
      void 0 !== previousActiveIndex &&
      void 0 !== swiper.snapGrid[previousActiveIndex + 1]
    ) {
      const t = Math.abs(swiper.snapGrid[previousActiveIndex]),
        s = Math.abs(t + swiper.size) - 8;
      if (Math.abs(r) > s) return void swiper.setTranslate(-s);
    }
    const a = swiper.touches.currentX - swiper.touches.startX;
    currentTouchOffsetX = a;
    const { slides: d } = swiper,
      l = swiper.activeIndex === d.length - 1 && !swiper.params.loop;
    d.forEach((t, r) => {
      const s = t.progress,
        i = Math.min(Math.max(s, -2), 2);
      let o = -t.swiperSlideOffset,
        c = 0,
        m = 100 * i,
        p = 0,
        f = 1;
      (i > 0 || (0 === i && isTinderEffect)) &&
        ((m = 0),
        (p = 45 * i * (a < 0 ? -1 : 1)),
        (o = swiper.size * (a < 0 ? -1 : 1) * i + o),
        void 0 !== t.translateY && (c = t.translateY)),
        "top" === t.transformOrigin && (p = -p),
        i > 1 && (f = 5 * (1.2 - i));
      const h = `\n        translate3d(${o}px, ${c}px, ${m}px)\n        rotateZ(${p}deg)\n      `;
      i >= 1 &&
        !t.tinderTransform &&
        ((t.tinderTransform = h), (t.tinderTransformSlideIndex = r)),
        ((t.tinderTransform && t.tinderTransformSlideIndex !== r) ||
          !isTinderEffect) &&
          (t.tinderTransform = ""),
        (t.style.zIndex = -Math.abs(Math.round(s)) + d.length),
        (t.style.transform = t.tinderTransform || h),
        (t.style.opacity = f);
    });
  });
}

export { EffectTinder };
