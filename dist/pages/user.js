var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiGet, apiPost, clearToken } from '../shared/api.js';
function fetchUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiGet('/user');
        if (response.ok) {
            const user = yield response.json();
            renderUserPage(user);
        }
        else {
            alert('Erro ao buscar informações do usuário. Faça login novamente.');
            clearToken();
            window.location.href = 'src/pages/login.html';
        }
    });
}
function renderUserPage(user) {
    var _a, _b, _c;
    const app = document.getElementById('app');
    if (!app)
        return;
    app.innerHTML = `
    <h2>Informações do Usuário</h2>
    <ul>
      <li><strong>ID:</strong> ${user.id}</li>
      <li><strong>Nome:</strong> ${user.name}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Função:</strong> ${user.role}</li>
      <li><strong>Saldo:</strong> R$ ${user.balance}</li>
    </ul>
    <button id="criar-transacao">Criar Transação</button>
    <button id="view-transactions">View Transactions</button>
    <button id="logout">Logout</button>
    <div id="transacao-form-container"></div>
    <div id="transactions-list-container"></div>
  `;
    (_a = document.getElementById('logout')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        clearToken();
        window.location.href = 'src/pages/login.html';
    });
    (_b = document.getElementById('criar-transacao')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', renderTransactionForm);
    (_c = document.getElementById('view-transactions')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', fetchAndRenderTransactions);
}
function renderTransactionForm() {
    var _a;
    const container = document.getElementById('transacao-form-container');
    if (container) {
        container.innerHTML = `
      <h3>Criar Transação</h3>
      <form id="transacao-form">
        <input type="email" id="destino-email" placeholder="Email de destino" required />
        <input type="number" id="valor" placeholder="Valor" required min="0.01" step="0.01" />
        <button type="submit">Enviar</button>
      </form>
    `;
        (_a = document.getElementById('transacao-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const destinoEmailInput = document.getElementById('destino-email');
            const valorInput = document.getElementById('valor');
            const destination = destinoEmailInput.value;
            const amount = parseFloat(valorInput.value);
            try {
                const response = yield apiPost('/transaction', { destination, amount });
                if (response.ok) {
                    alert('Transação realizada com sucesso!');
                    fetchUser();
                }
                else {
                    alert('Falha ao criar transação: ' + response.status);
                }
            }
            catch (error) {
                alert('Erro ao criar transação: ' + error);
            }
        }));
    }
}
function fetchAndRenderTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiGet('/transaction');
            if (response.ok) {
                const transactions = yield response.json();
                renderTransactionsList(transactions);
            }
            else {
                alert('Erro ao buscar transações: ' + response.status);
            }
        }
        catch (error) {
            alert('Erro ao buscar transações: ' + error);
        }
    });
}
function renderTransactionsList(transactions) {
    const container = document.getElementById('transactions-list-container');
    if (container) {
        if (!transactions.length) {
            container.innerHTML = '<p>Nenhuma transação encontrada.</p>';
            return;
        }
        container.innerHTML = `
      <h3>Transações</h3>
      <table border="1" style="width:100%;text-align:center;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Remetente</th>
            <th>Destinatário</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>${t.source}</td>
              <td>${t.destination}</td>
              <td>R$ ${t.amount}</td>
              <td>${t.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    }
}
fetchUser();
