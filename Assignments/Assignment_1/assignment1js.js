// MODEL WAS TAKEN FROM
// https://sketchfab.com/3d-models/material-ball-in-3d-coat-a6bdf1d11d714e07b9dd99dda02de965

"use strict";
let scene, camera, renderer, cameraControls;

let WIDTH  = window.innerWidth;
let HEIGHT = window.innerHeight;

function init() {
    scene = new THREE.Scene();
    initRenderer();
    initScene();
    handleResize();
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
}

function initScene() {

    initCamera();
            
    let material = new
        THREE.MeshStandardMaterial();
    
    var loader = new THREE.OBJLoader(  );
    
    loader.setPath("./"); // A local folder where the OBJ files are stored.
    loader.load( 
        "cam.obj",
        function ( obj ) {
            obj.scale.set(.25,.25,.25);
            scene.add(obj);
            render();
        }, 
        function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
            }
        });
    initLight();
}

function handleResize(){
    window.addEventListener (
        "resize",
        function () {
            WIDTH = window.innerWidth ;
            HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH,HEIGHT);
            camera.aspect = WIDTH/HEIGHT;
            camera.updateProjectionMatrix();
            render();
        });
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 40);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
    cameraControls = new THREE.OrbitControls ( 
        camera, renderer.domElement
    );
    cameraControls.addEventListener("change",
        function(){
            camera.updateProjectionMatrix();
            render();
        });
}

function initLight(){
    let keyLight = new THREE.DirectionalLight( 
        0xFFBF80, 1.0);
    keyLight.position.set(-1, 0.5, 1).normalize();

    let fillLight = new THREE.DirectionalLight( 
        0x8080FF, 0.5);
    fillLight.position.set(1, 0, 1).normalize();

    let backLight = new THREE.DirectionalLight( 
        0xffffff, 0.5);
    backLight.position.set(1, -0.5, -1).normalize();

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
}

function render() {
    renderer.render(scene, camera);
}

init();
render();