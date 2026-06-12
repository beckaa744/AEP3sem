const mapaNavLinks = {
  home:         ['nav-home'],
  susdigital:   ['nav-sus'],
  whatsapp:     ['nav-whats'],
  seguranca:    ['nav-seguranca'],
  sobre:        ['nav-sobre'],
  googleagenda: ['nav-agenda'],
};

// Cache para não buscar a mesma página duas vezes
const paginasCarregadas = {};

async function mostrarPagina(nomePagina) {
  const app = document.getElementById('app');

  // Se ainda não carregou, busca o HTML da página
  if (!paginasCarregadas[nomePagina]) {
    try {
      const res = await fetch(`pages/${nomePagina}.html`);
      if (!res.ok) throw new Error(`Página não encontrada: ${nomePagina}`);
      const html = await res.text();

      const div = document.createElement('div');
      div.id = 'pagina-' + nomePagina;
      div.innerHTML = html;
      app.appendChild(div);

      paginasCarregadas[nomePagina] = true;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  // Oculta todas
  app.querySelectorAll(':scope > div').forEach(el => el.classList.remove('ativa'));

  // Exibe a solicitada
  const alvo = document.getElementById('pagina-' + nomePagina);
  if (alvo) alvo.classList.add('ativa');

  // Atualiza nav active
document.querySelectorAll('.nb-link')
  .forEach(el => el.classList.remove('active'));
(mapaNavLinks[nomePagina] || []).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
});

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function enviarFormulario() {
  const botao     = document.getElementById('btn-enviar');
  const retorno   = document.getElementById('form-retorno');

  const dados = {
    nome:      document.getElementById('form-nome').value,
    sobrenome: document.getElementById('form-sobrenome').value,
    email:     document.getElementById('form-email').value,
    telefone:  document.getElementById('form-telefone').value,
    regiao:    document.getElementById('form-regiao').value,
    mensagem:  document.getElementById('form-mensagem').value,
  };

  // Validação básica
  if (!dados.nome || !dados.email || !dados.mensagem) {
    retorno.textContent = '⚠️ Preencha pelo menos nome, e-mail e mensagem.';
    retorno.style.color = '#f0a500';
    return;
  }

  botao.disabled = true;
  botao.textContent = 'Enviando...';

  try {
    const res = await fetch('http://localhost:3000/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (res.ok) {
      retorno.textContent = '✅ Mensagem enviada! Retornaremos em breve.';
      retorno.style.color = '#25D366';
      // Limpa os campos
      ['form-nome','form-sobrenome','form-email','form-telefone','form-mensagem'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('form-regiao').selectedIndex = 0;
    } else {
      throw new Error();
    }
  } catch {
    retorno.textContent = '❌ Algo deu errado. Tente novamente.';
    retorno.style.color = '#e53935';
  } finally {
    botao.disabled = false;
    botao.textContent = 'Enviar ›';
  }
}
// Carrega a home na inicialização
mostrarPagina('home');
