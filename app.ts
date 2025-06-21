const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginError = document.getElementById('loginError') as HTMLParagraphElement;
const loginView = document.getElementById('loginView') as HTMLDivElement;
const dashboardView = document.getElementById('dashboardView') as HTMLDivElement;

const userId = document.getElementById('userId')!;
const userName = document.getElementById('userName')!;
const userEmail = document.getElementById('userEmail')!;
const userRole = document.getElementById('userRole')!;
const userBalance = document.getElementById('userBalance')!;
const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

const API_URL = 'https://bitcoin-gold.onrender.com';

async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Email ou senha inválidos.');
    }

    const data = await response.json();
    return data.token;
}

async function getUserData(token: string) {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário.');
    }

    return await response.json();
}

function showDashboard(user: any) {
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

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
        const token = await login(email, password);
        localStorage.setItem('authToken', token);

        const user = await getUserData(token);
        showDashboard(user);
    } catch (err) {
        loginError.textContent = (err as Error).message;
    }
});

logoutButton.addEventListener('click', logout);

// Check token on load
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const user = await getUserData(token);
            showDashboard(user);
        } catch {
            logout(); // token inválido
        }
    }
});
