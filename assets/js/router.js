const mapaNavLinks = {
  home:         ['nav-home'],
  govbr:        ['nav-govbr'],
  susdigital:   ['nav-sus'],
  whatsapp:     ['nav-whats'],
  bancos:       ['nav-bancos'],
  seguranca:    ['nav-seguranca'],
  ajuda:        ['nav-ajuda'],
  googleagenda: [],
  sobre:        [],
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

// Carrega a home na inicialização
mostrarPagina('home');
