export default function(form) {
  return `<!DOCTYPE html>
    <head>
      <title>Logout Request</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
      <style>
        body {
          color: white;
        }
        .modal {
          background-color: #2d3252 !important;
        }
        .modal-content {
          background: linear-gradient(0.75turn, #002bb5, #1a55a1);
          box-shadow: 0px 0px 10px black !important;
          height: 100% !important;
          position: absolute;
        }
        .modal-dialog {
          max-width: 30% !important;
          min-height: 30% !important;
          top: 20% !important;
          position: relative !important;
        }
        .btn-danger {
          background-color: #a00007 !important;
        }
        .btn {
          font-size: 1.25rem !important;
        }
        @media only screen and (max-width: 992px) {
          .modal-dialog {
            max-width: 95% !important;
          }
        }
      </style>
    </head>
    <body>
      <div>${form}</div>
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header border-0 col">
              <h4 class="card-title mb-3 mx-auto">Sign out ?</h5>
            </div>
            <div class="modal-body border-0 d-grid gap-2">
              <button id="logout" class="btn btn-danger" type="submit" form="op.logoutForm" value="yes" name="logout">Confirm</button>
              <button class="btn btn-outline-light" type="submit" form="op.logoutForm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}
