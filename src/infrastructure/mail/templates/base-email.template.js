export const baseTemplate = ({ title, subtitle, content, footer }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
">

  <div style="max-width:560px; margin:40px auto; padding:0 20px;">

    <!-- LOGO / BRAND -->
    <div style="text-align:center; margin-bottom:24px;">
      <div style="
        font-weight:600;
        font-size:18px;
        color:#111827;
        letter-spacing:0.5px;
      ">
        TMS
      </div>
    </div>

    <!-- CARD -->
    <div style="
      background:#ffffff;
      border-radius:12px;
      padding:32px;
      box-shadow:0 8px 24px rgba(0,0,0,0.04);
    ">

      <h2 style="
        margin:0 0 8px;
        font-size:20px;
        color:#111827;
        font-weight:600;
      ">
        ${title}
      </h2>

      <p style="
        margin:0 0 24px;
        color:#6b7280;
        font-size:14px;
        line-height:1.5;
      ">
        ${subtitle}
      </p>

      ${content}

      <p style="
        margin-top:24px;
        font-size:12px;
        color:#9ca3af;
        line-height:1.5;
      ">
        ${footer}
      </p>

    </div>

    <!-- FOOTER -->
    <div style="
      text-align:center;
      margin-top:20px;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} TMS. All rights reserved.
    </div>

  </div>

</body>
</html>
`;
