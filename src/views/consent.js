export default function () {
  return `<!DOCTYPE html>
  <html >
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Consent</title>
    </head>
    <body>
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="card-title mb-3"><%= locals.title %></h5>
            </div>
              <% if (params.scope && params.scope.includes('offline_access')) { %>
                <div class="alert alert-danger m-3">
                  The client is asking to have offline access : it will be able to access permanently to the backend resource
                </div>
              <% } %>
              <form autocomplete="off" action="/oidc/interaction/<%= uid %>/confirm" method="post">
                <div class="modal-footer">
                  <button id="consent" autofocus type="submit" class="btn btn-primary float-end">Continue</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </body>
  </html>`
}