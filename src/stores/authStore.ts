import { AuthRole } from "../types";

class AuthStore {
  private accessToken: string | undefined;
  private role: AuthRole = AuthRole.Default;

  getRole() {
    return this.role;
  }
  setRole(role: AuthRole) {
    this.role = role;
  }

  getAccessToken() {
    return this.accessToken;
  }
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  isAdmin() {
    return this.role === AuthRole.Admin;
  }
}

export const authStore = new AuthStore();
