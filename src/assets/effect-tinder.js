function EffectTinder({ swiper, on }) {
  let r, s, n, i, o, a, c;

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
  const d = (e, t) => {
    e && t(e);
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

  const u = (t, r, s, i, o) => {
    if (n || o)
      if (i)
        d(document.querySelector(".swiper-tinder-button-yes"), (e) =>
          e.classList.add("swiper-tinder-button-hidden")
        ),
          d(document.querySelector(".swiper-tinder-button-no"), (e) =>
            e.classList.add("swiper-tinder-button-hidden")
          );
      else {
        const n = Math.max(Math.min(10 * r - 0.5, 1), 0);
        d(
          t.querySelector(".swiper-tinder-label-yes"),
          (e) => (e.style.opacity = s > 0 ? n : 0)
        ),
          d(
            t.querySelector(".swiper-tinder-label-no"),
            (e) => (e.style.opacity = s < 0 ? n : 0)
          ),
          d(document.querySelector(".swiper-tinder-button-yes"), (e) =>
            e.classList.remove("swiper-tinder-button-hidden")
          ),
          d(document.querySelector(".swiper-tinder-button-no"), (e) =>
            e.classList.remove("swiper-tinder-button-hidden")
          ),
          r >= swiper.params.longSwipesRatio && !i
            ? s > 0
              ? (d(document.querySelector(".swiper-tinder-button-yes"), (e) =>
                  e.classList.add("swiper-tinder-button-active")
                ),
                d(document.querySelector(".swiper-tinder-button-no"), (e) =>
                  e.classList.remove("swiper-tinder-button-active")
                ))
              : (d(document.querySelector(".swiper-tinder-button-yes"), (e) =>
                  e.classList.remove("swiper-tinder-button-active")
                ),
                d(document.querySelector(".swiper-tinder-button-no"), (e) =>
                  e.classList.add("swiper-tinder-button-active")
                ))
            : (d(document.querySelector(".swiper-tinder-button-yes"), (e) =>
                e.classList.remove("swiper-tinder-button-active")
              ),
              d(document.querySelector(".swiper-tinder-button-no"), (e) =>
                e.classList.remove("swiper-tinder-button-active")
              ));
      }
  };

  on("beforeInit", () => {
    if ("tinder" !== swiper.params.effect) return;

    swiper.classNames.push(`${swiper.params.containerModifierClass}tinder`);
    swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

    const t = {
      watchSlidesProgress: !0,
      virtualTranslate: !0,
      longSwipesRatio: 0.1,
      oneWayMovement: !0,
    };

    Object.assign(swiper.params, t), Object.assign(swiper.originalParams, t);
  });

  on("touchStart", (t, c) => {
    if ("tinder" !== swiper.params.effect) return;
    (n = !0), (o = !0), (a = !0);
    const { clientY: d } = c,
      { top: u, height: m } = swiper.el.getBoundingClientRect();
    s = !1;
    const p = c.target.closest(".swiper-slide, swiper-slide");
    p &&
      p.classList.contains("swiper-slide-active") &&
      ((r = p),
      (i = swiper.activeIndex),
      d - u > m / 2
        ? setTransformOriginForSlides("center top", "top")
        : setTransformOriginForSlides("center bottom", "bottom"));
  });

  on("touchMove", (t) => {
    if ("tinder" !== swiper.params.effect) return;
    const n = t.touches.currentY - t.touches.startY,
      i = t.touches.currentX - t.touches.startX;
    (s = (Math.abs(i), swiper.size, !1)), r && (r.translateY = n);
  });

  on("touchEnd", () => {
    "tinder" === swiper.params.effect &&
      ((s = !1),
      (o = !1),
      requestAnimationFrame(() => {
        n = !1;
      }));
  });

  on("setTransition", (t, r) => {
    "tinder" === swiper.params.effect &&
      (t.slides.forEach((e) => {
        (e.style.transitionDuration = `${r}ms`),
          e.querySelectorAll(".swiper-tinder-label").forEach((t) => {
            (t.style.transitionDuration = `${r}ms`),
              e.progress <= 0 && (t.style.opacity = 0);
          });
      }),
      requestAnimationFrame(() => {
        d(document.querySelector(".swiper-tinder-button-yes"), (e) =>
          e.classList.remove("swiper-tinder-button-active")
        ),
          d(document.querySelector(".swiper-tinder-button-no"), (e) =>
            e.classList.remove("swiper-tinder-button-active")
          );
      }));
  });

  on("slideChange", () => {
    if (
      swiper.activeIndex === swiper.slides.length - 1 &&
      !swiper.params.loop
    ) {
      const t = swiper.slides[swiper.slides.length - 1],
        r = t.progress,
        s = Math.min(Math.max(r, -2), 2),
        n = swiper.touches.currentX - swiper.touches.startX;
      u(t, s, n, !0, !0);
    }
    o || ((a = !1), swiper.emit("tinderSwipe", c < 0 ? "left" : "right"));
  });

  on("transitionStart", () => {
    a &&
      swiper.activeIndex !== i &&
      ((a = !1), swiper.emit("tinderSwipe", c < 0 ? "left" : "right"));
  });

  on("setTranslate", (t, r) => {
    if ("tinder" !== swiper.params.effect) return;
    if (s) return;
    if (o && void 0 !== i && void 0 !== swiper.snapGrid[i + 1]) {
      const t = Math.abs(swiper.snapGrid[i]),
        s = Math.abs(t + swiper.size) - 8;
      if (Math.abs(r) > s) return void swiper.setTranslate(-s);
    }
    const a = swiper.touches.currentX - swiper.touches.startX;
    c = a;
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
      (i > 0 || (0 === i && n)) &&
        ((m = 0),
        (p = 45 * i * (a < 0 ? -1 : 1)),
        (o = swiper.size * (a < 0 ? -1 : 1) * i + o),
        void 0 !== t.translateY && (c = t.translateY),
        u(t, i, a, l)),
        "top" === t.transformOrigin && (p = -p),
        i > 1 && (f = 5 * (1.2 - i));
      const h = `\n        translate3d(${o}px, ${c}px, ${m}px)\n        rotateZ(${p}deg)\n      `;
      i >= 1 &&
        !t.tinderTransform &&
        ((t.tinderTransform = h), (t.tinderTransformSlideIndex = r)),
        ((t.tinderTransform && t.tinderTransformSlideIndex !== r) || !n) &&
          (t.tinderTransform = ""),
        (t.style.zIndex = -Math.abs(Math.round(s)) + d.length),
        (t.style.transform = t.tinderTransform || h),
        (t.style.opacity = f);
    });
  });
}
export { EffectTinder };
