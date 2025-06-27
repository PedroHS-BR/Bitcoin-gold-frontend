import { apiPost } from '../shared/api.js';

document.getElementById('voltar')?.addEventListener('click', () => {
  window.location.href = 'src/pages/login.html';
});

document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const response = await apiPost('/auth/register', { name, email, password });
    if (response.ok) {
      alert('Registro realizado com sucesso! Faça login.');
      window.location.href = 'src/pages/login.html';
    } else {
      alert('Falha no registro: ' + response.status);
    }
  } catch (error) {
    alert('Erro ao registrar: ' + error);
  }
}); 