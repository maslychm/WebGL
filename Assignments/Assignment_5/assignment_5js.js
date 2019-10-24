let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let cameraControls;
let sceneObjects = [];
let invTModelMatrix;

init();
render();

function init() {
    initRenderer();
    initScene();
    initCamera();
    eventHandlers();
    applyShaders();
}

function render() {
    renderer.render(scene, camera);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x888888, 1);
    document.body.appendChild(renderer.domElement);
}

function initScene() {
    scene = new THREE.Scene();

    //Load background texture
    let loader = new THREE.TextureLoader();
    loader.load("grass.jpg",
        function (texture) {
            scene.background = texture;
        });
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 50);
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}

function eventHandlers() {
    cameraControls.addEventListener("change",
        function () {
            camera.updateProjectionMatrix();
            render();
        });

    window.addEventListener("resize",
        function () {
            WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
            render();
        });
}

function vertexShader() {
    return `
        uniform mat4 _invTModelMatrix;

        varying vec3 globalNormal;
        varying vec2 vUV;

        void main() {

            // Calculate points in of model in world space
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);

            // Get points for the texture
            vUV = uv;

            // Apply Inverse Transpose Model Matrix (Model in Global space) to normal 
            globalNormal = vec3(_invTModelMatrix * vec4(normal, 1.0));

            gl_Position = projectionMatrix * modelViewPosition;
        }
    `
}

function fragmentShader() {
    return `
        uniform vec3 _skyLight;
        uniform vec3 _groundLight;
        uniform vec3 _up;
        uniform sampler2D _concrete;

        varying vec3 globalNormal;
        varying vec2 vUV;

        void main() {
            // Weight the amount of light from each side
            float w = 0.5 * (1.0 + dot(normalize(globalNormal), normalize(_up)));

            // Apply the light colors and combine with material
            vec3 uIncidentLight = w * _skyLight + (1.0 - w) * _groundLight;
            
            // Get the color of texture at a point
            vec3 concreteColor = texture2D(_concrete,vUV).rgb;
            
            // Combine color at pixel + light to find shading
            vec3 uReflectedColor = uIncidentLight * concreteColor;

            gl_FragColor = vec4(uReflectedColor, 1.0);
        }
    `
}

function applyShaders() {

    let geometry = new THREE.TorusKnotBufferGeometry();
    let mesh2 = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());

    // Get ModelMatrix to inverse, transpose and apply to normal and shader
    invTModelMatrix = new THREE.Matrix4();
    invTModelMatrix.getInverse(mesh2.matrixWorld, false);

    let uniforms = {
        _up: { type: 'vec3', value: new THREE.Vector3(0, 1, 0) },
        _skyLight: { type: 'vec3', value: new THREE.Color(1, 1, 1) },
        _groundLight: { type: 'vec3', value: new THREE.Vector3(0, 1, 0) },
        _invTModelMatrix: { type: 'mat4', value: invTModelMatrix.transpose() }, // Transpose
        _concrete: {
            type: 't',
            value: new THREE.TextureLoader().load("concrete.jpeg", function (texture) { render(); })
        }
    }

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader()
    });

    mesh2 = new THREE.Mesh(geometry, material);
    scene.add(mesh2);
}