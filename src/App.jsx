import { useState, useRef, useEffect } from 'react';
import bgLanding from './fondo-landing.jpg';
import { buildSystemPrompt } from './systemPrompt.js';
import { HotelCards, DestinationCards, RoomCards } from './components/Cards.jsx';
import { FlightCards, PackageCards, ExtraCards, Comparator } from './components/FlightExtras.jsx';
import { CalendarWidget, BookingSummary } from './components/Widgets.jsx';

const LOGO_SVG = `<svg width="180" height="30" viewBox="0 0 300 50" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M27.53 24.32c0 .14-.11.25-.25.25h-6.94l-.57.44s-.09-.01-.07-.06l.4-1.07V18.23h-1.81v13.98h1.81v-6.48c0-.14.11-.25.25-.25h6.94c.14 0 .25.11.25.25v6.48h1.81V18.23H27.53v6.09Z" fill="#f0ebe3"/><path d="M37.71 32.2h8.71v-.85h-6.65c-.14 0-.25-.11-.25-.25v-5.41c0-.14.11-.25.25-.25h5.79v-.85h-5.67l-.54.41s-.09-.01-.07-.06l.26-.68v-4.93c0-.14.11-.25.25-.25h6.65v-.85H37.71V32.2ZM65.93 18.23h-3.91V32.2h1.81v-6.17h2.1c3.01 0 5.85-.95 5.85-3.91 0-2.96-2.84-3.91-5.85-3.91Zm-.12 7.01h-1.62l-.51.39s-.09-.01-.07-.06l.23-.61v-5.58c0-.14.11-.25.25-.25h1.73c2.43 0 3.94.78 3.94 3.11 0 2.33-1.51 3.1-3.95 3.1ZM96.15 31.69s-.09-.01-.07-.06l.28-.74V18.23h-1.81V32.2h8.7v-.85h-6.65l-.45.34ZM132.17 31.76c-2.65 0-5.32-1.88-5.32-6.53 0-4.65 2.67-6.53 5.32-6.53 1.88 0 3.97.39 5.09 3.3h.17v-2.63c-1.11-.83-3.12-1.37-5.26-1.37-4.03 0-7.35 2.81-7.35 7.23 0 4.42 3.32 7.23 7.35 7.23 1.9 0 3.8-.39 5.32-1.38v-2.63h-.17c-1.11 2.91-3.24 3.31-5.15 3.31ZM175.38 31.76c-2.65 0-5.32-1.88-5.32-6.53 0-4.65 2.67-6.53 5.32-6.53 1.88 0 3.97.39 5.09 3.3h.17v-2.63c-1.11-.83-3.12-1.37-5.26-1.37-4.03 0-7.35 2.81-7.35 7.23 0 4.42 3.32 7.23 7.35 7.23 1.9 0 3.8-.39 5.32-1.38v-2.63h-.17c-1.11 2.91-3.24 3.31-5.15 3.31ZM194.35 18c-4.03 0-7.43 2.81-7.43 7.23 0 4.42 3.4 7.23 7.43 7.23s7.43-2.81 7.43-7.23C201.78 20.81 198.37 18 194.35 18Zm0 13.76c-2.65 0-5.39-1.88-5.39-6.53 0-4.65 2.74-6.53 5.39-6.53s5.39 1.88 5.39 6.53c0 4.65-2.74 6.53-5.39 6.53ZM219.93 18.23l-4.1 11.86-4.36-11.86h-2.18l-.59 13.98h.94l.49-11.2c.01-.27.38-.33.49-.08l4.2 11.28h1.18l3.86-11.16c.09-.26.47-.21.48.07l.44 11.1h1.85l-.59-13.98h-2.1ZM273.46 28.45c0 .24-.3.35-.44.16l-7.49-10.38h-2.11V32.2h.95V20.42c0-.24.3-.34.44-.15l8.62 11.96h.98V18.23h-.96v10.22ZM287.58 25c-.09.16-.32.16-.42 0l-4.06-6.77h-1.97l4.81 7.99v5.98h1.81v-5.97l4.86-7.99h-.99l-4.04 6.76Z" fill="#f0ebe3"/><path d="M80.95 18.23 75.57 32.2h.94l1.8-4.66c.04-.09.13-.15.24-.15h5.25c.1 0 .19.06.23.15l1.78 4.66h1.9L81.32 18.23h-1.37Zm2.79 8.86-.92-.7a1.2 1.2 0 0 0-.73-.24h-3.02c-.18 0-.3-.18-.23-.35l1.97-5.08c.08-.22.37-.22.45 0l2.41 6.27c.02.05-.03.09-.06.07l-.02-.01-.85.04ZM113.11 18.23l-5.39 13.98h.94l1.8-4.66c.04-.09.13-.15.24-.15h5.25c.1 0 .19.06.23.15l1.78 4.66h1.9l-5.39-13.98h-1.36Zm2.78 8.86-.92-.7a1.2 1.2 0 0 0-.73-.24h-3.02c-.18 0-.3-.18-.23-.35l1.97-5.08c.08-.22.37-.22.45 0l2.41 6.27c.02.05-.03.09-.06.07l-.02-.01-.85.04ZM249.83 18.23l-5.39 13.98h.94l1.8-4.66c.04-.09.13-.15.24-.15h5.25c.1 0 .19.06.23.15l1.78 4.66h1.9l-5.39-13.98h-1.36Zm2.78 8.86-.92-.7a1.2 1.2 0 0 0-.73-.24h-3.02c-.18 0-.3-.18-.23-.35l1.97-5.08c.08-.22.37-.22.45 0l2.41 6.27c.02.05-.03.09-.06.07l-.02-.01-.85.04ZM297.71 18.24c-1.26 0-2.29 1.05-2.29 2.34 0 1.28 1.03 2.33 2.29 2.33S300 21.86 300 20.58c0-1.29-1.03-2.34-2.29-2.34Zm0 4.34a2 2 0 0 1-1.98-2.03 2 2 0 0 1 1.98-2.02 2 2 0 0 1 1.98 2.02 2 2 0 0 1-1.98 2.03Z" fill="#f0ebe3"/><path d="M298.13 20.59c.17-.03.29-.09.38-.2.09-.11.14-.25.14-.42 0-.13-.03-.24-.08-.32a.6.6 0 0 0-.2-.18 1.1 1.1 0 0 0-.29-.1 2.2 2.2 0 0 0-.33-.03h-.8v2.38h.33v-1.05h.4l.56 1.05h.4l-.64-1.09.13-.04Zm-.41-.24h-.39v-.78h.42c.06 0 .12 0 .17.01.06 0 .11.03.16.05.05.03.09.07.12.13.03.06.05.12.05.2 0 .09-.02.16-.05.22-.03.06-.07.1-.15.13-.05.03-.11.04-.17.04h-.16Z" fill="#f0ebe3"/><path d="M144.9 32.2h8.71v-.85h-6.65c-.14 0-.25-.11-.25-.25v-5.41c0-.14.11-.25.25-.25h5.79v-.85h-5.67l-.54.41s-.09-.01-.07-.06l.26-.68v-4.93c0-.14.11-.25.25-.25h6.65v-.85H144.9V32.2ZM234.8 18.23h-3.91V32.2h1.81v-6.17h2.1c3.01 0 5.85-.95 5.85-3.91 0-2.96-2.84-3.91-5.85-3.91Zm-.12 7.01h-1.62l-.51.39s-.09-.01-.07-.06l.23-.61v-5.58c0-.14.11-.25.25-.25h1.73c2.43 0 3.94.78 3.94 3.11 0 2.33-1.51 3.1-3.95 3.1ZM0 18.23v.85h4.88V32.2h1.81V19.56l-.35-.47-.11-.15s.01-.09.05-.08l.57.22h4.72v-.85H0Z" fill="#f0ebe3"/></g><defs><clipPath id="a"><rect width="300" height="50" fill="white"/></clipPath></defs></svg>`;

// Dark (blue) version of logo for light backgrounds
const LOGO_SVG_DARK = LOGO_SVG.replace(/fill="#f0ebe3"/g, 'fill="#274c69"');

const SUGGESTIONS = [
  "Quiero una escapada romántica inolvidable",
  "Vacaciones en familia con aventura y playa",
  "Viaje a Cancún en todo incluido",
  "Experiencia gastronómica de lujo",
];

const BG_IMAGE = bgLanding;

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function CheckinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  );
}

function AISparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" fill="#274c69"/>
      <path d="M5 17L4 20l3-1-2-2Z" fill="#274c69"/>
      <path d="M19 17l1 3-3-1 2-2Z" fill="#274c69"/>
    </svg>
  );
}

const NAV_LINKS = ['Todo incluido', 'Restaurantes', 'Galería', 'Ofertas', 'Actividades', 'The Dreamery', 'Spa', 'Bodas'];

function renderComponent(component, onSelect) {
  if (!component || !component.id) return null;
  const { id, data } = component;
  switch (id) {
    case 'C-01': return <DestinationCards data={data} onSelect={onSelect} />;
    case 'C-02': return <HotelCards data={data} onSelect={onSelect} />;
    case 'C-03': return <RoomCards data={data} onSelect={onSelect} />;
    case 'C-04': return <Comparator data={data} onSelect={onSelect} />;
    case 'C-05': return <FlightCards data={data} onSelect={onSelect} />;
    case 'C-06': return <PackageCards data={data} onSelect={onSelect} />;
    case 'C-07': return <ExtraCards data={data} onSelect={onSelect} />;
    case 'C-08': return <CalendarWidget data={data} onSelect={onSelect} />;
    case 'C-10': return <BookingSummary data={data} onSelect={onSelect} />;
    default: return null;
  }
}

function parseResponse(raw) {
  if (!raw || !raw.trim()) {
    return { intent: '', response_type: 'text', text: '', component: { id: null, data: {} } };
  }
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.component) parsed.component = { id: null, data: {} };
    if (!parsed.component.data) parsed.component.data = {};
    return parsed;
  } catch {
    const textMatch = raw.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (textMatch) {
      const extractedText = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      const idMatch = raw.match(/"id"\s*:\s*"(C-\d+)"/);
      const componentId = idMatch ? idMatch[1] : null;
      let componentData = {};
      if (componentId) {
        try {
          const dataMatch = raw.match(/"data"\s*:\s*(\{[\s\S]*)/);
          if (dataMatch) {
            let dataStr = dataMatch[1];
            for (let i = 0; i < 10; i++) {
              try { componentData = JSON.parse(dataStr); break; } catch { dataStr += '}'; }
            }
          }
        } catch {}
      }
      return { intent: '', response_type: componentId ? 'text+component' : 'text', text: extractedText, component: { id: componentId, data: componentData } };
    }
    return { intent: '', response_type: 'text', text: raw, component: { id: null, data: {} } };
  }
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [uiMessages, setUiMessages] = useState([]);
  const apiHistoryRef = useRef([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [uiMessages, loading]);

  const callChain = useRef(Promise.resolve());

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');
    setUiMessages(prev => [...prev, { role: 'user', content: userText }]);
    callChain.current = callChain.current.then(() => doApiCall(userText));
  };

  const doApiCall = async (userText, fromComponent = false) => {
    const FALLBACK_PREFIX = 'Disculpa, no he procesado';
    // Skip fallback messages — injecting them as context gives the model useless noise
    const lastAssistant = [...apiHistoryRef.current].reverse().find(
      m => m.role === 'assistant' && !m.content.startsWith(FALLBACK_PREFIX)
    );

    apiHistoryRef.current = [...apiHistoryRef.current, { role: 'user', content: userText }];

    let contextNote = '';
    if (fromComponent) {
      contextNote = `\n\n⚠️ SELECCIÓN DE COMPONENTE: El usuario hizo clic en la UI y seleccionó "${userText}". Confirma la selección verbalmente y avanza al siguiente paso. El campo "text" NO puede estar vacío.`;
    } else if (lastAssistant) {
      contextNote = `\n\nCONTEXTO: El usuario responde "${userText}" directamente a tu última intervención: "${lastAssistant.content.slice(0, 300)}". Interpreta su respuesta en este contexto. El campo "text" NO puede estar vacío.`;
    }

    // Prefill: the last message is a partial assistant turn starting with '{'.
    // The model must complete the JSON object. The API returns only the
    // continuation, so we prepend '{' when parsing. Using just '{' (not '{"')
    // avoids a double-quote bug where the model re-emits the opening quote of
    // the first key, producing invalid JSON like {""intent":...}.
    const PREFILL = '{';
    const callApi = (extraNote) => fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: buildSystemPrompt() + contextNote + extraNote,
        messages: [...apiHistoryRef.current, { role: 'assistant', content: PREFILL }],
      }),
    });

    setLoading(true);
    try {
      let res = await callApi('');
      let data = await res.json();
      if (!res.ok) {
        console.error('API error:', res.status, data);
        throw new Error(data?.error?.message || `HTTP ${res.status}`);
      }
      const continuation = data.content?.[0]?.text || '';
      let rawText = continuation ? PREFILL + continuation : '';

      // Retry once if still empty (e.g. API returned empty body)
      if (!rawText || !parseResponse(rawText).text?.trim()) {
        console.warn('Empty/invalid response, retrying:', rawText.slice(0, 200));
        res = await callApi('\n\n🚨 RESPUESTA ANTERIOR VACÍA. El campo "text" es OBLIGATORIO. Responde con texto ahora.');
        data = await res.json();
        const retryContinuation = data.content?.[0]?.text || '';
        rawText = retryContinuation ? PREFILL + retryContinuation : '';
      }

      const parsed = parseResponse(rawText);

      if ((!parsed.text || !parsed.text.trim()) && !parsed.component?.id) {
        parsed.text = 'Disculpa, no he procesado bien tu respuesta. ¿Puedes repetírmelo con un poco más de detalle?';
      }

      // Store only readable text in history (not raw JSON) so future short
      // replies can be interpreted without wading through component data.
      const historyContent = parsed.text?.trim() || rawText;
      apiHistoryRef.current = [...apiHistoryRef.current, { role: 'assistant', content: historyContent }];

      setUiMessages(prev => [...prev, { role: 'assistant', parsed, raw: rawText }]);
    } catch (err) {
      console.error('doApiCall error:', err);
      setUiMessages(prev => [...prev, {
        role: 'assistant',
        parsed: { text: 'Ha ocurrido un error de conexión. Por favor, inténtalo de nuevo.', component: { id: null } },
        raw: '',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSuggestion = (s) => {
    if (!started) setStarted(true);
    sendMessage(s);
  };

  const handleComponentSelect = (text) => {
    setInput('');
    setUiMessages(prev => [...prev, { role: 'user', content: text }]);
    callChain.current = callChain.current.then(() => doApiCall(text, true));
  };

  // ─── LANDING PAGE ───────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Background image */}
        <img
          src={BG_IMAGE}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Gradient: dark at top for nav readability, fades out */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 100%)' }} />

        {/* ── Top navigation bar ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          borderBottom: '1px solid rgba(255,255,255,0.35)',
          padding: '10px 48px',
          zIndex: 10,
        }}>
          {/* Row 1: logo + utility links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div dangerouslySetInnerHTML={{ __html: LOGO_SVG }} style={{ height: 30, flexShrink: 0 }} />

            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <GlobeIcon />
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: 'white', whiteSpace: 'nowrap' }}>ES</span>
              </div>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <PhoneIcon />
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: 'white', whiteSpace: 'nowrap' }}>+52(998)193-0285</span>
              </div>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <BookingIcon />
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: 'white', whiteSpace: 'nowrap' }}>Mi reserva</span>
              </div>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <CheckinIcon />
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: 'white', whiteSpace: 'nowrap' }}>Digital Check-in</span>
              </div>
              <MenuIcon />
            </div>
          </div>

          {/* Row 2: navigation links */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto' }}>
            {NAV_LINKS.map(link => (
              <span key={link} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: 'white', whiteSpace: 'nowrap' }}>
                {link}
              </span>
            ))}
          </div>
        </div>

        {/* ── Center content ── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) translateY(-20px)',
          width: '100%', maxWidth: 900, padding: '0 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
          zIndex: 5,
        }}>
          {/* Headline */}
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(32px, 4.5vw, 64px)',
            fontWeight: 400,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            margin: 0,
          }}>
            Tu escapada perfecta<br />empieza aquí
          </h1>

          {/* Input area + chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>

            {/* Switch selector — static, Concierge selected */}
            <div style={{
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 400,
              padding: '2px',
              display: 'inline-flex',
              gap: 8,
              alignItems: 'center',
            }}>
              <div style={{ padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: '#274c69' }}>
                  Buscador tradicional
                </span>
              </div>
              <div style={{
                background: '#c3d8e9',
                padding: '4px 12px',
                borderRadius: 20,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}>
                <AISparkleIcon />
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: '#274c69' }}>
                  Concierge de reservas
                </span>
              </div>
            </div>

            {/* Chat input */}
            <div style={{
              background: 'white',
              border: '1px solid #274c69',
              borderRadius: 12,
              padding: 4,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              width: '100%',
              maxWidth: 800,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (() => { setStarted(true); sendMessage(input); })()}
                placeholder="Cuéntame qué tienes en mente..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 16, fontFamily: 'Montserrat, sans-serif', color: '#333',
                  paddingLeft: 20, paddingRight: 12, paddingTop: 12, paddingBottom: 12,
                  caretColor: '#274c69',
                }}
              />
              <button
                onClick={() => { setStarted(true); sendMessage(input); }}
                style={{
                  background: 'rgba(39,76,105,0.6)',
                  border: 'none', borderRadius: 8,
                  padding: '14px 24px',
                  color: 'white', fontSize: 16,
                  fontFamily: 'Montserrat, sans-serif',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#274c69'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(39,76,105,0.6)'; }}
              >
                Enviar
              </button>
            </div>

            {/* Suggestion chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 700 }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1px solid #274c69',
                    borderRadius: 20,
                    padding: '4px 16px',
                    color: '#274c69',
                    fontSize: 14,
                    fontFamily: 'Montserrat, sans-serif',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    lineHeight: '24px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(39,76,105,0.2); border-radius: 2px; }
        `}</style>
      </div>
    );
  }

  // ─── CHAT VIEW (light mode) ─────────────────────────────────────────────────
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f8fb' }}>

      {/* Header */}
      <div style={{
        height: 60, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #dce8f0',
        background: 'white',
      }}>
        <div dangerouslySetInnerHTML={{ __html: LOGO_SVG_DARK }} style={{ height: 24, transform: 'scale(0.8)', transformOrigin: 'left center' }} />
        <div style={{
          fontSize: 12, color: '#274c69',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          fontFamily: 'Montserrat, sans-serif', fontWeight: 500,
        }}>
          Concierge de reservas
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(39,76,105,0.15) transparent' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {uiMessages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <div style={{
                    maxWidth: '75%',
                    background: '#c3d8e9',
                    borderRadius: '14px 14px 2px 14px',
                    padding: '10px 16px',
                    fontSize: 14, color: '#1a3347',
                    lineHeight: 1.6,
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            const parsed = msg.parsed || {};
            return (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: parsed.component?.id ? 8 : 0 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: 'rgba(39,76,105,0.08)',
                    border: '1px solid rgba(39,76,105,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: '#274c69',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}>
                    TPC
                  </div>
                  {(parsed.text && parsed.text.trim()) ? (
                    <div style={{
                      flex: 1, fontSize: 14, color: '#334155',
                      lineHeight: 1.75,
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 400,
                    }}>
                      {parsed.text}
                    </div>
                  ) : null}
                </div>
                {parsed.component?.id && (
                  <div style={{ paddingLeft: 40 }}>
                    {renderComponent(parsed.component, handleComponentSelect)}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(39,76,105,0.08)',
                border: '1px solid rgba(39,76,105,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: '#274c69',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
              }}>
                TPC
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#274c69',
                    animation: 'pulse 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.5,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        flexShrink: 0, padding: '12px 16px',
        borderTop: '1px solid #dce8f0',
        background: 'white',
      }}>
        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'flex', gap: 8,
          background: 'white',
          borderRadius: 12,
          border: '1px solid #274c69',
          padding: '6px 6px 6px 16px',
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#1a3347', fontSize: 14,
              fontFamily: 'Montserrat, sans-serif',
              caretColor: '#274c69',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? '#274c69' : 'rgba(39,76,105,0.15)',
              border: 'none', borderRadius: 8,
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke={input.trim() && !loading ? 'white' : 'rgba(39,76,105,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(39,76,105,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}
