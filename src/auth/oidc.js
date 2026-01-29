// src/auth/oidc.js
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const userPoolIssuer = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_mXG9FY7uH";
const cognitoDomain = "https://us-east-1mxg9fy7uh.auth.us-east-1.amazoncognito.com";

const client_id = "42nrq7rl9p43gqihe8nanubg3";

// OJO: si entras a la web por www o pages.dev, lo ideal es usar window.location.origin
const redirect_uri = "https://hakken.cloud/auth/callback";
const post_logout_redirect_uri = "https://hakken.cloud/";

export const userManager = new UserManager({
  authority: userPoolIssuer,
  client_id,
  redirect_uri,
  post_logout_redirect_uri,
  response_type: "code",
  response_mode: "query",
  scope: "openid email profile",

  // Evita llamadas extra tipo userInfo que a veces dan guerra por CORS
  loadUserInfo: false,

  // Evita discovery por fetch (y te aseguras de usar /login)
  metadata: {
    issuer: userPoolIssuer,
    authorization_endpoint: `${cognitoDomain}/login`,
    token_endpoint: `${cognitoDomain}/oauth2/token`,
    userinfo_endpoint: `${cognitoDomain}/oauth2/userInfo`,
    end_session_endpoint: `${cognitoDomain}/logout`,
    jwks_uri: `${userPoolIssuer}/.well-known/jwks.json`,
  },

  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

export async function signIn(returnTo = "/dashboard") {
  return userManager.signinRedirect({ state: returnTo });
}

export async function handleAuthCallback() {
  return userManager.signinRedirectCallback();
}

export async function signOut() {
  // 1) limpia la sesión local (tokens en localStorage)
  await userManager.removeUser();

  // 2) redirige al logout real de Cognito Hosted UI
  const cognitoDomain = "https://us-east-1mxg9fy7uh.auth.us-east-1.amazoncognito.com";
  const logoutUri = encodeURIComponent(post_logout_redirect_uri); // https://hakken.cloud/

  window.location.assign(
    `${cognitoDomain}/logout?client_id=${client_id}&logout_uri=${logoutUri}`
  );
}

export async function getUser() {
  return userManager.getUser();
}

export async function getAccessToken() {
  const user = await userManager.getUser();
  if (!user || user.expired) return null;
  return user.access_token;
}