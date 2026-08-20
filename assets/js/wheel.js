import mobCoin from "../images/mob/mob_coin.png";

const SEGMENTS = 8;
const TARGET_INDEX = 1;
const FULL_SPINS = 5;
const SPIN_DURATION = 5200;
const COIN_COUNT = 28;


const ACCEL_PHASE = 0.12;

let currentRotation = 0;
let isSpinning = false;

/**
 * Инициализирует колесо и вешает обработчик на кнопку спина.
 * @param {Object} options
 * @param {Function} options.canSpin - функция-предикат, можно ли крутить сейчас
 * @param {Function} options.onSpinEnd - вызывается после завершения анимации спина
 */
export function initWheel({ canSpin, onSpinEnd } = {}) {
  const wheelWrap = document.getElementById("wheelWrap");
  const wheelInner = document.getElementById("wheelInner");
  const wheelDisc = wheelInner.querySelector(".wheel__disc");
  const spinBtn = document.getElementById("spinBtn");

  function getTargetRotation() {
    const segmentAngle = 360 / SEGMENTS;
    const segmentCenter = TARGET_INDEX * segmentAngle;
    const alignAngle = 360 - segmentCenter;

    return FULL_SPINS * 645 + alignAngle;
  }

  function spin() {
    if (isSpinning) return;
    if (typeof canSpin === "function" && !canSpin()) return;

    isSpinning = true;
    spinBtn.disabled = true;

    const totalDelta = getTargetRotation();
    const startRotation = currentRotation;
    const rampRotation = startRotation + totalDelta * ACCEL_PHASE;
    const targetRotation = startRotation + totalDelta;

    wheelInner.classList.add("is-spinning");

 
    const animation = wheelDisc.animate(
      [
        {
          transform: `rotate(${startRotation}deg)`,
          easing: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
        },
        {
          transform: `rotate(${rampRotation}deg)`,
          offset: ACCEL_PHASE,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        {
          transform: `rotate(${targetRotation}deg)`,
        },
      ],
      {
        duration: SPIN_DURATION,
        fill: "forwards",
      },
    );

    currentRotation = targetRotation;

    animation.onfinish = () => {

      wheelDisc.style.transform = `rotate(${targetRotation}deg)`;
      animation.cancel();

      wheelInner.classList.remove("is-spinning");
      isSpinning = false;

      if (typeof onSpinEnd === "function") onSpinEnd();
    };
  }

  spinBtn.addEventListener("click", spin);

  return { spin, wheelWrap };
}


export function createCoinRain() {
  const coinRain = document.getElementById("coinRain");
  coinRain.innerHTML = "";

  for (let i = 0; i < COIN_COUNT; i += 1) {
    const coin = document.createElement("img");
    coin.src = mobCoin;
    coin.alt = "";
    coin.className = "coin-rain__coin";
    coin.style.left = Math.random() * 100 + "%";
    coin.style.animationDelay = Math.random() * 2.5 + "s";
    coin.style.animationDuration = 2.8 + Math.random() * 2.4 + "s";
    coin.style.width = 24 + Math.random() * 28 + "px";
    coinRain.appendChild(coin);
  }
}
