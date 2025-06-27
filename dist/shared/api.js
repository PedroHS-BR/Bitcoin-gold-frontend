var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const API_URL = "http://localhost:8080";
export function setToken(token) {
    localStorage.setItem('jwtToken', token);
}
export function getToken() {
    return localStorage.getItem('jwtToken');
}
export function clearToken() {
    localStorage.removeItem('jwtToken');
}
export function apiGet(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = getToken();
        return fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
    });
}
export function apiPost(path, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = getToken();
        return fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Bearer ${token}` } : {})),
            body: JSON.stringify(body)
        });
    });
}
