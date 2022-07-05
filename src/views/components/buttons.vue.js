import { h } from "../js/vue.runtime.esm-browser.min.js";
import { useI18n } from "../js/vue-i18n.runtime.esm-browser.min.js";

export const SubmitButton = {
  name: "SubmitButton",
  render() {
    return h(
      "button",
      { id: "signin", type: "submit", class: "btn btn-lg float-end" },
      "Sign In"
    );
  },
};

export const SendCodeButton = {
  name: "SendCodeButton",
  props: ["uid"],
  render() {
    return h(
      "button",
      {
        id: "sendcode",
        type: "submit",
        class: "btn btn-lg w-100 mb-3",
        style: "text-align: left",
        formaction: `/oidc/interaction/${this.uid}/login?send-code`,
      },
      this.t("clickAction")
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          clickAction: () => "Click to receive a one-time code",
        },
        fr: {
          clickAction: () =>
            "Cliquez pour recevoir un code de connexion unique",
        },
      },
    });
    return { t };
  },
};

export const ResendCodeButton = {
  name: "ResendCodeButton",
  props: ["uid"],
  render() {
    return h(
      "button",
      {
        id: "sendcode",
        type: "submit",
        class: "btn btn-lg w-100 mb-3",
        style: "text-align: left",
        formaction: `/oidc/interaction/${this.uid}/login?send-code`,
      },
      this.t("resendCode")
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          resendCode: () => "Click to resend a one-time code",
        },
        fr: {
          resendCode: () => "Cliquez pour renvoyer un code de verification",
        },
      },
    });
    return { t };
  },
};

export const SignupCodeButton = {
  name: "SignupCodeButton",
  props: ["uid"],
  render() {
    return h(
      "button",
      {
        id: "signup-code",
        type: "submit",
        class: "btn btn-lg w-100 mb-3",
        formaction: `/oidc/interaction/${this.uid}/login?sign-up`,
      },
      this.t("validate")
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          validate: () => "Validate sign up",
        },
        fr: {
          resendCode: () => "Valider l'inscription",
        },
      },
    });
    return { t };
  },
};
