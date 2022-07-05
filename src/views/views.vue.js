import { h } from "./js/vue.runtime.esm-browser.min.js";
import { SigninForm } from "./signin.vue.js";
import { SignupForm } from "./signup.vue.js";
import { useI18n } from "./js/vue-i18n.runtime.esm-browser.min.js";

export const LoginHeader = {
  name: "LoginHeader",
  props: ["title", "subtitle", "selectedTab"],
  render() {
    return h(
      "div",
      { class: "modal-header flex-column border-0 login-header" },
      [
        h(NavigationBar, {
          onChangeTab: tab => this.$emit("changeTab", tab),
          selectedTab: this.selectedTab,
        }),
        h("h1", { class: "card-title mb-md-1 mt-md-5 mt-2" }, this.title),
        h("h3", { class: "card-title mb-md-3 mt-1 mb-1" }, this.subtitle),
      ]
    );
  },
};

export const Login = {
  name: "Login",
  props: ["title", "subtitle", "uid", "method", "loginHint", "flash"],
  data() {
    return {
      selectedTab: "signin",
    };
  },
  render() {
    return h(
      "div",
      { class: "modal d-block", id: "background", tabindex: "-1" },
      [
        h("div", { class: "modal-dialog rounded" }, [
          h(
            "div",
            {
              class: "modal-content rounded d-flex flex-row align-start h-100",
            },
            [
              h(
                "div",
                {
                  class:
                    "col-lg-6 col-12 rounded-md-right px-sm-5 login-body h-100 d-flex",
                },
                [
                  h(
                    "div",
                    { class: "align-self-center px-0 col" },
                    [
                      h(LoginHeader, {
                        title: this.title,
                        subtitle: this.subtitle,
                        selectedTab: this.selectedTab,
                        onChangeTab: tab => (this.selectedTab = tab),
                      }),
                      this.selectedTab == "signin"
                        ? h(SigninForm, {
                            uid: this.uid,
                            method: this.method,
                            loginHint: this.loginHint,
                          })
                        : h(SignupForm, {
                          uid: this.uid,
                          method: this.method,
                          loginHint: this.loginHint,
                        }),
                    ].concat(
                      this.flash ? [h(AlertMessage, { flash: this.flash })] : []
                    )
                  ),
                ]
              ),
              h(MainImage),
            ]
          ),
        ]),
        h(AroneLogo),
      ]
    );
  },
};

export const AroneLogo = {
  name: "AroneLogo",
  render() {
    return h(
      "div",
      { class: "logo d-flex justify-content-start px-md-5 px-1 mt-2" },
      [
        h("span", this.t("poweredBy")),
        h("img", {
          src: "/assets/logo.svg",
          alt: "Arone Logo",
          class: "col-lg-auto col",
        }),
      ]
    );
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          poweredBy: () => "Powered By ",
        },
        fr: {
          poweredBy: () => "Créé par ",
        },
      },
    });
    return { t };
  },
};

export const MainImage = {
  name: "MainImage",
  render() {
    return h("div", { class: "col-6 p-5 image-container" }, [
      h("img", { src: "/assets/mainImage.svg", alt: "Main Image" }),
    ]);
  },
};

export const AlertMessage = {
  name: "AlertMessage",
  props: ["flash"],
  render() {
    return h(
      "p",
      { class: "alert-message m-2 pb-1 pt-1 text-center" },
      this.flash
    );
  },
};

export const NavigationBar = {
  name: "NavigationTabs",
  props: ["selectedTab"],
  methods: {
    changeTab(tab) {
      this.$emit("changeTab", tab);
    },
  },
  render() {
    return h("ul", { class: "nav ml-auto mt-2 mt-lg-0" }, [
      h("li", [
        h(
          "a",
          {
            id: "signinLink",
            class: this.selectedTab == "signin" ? "connexion h5" : "h5",
            onClick: () => this.changeTab("signin"),
          },
          this.t("signin")
        ),
      ]),
      h("li", [
        h(
          "a",
          {
            id: "signupLink",
            class:
              this.selectedTab == "signup" ? "px-4 connexion h5" : "px-4 h5",
            onClick: () => this.changeTab("signup"),
          },
          this.t("signup")
        ),
      ]),
    ]);
  },
  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          signin: () => "Sign In",
          signup: () => "Sign Up",
        },
        fr: {
          signin: () => "Connexion",
          signup: () => "Inscription",
        },
      },
    });
    return { t };
  },
};
