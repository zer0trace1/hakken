// src/auth/oidc.js
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const authority = "https://us-east-1mxg9fy7uh.auth.us-east-1.amazoncognito.com";
const client_id = "42nrq7l9p43gqihe8nanubg3";

const redirect_uri = "https://hakken.cloud/auth/callback";
const post_logout_redirect_uri = "https://hakken.cloud/";

export const userManager = new UserManager({
  authority,
  client_id,
  redirect_uri,
  post_logout_redirect_uri,
  response_type: "code", // code + PKCE (lo recomendado)
  scope: "openid email profile",

  // Guarda sesión en localStorage (más cómodo para SPA)
  userStore: new WebStorageStateStore({ store: window.localStorage }),

  // Opcional pero útil
  loadUserInfo: true,
});

export async function signIn(returnTo = "/dashboard") {
  // state nos permite volver a donde queramos tras login
  return userManager.signinRedirect({ state: returnTo });
}

export async function handleAuthCallback() {
  return userManager.signinRedirectCallback();
}

export async function signOut() {
  // oidc-client-ts hace la redirección de logout usando la metadata del provider
  return userManager.signoutRedirect();
}

export async function getUser() {
  return userManager.getUser();
}

export async function getAccessToken() {
  const user = await userManager.getUser();
  if (!user || user.expired) return null;
  return user.access_token;
}