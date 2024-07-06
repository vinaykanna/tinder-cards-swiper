import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { EffectTinder } from "./effect-tinder.js";

new Swiper(".swiper", {
  modules: [EffectTinder],
  effect: "tinder",
  grabCursor: true,
});
