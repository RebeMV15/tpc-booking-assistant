import { useState, useEffect, useRef } from 'react';

const CARD_BG = 'white';
const CARD_BORDER = 'rgba(39,76,105,0.2)';
const CARD_BORDER_HOVER = 'rgba(39,76,105,0.55)';
const TEXT_PRIMARY = '#1a3347';
const TEXT_SECONDARY = '#4a6070';
const TEXT_MUTED = '#7a8fa0';
const BLUE = '#274c69';
const GREEN = '#3a9a6a';

const RESTAURANT_IMGS = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80',
];

const ACTIVITY_IMGS = [
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
  'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
  'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
];

const SPA_IMGS = [
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=600&q=80',
  'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&q=80',
];

function getImgsForExtra(extra, index) {
  const nombre = (extra.nombre || '').toLowerCase();
  const tipo = (extra.tipo || '').toLowerCase();
  if (tipo.includes('gastro') || tipo.includes('restaur') || nombre.includes('restaur') || nombre.includes('cena') || nombre.includes('dinner')) {
    const offset = (index * 3) % RESTAURANT_IMGS.length;
    return [RESTAURANT_IMGS[offset], RESTAURANT_IMGS[(offset+1)%RESTAURANT_IMGS.length], RESTAURANT_IMGS[(offset+2)%RESTAURANT_IMGS.length]];
  }
  if (tipo.includes('bienestar') || tipo.includes('spa') || nombre.includes('spa') || nombre.includes('masaje')) {
    return SPA_IMGS;
  }
  const offset = (index * 3) % ACTIVITY_IMGS.length;
  return [ACTIVITY_IMGS[offset], ACTIVITY_IMGS[(offset+1)%ACTIVITY_IMGS.length], ACTIVITY_IMGS[(offset+2)%ACTIVITY_IMGS.length]];
}

function Carousel({ images, startIndex = 0 }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % images.length);
    }, 3500 + startIndex * 400);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (i) => { setCurrent(i); startTimer(); };

  return (
    <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
      {images.map((src, i) => (
        <img key={i} src={src} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === current ? 1 : 0, transition: 'opacity 0.7s ease' }}
        />
      ))}
      <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`Imagen ${i+1}`}
            style={{ width: i === current ? 16 : 5, height: 5, borderRadius: 3, background: i === current ? '#fff' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }}
          />
        ))}
      </div>
    </div>
  );
}

export function FlightCards({ data, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '8px 0' }}>
      {data.vuelos.map((v, i) => (
        <div key={i}
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = CARD_BORDER_HOVER}
          onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
          onClick={() => onSelect(`Elijo el vuelo de ${v.origen} a ${v.destino} con ${v.aerolinea}, duración ${v.duracion}, precio desde $${v.precio_desde}`)}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>{v.origen}</span>
              <span style={{ color: BLUE, fontSize: 16 }}>→</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>{v.destino}</span>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>{v.aerolinea}</span>
              <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>{v.duracion}</span>
              <span style={{ fontSize: 12, color: v.escalas === 0 ? GREEN : TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>
                {v.escalas === 0 ? 'Directo' : `${v.escalas} escala${v.escalas > 1 ? 's' : ''} · ${v.escala_en}`}
              </span>
            </div>
            {v.nota && <div style={{ fontSize: 11, color: BLUE, marginTop: 4, fontFamily: 'Montserrat, sans-serif' }}>{v.nota}</div>}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>${v.precio_desde}</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>por persona</div>
            <button onClick={e => { e.stopPropagation(); onSelect(`Elijo el vuelo de ${v.origen} a ${v.destino} con ${v.aerolinea}, duración ${v.duracion}, precio desde $${v.precio_desde}`); }}
              style={{ marginTop: 6, fontSize: 12, background: 'transparent', border: `1px solid rgba(39,76,105,0.45)`, color: BLUE, borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.background = 'rgba(39,76,105,0.08)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}>
              Elegir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PackageCards({ data, onSelect }) {
  const PKG_IMGS = [
    ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'],
    ['https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=80','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80','https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80'],
    ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '8px 0' }}>
      {data.paquetes.map((p, i) => (
        <div key={i}
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = CARD_BORDER_HOVER}
          onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
          onClick={() => onSelect(`Elijo el paquete completo: hotel ${p.hotel_nombre} más vuelo desde ${p.vuelo_origen}, precio total $${p.precio_total}`)}>
          <Carousel images={PKG_IMGS[i % PKG_IMGS.length]} startIndex={i} />
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>{p.hotel_nombre}</div>
            <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>{p.fechas} · {p.habitacion}</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 2, fontFamily: 'Montserrat, sans-serif' }}>Vuelo desde</div>
              <div style={{ fontSize: 13, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>{p.vuelo_origen} · {p.vuelo_duracion}</div>
              <div style={{ fontSize: 12, color: p.vuelo_escalas === 0 ? GREEN : TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>{p.vuelo_escalas === 0 ? 'Directo' : `${p.vuelo_escalas} escala(s)`}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>Hotel ${p.precio_hotel} + Vuelo ${p.precio_vuelo}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>${p.precio_total} <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 400 }}>total</span></div>
              </div>
              <button onClick={e => { e.stopPropagation(); onSelect(`Elijo el paquete completo: hotel ${p.hotel_nombre} más vuelo desde ${p.vuelo_origen}, precio total $${p.precio_total}`); }}
                style={{ fontSize: 12, background: 'transparent', border: `1px solid rgba(39,76,105,0.45)`, color: BLUE, borderRadius: 4, padding: '8px 16px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.background = 'rgba(39,76,105,0.08)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Seleccionar paquete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExtraCards({ data, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '8px 0' }}>
      {data.extras.map((extra, i) => {
        const images = getImgsForExtra(extra, i);
        const isRestaurant = (extra.tipo || '').toLowerCase().includes('restaur') || (extra.nombre || '').toLowerCase().includes('restaur') || (extra.nombre || '').toLowerCase().includes('cena');
        return (
          <div key={i}
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CARD_BORDER_HOVER; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Carousel images={images} startIndex={i} />
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 2 }}>{extra.nombre}</div>
              {extra.hotel && (
                <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 3, fontFamily: 'Montserrat, sans-serif' }}>{extra.hotel}</div>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                {extra.tipo && <span style={{ fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>{extra.tipo_cocina || extra.tipo}</span>}
                {extra.horario && <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>{extra.horario}</span>}
                {extra.dress_code && <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>{extra.dress_code}</span>}
              </div>
              <div style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5, marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>{extra.descripcion}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {extra.sin_cargo
                    ? <span style={{ fontSize: 12, color: GREEN, fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>Sin cargo</span>
                    : extra.precio ? <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>${extra.precio}</span> : null
                  }
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => onSelect(isRestaurant
                    ? `Quiero prerreservar en ${extra.nombre}${extra.hotel ? ' del ' + extra.hotel : ''}`
                    : `Sí, añade ${extra.nombre} a mi reserva`)}
                    style={{ fontSize: 12, background: 'rgba(39,76,105,0.07)', border: `1px solid rgba(39,76,105,0.45)`, color: BLUE, borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                    {isRestaurant ? 'Prerreservar' : 'Añadir'}
                  </button>
                  <button onClick={() => onSelect(`No, gracias`)}
                    style={{ fontSize: 12, background: 'transparent', border: `1px solid rgba(39,76,105,0.2)`, color: TEXT_SECONDARY, borderRadius: 4, padding: '6px 10px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Comparator({ data, onSelect }) {
  const entities = data.entidades || [];
  if (!entities.length) return null;
  const criterios = entities[0]?.criterios ? Object.keys(entities[0].criterios) : [];

  return (
    <div style={{ margin: '8px 0', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px 14px', textAlign: 'left', color: BLUE, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid rgba(39,76,105,0.15)`, fontFamily: 'Montserrat, sans-serif' }}>
              {data.tipo}
            </th>
            {entities.map((e, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: 'center', color: TEXT_PRIMARY, fontWeight: 600, borderBottom: `1px solid rgba(39,76,105,0.15)`, fontFamily: 'Montserrat, sans-serif', fontSize: 13 }}>
                {e.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criterios.map((crit, ci) => (
            <tr key={ci} style={{ background: ci % 2 === 0 ? 'rgba(39,76,105,0.03)' : 'transparent' }}>
              <td style={{ padding: '9px 14px', color: TEXT_MUTED, fontWeight: 500, fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}>{crit}</td>
              {entities.map((e, ei) => (
                <td key={ei} style={{ padding: '9px 14px', textAlign: 'center', color: TEXT_SECONDARY, fontFamily: 'Montserrat, sans-serif' }}>{e.criterios[crit] ?? '—'}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td style={{ padding: '10px 14px' }}></td>
            {entities.map((e, i) => (
              <td key={i} style={{ padding: '10px 14px', textAlign: 'center' }}>
                <button onClick={() => onSelect(`Elijo ${e.nombre} de las opciones comparadas`)}
                  style={{ fontSize: 12, background: 'transparent', border: `1px solid rgba(39,76,105,0.45)`, color: BLUE, borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                  onMouseEnter={ev => ev.target.style.background = 'rgba(39,76,105,0.08)'}
                  onMouseLeave={ev => ev.target.style.background = 'transparent'}>
                  Elegir
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
