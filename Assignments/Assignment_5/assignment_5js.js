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

    let geometry = new THREE.SphereBufferGeometry();
    let geometry2 = new THREE.TorusKnotBufferGeometry();
    let material = new THREE.MeshNormalMaterial;
    let object1 = new THREE.Mesh(geometry, material);
    let object2 = new THREE.Mesh(geometry2, material);
    // scene.add(object1);
    // scene.add(object2);
    // object1.position.set(1,1,1);
    // object2.position.set(-1,-1,-1);
    // sceneObjects.push(object1);
    // sceneObjects.push(object2);
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
            // sceneObjects[0].visible = false;
            // sceneObjects[1].visible = false;
            console.log(event.key);
            console.log(sceneObjects[2]);
            render();
        }
    });
}

function vertexShader() {
    return `
        precision highp float;

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
        precision highp float;

        uniform vec3 skyLight;
        uniform vec3 groundLight;
        uniform vec3 up;

        varying vec3 globalNormal;

        void main() {
            float w = (1.0 + dot(normalize(globalNormal), up)) / 2.0;
            // float uIncidentLight = IncidentLight
            // gl_FragColor = vec4(globalNormal, 1.0);
            gl_FragColor = vec4(w,w,w,w);
        }
    `
}

function applyShaders() {
    let uniforms = {
        // inverseModel : {type : 'mat3', value: new THREE.ShaderMaterial()}
        up : {type : 'vec3', value : new THREE.Vector3(0,1,0)},
        skyLight : {type : 'vec3', value : new THREE.Color(1,1,1)},
        groundLight : {type : 'vec3', value : new THREE.Color(0,0,0)}
    }

    let geometry = new THREE.TorusKnotBufferGeometry();
    
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader()
    });

    // let material2 = new THREE.MeshBasicMaterial();

    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0,0,0);
    scene.add(mesh);
    sceneObjects.push(mesh);
}