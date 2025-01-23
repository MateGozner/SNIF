import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "auth_token";

export const cookies = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      expires: 1/48, // 30 minutes
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getToken: () => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
  },
};