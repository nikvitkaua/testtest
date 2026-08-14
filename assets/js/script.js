(function () {
  const SEGMENTS = 8;
  const TARGET_INDEX = 1;
  const FULL_SPINS = 5;
  const SPIN_DURATION = 4500;
  const COIN_COUNT = 28;

  const landing = document.getElementById("landing");
  const wheelWrap = document.getElementById("wheelWrap");
  const wheelInner = document.getElementById("wheelInner");
  const wheelDisc = wheelInner.querySelector(".wheel__disc");
  const spinBtn = document.getElementById("spinBtn");
  const prizeOverlay = document.getElementById("prizeOverlay");
  const coinRain = document.getElementById("coinRain");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");
  const prizeForm = document.getElementById("prizeForm");

  let currentRotation = 0;
  let isSpinning = false;
  let modalShown = false;

  function getTargetRotation() {
    const segmentAngle = 360 / SEGMENTS;
    const segmentCenter = TARGET_INDEX * segmentAngle;
    const alignAngle = 360 - segmentCenter;

    return FULL_SPINS * 645 + alignAngle;
  }

  function createCoinRain() {
    coinRain.innerHTML = "";

    for (let i = 0; i < COIN_COUNT; i += 1) {
      const coin = document.createElement("img");
      coin.src = "./assets/images/mob/mob_coin.png";
      coin.alt = "";
      coin.className = "coin-rain__coin";
      coin.style.left = Math.random() * 100 + "%";
      coin.style.animationDelay = Math.random() * 2.5 + "s";
      coin.style.animationDuration = 2.8 + Math.random() * 2.4 + "s";
      coin.style.width = 24 + Math.random() * 28 + "px";
      coinRain.appendChild(coin);
    }
  }

  function showPrizeModal() {
    if (modalShown) return;

    modalShown = true;
    createCoinRain();

    wheelWrap.classList.add("is-hidden");
    landing.classList.add("is-modal-open");

    window.requestAnimationFrame(function () {
      prizeOverlay.classList.add("is-visible");
      prizeOverlay.setAttribute("aria-hidden", "false");
    });
  }

  function spin() {
    if (isSpinning || modalShown) return;

    isSpinning = true;
    spinBtn.disabled = true;

    const targetRotation = currentRotation + getTargetRotation();

    wheelInner.classList.add("is-spinning");
    wheelDisc.style.transform = "rotate(" + targetRotation + "deg)";

    currentRotation = targetRotation;

    window.setTimeout(function () {
      wheelInner.classList.remove("is-spinning");
      isSpinning = false;
      showPrizeModal();
    }, SPIN_DURATION);
  }

  togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Приховати пароль" : "Показати пароль"
    );
  });

  prizeForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  spinBtn.addEventListener("click", spin);
})();
