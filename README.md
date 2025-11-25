# 🫁🫀🛡️ Cuerpo Humano VR - Experiencia Educativa Interactiva

Proyecto de realidad virtual educativa desarrollado con **Three.js** y **WebXR** para enseñar sobre los sistemas del cuerpo humano de forma inmersiva e interactiva.

## 🎯 Características

### Sistemas del Cuerpo Humano

1. **Sistema Respiratorio 🫁** (Vista Frontal)
   - Modelos 3D de pulmones y bronquios
   - Animación de respiración (expansión y contracción)
   - Narración educativa sobre la función respiratoria

2. **Sistema Circulatorio 🫀** (Vista Derecha)
   - Corazón animado con latido
   - Venas y arterias visualizadas
   - Explicación del bombeo de sangre

3. **Sistema Inmunológico 🛡️** (Vista Izquierda)
   - Glóbulo blanco vs virus
   - Animación de ataque celular
   - Información sobre las defensas del cuerpo

### Funcionalidades VR

- ✅ Soporte completo para WebXR (VR)
- ✅ Detección de orientación de cámara
- ✅ Activación automática de sistemas al mirar en cada dirección
- ✅ Efectos de partículas al activar sistemas
- ✅ Música ambiental en loop
- ✅ Narración de audio para cada sistema
- ✅ Controles de zoom y rotación
- ✅ Texto flotante con nombres de sistemas
- ✅ Interfaz informativa

## 🚀 Instalación y Uso

### Opción 1: Servidor Local Simple

1. **Usando Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   ```

2. **Usando Node.js:**
   ```bash
   # Si tienes npx instalado
   npx http-server -p 8000
   ```

3. **Abre tu navegador en:**
   ```
   http://localhost:8000
   ```

### Opción 2: Extensión de VS Code

1. Instala la extensión **"Live Server"** en VS Code
2. Haz clic derecho en `index.html` → "Open with Live Server"

### Opción 3: Node.js + npm

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar en la carpeta del proyecto
http-server -p 8000
```

## 🎮 Controles

### Modo Escritorio (sin VR)
- 🖱️ **Clic izquierdo + Arrastrar**: Rotar vista
- 🔍 **Rueda del mouse**: Zoom in/out
- 🖱️ **Clic en sistema**: Activar narración y efectos

### Modo VR
- 👀 **Mirar al frente**: Sistema Respiratorio
- 👀 **Mirar a la derecha**: Sistema Circulatorio
- 👀 **Mirar a la izquierda**: Sistema Inmunológico
- 👆 **Acercarse**: Mostrar detalles del sistema

## 🎵 Configuración de Audio

### Estructura de Archivos de Audio

Crea una carpeta `audio` en la raíz del proyecto y coloca los siguientes archivos:

```
Sistemas/
├── audio/
│   ├── ambient.mp3          # Música ambiental espacial
│   ├── respiratory.mp3      # Narración sistema respiratorio
│   ├── circulatory.mp3      # Narración sistema circulatorio
│   └── immune.mp3           # Narración sistema inmunológico
├── index.html
└── main.js
```

### Textos de Narración (para generar audio)

**Sistema Respiratorio (respiratory.mp3):**
```
"El oxígeno entra y el dióxido de carbono sale. 
El aire limpio es importante. 
La nariz y los pulmones nos protegen del aire sucio."
```

**Sistema Circulatorio (circulatory.mp3):**
```
"El corazón bombea sangre con oxígeno. 
El ejercicio acelera el corazón. 
Podemos sentir el pulso en la muñeca."
```

**Sistema Inmunológico (immune.mp3):**
```
"El cuerpo tiene defensas. 
Si vivimos mal, el cuerpo se debilita. 
Comer bien y hacer ejercicio ayuda a defendernos."
```

### Activar el Audio en el Código

Una vez que tengas los archivos de audio, descomenta las siguientes secciones en `main.js`:

**Líneas 295-301** (Música ambiental):
```javascript
this.audioLoader.load('./audio/ambient.mp3', (buffer) => {
    this.ambientMusic.setBuffer(buffer);
    this.ambientMusic.setLoop(true);
    this.ambientMusic.setVolume(0.3);
});
```

**Líneas 308-318** (Narraciones):
```javascript
this.audioLoader.load('./audio/respiratory.mp3', (buffer) => {
    this.systems.respiratory.userData.audio.setBuffer(buffer);
});
this.audioLoader.load('./audio/circulatory.mp3', (buffer) => {
    this.systems.circulatory.userData.audio.setBuffer(buffer);
});
this.audioLoader.load('./audio/immune.mp3', (buffer) => {
    this.systems.immune.userData.audio.setBuffer(buffer);
});
```

### Herramientas para Generar Audio

**Servicios de Text-to-Speech (TTS):**
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)
- [Amazon Polly](https://aws.amazon.com/polly/)
- [ElevenLabs](https://elevenlabs.io/) - Voces naturales
- [Narakeet](https://www.narakeet.com/) - Español latino

**Software Gratuito:**
- [Balabolka](http://www.cross-plus-a.com/balabolka.htm) - Windows
- [NaturalReader](https://www.naturalreaders.com/online/)

**Música Ambiental Libre:**
- [FreePD](https://freepd.com/) - Música de dominio público
- [Incompetech](https://incompetech.com/music/) - Música libre de Kevin MacLeod
- [YouTube Audio Library](https://www.youtube.com/audiolibrary/)

## 🎨 Personalización

### Cambiar Colores de los Sistemas

En `main.js`, modifica los colores en las funciones:

```javascript
// Sistema Respiratorio
lungMaterial = new THREE.MeshStandardMaterial({
    color: 0xff9999, // ← Cambia este valor
    // ...
});

// Sistema Circulatorio
heartMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000, // ← Cambia este valor
    // ...
});

// Sistema Inmunológico
whiteBloodCellMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // ← Cambia este valor
    // ...
});
```

### Ajustar Posición de los Sistemas

```javascript
// En createSystems()
this.systems.respiratory.position.set(0, 2, -8);    // X, Y, Z
this.systems.circulatory.position.set(8, 2, 0);
this.systems.immune.position.set(-8, 2, 0);
```

### Modificar Velocidad de Animaciones

```javascript
// Respiración (línea ~460)
const breathScale = 1 + Math.sin(time * 2) * 0.1;
//                                    ^ Aumenta para respirar más rápido

// Latido del corazón (línea ~466)
const heartBeat = 1 + Math.sin(time * 4) * 0.15;
//                                   ^ Aumenta para latir más rápido

// Ataque inmunológico (línea ~472)
const attack = Math.sin(time * 1.5) * 0.5 + 0.5;
//                            ^ Aumenta para moverse más rápido
```

## 🔧 Requisitos Técnicos

### Navegadores Compatibles con WebXR

✅ **Escritorio:**
- Chrome/Edge 79+
- Firefox 98+
- Opera 66+

✅ **Móvil (con visor VR):**
- Chrome para Android
- Samsung Internet
- Oculus Browser

### Dispositivos VR Recomendados

- Meta Quest 2 / 3 / Pro
- PlayStation VR2
- HTC Vive
- Valve Index
- Google Cardboard (limitado)

### Requisitos de Hardware

- **GPU**: Compatible con WebGL 2.0
- **RAM**: Mínimo 4GB
- **Procesador**: Moderno (últimos 5 años)

## 📱 Probar sin Dispositivo VR

Puedes probar la aplicación sin un visor VR:

1. Usa el **mouse** para rotar la vista
2. Los sistemas aparecerán automáticamente al girar
3. Haz **clic** en un sistema para activar su narración

## 🐛 Solución de Problemas

### "Cross-Origin Request Blocked"
- Debes usar un servidor local (no abrir el archivo directamente)
- Usa una de las opciones de instalación mencionadas arriba

### El botón VR no aparece
- Verifica que tu navegador soporte WebXR
- Prueba con Chrome o Firefox
- En Chrome, habilita: `chrome://flags/#webxr`

### No se ve nada en VR
- Verifica que tu dispositivo esté conectado correctamente
- Otorga permisos de acceso al navegador
- Actualiza los drivers de tu dispositivo VR

### El audio no se reproduce
- Verifica que los archivos de audio existan en la carpeta `audio/`
- Descomenta el código de audio en `main.js`
- Algunos navegadores requieren interacción del usuario primero

## 🎓 Objetivos Educativos

Este proyecto busca enseñar:

- **Anatomía básica**: Estructura de los sistemas del cuerpo
- **Fisiología**: Cómo funcionan los sistemas
- **Salud**: Importancia de cuidar nuestro cuerpo
- **Ciencia**: Conceptos científicos de forma visual
- **Tecnología**: Uso educativo de la realidad virtual

## 🚀 Mejoras Futuras

- [ ] Agregar más sistemas (digestivo, nervioso, óseo)
- [ ] Quiz interactivo sobre cada sistema
- [ ] Modo multijugador educativo
- [ ] Modelos 3D más detallados
- [ ] Minijuegos educativos
- [ ] Soporte para múltiples idiomas
- [ ] Integración con controladores VR
- [ ] Modo AR (Realidad Aumentada)

## 📚 Recursos Adicionales

- [Three.js Documentation](https://threejs.org/docs/)
- [WebXR Device API](https://www.w3.org/TR/webxr/)
- [MDN Web Docs - WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## 👨‍💻 Autor

Desarrollado con ❤️ para educación en realidad virtual

---

**¡Disfruta explorando el cuerpo humano en VR! 🎉**
