import Cookies from "js-cookie";

export const setCookies = (
  nameCookie: string,
  valueCookie: string,
  expirationDuration: number
) => {
  const expirationTime = new Date(new Date().getTime() + expirationDuration);
  Cookies.set(nameCookie, valueCookie, { expires: expirationTime });
};
