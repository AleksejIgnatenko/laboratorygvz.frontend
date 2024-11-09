import Cookies from "js-cookie";

export const getCookie = (cookieName: string) => {
  const cookie = Cookies.get(cookieName);
  if (!cookie) {
    return null;
  }
  return cookie;
};
