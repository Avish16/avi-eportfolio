/* =========================================================
   CHATBOT — Avi's portfolio assistant
   - Auto-mounts widget into DOM on page load
   - Local Q&A bank for now (Phase 6)
   - Phase 8 will replace `generateReply()` with a Claude API
     call to /api/chat (Vercel serverless function)
   ========================================================= */

(() => {

  // ----- 1. THE Q&A BANK (replace with Claude API in Phase 8) -----
  // Keyword matching — every key is a regex tested against the user message
  const KB = [
    {
      match: /\b(who are you|tell me about yourself|introduce|about you)\b/i,
      reply: "I'm Avi Sharma — an M.S. in Applied Data Science candidate at Syracuse University, graduating May 2026. I build end-to-end systems that turn complex data into decisions, from seismic signal processing on AWS to medical AI agents to city-scale geospatial analytics."
    },
    {
      match: /\b(what.*work|current job|momacmo|intern)\b/i,
      reply: "Right now I'm a Data Science Intern at MoMacMo (since Sep 2025). I built cloud pipelines on AWS to ingest and analyze 3.6+ TB of high-frequency sensor data from scratch, and designed inference workflows using VGG16 transfer learning and XGBoost — hitting over 90% accuracy on event detection."
    },
    {
      match: /\b(mediexplain|medical.*ai|rag|agentic)\b/i,
      reply: "MediExplain is my biggest project — an 18-component agentic AI system that explains complex medical documents to patients and caregivers. It uses ChromaDB for RAG, has JSON schema validation and retry logic for reliability, and ships with a Streamlit interface for privacy-safe interactions."
    },
    {
      match: /\b(bitcoin|crypto|flash crash|crash predict|finbert|vader)\b/i,
      reply: "Bitcoin Flash Crash Prediction is a PyTorch sequence model that classifies extreme downside Bitcoin minutes. It fuses minute-level OHLCV features with Reddit sentiment scored through VADER and FinBERT, trained over 60-minute sliding windows. Got ~71% test accuracy on ~56.8K sequenced samples."
    },
    {
      match: /\b(drowsiness|driver|cnn|opencv|computer vision)\b/i,
      reply: "Driver Drowsiness Detection is a real-time CNN classifier I trained on 85K+ labeled eye images — ~98% test accuracy with near-perfect ROC-AUC. The inference pipeline uses facial landmarks and time-based aggregation to distinguish sustained closure from natural blinking, deployed via OpenCV for both live webcam and offline video."
    },
    {
      match: /\b(datathon|syracuse.*data|geospatial|folium|civic)\b/i,
      reply: "DataThon 26 was a city-scale geospatial project — I merged 140K+ Syracuse code-violation records with 41K+ assessment parcels on normalized SBL keys, built a scikit-learn regression pipeline, trained a Random Forest, and shipped interactive Folium risk and vacancy maps via GitHub Pages."
    },
    {
      match: /\b(northwind|snowflake|warehouse|power bi|etl|bi)\b/i,
      reply: "Northwind Data Warehouse is my end-to-end Snowflake project — dimensional modeling (STG to DW), SQL ETL pipelines, and Power BI dashboards for revenue, delivery, and inventory KPIs. It's coursework but the architecture choices are real."
    },
    {
      match: /\b(healthcare|research|syracuse.*ai|best project|medical image)\b/i,
      reply: "I'm an AI Researcher at Syracuse's Healthcare AI lab since Jan 2025. I develop CNN-based deep learning models for medical image classification using transfer learning, with reproducible training pipelines and A/B-style model comparisons. One of our projects was awarded Best Project — Fall 2025."
    },
    {
      match: /\b(skill|stack|tech|language|tools)\b/i,
      reply: "My core stack: Python, SQL, R for code. PyTorch, scikit-learn, XGBoost, OpenCV, Hugging Face Transformers for ML/DL. AWS (S3, EC2), Snowflake, PostgreSQL, ChromaDB for infra and data. Streamlit, Power BI, Tableau, Folium for surfaces. And LLMs, RAG, and multi-agent systems for the generative work."
    },
    {
      match: /\b(education|degree|syracuse|nmims|university|study)\b/i,
      reply: "I'm doing my M.S. in Applied Data Science at Syracuse University (2024-2026). Before that I did my B.Tech in Computer Science at NMIMS in India (2020-2024). At Syracuse my coursework covers applied ML, NLP, deep learning, business analytics, advanced databases, and human-centered AI."
    },
    {
      match: /\b(hire|hiring|job|opportunity|opportunities|role|opt|sponsor|available)\b/i,
      reply: "Yes — I'm actively looking for full-time Data Scientist, ML Engineer, or Data Analyst roles starting May 2026 after I graduate. OPT-sponsored. Best way to reach me is asharm78@syr.edu or via LinkedIn."
    },
    {
      match: /\b(contact|reach|email|linkedin|phone|message)\b/i,
      reply: "Hit me on email: asharm78@syr.edu. LinkedIn: linkedin.com/in/avi-sharma16. GitHub: github.com/Avish16. Phone: 315-418-3188. The Signal page has all of these as direct links."
    },
    {
      match: /\b(resume|cv)\b/i,
      reply: "My resume is on the Signal page — there's a download card right at the top. It's also linked from the Operator Profile section on the home page."
    },
    {
      match: /\b(location|where|live|syracuse|based)\b/i,
      reply: "I'm based in Syracuse, NY. Open to relocating for the right role."
    },
    {
      match: /\b(github|repo|code|repository)\b/i,
      reply: "github.com/Avish16 — pinned repos: Bitcoin-FlashCrash-Prediction, DataThon26, Deep_Learning-Drowsiness_Detection, mediexplain, and Northwind."
    },
    {
      match: /\b(hi|hello|hey|sup|yo)\b/i,
      reply: "Hey! Ask me anything about my work — projects, experience, skills, or how to get in touch. Try one of the chips below or just type."
    },
    {
      match: /\b(thanks|thank you|cool|nice|awesome|great)\b/i,
      reply: "Anytime. If you want to dig deeper, the Archive page has full project deep-dives. Or send a signal — I'm always up for a conversation."
    }
  ];

  const FALLBACK = "Good question — I don't have a canned answer for that one. For the full picture, the Archive has every project broken down in detail, or you can email me at asharm78@syr.edu and I'll get back to you. The chatbot here is still pretty basic; the real one with full conversation is coming soon.";

  // ----- 2. THE INITIAL CHIPS shown on first open -----
  const INITIAL_CHIPS = [
    "Who are you?",
    "Tell me about MediExplain",
    "What's the Bitcoin project?",
    "Are you hiring?"
  ];

  const OPENER = "Hey, I'm Avi. Ask me about my work, projects, or anything else.";

  // ----- 3. BUILD THE WIDGET HTML and inject it -----
  const widget = document.createElement('div');
  widget.innerHTML = `
    <button class="cbot-launcher" id="cbotLauncher" aria-label="Open chat">
      <span class="cbot-launcher__tip">Ask me anything</span>
      <svg class="cbot-launcher__icon cbot-launcher__icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg class="cbot-launcher__icon cbot-launcher__icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <aside class="cbot-panel" id="cbotPanel" aria-label="Chat with Avi" aria-hidden="true">
      <header class="cbot-header">
        <div class="cbot-header__avatar">A</div>
        <div class="cbot-header__info">
          <p class="cbot-header__name">Avi Sharma</p>
          <div class="cbot-header__status" id="cbotStatus">
            <span class="cbot-header__status-dot"></span>
            <span id="cbotStatusText">Online</span>
          </div>
        </div>
        <button class="cbot-header__close" id="cbotClose" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </header>

      <div class="cbot-thread" id="cbotThread"></div>

      <div class="cbot-chips" id="cbotChips"></div>

      <form class="cbot-input" id="cbotForm">
        <input class="cbot-input__field" id="cbotInput" type="text"
               placeholder="Ask me anything…" autocomplete="off" />
        <button class="cbot-input__send" id="cbotSend" type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>

      <div class="cbot-foot">A.S<span class="cbot-foot__dot">/</span>26 · ASSISTANT</div>
    </aside>
  `;
  document.body.appendChild(widget);

  // ----- 4. WIRE UP ELEMENTS -----
  const launcher = document.getElementById('cbotLauncher');
  const panel = document.getElementById('cbotPanel');
  const closeBtn = document.getElementById('cbotClose');
  const thread = document.getElementById('cbotThread');
  const chipsBox = document.getElementById('cbotChips');
  const form = document.getElementById('cbotForm');
  const input = document.getElementById('cbotInput');
  const statusEl = document.getElementById('cbotStatus');
  const statusText = document.getElementById('cbotStatusText');

  let hasOpened = false;

  // ----- 5. MESSAGE RENDERING -----
  const addMsg = (text, who = 'bot') => {
    const div = document.createElement('div');
    div.className = `cbot-msg cbot-msg--${who}`;
    div.textContent = text;
    thread.appendChild(div);
    thread.scrollTop = thread.scrollHeight;
    return div;
  };

  const addThinking = () => {
    const div = document.createElement('div');
    div.className = 'cbot-msg cbot-msg--bot cbot-msg--thinking';
    div.innerHTML = '<span></span><span></span><span></span>';
    thread.appendChild(div);
    thread.scrollTop = thread.scrollHeight;
    statusEl.classList.add('is-thinking');
    statusText.textContent = 'Thinking…';
    return div;
  };

  const clearThinking = (node) => {
    if (node && node.parentNode) node.parentNode.removeChild(node);
    statusEl.classList.remove('is-thinking');
    statusText.textContent = 'Online';
  };

  // ----- 6. RENDER CHIPS -----
  const renderChips = (chips) => {
    chipsBox.innerHTML = '';
    chips.forEach((text) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cbot-chip';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        chipsBox.innerHTML = ''; // chips disappear after first use
        sendMessage(text);
      });
      chipsBox.appendChild(btn);
    });
  };

  // ----- 7. CONVERSATION HISTORY (sent to API for context) -----
  const history = [];

  // ----- 8. GET REPLY FROM CLAUDE API (/api/chat serverless fn) -----
  // Falls back to the local KB if the API is unreachable (e.g. opened
  // as a local file instead of running on Vercel).
  const localReply = (userText) => {
    for (const entry of KB) {
      if (entry.match.test(userText)) return entry.reply;
    }
    return FALLBACK;
  };

  const getReply = async (userText) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return data.reply || localReply(userText);
      }
      const data = await res.json();
      return data.reply || localReply(userText);
    } catch (err) {
      // Network error / opened as local file — gracefully use local KB
      console.warn('Chat API unreachable, using local fallback:', err);
      return localReply(userText);
    }
  };

  // ----- 9. SEND MESSAGE FLOW -----
  const sendMessage = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    addMsg(trimmed, 'user');
    history.push({ role: 'user', content: trimmed });
    input.value = '';

    const thinker = addThinking();
    const reply = await getReply(trimmed);
    clearThinking(thinker);
    addMsg(reply, 'bot');
    history.push({ role: 'assistant', content: reply });
    // Keep history bounded
    if (history.length > 16) history.splice(0, history.length - 16);
  };

  // ----- 10. EVENT BINDINGS -----
  const openPanel = () => {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-label', 'Close chat');

    if (!hasOpened) {
      hasOpened = true;
      // First open — add opener and chips
      setTimeout(() => {
        addMsg(OPENER, 'bot');
        renderChips(INITIAL_CHIPS);
      }, 200);
    }
    setTimeout(() => input.focus(), 350);
  };

  const closePanel = () => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.classList.remove('is-open');
    launcher.setAttribute('aria-label', 'Open chat');
    // Remember the visitor dismissed it — don't auto-open again this visit
    try { sessionStorage.setItem('cbotDismissed', '1'); } catch (e) {}
  };

  launcher.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener('click', closePanel);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  // Esc closes the panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  // ----- 11. AUTO-OPEN ON FIRST VISIT -----
  // Opens the chat ~3.5s after load so it doesn't clash with the hero
  // animation. Only fires once per browser session — if the visitor
  // closes it, it stays closed across all pages until they leave the site.
  let dismissed = false;
  try { dismissed = sessionStorage.getItem('cbotDismissed') === '1'; } catch (e) {}

  if (!dismissed) {
    setTimeout(() => {
      // Don't pop if they already opened it manually in the meantime
      if (!panel.classList.contains('is-open')) openPanel();
    }, 3500);
  }

})();
