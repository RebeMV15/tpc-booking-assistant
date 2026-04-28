import { useState } from 'react';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS = ['L','M','X','J','V','S','D'];

const BLUE = '#274c69';
const TEXT_PRIMARY = '#1a3347';
const TEXT_SECONDARY = '#4a6070';
const TEXT_MUTED = '#7a8fa0';
const GREEN = '#3a9a6a';

export function CalendarWidget({ data, onSelect }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [selecting, setSelecting] = useState('in');

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const fmt = (d) => d ? `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}` : null;

  const isPast = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  };

  const handleDay = (day) => {
    if (isPast(day)) return;
    const date = new Date(viewYear, viewMonth, day);
    if (selecting === 'in') {
      setCheckIn(date);
      setCheckOut(null);
      setSelecting('out');
    } else {
      if (checkIn && date <= checkIn) {
        setCheckIn(date);
        setCheckOut(null);
        return;
      }
      setCheckOut(date);
      setSelecting('in');
      const nights = Math.round((date - checkIn) / 86400000);
      onSelect(`Fechas confirmadas: entrada ${fmt(checkIn)}, salida ${fmt(date)} (${nights} noche${nights !== 1 ? 's' : ''})`);
    }
  };

  const isIn = (day) => checkIn && checkIn.getFullYear() === viewYear && checkIn.getMonth() === viewMonth && checkIn.getDate() === day;
  const isOut = (day) => checkOut && checkOut.getFullYear() === viewYear && checkOut.getMonth() === viewMonth && checkOut.getDate() === day;
  const isRange = (day) => {
    if (!checkIn || !checkOut) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d > checkIn && d < checkOut;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div style={{ background: 'white', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 10, padding: 16, margin: '8px 0', maxWidth: 320, boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={prevMonth}
          style={{ background: 'none', border: 'none', color: BLUE, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '4px 10px' }}>‹</button>
        <span style={{ fontSize: 14, color: TEXT_PRIMARY, fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth}
          style={{ background: 'none', border: 'none', color: BLUE, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '4px 10px' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, color: TEXT_MUTED, padding: '2px 0', fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {Array(offset).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          const in_ = isIn(day);
          const out_ = isOut(day);
          const range = isRange(day);
          return (
            <button key={day}
              onClick={() => handleDay(day)}
              style={{
                padding: '7px 2px', fontSize: 13, border: 'none',
                borderRadius: in_ || out_ ? 6 : 4,
                background: in_ || out_ ? BLUE : range ? 'rgba(39,76,105,0.12)' : 'transparent',
                color: in_ || out_ ? 'white' : past ? '#c5d2db' : TEXT_PRIMARY,
                cursor: past ? 'default' : 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: in_ || out_ ? 600 : 400,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: TEXT_SECONDARY, paddingTop: 8, borderTop: '1px solid rgba(39,76,105,0.12)', fontFamily: 'Montserrat, sans-serif' }}>
        {!checkIn && 'Selecciona fecha de entrada'}
        {checkIn && !checkOut && <><span style={{ color: BLUE, fontWeight: 600 }}>Entrada: {fmt(checkIn)}</span> — selecciona salida</>}
        {checkIn && checkOut && <span style={{ color: BLUE, fontWeight: 600 }}>{fmt(checkIn)} → {fmt(checkOut)}</span>}
      </div>
    </div>
  );
}

export function ClimateWidget({ data }) {
  const [activeMonth, setActiveMonth] = useState(null);
  const dest = data.destinos[0];
  if (!dest) return null;
  const meses = dest.meses;
  const monthKeys = Object.keys(meses);
  const maxTemp = Math.max(...monthKeys.map(m => meses[m].max));

  const rainColor = { baja: '#3a9a6a', media: '#c4a84a', alta: '#c07050' };

  return (
    <div style={{ background: 'white', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 10, padding: 16, margin: '8px 0', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}>
      {data.destinos.map((d, di) => (
        <div key={di} style={{ marginBottom: di < data.destinos.length - 1 ? 16 : 0 }}>
          <div style={{ fontSize: 12, color: BLUE, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{d.nombre}</div>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 60 }}>
            {Object.keys(d.meses).map((mes, i) => {
              const m = d.meses[mes];
              const h = ((m.max) / maxTemp) * 50;
              return (
                <div key={mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                  onClick={() => setActiveMonth(activeMonth === mes ? null : mes)}>
                  <div style={{ width: '100%', background: activeMonth === mes ? BLUE : 'rgba(39,76,105,0.2)', borderRadius: 2, height: h, transition: 'background 0.2s' }} />
                  <div style={{ fontSize: 8, color: TEXT_MUTED, textTransform: 'capitalize', fontFamily: 'Montserrat, sans-serif' }}>{mes.slice(0,1).toUpperCase()}</div>
                </div>
              );
            })}
          </div>
          {activeMonth && d.meses[activeMonth] && (
            <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(39,76,105,0.05)', borderRadius: 6, fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}>
              <span style={{ color: TEXT_PRIMARY, textTransform: 'capitalize' }}>{activeMonth}: </span>
              <span style={{ color: BLUE, fontWeight: 600 }}>{d.meses[activeMonth].max}° máx </span>
              <span style={{ color: TEXT_MUTED }}>{d.meses[activeMonth].min}° mín · </span>
              <span style={{ color: rainColor[d.meses[activeMonth].lluvia] || '#7a8fa0' }}>lluvia {d.meses[activeMonth].lluvia}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function BookingSummary({ data, onSelect }) {
  const [comments, setComments] = useState('');
  const [shared, setShared] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const nights = data.hotel?.noches || 0;

  return (
    <div style={{ background: 'white', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 12, overflow: 'hidden', margin: '8px 0', boxShadow: '0 1px 6px rgba(39,76,105,0.08)' }}>
      <img
        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
        alt=""
        style={{ width: '100%', height: 160, objectFit: 'cover' }}
      />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>{data.hotel?.nombre}</div>
        <div style={{ fontSize: 12, color: BLUE, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{data.hotel?.destino}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            ['Entrada', data.hotel?.fecha_entrada],
            ['Salida', data.hotel?.fecha_salida],
            ['Habitación', data.hotel?.habitacion],
            ['Noches', nights],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(39,76,105,0.04)', borderRadius: 6, padding: '8px 10px', border: '1px solid rgba(39,76,105,0.1)' }}>
              <div style={{ fontSize: 10, color: TEXT_MUTED, marginBottom: 2, fontFamily: 'Montserrat, sans-serif' }}>{label}</div>
              <div style={{ fontSize: 13, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>

        {data.vuelo && (
          <div style={{ background: 'rgba(39,76,105,0.04)', borderRadius: 6, padding: '10px 12px', marginBottom: 14, border: '1px solid rgba(39,76,105,0.1)' }}>
            <div style={{ fontSize: 10, color: BLUE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>Vuelo</div>
            <div style={{ fontSize: 12, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>{data.vuelo.origen} → {data.vuelo.destino}</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>{data.vuelo.aerolinea} · {data.vuelo.escalas === 0 ? 'Directo' : `${data.vuelo.escalas} escala(s)`}</div>
          </div>
        )}

        {data.extras?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: BLUE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>Extras</div>
            {data.extras.map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 3, fontFamily: 'Montserrat, sans-serif' }}>
                {e.nombre} {e.sin_cargo ? <span style={{ color: GREEN }}>· sin cargo</span> : e.precio ? `· $${e.precio}` : ''}
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid rgba(39,76,105,0.12)', paddingTop: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>Hotel ({nights} noches)</div>
            <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>${data.hotel?.precio_hotel_total}</div>
          </div>
          {data.vuelo && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>Vuelo</div>
              <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>${data.vuelo.precio_total}</div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>${data.precio_total}</div>
          </div>
        </div>

        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder="Comentarios personalizados (opcional)"
          style={{
            width: '100%', background: 'rgba(39,76,105,0.03)', border: '1px solid rgba(39,76,105,0.15)',
            borderRadius: 6, padding: '10px 12px', color: TEXT_PRIMARY, fontSize: 12, resize: 'vertical',
            minHeight: 60, fontFamily: 'Montserrat, sans-serif', marginBottom: 14, outline: 'none',
          }}
        />

        <button
          onClick={() => onSelect('Proceder al pago')}
          style={{
            width: '100%', padding: '13px', background: BLUE, border: 'none',
            borderRadius: 6, color: 'white', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10,
            letterSpacing: '0.04em', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = '#1a3347'}
          onMouseLeave={e => e.target.style.background = BLUE}
        >
          Proceder al pago
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 6, color: TEXT_MUTED, fontSize: 11, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
            title="Requiere inicio de sesión"
          >
            Guardar plan
          </button>
          <button
            onClick={() => setShowEmail(v => !v)}
            style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 6, color: TEXT_MUTED, fontSize: 11, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
          >
            Compartir
          </button>
          <button
            style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 6, color: TEXT_MUTED, fontSize: 11, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
          >
            Descargar PDF
          </button>
        </div>

        {showEmail && (
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={{ flex: 1, background: 'rgba(39,76,105,0.03)', border: '1px solid rgba(39,76,105,0.2)', borderRadius: 6, padding: '8px 10px', color: TEXT_PRIMARY, fontSize: 12, fontFamily: 'Montserrat, sans-serif', outline: 'none' }}
            />
            <button
              onClick={() => { setShared(true); setShowEmail(false); }}
              style={{ padding: '8px 14px', background: 'rgba(39,76,105,0.08)', border: '1px solid rgba(39,76,105,0.35)', borderRadius: 6, color: BLUE, fontSize: 11, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
            >
              Enviar
            </button>
          </div>
        )}
        {shared && <div style={{ marginTop: 6, fontSize: 11, color: GREEN, fontFamily: 'Montserrat, sans-serif' }}>Enlace enviado correctamente.</div>}
      </div>
    </div>
  );
}
