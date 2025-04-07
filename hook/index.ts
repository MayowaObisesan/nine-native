import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import {redirectUri} from "~/config/authConfig";

WebBrowser.maybeCompleteAuthSession();

const githubClientId = "Ov23li2gyze1SatchUp2";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export function useGitHubAuth() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubClientId,
      redirectUri,
      scopes: ["identity", "repo"],
    },
    discovery
  );

  const signInWithGitHub = async () => {
    if (request) {
      const result = await promptAsync();
      console.log("Auth result:", result);
    } else {
      console.error("Auth request is null");
    }
  };

  return { signInWithGitHub };
}
