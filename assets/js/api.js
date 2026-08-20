import {
  initAppAndGetActiveDomain,
  RegisterPlayer,
  getLinkToNavigate,
  LoginType,
} from "apuesta-cloud-landing-utils";

const REDIRECTOR_ORIGIN = "https://sltrd.link/";
const REDIRECTOR_CAMPAIGN_ID = "da134877";

let domainData = null;

/**
 * Инициализация активного домена. Вызывать один раз при старте приложения.
 */
export function initDomain() {
  return initAppAndGetActiveDomain(REDIRECTOR_ORIGIN, REDIRECTOR_CAMPAIGN_ID)
    .then((data) => {
      domainData = data;
      return data;
    })
    .catch((e) => {
      console.error("Failed to init active domain:", e);
      throw e;
    });
}

export function isDomainReady() {
  return Boolean(domainData);
}

/**
 * Регистрирует игрока и делает редирект на платформу.
 * Кидает ошибку наружу, если домен ещё не готов или запрос не прошёл —
 * решение, что делать дальше (например, разблокировать кнопку),
 * остаётся за вызывающим кодом (form.js).
 */
export async function registerPlayer({ email, password, currency = "CAD" }) {
  if (!domainData) {
    throw new Error("Domain data is not ready yet");
  }

  try {
    const response = await RegisterPlayer(domainData.domain, {
      email,
      phone: null,
      password,
      currency,
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

    return response;
  } catch (e) {
    console.error("Registration failed:", e);

    const linkToNavigate = getLinkToNavigate({
      activeDomainData: domainData,
      isError: true,
    });

    if (linkToNavigate) {
      window.location.href = linkToNavigate;
    }

    throw e;
  }
}
