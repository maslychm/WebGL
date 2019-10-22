"use strict";
    let scene, object, camera, renderer;
    let cameraControls; // Optional

    let WIDTH  = window.innerWidth;
    let HEIGHT = window.innerHeight;
    
    init();
    render();

    function init() {
        initRenderer();
        initScene();
        initCamera();
        eventHandlers();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor (0x888888, 1);
        document.body.appendChild(renderer.domElement);
    }

    function initScene() {

        scene = new THREE.Scene();
        
        // Sphere dimensions
        let radius = 2, segments = 32, rings = 32;
        let geometry = new THREE.SphereBufferGeometry(radius, segments, rings);
        
        // Sphere material
        let material = new THREE.RawShaderMaterial({
            vertexShader:   document.getElementById('vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragShader' ).textContent 
        });
        
        object = new THREE.Mesh(geometry, material);
        scene.add(object);
    }	
    function initCamera() {
        camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 10);
        camera.position.set(0, 5, 5);
        camera.lookAt(scene.position);
        cameraControls = new THREE.OrbitControls ( 
            camera, renderer.domElement);
    }
    
    function eventHandlers(){
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

        cameraControls.addEventListener("change",
            function(){
                camera.updateProjectionMatrix();
                render();
            });
    }