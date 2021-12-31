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
