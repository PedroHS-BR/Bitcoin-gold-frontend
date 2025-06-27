import { apiPost, setToken } from '../shared/api.js';

document.getElementById('register')?.addEventListener('click', () => {
  window.location.href = 'src/pages/register.html';
});

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const response = await apiPost('/auth/login', { email, password });
    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      window.location.href = 'src/pages/user.html';
    } else {
      alert('Falha no login: ' + response.status);
    }
  } catch (error) {
    alert('Erro ao fazer login: ' + error);
  }
}); 