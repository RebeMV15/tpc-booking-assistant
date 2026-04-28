import { useState, useEffect, useRef } from 'react';

const IMAGE_POOL = {
  familia: [
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    'https://images.unsplash.com/photo-1540541834702-3ab9a9e24d49?w=600&q=80',
    'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=600&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  ],
  pareja: [
    'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  ],
  gastronomia: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80',
  ],
  aventura: [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=600&q=80',
  ],
  relax: [
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=600&q=80',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&q=80',
  ],
  golf: [
    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80',
    'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?w=600&q=80',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80',
    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  ],
};

const ROOM_IMAGES = [
  [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  ],
  [
    'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=600&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  ],
  [
    'https://images.unsplash.com/photo-1540541834702-3ab9a9e24d49?w=600&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
  ],
];

function getPoolKey(imageContext) {
  const ctx = (imageContext || '').toLowerCase();
  if (ctx.includes('famil') || ctx.includes('nino') || ctx.includes('child')) return 'familia';
  if (ctx.includes('romantic') || ctx.includes('pareja') || ctx.includes('romantico')) return 'pareja';
  if (ctx.includes('gastro') || ctx.includes('restaur') || ctx.includes('food')) return 'gastronomia';
  if (ctx.includes('aventur') || ctx.includes('buceo') || ctx.includes('adventure')) return 'aventura';
  if (ctx.includes('spa') || ctx.includes('relax') || ctx.includes('bienestar')) return 'relax';
  if (ctx.includes('golf')) return 'golf';
  return 'default';
}

function getImagesForCard(imageContext, cardIndex) {
  const key = getPoolKey(imageContext);
  const pool = IMAGE_POOL[key];
  const offset = (cardIndex * 2) % pool.length;
  return [
    pool[offset % pool.length],
    pool[(offset + 1) % pool.length],
    pool[(offset + 2) % pool.length],
  ];
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

  const go = (i) => {
    setCurrent(i);
    startTimer();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
      {images.map((src, i) => (
        <img key={i} src={src} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === current ? 1 : 0, transition: 'opacity 0.7s ease' }}
        />
      ))}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`Imagen ${i + 1}`}
            style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? '#fff' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }}
          />
        ))}
      </div>
    </div>
  );
}

const CARD_BG = 'white';
const CARD_BORDER = 'rgba(39,76,105,0.2)';
const CARD_BORDER_HOVER = 'rgba(39,76,105,0.55)';
const TEXT_PRIMARY = '#1a3347';
const TEXT_SECONDARY = '#4a6070';
const TEXT_MUTED = '#7a8fa0';
const BLUE = '#274c69';
const GREEN = '#3a9a6a';
const BTN_STYLE = {
  fontSize: 12, background: 'transparent',
  border: '1px solid rgba(39,76,105,0.45)',
  color: '#274c69', borderRadius: 4, padding: '6px 14px', cursor: 'pointer',
  fontFamily: 'Montserrat, sans-serif', transition: 'background 0.2s', fontWeight: 500,
};

export function HotelCards({ data, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '8px 0' }}>
      {data.hoteles.map((hotel, idx) => {
        const images = getImagesForCard(hotel.imagen_context, idx);
        return (
          <div key={hotel.id || idx}
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CARD_BORDER_HOVER; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
            onClick={() => onSelect(`Selecciono el hotel ${hotel.nombre} en ${hotel.destino || ''}`)}
          >
            <Carousel images={images} startIndex={idx} />
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 3 }}>{hotel.nombre}</div>
              <div style={{ fontSize: 11, color: BLUE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{hotel.destino}</div>
              <div style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5, marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>{hotel.descripcion?.slice(0, 90)}...</div>
              {hotel.atributos_clave && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {hotel.atributos_clave.slice(0, 3).map((a, i) => (
                    <span key={i} style={{ fontSize: 11, background: 'rgba(39,76,105,0.07)', color: BLUE, borderRadius: 3, padding: '2px 8px', border: '1px solid rgba(39,76,105,0.2)', fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>{a}</span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>desde </span>
                  <span style={{ fontSize: 17, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>${hotel.precio_desde}</span>
                  <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>/noche</span>
                </div>
                <button onClick={e => { e.stopPropagation(); onSelect(`Selecciono el hotel ${hotel.nombre} en ${hotel.destino || ''}`); }} style={BTN_STYLE}
                  onMouseEnter={e => e.target.style.background = 'rgba(39,76,105,0.08)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DestinationCards({ data, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '8px 0' }}>
      {data.destinos.map((destino, idx) => {
        const images = getImagesForCard(destino.imagen_context, idx);
        return (
          <div key={destino.id || idx}
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CARD_BORDER_HOVER; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
            onClick={() => onSelect(`Quiero explorar opciones en ${destino.nombre}, ${destino.pais}`)}
          >
            <Carousel images={images} startIndex={idx} />
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 2 }}>{destino.nombre}</div>
              <div style={{ fontSize: 11, color: BLUE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{destino.pais}</div>
              <div style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5, marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>{destino.descripcion?.slice(0, 80)}...</div>
              {destino.etiquetas && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {destino.etiquetas.slice(0, 3).map((e, i) => (
                    <span key={i} style={{ fontSize: 11, background: 'rgba(39,76,105,0.07)', color: BLUE, borderRadius: 3, padding: '2px 8px', border: '1px solid rgba(39,76,105,0.2)', fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>{e}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RoomCards({ data, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '8px 0' }}>
      {data.habitaciones.map((hab, idx) => {
        const images = ROOM_IMAGES[idx % ROOM_IMAGES.length];
        return (
          <div key={idx}
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', boxShadow: '0 1px 4px rgba(39,76,105,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CARD_BORDER_HOVER; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
            onClick={() => onSelect(`Elijo la habitación: ${hab.tipo}, ${hab.metros}m², $${hab.precio_noche} por noche`)}
          >
            <Carousel images={images} startIndex={idx} />
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 6 }}>{hab.tipo}</div>
              <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>{hab.metros} m²</span>
                <span style={{ fontSize: 12, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>max. {hab.capacidad} pers.</span>
              </div>
              {hab.descripcion_breve && <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 10, lineHeight: 1.4, fontFamily: 'Montserrat, sans-serif' }}>{hab.descripcion_breve}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 17, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Montserrat, sans-serif' }}>${hab.precio_noche}</span>
                  <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: 'Montserrat, sans-serif' }}>/noche</span>
                </div>
                <button onClick={e => { e.stopPropagation(); onSelect(`Elijo la habitación: ${hab.tipo}, ${hab.metros}m², $${hab.precio_noche} por noche`); }} style={BTN_STYLE}
                  onMouseEnter={e => e.target.style.background = 'rgba(39,76,105,0.08)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  Elegir
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
