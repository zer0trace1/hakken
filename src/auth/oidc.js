// src/auth/oidc.js
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

// === Cognito settings (una sola fuente de verdad) ===
export const REGION = "us-east-1";
export const USER_POOL_ID = "us-east-1_mXG9FY7uH";
export const CLIENT_ID = "42nrq7l9p43gqihe8nanubg3";

export const COGNITO_DOMAIN =
  "https://us-east-1mxg9fy7uh.auth.us-east-1.amazoncognito.com";

export const REDIRECT_URI = "https://hakken.cloud/auth/callback";
export const LOGOUT_REDIRECT_URI = "https://hakken.cloud/";

// Issuer del user pool (este SÍ suele permitir CORS para la metadata OIDC)
const authority = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

export const userManager = new UserManager({
  authority,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: "openid email profile",

  // Sesión SPA
  userStore: new WebStorageStateStore({ store: window.localStorage }),

  // Evita llamadas extra a /oauth2/userInfo (no necesarias normalmente)
  loadUserInfo: false,
});

export function signIn(returnTo = "/dashboard") {
  return userManager.signinRedirect({ state: returnTo });
}

export function handleAuthCallback() {
  return userManager.signinRedirectCallback();
}

export async function signOut() {
  // Limpieza local para no dejar UI “logueada” mientras vuelves
  await userManager.removeUser();

  // Logout estándar Cognito Hosted UI / Managed login
  const url =
    `${COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(LOGOUT_REDIRECT_URI)}`;

  window.location.assign(url);
}

export function getUser() {
  return userManager.getUser();
}

export async function getAccessToken() {
  const user = await getUser();
  if (!user || user.expired) return null;
  return user.access_token;
}