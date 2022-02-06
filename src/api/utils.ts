import Axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

// export const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? `https://${window.location.host}/api`
//     : "http://localhost:8000/api";

export const BASE_URL = "http://localhost:8000/api";

export const axios = applyCaseMiddleware(
  Axios.create({
    timeout: 60000,
  }),
);

// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export const parseJwt = <T>(token: string): T => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
};
