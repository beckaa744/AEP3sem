const RESPOSTAS = {
  whatsapp: {
    palavras: ['whatsapp', 'mensagem', 'audio', 'áudio', 'video', 'vídeo', 'chamada', 'foto', 'zap'],
    texto: 'Posso te ajudar com o WhatsApp! Lá você aprende a mandar mensagens de voz, fazer videochamadas e enviar fotos. Quer que eu te leve até o guia completo?',
    pagina: 'whatsapp',
  },
  susdigital: {
    palavras: ['sus', 'saude', 'saúde', 'vacina', 'cartão', 'cartao', 'exame', 'remedio', 'remédio', 'medicamento'],
    texto: 'O Meu SUS Digital guarda seu cartão do SUS, vacinas e exames no celular! Quer ver o guia passo a passo?',
    pagina: 'susdigital',
  },
  googleagenda: {
    palavras: ['agenda', 'compromisso', 'lembrete', 'consulta', 'horário', 'horario', 'calendario', 'calendário'],
    texto: 'Com o Google Agenda você nunca esquece um compromisso! Ele avisa antes da hora chegar. Quer aprender a usar?',
    pagina: 'googleagenda',
  },
  seguranca: {
    palavras: ['golpe', 'senha', 'segurança', 'seguranca', 'fraude', 'link', 'suspeito', 'perigo', 'scam', 'banco'],
    texto: 'Muito importante se proteger na internet! Temos dicas essenciais sobre como evitar golpes e manter seus dados seguros. Quer ver?',
    pagina: 'seguranca',
  },
  sobre: {
    palavras: ['sobre', 'projeto', 'quem', 'criou', 'site'],
    texto: 'O SeConecte foi criado para ajudar pessoas a aprender a usar o celular com segurança e confiança. Quer saber mais sobre o projeto?',
    pagina: 'sobre',
  },
  saudacao: {
    palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'hello'],
    texto: 'Olá! Fico feliz em te ver por aqui! 😊 Como posso te ajudar hoje? Você pode me perguntar sobre WhatsApp, SUS Digital, Google Agenda ou dicas de segurança.',
    pagina: null,
  },
  ajuda: {
    palavras: ['ajuda', 'help', 'não sei', 'nao sei', 'como', 'aprender', 'duvida', 'dúvida'],
    texto: 'Estou aqui para ajudar! Temos guias sobre:\n\n• WhatsApp — mensagens, áudios e videochamadas\n• SUS Digital — cartão do SUS e vacinas\n• Google Agenda — compromissos e lembretes\n• Segurança — como evitar golpes\n\nSobre qual desses você quer saber mais?',
    pagina: null,
  },
};

const RESPOSTA_PADRAO = 'Não entendi muito bem, mas posso te ajudar! Você pode me perguntar sobre WhatsApp, SUS Digital, Google Agenda ou dicas de segurança. O que você precisa?';

const SUGESTOES = [
  'Como usar o WhatsApp?',
  'Ver meu cartão do SUS',
  'Dicas de segurança',
  'Agendar um compromisso',
];

let aberto = false;

document.addEventListener('DOMContentLoaded', () => {
  injetarHTML();
  bindEventos();
});

function injetarHTML() {
  document.body.insertAdjacentHTML('beforeend', `
    <button id="chat-toggle" aria-label="Abrir assistente">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>

    <div id="chatbox">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <div class="chat-header-text">
            <p>Conect</p>
            <span>● Online agora</span>
          </div>
        </div>
        <button class="chat-close" id="chat-fechar" aria-label="Fechar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="chat-body" id="chat-body"></div>

      <div class="chat-suggestions" id="chat-sugestoes"></div>

      <div class="chat-footer">
        <input type="text" id="chat-input" placeholder="Digite sua dúvida...">
        <button class="chat-send" id="chat-enviar" aria-label="Enviar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `);

  renderizarSugestoes();
  setTimeout(() => {
    adicionarMensagem('bot', 'Olá! Sou o Conect, seu assistente aqui no SeConecte. 😊\n\nPode me perguntar sobre qualquer aplicativo ou dúvida que tiver. Estou aqui para ajudar!');
  }, 300);
}

function bindEventos() {
  document.getElementById('chat-toggle').addEventListener('click', toggleChat);
  document.getElementById('chat-fechar').addEventListener('click', fecharChat);
  document.getElementById('chat-enviar').addEventListener('click', enviar);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') enviar();
  });
}

function toggleChat() {
  aberto ? fecharChat() : abrirChat();
}
function abrirChat() {
  aberto = true;
  document.getElementById('chatbox').classList.add('aberto');
  document.getElementById('chat-input').focus();
}
function fecharChat() {
  aberto = false;
  document.getElementById('chatbox').classList.remove('aberto');
}

function renderizarSugestoes() {
  const container = document.getElementById('chat-sugestoes');
  container.innerHTML = '';
  SUGESTOES.forEach(texto => {
    const btn = document.createElement('button');
    btn.className = 'sug-btn';
    btn.textContent = texto;
    btn.addEventListener('click', () => {
      container.innerHTML = '';
      enviarMensagem(texto);
    });
    container.appendChild(btn);
  });
}

function adicionarMensagem(tipo, texto) {
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = `msg ${tipo}`;
  div.textContent = texto;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

function mostrarDigitando() {
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'msg bot typing';
  div.id = 'chat-typing';
  div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function removerDigitando() {
  const el = document.getElementById('chat-typing');
  if (el) el.remove();
}

function identificarResposta(texto) {
  const lower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const chave in RESPOSTAS) {
    const entry = RESPOSTAS[chave];
    if (entry.palavras.some(p => lower.includes(p))) {
      return entry;
    }
  }
  return null;
}

function enviar() {
  const input = document.getElementById('chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  enviarMensagem(texto);
}

function enviarMensagem(texto) {
  adicionarMensagem('user', texto);
  mostrarDigitando();

  setTimeout(() => {
    removerDigitando();
    const match = identificarResposta(texto);

    if (match) {
      adicionarMensagem('bot', match.texto);

      if (match.pagina) {
        setTimeout(() => {
          const nav = document.createElement('div');
          nav.className = 'msg bot';
          nav.style.cursor = 'pointer';
          nav.style.background = 'linear-gradient(135deg, rgba(91,155,213,0.2), rgba(178,151,229,0.2))';
          nav.style.border = '0.5px solid rgba(178,151,229,0.4)';
          nav.style.color = '#c9b8f0';
          nav.textContent = '👉 Ir para o guia agora';
          nav.addEventListener('click', () => {
            if (typeof mostrarPagina === 'function') mostrarPagina(match.pagina);
            fecharChat();
          });
          document.getElementById('chat-body').appendChild(nav);
          document.getElementById('chat-body').scrollTop = 99999;
        }, 400);
      }
    } else {
      adicionarMensagem('bot', RESPOSTA_PADRAO);
    }
  }, 800);
}