import { EmailInput, NameInput, OrganizationInput, PhoneInput, RoleInput, SurnameInput } from "./components/inputs.vue.js";
import { h } from "./js/vue.runtime.esm-browser.min.js";
import { SignupCodeButton } from "./components/buttons.vue.js";
import { SigninFooter } from "./signin.vue.js";

export const SignupForm = {
  props: ["uid", "loginHint", "method"],
  render() {
    return h(
      "form",
      {
        id: "loginform",
        autocomplete: "off",
        action: `/oidc/interaction/${this.uid}/login?sign-up`,
        method: "post",
        onKeydown: e => {
          if (e.key == "Enter") e.preventDefault();
        },
      },
      h("div", { class: "modal-body border-0" }, [
        h(EmailInput, { loginHint: this.loginHint }),
        h(NameInput),
        h(SurnameInput),
        h(OrganizationInput),
        h(RoleInput),
        h(PhoneInput)
      ]),
      h("div", { class: "modal-footer border-0" }, [
        h(SignupCodeButton, { uid: this.uid }),
      ]),
      h("div", { class: "d-flex flex-row align-baseline mx-2" }, [
        h(SigninFooter),
      ])
    );
  },
};
