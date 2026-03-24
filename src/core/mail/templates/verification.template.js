export const verificationTemplate = otp => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px;">
  <div style="max-width:500px; margin:0 auto; background:white; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

    <h2 style="margin-bottom:20px; color:#333;">Verify Your Email</h2>

    <p style="color:#555; font-size:14px;">
      Please use the verification code below to complete your sign in process.
    </p>

    <div style="
      margin:30px 0;
      padding:15px;
      font-size:28px;
      font-weight:bold;
      letter-spacing:8px;
      text-align:center;
      background:#f1f3f5;
      border-radius:6px;
      color:#111;
    ">
      ${otp}
    </div>

    <p style="font-size:13px; color:#777;">
      This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
    </p>

    <p style="font-size:12px; color:#aaa; margin-top:30px;">
      If you didn’t request this, you can safely ignore this email.
    </p>

  </div>
</body>
</html>
`;
