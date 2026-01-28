// src/auth/oidc.js
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_mXG9FY7uH";
const CLIENT_ID = "42nrq7l9p43gqihe8nanubg3";

// Hosted UI domain (NO el cognito-idp)
const COGNITO_DOMAIN = "https://us-east-1mxg9fy7uh.auth.us-east-1.amazoncognito.com";

// Issuer (sí: cognito-idp)
const authority = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

// Recomendación: fija producción a hakken.cloud para no liarte con .pages.dev / www
const APP_ORIGIN = "https://hakken.cloud";
const redirect_uri = `${APP_ORIGIN}/auth/callback`;
const post_logout_redirect_uri = `${APP_ORIGIN}/`;

// Metadata “a mano” para evitar CORS al /.well-known/openid-configuration
const metadata = {
  issuer: authority,
  authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
  token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
  userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
  jwks_uri: `${authority}/.well-known/jwks.json`,
  end_session_endpoint: `${COGNITO_DOMAIN}/logout`,
};

export const userManager = new UserManager({
  authority,
  client_id: CLIENT_ID,
  redirect_uri,
  response_type: "code",
  scope: "openid email profile",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  loadUserInfo: true,
  metadata,
});

export async function signIn(returnTo = "/dashboard") {
  return userManager.signinRedirect({ state: returnTo });
}

export async function handleAuthCallback() {
  return userManager.signinRedirectCallback();
}

export async function getUser() {
  return userManager.getUser();
}

export async function getAccessToken() {
  const user = await userManager.getUser();
  if (!user || user.expired) return null;
  return user.access_token;
}

// Logout recomendado para Cognito (usa logout_uri)
export async function signOut() {
  await userManager.removeUser();
  const url =
    `${COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(post_logout_redirect_uri)}`;
  window.location.assign(url);
}