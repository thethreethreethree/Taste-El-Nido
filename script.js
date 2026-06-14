/* ================================================================
   taste. El Nido — Main Script
================================================================ */

/* ── Navbar: transparent → solid on scroll ── */
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '1';
    });
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Menu tabs / filter ── */
const tabBtns  = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    menuCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity .3s, transform .3s';

      if (match) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity   = '1';
          card.style.transform = '';
        });
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'scale(.95)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ── Smooth active nav link highlighting ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--teal)';
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── Floating buttons pulse animation ── */
const floatBtns = document.querySelectorAll('.float-btn');

floatBtns.forEach((btn, i) => {
  btn.style.animationDelay = `${i * 0.2}s`;
});

/* ── Gallery lightbox (simple) ── */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(10,10,10,.92);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; animation: fadeIn .25s ease;
      padding: 24px;
    `;

    const picture = document.createElement('img');
    picture.src = img.src;
    picture.alt = img.alt;
    picture.style.cssText = `
      max-width: 90vw; max-height: 88vh;
      object-fit: contain; border-radius: 12px;
      box-shadow: 0 32px 80px rgba(0,0,0,.6);
    `;

    const close = document.createElement('button');
    close.innerHTML = '✕';
    close.style.cssText = `
      position: absolute; top: 20px; right: 24px;
      background: rgba(255,255,255,.12); border: none;
      color: #fff; font-size: 1.4rem; width: 44px; height: 44px;
      border-radius: 50%; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      transition: background .2s;
    `;
    close.addEventListener('mouseover', () => close.style.background = 'rgba(255,255,255,.22)');
    close.addEventListener('mouseout',  () => close.style.background = 'rgba(255,255,255,.12)');

    overlay.appendChild(picture);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const dismiss = () => {
      overlay.style.animation = 'fadeOut .2s ease forwards';
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }, 200);
    };

    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
    close.addEventListener('click', dismiss);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', esc); }
    });
  });
});

/* ── Inject keyframes for lightbox ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
`;
document.head.appendChild(style);

/* ── Stats counter animation ── */
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        if (text === '500+') animateCount(el, 500, '+');
        if (text === '100%') animateCount(el, 100, '%');
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => statsObserver.observe(el));

/* ================================================================
   AI CHAT WIDGET — Kaya
================================================================ */
(function () {
  const CHAT_API = '/api/chat';   // proxied through the Node.js server

  const toggleBtn   = document.getElementById('chat-toggle');
  const closeBtn    = document.getElementById('chatCloseBtn');
  const panel       = document.getElementById('chatPanel');
  const messagesEl  = document.getElementById('chatMessages');
  const input       = document.getElementById('chatInput');
  const sendBtn     = document.getElementById('chatSend');
  const badge       = document.getElementById('chatBadge');
  const quickReplies = document.getElementById('quickReplies');
  const iconOpen    = toggleBtn.querySelector('.chat-icon-open');
  const iconClose   = toggleBtn.querySelector('.chat-icon-close');

  let isOpen      = false;
  let isLoading   = false;
  let messageHistory = [];   // [{role, content}]

  /* ── Open / Close ── */
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    iconOpen.style.display  = 'none';
    iconClose.style.display = 'flex';
    badge.classList.add('hidden');
    input.focus();
    scrollBottom();
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    iconOpen.style.display  = 'flex';
    iconClose.style.display = 'none';
  }

  toggleBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeChat();
    }
  });

  /* ── Scroll to bottom ── */
  function scrollBottom() {
    setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 60);
  }

  /* ── Get current time string ── */
  function nowStr() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /* ── Append message bubble ── */
  function appendMessage(role, html, time) {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = html;

    const ts = document.createElement('span');
    ts.className = 'chat-time';
    ts.textContent = time || nowStr();

    wrap.appendChild(bubble);
    wrap.appendChild(ts);
    messagesEl.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  /* ── Typing indicator ── */
  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg assistant chat-typing';
    wrap.id = 'typingIndicator';
    wrap.innerHTML = `
      <div class="chat-bubble">
        <span class="dot-one"></span>
        <span class="dot-two"></span>
        <span class="dot-three"></span>
      </div>`;
    messagesEl.appendChild(wrap);
    scrollBottom();
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  /* ── Sanitise AI text → safe HTML ── */
  function textToHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  /* ── Send message ── */
  async function sendMessage(text) {
    const userText = text.trim();
    if (!userText || isLoading) return;

    /* Hide quick-replies after first interaction */
    if (quickReplies) quickReplies.style.display = 'none';

    /* Add user bubble */
    appendMessage('user', userText.replace(/</g, '&lt;'));
    messageHistory.push({ role: 'user', content: userText });

    input.value   = '';
    input.disabled = true;
    sendBtn.disabled = true;
    isLoading = true;

    showTyping();

    try {
      const res = await fetch(CHAT_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: messageHistory }),
      });

      hideTyping();

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const { reply } = await res.json();
      const html = textToHtml(reply);

      appendMessage('assistant', html);
      messageHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
      hideTyping();
      appendMessage('assistant',
        '😔 Sorry, I had a little trouble connecting. Please try again or ' +
        '<a href="https://wa.me/63969274090" target="_blank" rel="noopener" style="color:var(--teal);font-weight:600">message us on WhatsApp</a>!'
      );
      console.error('Chat error:', err.message);
    } finally {
      isLoading        = false;
      input.disabled   = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  /* ── Event listeners ── */
  sendBtn.addEventListener('click', () => sendMessage(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  /* Quick reply chips */
  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.msg);
    });
  });

}());
