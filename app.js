"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const userId = document.getElementById('userId');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');
const userBalance = document.getElementById('userBalance');
const logoutButton = document.getElementById('logoutButton');
const API_URL = 'https://bitcoin-gold.onrender.com';
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Email ou senha inválidos.');
        }
        const data = yield response.json();
        return data.token;
    });
}
function getUserData(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
        }
        return yield response.json();
    });
}
function showDashboard(user) {
    userId.textContent = user.id;
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userRole.textContent = user.role;
    userBalance.textContent = Number(user.balance).toFixed(2);
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
}
function logout() {
    localStorage.removeItem('authToken');
    loginView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
}
loginForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const token = yield login(email, password);
        localStorage.setItem('authToken', token);
        const user = yield getUserData(token);
        showDashboard(user);
    }
    catch (err) {
        loginError.textContent = err.message;
    }
}));
logoutButton.addEventListener('click', logout);
// Check token on load
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const user = yield getUserData(token);
            showDashboard(user);
        }
        catch (_a) {
            logout(); // token inválido
        }
    }
}));
