import { NODE_ENV } from "../../../core/config/env.js";
import {
  generateDeviceId,
  setRefreshTokenCookie,
  setDeviceCookie,
} from "../../../core/security/index.js";
import { buildAuthMeta } from "../shared/auth.utils.js";
import {
  asyncHandler,
  ApiResponse,
  buildAuthResponse,
  getRequestMeta,
} from "../../../core/utils/index.js";
import {
  getUserSessionsService,
  revokeAllSessionsService,
  revokeSessionService,
  rotateSessionService,
  terminateSessionService,
} from "../session/session.service.js";

import { loginService, registerService } from "./auth.service.js";

// ! CONTROLLER FOR USER REGISTRATION
export const registerController = asyncHandler(async (req, res) => {
  const meta = buildAuthMeta(req, res);
  const { user, accessToken, refreshToken } = await registerService(
    req.body,
    meta
  );

  // SET HTTP-ONLY COOKIE FOR REFRESH TOKEN
  setRefreshTokenCookie(res, refreshToken);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        buildAuthResponse(user, accessToken),
        "User registered successfully"
      )
    );
});

// ! CONTROLLER FOR USER LOGIN
export const loginController = asyncHandler(async (req, res) => {
  const meta = buildAuthMeta(req, res);

  const result = await loginService(req.body, meta);

  // If 2FA required
  if (result.require2FA) {
    return res.status(200).json(
      new ApiResponse(200, {
        twofactorRequired: true,
        tempToken: result.tempToken,
      })
    );
  }

  const { user, accessToken, refreshToken } = result;

  // SET HTTP-ONLY COOKIE FOR REFRESH TOKEN
  setRefreshTokenCookie(res, refreshToken);

  const authRes = buildAuthResponse(user, accessToken);

  return res.json(new ApiResponse(200, authRes));
});

// ! CONTROLLER FOR REFRESHING TOKENS
export const refreshController = asyncHandler(async (req, res) => {
  const meta = buildAuthMeta(req, res);

  const oldRefreshToken = req.cookies.refreshToken;

  const { accessToken, refreshToken } = await rotateSessionService(
    oldRefreshToken,
    meta
  );

  // SET NEW COOKIE FOR REFRESH TOKEN
  setRefreshTokenCookie(res, refreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        "Access token refreshed successfully"
      )
    );
});

// ! CONTROLLER FOR LOGOUT
export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await revokeSessionService(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

// ! CONTROLLER FOR LOGOUT ALL
export const logoutAllController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await revokeAllSessionsService(userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out from all devices"));
});

// ! CONTROLLER FOR LISTING USER ACTIVE SESSIONS
export const getSessionsController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const deviceId = req.cookies.deviceId;

  const sessions = await getUserSessionsService(userId, deviceId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, sessions, "Active sessions retrieved successfully")
    );
});

// ! CONTROLLER FOR TERMINATING A SPECIFIC SESSION
export const terminateSessionController = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const refreshToken = req.cookies.refreshToken;

  await terminateSessionService(req.user.id, sessionId, refreshToken);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Session terminated successfully"));
});
