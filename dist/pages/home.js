var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { apiGet } from '../shared/api';
(_a = document.getElementById('btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield apiGet('/auth/connect');
        if (response.ok) {
            window.location.href = 'login.html';
        }
        else {
            alert('Erro ao conectar: ' + response.status);
        }
    }
    catch (error) {
        alert('Erro de conexão: ' + error);
    }
}));
