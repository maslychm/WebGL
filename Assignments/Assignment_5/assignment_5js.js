let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let cameraControls;
let sceneObjects = [];

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
    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x888888, 1);
    document.body.appendChild(renderer.domElement);
}

function initScene() {
    scene = new THREE.Scene();
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 50);
    camera.position.set(7,7,7);
    camera.lookAt(0,0,0);
    cameraControls = new THREE.OrbitControls (camera, renderer.domElement);
}

function eventHandlers() {
    cameraControls.addEventListener("change", 
        function () {
            camera.updateProjectionMatrix();
            render();
        });

    window.addEventListener("resize",
    function() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        render();
    });

    window.addEventListener("keydown", event => {
        if (event.key == "w") {
            console.log(event.key);
            render();
        }
    });
}

function vertexShader() {
    return `
        varying vec3 globalNormal;

        void main() {
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);

            gl_Position = projectionMatrix * modelViewPosition;

            globalNormal = vec3(modelMatrix * vec4(normal, 1.0));
        }
    `
}

function fragmentShader() {
    return `
        uniform vec3 _skyLight;
        uniform vec3 _groundLight;
        uniform vec3 _up;
        uniform vec3 _materialColor;

        varying vec3 globalNormal;
        varying vec4 color;

        void main() {
            float w = 0.5 * (1.0 + dot(normalize(globalNormal), _up));

            vec3 uIncidentLight = w * _skyLight + (1.0 - w) * _groundLight;
            vec3 uReflectedColor = uIncidentLight * _materialColor;

            gl_FragColor = vec4(uReflectedColor, 1.0);
        }
    `
}

function applyShaders() {

    let materialColor = new THREE.Color(1, .5, .5);

    let uniforms = {
        // inverseModel : {type : 'mat3', value: new THREE.ShaderMaterial()}
        _up : {type : 'vec3', value : new THREE.Vector3(0,1,0)},
        _skyLight : {type : 'vec3', value : new THREE.Color(1,1,1)},
        _groundLight : {type : 'vec3', value : new THREE.Color(0,0,0)},
        _materialColor : {type : 'vec3', value : materialColor}
    }

    let geometry = new THREE.TorusKnotBufferGeometry();
    
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader()
    });

    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0,0,0);
    scene.add(mesh);
    sceneObjects.push(mesh);
}