import { apiGet, apiPost, getToken, clearToken } from '../shared/api.js';

async function fetchUser() {
  const response = await apiGet('/user');
  if (response.ok) {
    const user = await response.json();
    renderUserPage(user);
  } else {
    alert('Erro ao buscar informações do usuário. Faça login novamente.');
    clearToken();
    window.location.href = 'src/pages/login.html';
  }
}

function renderUserPage(user: { id: string, name: string, email: string, role: string, balance: number }) {
  const app = document.getElementById('app');
  if (!app) return;
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
  document.getElementById('logout')?.addEventListener('click', () => {
    clearToken();
    window.location.href = 'src/pages/login.html';
  });
  document.getElementById('criar-transacao')?.addEventListener('click', renderTransactionForm);
  document.getElementById('view-transactions')?.addEventListener('click', fetchAndRenderTransactions);
}

function renderTransactionForm() {
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
    document.getElementById('transacao-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const destinoEmailInput = document.getElementById('destino-email') as HTMLInputElement;
      const valorInput = document.getElementById('valor') as HTMLInputElement;
      const destination = destinoEmailInput.value;
      const amount = parseFloat(valorInput.value);
      try {
        const response = await apiPost('/transaction', { destination, amount });
        if (response.ok) {
          alert('Transação realizada com sucesso!');
          fetchUser();
        } else {
          alert('Falha ao criar transação: ' + response.status);
        }
      } catch (error) {
        alert('Erro ao criar transação: ' + error);
      }
    });
  }
}

async function fetchAndRenderTransactions() {
  try {
    const response = await apiGet('/transaction');
    if (response.ok) {
      const transactions = await response.json();
      renderTransactionsList(transactions);
    } else {
      alert('Erro ao buscar transações: ' + response.status);
    }
  } catch (error) {
    alert('Erro ao buscar transações: ' + error);
  }
}

function renderTransactionsList(transactions: Array<{ id: number, source: string, destination: string, amount: number, status: string }>) {
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