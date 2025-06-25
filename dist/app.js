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
const API_URL = "http://localhost:8080";
let jwtToken = null;
function renderHome() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
      <h1>Bem-vindo ao Meu Site!</h1>
      <button id="btn">CONECTAR</button>
    `;
        const btn = document.getElementById('btn');
        btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${API_URL}/auth/connect`, { method: 'GET' });
                if (response.ok) {
                    renderLogin();
                }
                else {
                    alert('Erro ao conectar: ' + response.status);
                }
            }
            catch (error) {
                alert('Erro de conexão: ' + error);
            }
        }));
    }
}
function renderLogin() {
    var _a, _b;
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
      <h2>Login</h2>
      <form id="login-form">
        <input type="text" id="email" placeholder="Usuário" required value="teste1@gmail.com" />
        <input type="password" id="password" placeholder="Senha" required value="aslkdhnufbiow@" />
        <button type="submit">Entrar</button>
      </form>
      <button id="register">Registrar</button>
    `;
        (_a = document.getElementById('register')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', renderRegister);
        (_b = document.getElementById('login-form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const email = emailInput.value;
            const password = passwordInput.value;
            try {
                const response = yield fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    const data = yield response.json();
                    jwtToken = data.token;
                    yield fetchAndRenderUser();
                }
                else {
                    alert('Falha no login: ' + response.status);
                }
            }
            catch (error) {
                alert('Erro ao fazer login: ' + error);
            }
        }));
    }
}
function renderRegister() {
    var _a, _b;
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
      <h2>Registro</h2>
      <form id="register-form">
        <input type="text" id="name" placeholder="Nome" required />
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Senha" required />
        <button type="submit">Registrar</button>
      </form>
      <button id="voltar">Voltar</button>
    `;
        (_a = document.getElementById('voltar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', renderLogin);
        (_b = document.getElementById('register-form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            try {
                const response = yield fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });
                if (response.ok) {
                    alert('Registro realizado com sucesso! Faça login.');
                    renderLogin();
                }
                else {
                    alert('Falha no registro: ' + response.status);
                }
            }
            catch (error) {
                alert('Erro ao registrar: ' + error);
            }
        }));
    }
}
function fetchAndRenderUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!jwtToken) {
            alert('Token não encontrado. Faça login novamente.');
            renderLogin();
            return;
        }
        try {
            const response = yield fetch(`${API_URL}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (response.ok) {
                const user = yield response.json();
                renderUserPage(user);
            }
            else {
                alert('Erro ao buscar informações do usuário: ' + response.status);
                renderLogin();
            }
        }
        catch (error) {
            alert('Erro ao buscar informações do usuário: ' + error);
            renderLogin();
        }
    });
}
function renderUserPage(user) {
    var _a;
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
      <h2>Informações do Usuário</h2>
      <ul>
        <li><strong>ID:</strong> ${user.id}</li>
        <li><strong>Nome:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Função:</strong> ${user.role}</li>
        <li><strong>Saldo:</strong> R$ ${user.balance}</li>
      </ul>
      <button id="logout">Logout</button>
    `;
        (_a = document.getElementById('logout')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            jwtToken = null;
            renderHome();
        });
    }
}
// Inicializa a página principal
renderHome();
