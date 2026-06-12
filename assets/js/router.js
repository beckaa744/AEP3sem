// ═══════════════════════════════════════════════════
// MODELAGEM ORIENTADA A OBJETOS: ESTRUTURA DE DADOS (PILHA)
// ═══════════════════════════════════════════════════
class PilhaHistorico {
  constructor() {
    this.itens = [];
  }

  empilhar(pagina) {
    console.log(`[Pilha] Empilhando: ${pagina}`);
    this.itens.push(pagina);
    console.log(`[Pilha] Pilha atual:`, this.itens);
  }

  desempilhar() {
    if (this.estaVazia()) {
      console.log(`[Pilha] Tentativa de desempilhar com pilha vazia`);
      return null;
    }
    const item = this.itens.pop();
    console.log(`[Pilha] Desempilhado: ${item}. Pilha atual:`, this.itens);
    return item;
  }

  estaVazia() {
    return this.itens.length === 0;
  }

  topo() {
    return this.itens[this.itens.length - 1];
  }

  tamanho() {
    return this.itens.length;
  }
}

// Instanciação da estrutura de dados
const historico = new PilhaHistorico();
let paginaAtual = 'home';

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

async function mostrarPagina(nomePagina, registrarHistorico = true) {
  console.log(`[Router] mostrarPagina chamada para '${nomePagina}', registrarHistorico=${registrarHistorico}`);
  
  // Evita reentrada na mesma página caso já esteja carregada e ativa
  if (nomePagina === paginaAtual && Object.keys(paginasCarregadas).length > 0) {
    console.log(`[Router] Página '${nomePagina}' já é a atual. Ignorando.`);
    return;
  }

  const app = document.getElementById('app');

  // Se ainda não carregou, busca o HTML da página
  if (!paginasCarregadas[nomePagina]) {
    try {
      console.log(`[Router] Carregando HTML assincronamente para '${nomePagina}'`);
      const res = await fetch(`pages/${nomePagina}.html`);
      if (!res.ok) throw new Error(`Página não encontrada: ${nomePagina}`);
      const html = await res.text();

      const div = document.createElement('div');
      div.id = 'pagina-' + nomePagina;
      div.innerHTML = html;
      app.appendChild(div);

      paginasCarregadas[nomePagina] = true;
    } catch (e) {
      console.error(`[Router] Erro ao carregar página:`, e);
      return;
    }
  }

  // Empilha a página atual se a navegação for direta
  if (registrarHistorico && paginaAtual !== nomePagina) {
    historico.empilhar(paginaAtual);
  }

  // Oculta todas
  app.querySelectorAll(':scope > div').forEach(el => el.classList.remove('ativa'));

  // Exibe a solicitada
  const alvo = document.getElementById('pagina-' + nomePagina);
  if (alvo) {
    alvo.classList.add('ativa');
    console.log(`[Router] Seção '#pagina-${nomePagina}' ativada visualmente.`);
  }

  // Atualiza a página ativa
  paginaAtual = nomePagina;

  // Atualiza nav active
  document.querySelectorAll('.nb-link')
    .forEach(el => el.classList.remove('active'));
  (mapaNavLinks[nomePagina] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  });

  // Gerencia a visibilidade do botão "Voltar"
  const btnVoltar = document.getElementById('btn-voltar');
  if (btnVoltar) {
    if (historico.estaVazia()) {
      btnVoltar.classList.add('d-none');
      console.log(`[Router] Pilha vazia. Escondendo botão Voltar.`);
    } else {
      btnVoltar.classList.remove('d-none');
      console.log(`[Router] Pilha possui itens. Exibindo botão Voltar.`);
    }
  }

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

function voltarPagina() {
  console.log(`[Router] voltarPagina acionada`);
  const paginaAnterior = historico.desempilhar();
  console.log(`[Router] Página anterior obtida: '${paginaAnterior}'`);
  if (paginaAnterior) {
    mostrarPagina(paginaAnterior, false); // false para não reinserir o retorno no histórico
  } else {
    console.warn(`[Router] Não há página anterior no histórico para voltar`);
  }
}

// Expõe as funções globalmente para o HTML
window.mostrarPagina = mostrarPagina;
window.voltarPagina = voltarPagina;
window.enviarFormulario = enviarFormulario;

// Carrega a home na inicialização sem registrar histórico inicial
mostrarPagina('home', false);

// ═══════════════════════════════════════════════════
// SISTEMA DE BUSCA INTERATIVO E INTELIGENTE (SPA)
// ═══════════════════════════════════════════════════
const paginasParaIndexar = ['home', 'susdigital', 'whatsapp', 'googleagenda', 'seguranca', 'sobre'];
let indiceBusca = [];

async function construirIndiceBusca() {
  indiceBusca = [];
  for (const pagina of paginasParaIndexar) {
    try {
      console.log(`[Busca] Indexando página: '${pagina}'`);
      const res = await fetch(`pages/${pagina}.html`);
      if (res.ok) {
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Remove blocos de estilo para não indexar regras de CSS
        doc.querySelectorAll('style').forEach(el => el.remove());
        
        const elementos = doc.querySelectorAll('h1, h2, h3, h4, p, li, strong, span');
        elementos.forEach(el => {
          const texto = el.textContent.trim().replace(/\s+/g, ' ');
          // Indexa apenas elementos folha com texto significativo
          if (texto.length > 5 && !el.querySelector('h1, h2, h3, h4, p, li, strong, span')) {
            indiceBusca.push({
              pagina: pagina,
              texto: texto
            });
          }
        });
      }
    } catch (e) {
      console.error(`[Busca] Erro ao indexar página ${pagina}:`, e);
    }
  }
  console.log(`[Busca] Índice de busca construído com ${indiceBusca.length} itens.`);
}

function executarBusca(query) {
  const resultadosContainer = document.getElementById('busca-resultados');
  if (!resultadosContainer) return;

  if (!query || query.trim().length < 2) {
    resultadosContainer.innerHTML = '';
    resultadosContainer.classList.add('d-none');
    return;
  }

  const termo = query.toLowerCase().trim();
  // Filtra as ocorrências
  const matches = indiceBusca.filter(item => item.texto.toLowerCase().includes(termo));

  if (matches.length === 0) {
    resultadosContainer.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 14px; padding: 0.8rem 1.25rem;">Nenhum resultado encontrado</div>';
    resultadosContainer.classList.remove('d-none');
    return;
  }

  // Limita a 6 resultados para manter a UI limpa
  const lim = matches.slice(0, 6);
  resultadosContainer.innerHTML = '';
  
  lim.forEach(match => {
    const itemDiv = document.createElement('div');
    itemDiv.style.padding = '0.8rem 1.25rem';
    itemDiv.style.cursor = 'pointer';
    itemDiv.style.borderBottom = '0.5px solid rgba(255,255,255,0.05)';
    itemDiv.style.transition = 'background 0.2s';
    
    // Destaca o termo no trecho de texto exibido (comprimento aumentado para 90 caracteres)
    const index = match.texto.toLowerCase().indexOf(termo);
    let snippet = match.texto;
    if (snippet.length > 90) {
      const start = Math.max(0, index - 25);
      const end = Math.min(snippet.length, index + termo.length + 55);
      snippet = (start > 0 ? '...' : '') + snippet.slice(start, end) + (end < snippet.length ? '...' : '');
    }
    
    const escapedTerm = escapeRegExp(termo);
    const textHighlighted = snippet.replace(new RegExp(escapedTerm, 'gi'), m => `<span style="color: #b297e5; font-weight: bold;">${m}</span>`);
    
    const nomesAmigaveis = {
      home: 'Início',
      susdigital: 'Meu SUS Digital',
      whatsapp: 'WhatsApp',
      googleagenda: 'Google Agenda',
      seguranca: 'Dicas de Segurança',
      sobre: 'Sobre o Projeto'
    };

    itemDiv.innerHTML = `
      <div style="font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">
        ${nomesAmigaveis[match.pagina] || match.pagina}
      </div>
      <div style="font-size: 15px; color: #fff; line-height: 1.4;">
        ${textHighlighted}
      </div>
    `;
    
    itemDiv.onmouseenter = () => { itemDiv.style.background = 'rgba(255,255,255,0.05)'; };
    itemDiv.onmouseleave = () => { itemDiv.style.background = 'transparent'; };
    
    itemDiv.onclick = () => {
      resultadosContainer.classList.add('d-none');
      document.getElementById('busca-input').value = '';
      irParaERealcar(match.pagina, match.texto, query);
    };
    
    resultadosContainer.appendChild(itemDiv);
  });

  resultadosContainer.classList.remove('d-none');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function irParaERealcar(nomePagina, textoOriginal, termoBusca) {
  console.log(`[Busca] Navegando para '${nomePagina}' para realçar '${termoBusca}'`);
  await mostrarPagina(nomePagina);

  // Pequeno timeout para garantir a renderização e o scroll
  setTimeout(() => {
    const pageDiv = document.getElementById('pagina-' + nomePagina);
    if (!pageDiv) return;

    // Filtro para ignorar nós de estilo ou script
    const nodeFilter = {
      acceptNode: function(node) {
        const parentTagName = node.parentNode ? node.parentNode.tagName : '';
        if (parentTagName === 'STYLE' || parentTagName === 'SCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    };

    // Busca nó de texto (TextNode) contendo o termo
    const walker = document.createTreeWalker(pageDiv, NodeFilter.SHOW_TEXT, nodeFilter, false);
    let textNode = null;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.toLowerCase().includes(termoBusca.toLowerCase())) {
        // Se textoOriginal foi informado, garante que o elemento pai contém esse texto completo
        if (textoOriginal && node.parentNode && !node.parentNode.textContent.toLowerCase().includes(textoOriginal.toLowerCase())) {
          continue;
        }
        textNode = node;
        break;
      }
    }

    // Se não encontrou no modo estrito, tenta no modo de fallback sem comparar com textoOriginal
    if (!textNode) {
      const fallbackWalker = document.createTreeWalker(pageDiv, NodeFilter.SHOW_TEXT, nodeFilter, false);
      while (fallbackWalker.nextNode()) {
        const node = fallbackWalker.currentNode;
        if (node.nodeValue.toLowerCase().includes(termoBusca.toLowerCase())) {
          textNode = node;
          break;
        }
      }
    }

    if (textNode) {
      const parent = textNode.parentNode;
      
      // Rola para o elemento pai suavemente
      parent.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Salva o texto original
      const originalText = textNode.nodeValue;
      
      // Cria o elemento com realce de forma segura usando escape
      const span = document.createElement('span');
      const escapedTerm = escapeRegExp(termoBusca);
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      span.innerHTML = originalText.replace(regex, '<mark class="highlight-search">$1</mark>');

      // Substitui o nó de texto original
      parent.replaceChild(span, textNode);

      // Remove o realce após 3 segundos
      setTimeout(() => {
        const marks = span.querySelectorAll('.highlight-search');
        marks.forEach(mark => mark.classList.add('fade-out'));
        
        // Remove a marcação e restaura o nó original após o fade-out
        setTimeout(() => {
          if (span.parentNode === parent) {
            parent.replaceChild(document.createTextNode(originalText), span);
          }
        }, 1000);
      }, 3000);
    }
  }, 350);
}

// Fecha o painel de resultados se clicar fora
document.addEventListener('click', (e) => {
  const resultados = document.getElementById('busca-resultados');
  const buscaInput = document.getElementById('busca-input');
  if (resultados && e.target !== buscaInput && !resultados.contains(e.target)) {
    resultados.classList.add('d-none');
  }
});

// Fecha o painel de resultados se apertar a tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const resultados = document.getElementById('busca-resultados');
    if (resultados) {
      resultados.classList.add('d-none');
    }
    const buscaInput = document.getElementById('busca-input');
    if (buscaInput) {
      buscaInput.blur();
    }
  }
});

// Expõe globalmente
window.executarBusca = executarBusca;

// Funções de controle do Lightbox (Zoom de Imagens)
function abrirLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }
}

function fecharLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

window.abrirLightbox = abrirLightbox;
window.fecharLightbox = fecharLightbox;

// Inicia indexação
construirIndiceBusca();
