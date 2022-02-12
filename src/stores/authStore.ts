import { AuthRole } from "../types";

class AuthStore {
  private role: AuthRole = AuthRole.Default;

  getRole() {
    return this.role;
  }
  setRole(role: AuthRole) {
    this.role = role;
  }

  isAdmin() {
    return this.role === AuthRole.Admin;
  }

  reset() {
    this.role = AuthRole.Default;
  }
}

export const authStore = new AuthStore();
