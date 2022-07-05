import { h } from "../js/vue.runtime.esm-browser.min.js";

export const DemoRoleSelect = {
  name: "DemoRoleSelect",
  data() {
    return {
      roles: [
        "developer",
        "administrator",
        "writer_s001",
        "writer_s002",
        "writer_p000003",
        "writer",
        "super_administrator",
        "reader_s001",
      ],
    };
  },
  render() {
    return h(
      "select",
      {
        name: "role",
        id: "roles",
        class: "form-control form-control-lg mb-3",
        form: "loginform",
      },
      this.roles.map(role => h("option", role))
    );
  },
};