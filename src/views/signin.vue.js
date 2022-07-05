import { h } from "./js/vue.runtime.esm-browser.min.js";
import { useI18n } from "./js/vue-i18n.runtime.esm-browser.min.js";
import {
  EmailInput,
  PasswordInput,
  CodeInput,
} from "./components/inputs.vue.js";
import {
  SubmitButton,
  SendCodeButton,
  ResendCodeButton,
} from "./components/buttons.vue.js";
import { DemoRoleSelect } from "./components/select.vue.js";

export const SigninForm = {
  name: "SigninForm",
  props: ["uid", "method", "loginHint"],
  computed: {
    resolveLoginForms() {
      switch (this.method) {
        case "demo":
          return [h(SigninDemo)];
        case "code":
        case "code,retry":
        case "code,reset":
        case "code,reset,retry":
          return [
            h(SigninCodeResetRetry, {
              loginHint: this.loginHint,
              method: this.method,
              uid: this.uid,
            }),
          ];
        default:
          return [h(SigninCode, { loginHint: this.loginHint, uid: this.uid })];
      }
    },
  },
  render() {
    return h(
      "form",
      {
        id: "loginform",
        autocomplete: "off",
        action: `/oidc/interaction/${this.uid}/login?sign-in`,
        method: "post",
        onKeydown: (e) => { if(e.key == "Enter") e.preventDefault(); }
      },
      [
        h("div", { class: "modal-body border-0" }, this.resolveLoginForms),
        h("div", { class: "modal-footer border-0" }, [h(SubmitButton)]),
        h("div", { class: "d-flex flex-row align-baseline mx-2" }, [
          h(SigninFooter),
        ]),
      ]
    );
  },
};

export const SigninDemo = {
  name: "SigninDemo",
  render() {
    return [
      h("input", {
        required: true,
        type: "hidden",
        name: "method",
        value: "demo",
      }),
      h(DemoRoleSelect),
    ];
  },
};

export const SigninCode = {
  name: "SigninCode",
  props: ["loginHint", "uid"],
  render() {
    return [
      h("input", {
        required: true,
        type: "hidden",
        name: "method",
        value: "password",
        class: "form-control",
        loginHint: this.loginHint,
      }),
      h(EmailInput, { loginHint: this.loginHint }),
      h(SendCodeButton, { uid: this.uid }),
      h("h3", { class: "mb-3 text-center info" }, this.t("or")),
      h(PasswordInput, { loginHint: this.loginHint }),
    ];
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          or: () => "OR",
        },
        fr: {
          or: () => "OU",
        },
      },
    });
    return { t };
  },
};

export const SigninCodeResetRetry = {
  name: "SigninCodeResetRetry",
  props: ["method", "loginHint", "uid"],
  computed: {
    renderInputs() {
      const inputs = [
        h("input", {
          required: true,
          type: "hidden",
          name: "method",
          value: this.method.replace(/(,retry)?$/, ",retry"),
        }),
        h("input", {
          required: true,
          type: "hidden",
          name: "userid",
          value: this.loginHint,
        }),
        h(CodeInput),
        h(ResendCodeButton, { uid: this.uid }),
      ];
      if (this.method.startsWith("code,reset"))
        inputs.push(h(SigninSetPassword));
      return inputs;
    },
  },
  render() {
    return this.renderInputs;
  },
};

export const SigninSetPassword = {
  name: "SigninSetPassword",
  render() {
    return h("div", { class: "form-check form-switch" }, [
      h("input", {
        type: "checkbox",
        class: "form-check-input",
        name: "changePassword",
        id: "toggle-pwd",
      }),
      h(
        "label",
        { class: "form-check-label", for: "toggle-pwd" },
        this.t("setPassword")
      ),
      h("div", { id: "password-inputs", class: "mt-3" }, [
        h("input", {
          type: "password",
          name: "password",
          autocomplete: "new-password",
          class: "form-control form-control-lg mb-3 signin",
          placeholder: this.t("choosePassword"),
        }),
        h("input", {
          type: "password",
          name: "password2",
          autocomplete: "new-password",
          class: "form-control form-control-lg mb-3 signin",
          placeholder: this.t("retypePassword"),
        }),
      ]),
    ]);
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          setPassword: () => "Optionally set a new password",
          choosePassword: () => "Choose password",
          retypePassword: () => "Retype password",
        },
        fr: {
          setPassword: () =>
            "Vous pouvez également définir un nouveau mot de passe",
          choosePassword: () => "Choisissez un mot de passe",
          retypePassword: () => "Retapez le mot de passe",
        },
      },
    });
    return { t };
  },
};

export const SigninFooter = {
  name: "SigninFooter",
  render() {
    return [
      h("h6", { class: "px-2" }, [this.t("followUs")]),
      h(
        "a",
        {
          href: "https://www.linkedin.com/company/aronelogiciels/",
          target: "_blank",
        },
        [
          h("i", {
            class: "fa fa-linkedin-square ml-2",
            style: "font-size: 20px;",
          }),
        ]
      ),
    ];
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          followUs: () => "Follow us on : ",
        },
        fr: {
          followUs: () => "Suivez-nous : ",
        },
      },
    });
    return { t };
  },
};