export const HTMLTemplate = (
  appName: string,
  title: string,
  heading: string,
  message: string,
) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family:
          Geist,
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          Oxygen,
          Ubuntu,
          Cantarell,
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          sans-serif;
        background:
          radial-gradient(
            100% 100% at 50% 0%,
            var(--Neutral-N-0, color(display-p3 0.0353 0.0353 0.0431 / 0)) 50%,
            var(--Neutral-N-10, color(display-p3 0.0353 0.0353 0.0431 / 0.1))
              100%
          ),
          var(--Neutral-Inverted-NI-100, color(display-p3 0.9569 0.9569 0.9608));
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .container {
        background: white;
        border-radius: 16px;
        padding: 32px 26px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        text-align: left;
      }

      .brand {
        color: #6b7280;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 23.45px;
        letter-spacing: -0.14px;
        margin-bottom: 16px;
      }

      h1 {
        color: #111827;
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 24px;
        line-height: 1.2;
      }

      .message {
        color: #6b7280;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 23.5px;
        letter-spacing: 0.14px;
        margin-bottom: 16px;
      }

      @media (max-width: 480px) {
        .container {
          padding: 32px 24px;
        }

        h1 {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">${appName}</div>
      <h1>${heading}</h1>
      <p class="message">${message}</p>
    </div>
  </body>
</html>`
