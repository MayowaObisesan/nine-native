import { AuthConfiguration } from "react-native-app-auth";
import { makeRedirectUri } from "expo-auth-session";
import {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} from "~/lib/constants";

export const redirectUri = makeRedirectUri({
  scheme: "nine://",
  preferLocalhost: false,
  native: "nine://"
  // useProxy: true, // Change to false if using standalone app
});

const redirectUrl =
  process.env.NODE_ENV === "development"
    ? "exp://192.168.1.191:808" // Change to match your Expo Go URL
    : "nine://"; // For standalone builds

export const githubAuthConfig: AuthConfiguration = {
  issuer: "https://github-auth.github.io",
  clientId: GITHUB_CLIENT_ID!,
  clientSecret: GITHUB_CLIENT_SECRET!,
  // redirectUrl: "http://localhost:3000", // "com.yourapp://oauthredirect",
  redirectUrl: redirectUri,
  scopes: ["repo", "read:user", "user:email"],  // "repo" gives access to private repos
  serviceConfiguration: {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
  },
};
