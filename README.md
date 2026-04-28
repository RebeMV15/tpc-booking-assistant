# The Palace Company — Concierge POC

Prototipo funcional del asistente de reservas con IA.

## Estructura

```
/api/chat.js          → Función serverless Vercel (proxy a Anthropic)
/src/App.jsx          → Aplicación React principal
/src/systemPrompt.js  → System prompt + datos de hoteles
/src/components/      → Componentes de UI (cards, widgets, etc.)
/src/data/            → JSON de hoteles, destinos, vuelos y clima
```

## Despliegue en Vercel (10 minutos)

### Opción A — desde GitHub (recomendada)

1. Sube este proyecto a un repositorio en GitHub (puede ser privado)
2. Ve a [vercel.com](https://vercel.com) y crea una cuenta o inicia sesión
3. Haz clic en "Add New Project" y selecciona tu repositorio
4. En la sección "Environment Variables", añade:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu clave de API de Anthropic (empieza por `sk-ant-...`)
5. Haz clic en "Deploy"
6. Vercel te dará una URL pública para compartir

### Opción B — desde la CLI de Vercel

```bash
npm install -g vercel
cd palace-prototype
vercel
# Sigue las instrucciones interactivas
# Cuando pregunte por variables de entorno, añade ANTHROPIC_API_KEY
```

## Desarrollo local

```bash
npm install
vercel dev   # Levanta frontend + API serverless localmente
```

Para desarrollo local necesitas un archivo `.env.local` con:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Notas del prototipo

- Los datos de hoteles, vuelos y clima son simulados y están en `/src/data/palace_data.json`
- La funcionalidad "Guardar plan" es ilustrativa (no funcional en el POC)
- El flujo termina al pulsar "Proceder al pago" (fuera del alcance del POC)
- La membresía se simula: si el usuario menciona datos de identificación, el agente finge reconocerlos
