import { apiGet } from './shared/api.js';

document.getElementById('btn')?.addEventListener('click', async () => {
  try {
    const response = await apiGet('/auth/connect');
    if (response.ok) {
      window.location.href = 'src/pages/login.html';
    } else {
      alert('Erro ao conectar: ' + response.status);
    }
  } catch (error) {
    alert('Erro de conexão: ' + error);
  }
}); 