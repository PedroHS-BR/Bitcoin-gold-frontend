const API_URL = "http://localhost:8080";
let jwtToken: string | null = null;

function renderHome() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <h1>Bem-vindo ao Meu Site!</h1>
      <button id="btn">CONECTAR</button>
    `;
    const btn = document.getElementById('btn') as HTMLButtonElement;
    btn.addEventListener('click', async () => {
      try {
        const response = await fetch(`${API_URL}/auth/connect`, { method: 'GET' });
        if (response.ok) {
          renderLogin();
        } else {
          alert('Erro ao conectar: ' + response.status);
        }
      } catch (error) {
        alert('Erro de conexão: ' + error);
      }
    });
  }
}

function renderLogin() {
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
    document.getElementById('register')?.addEventListener('click', renderRegister);
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const email = emailInput.value;
      const password = passwordInput.value;
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        if (response.ok) {
          const data = await response.json();
          jwtToken = data.token;
          await fetchAndRenderUser();
        } else {
          alert('Falha no login: ' + response.status);
        }
      } catch (error) {
        alert('Erro ao fazer login: ' + error);
      }
    });
  }
}

function renderRegister() {
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
    document.getElementById('voltar')?.addEventListener('click', renderLogin);
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        if (response.ok) {
          alert('Registro realizado com sucesso! Faça login.');
          renderLogin();
        } else {
          alert('Falha no registro: ' + response.status);
        }
      } catch (error) {
        alert('Erro ao registrar: ' + error);
      }
    });
  }
}

async function fetchAndRenderUser() {
  if (!jwtToken) {
    alert('Token não encontrado. Faça login novamente.');
    renderLogin();
    return;
  }
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      const user = await response.json();
      renderUserPage(user);
    } else {
      alert('Erro ao buscar informações do usuário: ' + response.status);
      renderLogin();
    }
  } catch (error) {
    alert('Erro ao buscar informações do usuário: ' + error);
    renderLogin();
  }
}

function renderUserPage(user: { id: string, name: string, email: string, role: string, balance: number }) {
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
      <button id="criar-transacao">Criar Transação</button>
      <button id="view-transactions">View Transactions</button>
      <button id="logout">Logout</button>
      <div id="transacao-form-container"></div>
      <div id="transactions-list-container"></div>
    `;
    document.getElementById('logout')?.addEventListener('click', () => {
      jwtToken = null;
      renderHome();
    });
    document.getElementById('criar-transacao')?.addEventListener('click', renderTransactionForm);
    document.getElementById('view-transactions')?.addEventListener('click', fetchAndRenderTransactions);
  }
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
      if (!jwtToken) {
        alert('Token não encontrado. Faça login novamente.');
        renderLogin();
        return;
      }
      try {
        const response = await fetch(`${API_URL}/transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ destination, amount })
        });
        if (response.ok) {
          alert('Transação realizada com sucesso!');
          // Aqui você pode atualizar o saldo ou recarregar os dados do usuário
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
  if (!jwtToken) {
    alert('Token não encontrado. Faça login novamente.');
    renderLogin();
    return;
  }
  try {
    const response = await fetch(`${API_URL}/transaction`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
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

// Inicializa a página principal
renderHome(); 