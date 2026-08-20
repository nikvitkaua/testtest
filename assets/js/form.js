import { registerPlayer, isDomainReady } from "./api.js";

const EMAIL_MIN_LEN = 3;
const PASSWORD_MIN_LEN = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initForm() {
  const form = document.getElementById("prizeForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const emailField = document.getElementById("emailField");
  const passwordField = document.getElementById("passwordField");
  const emailStatus = document.getElementById("emailStatus");
  const emailTooltip = document.getElementById("emailTooltip");
  const passwordStatus = document.getElementById("passwordStatus");
  const passwordTooltip = document.getElementById("passwordTooltip");
  const toggleBtn = document.getElementById("togglePassword");
  const termsCheckbox = form.querySelector('input[name="terms"]');
  const submitBtn = document.getElementById("submitBtn");

  function setError(fieldEl, statusEl, tooltipEl, message) {
    if (message) {
      fieldEl.classList.add("has-error");
      statusEl.classList.add("show");
      tooltipEl.textContent = message;
    } else {
      fieldEl.classList.remove("has-error");
      statusEl.classList.remove("show");
      tooltipEl.textContent = "";
    }
  }

  function validateEmail() {
    const value = emailInput.value.trim();

    if (!value) {
      setError(emailField, emailStatus, emailTooltip, "Field is required");
      return false;
    }
    if (value.length < EMAIL_MIN_LEN) {
      setError(
        emailField,
        emailStatus,
        emailTooltip,
        "Login should be at least 3 characters long",
      );
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setError(emailField, emailStatus, emailTooltip, "Email is not valid");
      return false;
    }
    setError(emailField, emailStatus, emailTooltip, "");
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;

    if (!value) {
      setError(
        passwordField,
        passwordStatus,
        passwordTooltip,
        "Field is required",
      );
      return false;
    }
    if (value.length < PASSWORD_MIN_LEN) {
      setError(
        passwordField,
        passwordStatus,
        passwordTooltip,
        "Password must be at least 5 characters long",
      );
      return false;
    }
    setError(passwordField, passwordStatus, passwordTooltip, "");
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

  async function handleSubmit(event) {
    event.preventDefault();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid || !termsCheckbox.checked) return;

    if (!isDomainReady()) {
      console.error("Domain data is not ready yet");
      return;
    }

    submitBtn.disabled = true;

    try {
      await registerPlayer({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      });
      // Редирект на платформу происходит внутри registerPlayer (api.js).
    } finally {
      submitBtn.disabled = false;
    }
  }

  emailInput.addEventListener("input", () => {
    validateEmail();
    updateSubmitState();
  });
  passwordInput.addEventListener("input", () => {
    validatePassword();
    updateSubmitState();
  });
  emailInput.addEventListener("blur", () => {
    validateEmail();
    updateSubmitState();
  });
  passwordInput.addEventListener("blur", () => {
    validatePassword();
    updateSubmitState();
  });
  termsCheckbox.addEventListener("change", updateSubmitState);

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.setAttribute(
      "aria-label",
      isPassword ? "Hide pass" : "Show pass",
    );
  });

  // Единственный submit-обработчик на форме.
  // ВАЖНО: здесь нет и не должно быть вызова form.submit() —
  // именно он был причиной бага с email/password в URL.
  form.addEventListener("submit", handleSubmit);

  updateSubmitState();
}
