export default function (method, nonce) {
  return `<!DOCTYPE html>
  <html >
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <title>Sign-in</title>
      <link rel="stylesheet" href="/style/style.css">
    </head>
    <body>
      <script nonce="${nonce}" type="module">
        import { i18n, Login, h, createApp } from "/app.vue.js";

        const app = createApp({
          render() {
            return h(Login, {
              title: "<%= locals.title %>", 
              subtitle: "<%= locals.subtitle %>", 
              saasMode: "<%= locals.saasMode %>", 
              uid: "<%= locals.uid %>",
              method: "${method}",
              loginHint: "<%= locals.params.login_hint %>",
              flash: "<%= locals.flash %>"
            })
          }
        });
        app.use(i18n)
        app.mount("#app");
      </script>
      <div id="app">
      </div>
    </body>
  </html>`;
}
