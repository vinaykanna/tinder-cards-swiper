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
      currentSlideElement = closestSlide;
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
