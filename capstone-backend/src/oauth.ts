import { Google } from "arctic";
import { Conf } from "./config.ts";

const googleOAuth = Conf.googleOAuth;
export const google = new Google(
  googleOAuth.clientId,
  googleOAuth.clientSecret,
  googleOAuth.redirectURI,
);
