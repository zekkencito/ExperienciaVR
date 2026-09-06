#  Cuerpo Humano VR — Experiencia Educativa Interactiva

[![Demo en vivo](https://img.shields.io/badge/demo-en%20vivo-brightgreen)](https://vrbody.caychopomachagua.dev)
[![A-Frame](https://img.shields.io/badge/A--Frame-1.5.0-ef2d5e)](https://aframe.io/)
[![Three.js](https://img.shields.io/badge/Three.js-r15x-black)](https://threejs.org/)
[![WebXR](https://img.shields.io/badge/WebXR-compatible-blue)](https://developer.mozilla.org/es/docs/Web/API/WebXR_Device_API)
[![Docker](https://img.shields.io/badge/Docker-listos-2496ed?)](https://www.docker.com/)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-yellowgreen)](LICENSE)

Experiencia de **realidad virtual educativa sobre el cuerpo humano**, creada para explorar los sistemas del organismo de forma inmersiva e interactiva. Funciona en **visores VR** y también en navegadores de escritorio o móviles sin visor.

> 🔴 **Demo en vivo:** [https://vrbody.caychopomachagua.dev](https://vrbody.caychopomachagua.dev)

---

##  ¿De qué trata?

El proyecto contiene **dos implementaciones** del mismo recorrido educativo:

| Archivo | Tecnología | Descripción |
|---|---|---|
| `index-aframe.html` | **A-Frame 1.5.0** | **Versión principal (la que se despliega).** Recorrido guiado por mirada, con modelo del cuerpo humano, flechas de navegación, audio por sistema y secuencia final animada. |
| `main.js` | **Three.js + WebXR** | Versión alternativa. Los sistemas se construyen con geometría procedural (esferas, tubos, icosaedros) en lugar de modelos externos. |
| `narration-scripts.html` | Documentación | Guiones de narración de cada sistema. |

Se exploran **cuatro zonas del cuerpo** en una secuencia guiada:

1.  **Sistema Respiratorio** (al frente) — pulmones con animación de respiración y bronquios.
2.  **Sistema Circulatorio** (a la derecha) — corazón con latido (ritmo ~90 BPM) y vasos sanguíneos.
3.  **Sistema Inmunológico** (atrás) — glóbulos blancos enfrentando virus con células en movimiento.
4.  **Secuencia final** (a la izquierda) — cierre con audio especial y pantalla final.
5. 
Cada sistema incluye **narración de audio**, **música ambiental**, **efectos de partículas** y **etiquetas flotantes** con su nombre.

##  Características

- **Interacción por mirada**: mantén la vista sobre un sistema ~1.5 s para activar su descripción (con cooldown de 15 s entre activaciones).
- **Flechas guía 3D** que indican hacia dónde girar para continuar el recorrido.
- **Audio espacial**: música de fondo, narración por sistema, latido, respiración y secuencia final.
- **Soporte WebXR**: entra en modo VR desde visores (Meta Quest, Cardboard, etc.).
- Visualización por clic en escritorio (en la versión Three.js: rotar con *OrbitControls* y zoom con rueda del mouse).
- Botón **COMENZAR EXPERIENCIA VR** y control de **silenciar música**.
- *Atmósfera inmersiva**: en la versión Three.js incluye cielo nocturno con estrellas y niebla; en la versión A-Frame incluye **cielo dinámico** que cambia de color según el sistema y glóbulos rojos flotantes. Ambas tienen suelo y luces de acento de color por sistema (verde / rojo / azul).

##  Instalación y ejecución

### Opción 1 — Node.js (recomendada)

```bash
# Instalar dependencias (http-server)
npm install

# Abre en http://localhost:8000
npm start          # o: npm run dev  (abre el navegador automáticamente)
```

### Opción 2 — Servidor Python

```bash
python -m http.server 8000
# Abre http://localhost:8000/index-aframe.html
```

### Opción 3 — VS Code (Live Server)

1. Instala la extensión **Live Server**.
2. `index-aframe.html` → clic derecho → **Open with Live Server**.

### Opción 4 — Docker 🐳

```bash
# Build e inicio del contenedor (nginx, puerto 3003)
docker compose up -d
# Abre http://localhost:3003
```

Para producción usando la imagen ya publicada:

```bash
docker compose -f docker-compose.prod.yml up -d
```

> ⚠️ Nota: no abras los archivos haciendo doble-clic (doble clic en `file://`); el cargado de modelos y audio requiere un servidor HTTP.

##  Estructura del proyecto

```
cuerpo-humano-vr/
├── index-aframe.html       # Versión principal (A-Frame)
├── main.js                 # Versión alternativa (Three.js + WebXR)
├── narration-scripts.html  # Guiones de narración
├── models/                 # Modelos 3D (GLB/FBX)
│   ├── person.glb, male.glb, human.glb   # Cuerpo humano
│   ├── lungs.glb, Bronquios.glb, traquea.glb, Nose.glb, PulmonDer/Izq.glb
│   ├── Heart.glb, corazon.glb
│   ├── Virus.glb, Cell.glb, redcell.glb
│   ├── arrow.glb, planet.glb
├── audio/                  # Archivos de audio (ver sección de audio)
├── Dockerfile              # Imagen nginx (expone el puerto 80)
├── docker-compose.yml      # Build local → http://localhost:3003
├── docker-compose.prod.yml # Usa imagen: zekken03x/experienciavr:latest
└── package.json            # Scripts npm (http-server)
```

## 🎮 Controles

| Acción | A-Frame (`index-aframe.html`) | Three.js (`main.js`) |
|---|---|---|
| **Activar sistema** | Mirar el sistema durante ~1.5 s (o clic) | Clic sobre el sistema |
| **Rotar vista** | Girar la cabeza (VR) o arrastrar con el mouse (escritorio) | Clic izquierdo + arrastrar (*OrbitControls*) |
| **Zoom** | Acercarte físicamente | Rueda del mouse |
| **Audio** | Conmutar con el botón 🔊 | Configurado por código |

En el **modo VR**, los sistemas se muestran solo cuando miras en su dirección (frente → respiratorio, derecha → circulatorio, atrás → inmunológico, izquierda → final). En escritorio, gira la vista con el mouse para revelarlos.

## 🎵 Audio

### Archivos incluidos

| Archivo | Uso |
|---|---|
| `music.mp3` | Música ambiental de fondo |
| `respiratorio.mp3` | Narración del sistema respiratorio |
| `circulatorio.mp3` | Narración del sistema circulatorio |
| `inmuno.mp3` | Narración del sistema inmunológico |
| `breathing.mp3` | Efecto de respiración |
| `heartbeat.mp3` | Efecto de latido del corazón |
| `battle.mp3` | Ambiente de la escena de células |
| `click.wav` | Sonido de confirmación/interacción |
| `final1.mp3`, `final2.mp3` | Secuencia final |

### Activar audio en la versión Three.js (`main.js`)

En la versión Three.js el cargador de audio está **comentado**. Dentro de `setupAudio()` (línea 453):

- Bloque de música ambiental: **líneas 458–465** (espera `./audio/ambient.mp3`).
- Bloque de narraciones: **líneas 474–484** (espera `./audio/respiratory.mp3`, `./audio/circulatory.mp3`, `./audio/immune.mp3`).

```javascript
// Música ambiental — descomenta para activar
this.audioLoader.load('./audio/ambient.mp3', (buffer) => {
    this.ambientMusic.setBuffer(buffer);
    this.ambientMusic.setLoop(true);
    this.ambientMusic.setVolume(0.3);
});

// Narraciones — descomenta para activar
this.audioLoader.load('./audio/respiratory.mp3', (buffer) => {
    this.systems.respiratory.userData.audio.setBuffer(buffer);
});
```

>  En la versión A-Frame el audio ya está cableado en el HTML y usa los nombres que **ya existen** en `audio/` (`respiratorio.mp3`, `circulatorio.mp3`, `inmuno.mp3`, etc.).

### Guiones de narración

Están disponibles en `narration-scripts.html` y también embebidos como textos en el código:

- **Respiratorio:** "El oxígeno entra y el dióxido de carbono sale. El aire limpio es importante. La nariz y los pulmones nos protegen del aire sucio."
- **Circulatorio:** "El corazón bombea sangre con oxígeno. El ejercicio acelera el corazón. Podemos sentir el pulso en la muñeca."
- **Inmunológico:** "El cuerpo tiene defensas. Si vivimos mal, el cuerpo se debilita. Comer bien y hacer ejercicio ayuda a defendernos."

##  Personalización

### Colores de los sistemas (Three.js — `main.js`)

| Sistema | Material | Línea | Color |
|---|---|---|---|
| Respiratorio | `lungMaterial` | 175 | `0xff9999` |
| Circulatorio | `heartMaterial` | 238 | `0xff0000` (emissive `0x330000`) |
| Inmunológico | `whiteBloodCellMaterial` | 320 | `0xffffff` (emissive `0x444444`) |

```javascript
const lungMaterial = new THREE.MeshStandardMaterial({
    color: 0xff9999,   // ← Cambia este valor
    roughness: 0.5,
    metalness: 0.1
});
```

>  En la versión A-Frame los colores se cambian en el HTML (atributos `material` de cada `<a-entity>`).

### Posición de los sistemas

**Three.js (`main.js`, líneas 145–157):** respiratorio en frente `(0, 2, -8)`, circulatorio a la derecha `(8, 2, 0)`, inmunológico a la izquierda `(-8, 2, 0)`.

**A-Frame (`index-aframe.html`):** respiratorio `(0, 1.6, -8)`, circulatorio `(8, 1.6, 0)`, inmunológico atrás `(0, 1.6, 8)`, final a la izquierda `(-8, 1.6, 4)`.

### Velocidad de animaciones (Three.js — `animateSystems()`, línea 624)

| Animación | Línea | Expresión |
|---|---|---|
| Respiración | 629 | `1 + Math.sin(time * 2) * 0.1` — ↑ para respirar más rápido |
| Latido del corazón | 636 | `1 + Math.sin(time * 4) * 0.15` — ↑ para latir más rápido |
| Ataque inmunológico | 642 | `Math.sin(time * 1.5) * 0.5 + 0.5` — ↑ para moverse más rápido |

En la versión A-Frame el latido se controla con el componente `heartbeat` (`bpm: 90`, `lubScale`/`dubScale`).

##  Requisitos técnicos

- **Navegador con soporte WebXR** para el modo VR (Chrome/Edge en Android, Meta Quest Browser, Samsung Internet).
- **HTTPS o `localhost`** (WebXR y el audio requieren contexto seguro en producción).
- **GPU** compatible con WebGL 2.0.
- **RAM** mínima: 4 GB (recomendado 8 GB).
- **Visores compatibles**: Meta Quest 2/3/Pro, HTC Vive, Valve Index, Google Cardboard.

Sin visor también funciona en escritorio/móvil: el recorrido se puede completar con mouse y teclado o pantalla táctil.

##  Solución de problemas

| Problema | Solución |
|---|---|
| "Cross-Origin Request Blocked" | Sirve el proyecto con un servidor HTTP (npm/python), no lo abras con doble clic. |
| El botón de VR no aparece | Verifica el soporte WebXR de tu navegador y que el sitio esté bajo HTTPS/localhost. |
| No se ve nada en VR | Conecta el visor, otorga permisos al navegador y actualiza drivers/firmware. |
| El audio no se reproduce | Revisa que existan los archivos en `audio/` y que el navegador permita autoplay tras interacción del usuario (botón "COMENZAR"). |

##  Objetivos educativos

- **Anatomía básica**: estructura y ubicación de los sistemas del cuerpo.
- **Fisiología**: cómo funcionan (respiración, bombeo de sangre, defensas).
- **Salud**: hábitos que fortalecen el organismo.
- **Ciencia y tecnología**: aplicación educativa de la realidad virtual.

##  Mejoras futuras

- [ ] Agregar más sistemas (digestivo, nervioso, óseo).
- [ ] Quiz interactivo por sistema.
- [ ] Modo multijugador educativo.
- [ ] Modelos 3D con mayor nivel de detalle.
- [ ] Minijuegos educativos.
- [ ] Soporte multilingüe.
- [ ] Integración con controladores VR.
- [ ] Modo AR (Realidad Aumentada).

##  Recursos

- [A-Frame](https://aframe.io/) — framework para web VR.
- [Three.js Documentation](https://threejs.org/docs/)
- [WebXR Device API](https://www.w3.org/TR/webxr/)
- [MDN — WebXR](https://developer.mozilla.org/es/docs/Web/API/WebXR_Device_API)

## 📄 Licencia

MIT — consulta el archivo [LICENSE](LICENSE) para más detalles. Disponible para uso educativo.

## 👨‍💻 Autor

- **Renzo Caycho** — [github.com/zekkencito](https://github.com/zekkencito)
- Repositorio: [github.com/zekkencito/ExperienciaVR](https://github.com/zekkencito/ExperienciaVR)
- Demo: [vrbody.caychopomachagua.dev](https://vrbody.caychopomachagua.dev)

---
