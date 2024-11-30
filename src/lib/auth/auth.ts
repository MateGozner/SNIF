import {jwtDecode} from 'jwt-decode';
import { AuthToken } from '../types/auth';


export class AuthService {
    private static TOKEN_KEY = 'token';	

    static setToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getToken() : string | null {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;
    
        try {
          const decoded = jwtDecode<AuthToken>(token);
          return decoded.exp * 1000 > Date.now();
        } catch {
          return false;
        }
    }
}