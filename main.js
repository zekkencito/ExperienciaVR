import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Clase principal de la aplicación
class BodySystemsVR {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        this.systems = {
            respiratory: null,
            circulatory: null,
            immune: null
        };
        
        this.activeSystem = null;
        this.currentDirection = null;
        
        // Audio
        this.ambientMusic = null;
        this.audioLoader = new THREE.AudioLoader();
        this.listener = new THREE.AudioListener();
        
        // Partículas
        this.particles = null;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.setupEnvironment();
        this.createSystems();
        this.setupAudio();
        this.setupControls();
        this.setupVR();
        this.setupEventListeners();
        this.animate();
        
        // Ocultar loading
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1000);
    }

    setupScene() {
        // Escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);
        this.scene.fog = new THREE.Fog(0x0a0a1a, 10, 50);

        // Cámara
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 5); // Altura típica de ojos humanos en VR
        this.camera.add(this.listener);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.enabled = true;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Luz ambiental suave
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);

        // Luz direccional principal
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // Luces de acento para cada sistema
        const accentLight1 = new THREE.PointLight(0x4CAF50, 1, 20);
        accentLight1.position.set(0, 2, -8);
        this.scene.add(accentLight1);

        const accentLight2 = new THREE.PointLight(0xF44336, 1, 20);
        accentLight2.position.set(8, 2, 0);
        this.scene.add(accentLight2);

        const accentLight3 = new THREE.PointLight(0x2196F3, 1, 20);
        accentLight3.position.set(-8, 2, 0);
        this.scene.add(accentLight3);
    }

    setupEnvironment() {
        // Crear fondo espacial con estrellas
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);

        // Suelo simple
        const floorGeometry = new THREE.CircleGeometry(20, 32);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Grid sutil
        const gridHelper = new THREE.GridHelper(20, 20, 0x00ff00, 0x003300);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    createSystems() {
        // Sistema Respiratorio (Frente)
        this.systems.respiratory = this.createRespiratorySystem();
        this.systems.respiratory.position.set(0, 2, -8);
        this.systems.respiratory.visible = false;
        this.scene.add(this.systems.respiratory);

        // Sistema Circulatorio (Derecha)
        this.systems.circulatory = this.createCirculatorySystem();
        this.systems.circulatory.position.set(8, 2, 0);
        this.systems.circulatory.visible = false;
        this.scene.add(this.systems.circulatory);

        // Sistema Inmunológico (Izquierda)
        this.systems.immune = this.createImmuneSystem();
        this.systems.immune.position.set(-8, 2, 0);
        this.systems.immune.visible = false;
        this.scene.add(this.systems.immune);
    }

    createRespiratorySystem() {
        const group = new THREE.Group();
        group.userData.systemName = 'Sistema Respiratorio';
        group.userData.systemType = 'respiratory';
        group.userData.narration = [
            "El oxígeno entra y el dióxido de carbono sale.",
            "El aire limpio es importante.",
            "La nariz y los pulmones nos protegen del aire sucio."
        ];

        // Pulmones (dos esferas deformadas)
        const lungGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const lungMaterial = new THREE.MeshStandardMaterial({
            color: 0xff9999,
            roughness: 0.5,
            metalness: 0.1
        });

        const leftLung = new THREE.Mesh(lungGeometry, lungMaterial);
        leftLung.scale.set(1, 1.2, 0.7);
        leftLung.position.set(-0.6, 0, 0);
        leftLung.castShadow = true;
        group.add(leftLung);

        const rightLung = new THREE.Mesh(lungGeometry, lungMaterial);
        rightLung.scale.set(1, 1.2, 0.7);
        rightLung.position.set(0.6, 0, 0);
        rightLung.castShadow = true;
        group.add(rightLung);

        // Bronquios (tubos)
        const tubeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const tubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcccc,
            roughness: 0.6
        });

        const leftBronchus = new THREE.Mesh(tubeGeometry, tubeMaterial);
        leftBronchus.position.set(-0.3, 0.5, 0);
        leftBronchus.rotation.z = Math.PI / 6;
        group.add(leftBronchus);

        const rightBronchus = new THREE.Mesh(tubeGeometry, tubeMaterial);
        rightBronchus.position.set(0.3, 0.5, 0);
        rightBronchus.rotation.z = -Math.PI / 6;
        group.add(rightBronchus);

        // Tráquea
        const trachea = new THREE.Mesh(tubeGeometry, tubeMaterial);
        trachea.position.set(0, 1.2, 0);
        group.add(trachea);

        // Texto flotante
        this.createFloatingLabel(group, '🫁 Sistema Respiratorio', 0x4CAF50);

        // Guardar referencias para animación
        group.userData.leftLung = leftLung;
        group.userData.rightLung = rightLung;
        group.userData.breathing = true;

        return group;
    }

    createCirculatorySystem() {
        const group = new THREE.Group();
        group.userData.systemName = 'Sistema Circulatorio';
        group.userData.systemType = 'circulatory';
        group.userData.narration = [
            "El corazón bombea sangre con oxígeno.",
            "El ejercicio acelera el corazón.",
            "Podemos sentir el pulso en la muñeca."
        ];

        // Corazón (forma aproximada)
        const heartGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const heartMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.4,
            metalness: 0.2,
            emissive: 0x330000
        });

        const heartBase = new THREE.Mesh(heartGeometry, heartMaterial);
        heartBase.scale.set(1.2, 1, 1);
        heartBase.castShadow = true;
        group.add(heartBase);

        // Aurículas (partes superiores)
        const auricleGeometry = new THREE.SphereGeometry(0.3, 12, 12);
        const leftAuricle = new THREE.Mesh(auricleGeometry, heartMaterial);
        leftAuricle.position.set(-0.4, 0.5, 0);
        group.add(leftAuricle);

        const rightAuricle = new THREE.Mesh(auricleGeometry, heartMaterial);
        rightAuricle.position.set(0.4, 0.5, 0);
        group.add(rightAuricle);

        // Venas/Arterias
        const vesselGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0.5, 1, 0.5),
                new THREE.Vector3(1, 1.5, 0)
            ]),
            20,
            0.08,
            8,
            false
        );

        const arteryMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            roughness: 0.5
        });

        const veinMaterial = new THREE.MeshStandardMaterial({
            color: 0x5555ff,
            roughness: 0.5
        });

        const artery1 = new THREE.Mesh(vesselGeometry, arteryMaterial);
        group.add(artery1);

        const artery2 = new THREE.Mesh(vesselGeometry, arteryMaterial);
        artery2.rotation.y = Math.PI;
        group.add(artery2);

        const vein1 = new THREE.Mesh(vesselGeometry, veinMaterial);
        vein1.rotation.y = Math.PI / 2;
        group.add(vein1);

        const vein2 = new THREE.Mesh(vesselGeometry, veinMaterial);
        vein2.rotation.y = -Math.PI / 2;
        group.add(vein2);

        // Texto flotante
        this.createFloatingLabel(group, '🫀 Sistema Circulatorio', 0xF44336);

        // Guardar referencias para animación
        group.userData.heart = heartBase;
        group.userData.beating = true;

        return group;
    }

    createImmuneSystem() {
        const group = new THREE.Group();
        group.userData.systemName = 'Sistema Inmunológico';
        group.userData.systemType = 'immune';
        group.userData.narration = [
            "El cuerpo tiene defensas.",
            "Si vivimos mal, el cuerpo se debilita.",
            "Comer bien y hacer ejercicio ayuda a defendernos."
        ];

        // Glóbulo blanco (célula de defensa)
        const whiteBloodCellGeometry = new THREE.IcosahedronGeometry(0.5, 1);
        const whiteBloodCellMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.4,
            emissive: 0x444444
        });

        const whiteBloodCell = new THREE.Mesh(whiteBloodCellGeometry, whiteBloodCellMaterial);
        whiteBloodCell.position.set(-1, 0, 0);
        whiteBloodCell.castShadow = true;
        group.add(whiteBloodCell);

        // Núcleo del glóbulo blanco
        const nucleusGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        const nucleusMaterial = new THREE.MeshStandardMaterial({
            color: 0x8888ff,
            emissive: 0x222244
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        whiteBloodCell.add(nucleus);

        // Virus (forma espinosa)
        const virusGeometry = new THREE.IcosahedronGeometry(0.4, 0);
        const virusMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            roughness: 0.4,
            metalness: 0.2,
            emissive: 0x003300
        });

        const virus = new THREE.Mesh(virusGeometry, virusMaterial);
        virus.position.set(1.5, 0, 0);
        virus.castShadow = true;
        group.add(virus);

        // Espinas del virus
        const spikeGeometry = new THREE.ConeGeometry(0.05, 0.3, 4);
        const spikeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x330000
        });

        for (let i = 0; i < 12; i++) {
            const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
            const phi = Math.acos(-1 + (2 * i) / 12);
            const theta = Math.sqrt(12 * Math.PI) * phi;
            
            spike.position.setFromSphericalCoords(0.4, phi, theta);
            spike.lookAt(0, 0, 0);
            virus.add(spike);
        }

        // Texto flotante
        this.createFloatingLabel(group, '🛡️ Sistema Inmunológico', 0x2196F3);

        // Guardar referencias para animación
        group.userData.whiteBloodCell = whiteBloodCell;
        group.userData.virus = virus;
        group.userData.attacking = true;

        return group;
    }

    createFloatingLabel(parent, text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = 'bold 40px Arial';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 256, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(4, 1, 1);
        sprite.position.set(0, 2, 0);
        
        parent.add(sprite);
        parent.userData.label = sprite;
    }

    createParticles(position, color) {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCnt = 100;
        const posArray = new Float32Array(particlesCnt * 3);

        for (let i = 0; i < particlesCnt * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        particlesMesh.position.copy(position);
        this.scene.add(particlesMesh);

        // Animar y remover partículas
        let opacity = 0.8;
        const animate = () => {
            opacity -= 0.02;
            particlesMaterial.opacity = opacity;
            
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.05; // Mover hacia arriba
            }
            particlesGeometry.attributes.position.needsUpdate = true;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particlesMesh);
                particlesGeometry.dispose();
                particlesMaterial.dispose();
            }
        };
        animate();
    }

    setupAudio() {
        // Música ambiental
        // NOTA: Coloca tu archivo de música en ./audio/ambient.mp3
        this.ambientMusic = new THREE.Audio(this.listener);
        
        // Descomentar cuando tengas el archivo de audio
        /*
        this.audioLoader.load('./audio/ambient.mp3', (buffer) => {
            this.ambientMusic.setBuffer(buffer);
            this.ambientMusic.setLoop(true);
            this.ambientMusic.setVolume(0.3);
        });
        */

        // Audio de narración para cada sistema
        // NOTA: Coloca los archivos en ./audio/respiratory.mp3, ./audio/circulatory.mp3, ./audio/immune.mp3
        this.systems.respiratory.userData.audio = new THREE.Audio(this.listener);
        this.systems.circulatory.userData.audio = new THREE.Audio(this.listener);
        this.systems.immune.userData.audio = new THREE.Audio(this.listener);

        // Descomentar cuando tengas los archivos
        /*
        this.audioLoader.load('./audio/respiratory.mp3', (buffer) => {
            this.systems.respiratory.userData.audio.setBuffer(buffer);
        });
        this.audioLoader.load('./audio/circulatory.mp3', (buffer) => {
            this.systems.circulatory.userData.audio.setBuffer(buffer);
        });
        this.audioLoader.load('./audio/immune.mp3', (buffer) => {
            this.systems.immune.userData.audio.setBuffer(buffer);
        });
        */
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 15;
        this.controls.target.set(0, 1.6, 0);
    }

    setupVR() {
        const vrButton = VRButton.createButton(this.renderer);
        document.getElementById('vr-button').remove();
        document.body.appendChild(vrButton);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Click para activar narración
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });

        // Raycaster para detección de sistemas
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects([
            this.systems.respiratory,
            this.systems.circulatory,
            this.systems.immune
        ], true);

        if (intersects.length > 0) {
            const clickedSystem = this.getSystemFromIntersect(intersects[0]);
            if (clickedSystem) {
                this.activateSystem(clickedSystem);
            }
        }
    }

    getSystemFromIntersect(intersect) {
        let obj = intersect.object;
        while (obj.parent) {
            if (obj.userData.systemType) {
                return obj;
            }
            obj = obj.parent;
        }
        return null;
    }

    activateSystem(system) {
        // Reproducir audio de narración
        if (system.userData.audio && system.userData.audio.buffer) {
            system.userData.audio.play();
        }

        // Mostrar info en pantalla
        document.getElementById('system-title').textContent = system.userData.systemName;
        document.getElementById('system-description').textContent = system.userData.narration.join(' ');
        document.getElementById('system-info').classList.remove('hidden');

        // Crear partículas
        const color = system.userData.systemType === 'respiratory' ? 0x4CAF50 :
                     system.userData.systemType === 'circulatory' ? 0xF44336 : 0x2196F3;
        this.createParticles(system.position, color);

        // Ocultar después de 8 segundos
        setTimeout(() => {
            document.getElementById('system-info').classList.add('hidden');
        }, 8000);
    }

    checkCameraDirection() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);

        // Normalizar y obtener ángulo
        const angle = Math.atan2(direction.x, direction.z);
        const degrees = THREE.MathUtils.radToDeg(angle);

        let newDirection = null;

        // Frente: Sistema Respiratorio (-45° a 45°)
        if (degrees >= -45 && degrees <= 45) {
            newDirection = 'front';
            if (!this.systems.respiratory.visible) {
                this.systems.respiratory.visible = true;
                this.createParticles(this.systems.respiratory.position, 0x4CAF50);
            }
            this.systems.circulatory.visible = false;
            this.systems.immune.visible = false;
        }
        // Derecha: Sistema Circulatorio (45° a 135°)
        else if (degrees > 45 && degrees < 135) {
            newDirection = 'right';
            if (!this.systems.circulatory.visible) {
                this.systems.circulatory.visible = true;
                this.createParticles(this.systems.circulatory.position, 0xF44336);
            }
            this.systems.respiratory.visible = false;
            this.systems.immune.visible = false;
        }
        // Izquierda: Sistema Inmunológico (-135° a -45°)
        else if (degrees < -45 && degrees > -135) {
            newDirection = 'left';
            if (!this.systems.immune.visible) {
                this.systems.immune.visible = true;
                this.createParticles(this.systems.immune.position, 0x2196F3);
            }
            this.systems.respiratory.visible = false;
            this.systems.circulatory.visible = false;
        }
        // Atrás
        else {
            this.systems.respiratory.visible = false;
            this.systems.circulatory.visible = false;
            this.systems.immune.visible = false;
        }

        this.currentDirection = newDirection;
    }

    animateSystems() {
        const time = Date.now() * 0.001;

        // Animar Sistema Respiratorio (respiración)
        if (this.systems.respiratory.userData.breathing) {
            const breathScale = 1 + Math.sin(time * 2) * 0.1;
            this.systems.respiratory.userData.leftLung.scale.set(1, 1.2 * breathScale, 0.7);
            this.systems.respiratory.userData.rightLung.scale.set(1, 1.2 * breathScale, 0.7);
        }

        // Animar Sistema Circulatorio (latido)
        if (this.systems.circulatory.userData.beating) {
            const heartBeat = 1 + Math.sin(time * 4) * 0.15;
            this.systems.circulatory.userData.heart.scale.set(1.2 * heartBeat, heartBeat, heartBeat);
        }

        // Animar Sistema Inmunológico (ataque)
        if (this.systems.immune.userData.attacking) {
            const attack = Math.sin(time * 1.5) * 0.5 + 0.5;
            const whiteCell = this.systems.immune.userData.whiteBloodCell;
            whiteCell.position.x = -1 + attack * 2.5;
            
            // Rotar células
            whiteCell.rotation.y += 0.02;
            this.systems.immune.userData.virus.rotation.y -= 0.01;
        }

        // Rotación suave de etiquetas hacia la cámara
        Object.values(this.systems).forEach(system => {
            if (system.userData.label) {
                system.userData.label.lookAt(this.camera.position);
            }
        });
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            this.update();
            this.render();
        });
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }

        // Verificar dirección de la cámara
        this.checkCameraDirection();

        // Animar sistemas
        this.animateSystems();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializar la aplicación cuando se cargue la página
window.addEventListener('DOMContentLoaded', () => {
    new BodySystemsVR();
});
