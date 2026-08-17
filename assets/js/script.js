import {
  initAppAndGetActiveDomain,
  RegisterPlayer,
  getLinkToNavigate,
  LoginType,
} from "apuesta-cloud-landing-utils";

(function () {
  const SEGMENTS = 8;
  const TARGET_INDEX = 1;
  const FULL_SPINS = 5;
  const SPIN_DURATION = 4500;
  const COIN_COUNT = 28;

  const REDIRECTOR_ORIGIN = "https://sltrd.link/";
  const REDIRECTOR_CAMPAIGN_ID = "da134877";

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
  let domainData = null;

  initAppAndGetActiveDomain(REDIRECTOR_ORIGIN, REDIRECTOR_CAMPAIGN_ID)
    .then(function (data) {
      domainData = data;
    })
    .catch(function (e) {
      console.error("Failed to init active domain:", e);
    });

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

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!domainData) {
      console.error("Domain data is not ready yet");
      return;
    }

    const formData = new FormData(prizeForm);
    const submitBtn = prizeForm.querySelector(".prize-form__submit");
    submitBtn.disabled = true;

    try {
      const response = await RegisterPlayer(domainData.domain, {
        email: formData.get("email"),
        phone: null,
        password: formData.get("password"),
        currency: "CAD",
        loginType: LoginType.Email,
        region: "",
        language: "en",
      });

      const linkToNavigate = getLinkToNavigate({
        activeDomainData: domainData,
        refreshToken: response.refresh_token,
      });

      if (linkToNavigate) {
        localStorage.setItem("was-registered", "true");
        window.location.href = linkToNavigate;
      }
    } catch (e) {
      console.error("Registration failed:", e);

      const linkToNavigate = getLinkToNavigate({
        activeDomainData: domainData,
        isError: true,
      });

      if (linkToNavigate) {
        window.location.href = linkToNavigate;
      }
    } finally {
      submitBtn.disabled = false;
    }
  }

  togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Приховати пароль" : "Показати пароль",
    );
  });

  prizeForm.addEventListener("submit", handleFormSubmit);

  spinBtn.addEventListener("click", spin);
})();

(function () {
  const form = document.getElementById("prizeForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const emailField = document.getElementById("emailField");
  const passwordField = document.getElementById("passwordField");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const toggleBtn = document.getElementById("togglePassword");
  const termsCheckbox = form.querySelector('input[name="terms"]');
  const submitBtn = document.getElementById("submitBtn");

  const EMAIL_MIN_LEN = 3;
  const PASSWORD_MIN_LEN = 5;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldEl, errorEl, message) {
    if (message) {
      fieldEl.classList.add("has-error");
      errorEl.textContent = message;
      errorEl.classList.add("show");
    } else {
      fieldEl.classList.remove("has-error");
      errorEl.textContent = "";
      errorEl.classList.remove("show");
    }
  }

  function validateEmail() {
    const value = emailInput.value.trim();

    if (!value) {
      setError(emailField, emailError, "Field is required");
      return false;
    }
    if (value.length < EMAIL_MIN_LEN) {
      setError(
        emailField,
        emailError,
        "Login should be at least 3 characters long",
      );
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setError(emailField, emailError, "Email is not valid");
      return false;
    }
    setError(emailField, emailError, "");
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;

    if (!value) {
      setError(passwordField, passwordError, "Field is required");
      return false;
    }
    if (value.length < PASSWORD_MIN_LEN) {
      setError(
        passwordField,
        passwordError,
        "Password must be at least 5 characters long",
      );
      return false;
    }
    setError(passwordField, passwordError, "");
    return true;
  }

  function updateSubmitState() {
    const isEmailValid =
      EMAIL_REGEX.test(emailInput.value.trim()) &&
      emailInput.value.trim().length >= EMAIL_MIN_LEN;
    const isPasswordValid = passwordInput.value.length >= PASSWORD_MIN_LEN;
    const areTermsAccepted = termsCheckbox.checked;

    submitBtn.disabled = !(isEmailValid && isPasswordValid && areTermsAccepted);
  }

  function handleEmailChange() {
    validateEmail();
    updateSubmitState();
  }

  function handlePasswordChange() {
    validatePassword();
    updateSubmitState();
  }

  // динамическая валидация — срабатывает при каждом вводе, не только при потере фокуса
  emailInput.addEventListener("input", handleEmailChange);
  passwordInput.addEventListener("input", handlePasswordChange);
  emailInput.addEventListener("blur", handleEmailChange);
  passwordInput.addEventListener("blur", handlePasswordChange);
  termsCheckbox.addEventListener("change", updateSubmitState);

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.setAttribute(
      "aria-label",
      isPassword ? "Hide pass" : "Show pass",
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid && termsCheckbox.checked) {
      // форма валидна — тут можно вызывать реальный submit / fetch
      form.submit();
    }
  });

  // выставляем начальное состояние кнопки при загрузке
  updateSubmitState();
})();
