import { h } from "../js/vue.runtime.esm-browser.min.js";
import { useI18n } from "../js/vue-i18n.runtime.esm-browser.min.js";

export const EmailInput = {
  name: "EmailInput",
  props: ["loginHint"],
  render() {
    return h("input", {
      required: true,
      type: "email",
      name: "email",
      autocomplete: "username",
      class: "form-control form-control-lg mb-2",
      placeholder: this.t("enterEmail"),
      ...(this.loginHint ? { autocomplete: "on" } : { value: this.loginHint }),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterEmail: () => "Enter an email",
        },
        fr: {
          enterEmail: () => "Entrez un email",
        },
      },
    });
    return { t };
  },
};

export const PasswordInput = {
  name: "PasswordInput",
  props: ["loginHint"],
  render() {
    return h("input", {
      type: "password",
      name: "password",
      autocomplete: "current-password",
      class: "form-control form-control-lg mb-3 signin",
      placeholder: this.t("enterPassword"),
      ...(this.loginHint ? { autocomplete: "on" } : {}),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterPassword: () => "Enter password",
        },
        fr: {
          enterPassword: () => "Entrez votre mot de passe",
        },
      },
    });
    return { t };
  },
};

export const CodeInput = {
  name: "CodeInput",
  render() {
    return h("input", {
      type: "text",
      name: "code",
      autocomplete: "one-time-code",
      class: "form-control form-control-lg mb-3 signin",
      placeholder: this.t("verificationCode"),
      autofocus: "on",
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          verificationCode: () => "Enter verification code",
        },
        fr: {
          verificationCode: () => "Entrez votre code de verification",
        },
      },
    });
    return { t };
  },
};

export const NameInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "name",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your name`,
        },
        fr: {
          enterText: () => `Entrez votre prénom`,
        },
      },
    });
    return { t };
  },
};

export const SurnameInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "surname",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your surname`,
        },
        fr: {
          enterText: () => `Entrez votre nom de famille`,
        },
      },
    });
    return { t };
  },
};

export const OrganizationInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "organization",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your organization name`,
        },
        fr: {
          enterText: () => `Entrez le nom de votre organisation`,
        },
      },
    });
    return { t };
  },
};

export const PhoneInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "phone",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your phone number (optionnal)`,
        },
        fr: {
          enterText: () => `Entrez votre numéro de téléphone (optionnel)`,
        },
      },
    });
    return { t };
  },
};

export const RoleInput = {
  name: "TextInput",
  render() {
    return h("input", {
      type: "text",
      name: "role",
      autocomplete: "off",
      class: "form-control form-control-lg mb-2 signin",
      placeholder: this.t("enterText"),
    });
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          enterText: () => `Enter your job (optionnal)`,
        },
        fr: {
          enterText: () => `Entrez votre poste (optionnel)`,
        },
      },
    });
    return { t };
  },
};