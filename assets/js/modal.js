import { createCoinRain } from "./wheel.js";

let modalShown = false;

export function isModalShown() {
  return modalShown;
}

export function showPrizeModal() {
  if (modalShown) return;

  modalShown = true;

  const landing = document.getElementById("landing");
  const wheelWrap = document.getElementById("wheelWrap");
  const prizeOverlay = document.getElementById("prizeOverlay");

  createCoinRain();

  wheelWrap.classList.add("is-hidden");
  landing.classList.add("is-modal-open");

  window.requestAnimationFrame(() => {
    prizeOverlay.classList.add("is-visible");
    prizeOverlay.setAttribute("aria-hidden", "false");
  });
}
