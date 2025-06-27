var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { apiPost } from '../shared/api.js';
(_a = document.getElementById('voltar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    window.location.href = 'src/pages/login.html';
});
(_b = document.getElementById('register-form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        const response = yield apiPost('/auth/register', { name, email, password });
        if (response.ok) {
            alert('Registro realizado com sucesso! Faça login.');
            window.location.href = 'src/pages/login.html';
        }
        else {
            alert('Falha no registro: ' + response.status);
        }
    }
    catch (error) {
        alert('Erro ao registrar: ' + error);
    }
}));
