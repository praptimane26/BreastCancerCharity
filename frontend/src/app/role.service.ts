import { Injectable } from '@angular/core';

const ROLE_KEY = 'role';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveRole(role: string): void {
    window.sessionStorage.removeItem(ROLE_KEY);
    window.sessionStorage.setItem(ROLE_KEY, role);
  }

  public getRole(): string | null {
    return window.sessionStorage.getItem(ROLE_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}