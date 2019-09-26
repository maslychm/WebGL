// MODEL WAS TAKEN FROM
// https://sketchfab.com/3d-models/material-ball-in-3d-coat-a6bdf1d11d714e07b9dd99dda02de965

"use strict";
let scene, camera, renderer, cameraControls;
// let object;
let keyLight, fillLight, backLight;

let WIDTH  = window.innerWidth;
let HEIGHT = window.innerHeight;

function init() {
    scene = new THREE.Scene();
    initRenderer();
    initScene();
    createGUI();
    eventHandlers();
}

function eventHandlers(){
    handleWindowResize();
    handleCameraChange();
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
}

function initScene() {

    initCamera();
            
    let material = new THREE.MeshStandardMaterial();
    
    var loader = new THREE.OBJLoader(  );
    
    loader.setPath("./"); // A local folder where the OBJ files are stored.
    loader.load( 
        "cam.obj",
        function ( obj ) {
            obj.scale.set(.25,.25,.25);
            obj.name = "cam";
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

function handleWindowResize(){
    window.addEventListener (
        "resize",
        function () {
            WIDTH = window.innerWidth ;
            HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH,HEIGHT);
            camera.aspect = WIDTH/HEIGHT;
            camera.updateProjectionMatrix();
            render();
        }
    );
}

function handleCameraChange(){
    cameraControls.addEventListener("change",
        function(){
            camera.updateProjectionMatrix();
            render();
        }
    );	
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 40);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
    cameraControls = new THREE.OrbitControls ( 
        camera, renderer.domElement
    );
}

function initLight(){
    keyLight = new THREE.DirectionalLight( 
        0xFFBF80, 1.0);
    keyLight.position.set(-1, 0.5, 1).normalize();

    fillLight = new THREE.DirectionalLight( 
        0x8080FF, 0.5);
    fillLight.position.set(1, 0, 1).normalize();

    backLight = new THREE.DirectionalLight( 
        0xffffff, 0.5);
    backLight.position.set(1, -0.5, -1).normalize();

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
}

function createGUI() {
    let guiObject = {
        Geometry : "WebCam",
        light : {
            visible : true,
            intensity : keyLight.intensity,
            color: "#"+keyLight.color.getHexString()
        }
    };
    
    let guiController = new dat.GUI();
    
    guiController.add(guiObject,"Geometry",["WebCam"])
    .name("Geometry")
    .onChange( function(param){
        switch(param){
        case "box" :
            object.geometry = box;
            break;
        case "WebCam" :
            object.geometry = teapot;
            break;
        }
        render();
    });

    let keyLightFolder = guiController.addFolder("KeyLight");
    keyLightFolder.add(guiObject.light,"visible")
    .name("switchOn")
    .onChange(function(flag){
        console.log("Keylight is "+ (flag?"on":"off"));
        keyLight.visible = flag;
        render();
    });
    
    keyLightFolder.add(guiObject.light,"intensity").min(0).max(1).step(0.1)
    .name("Intensity")
    .onChange(function(val){
        console.log("Intensity: "+ val);
        keyLight.intensity = val;
        render();
    });
    
    keyLightFolder.addColor(guiObject.light,"color")
    .name("Color")
    .onChange(function(hexstring){
        console.log("Key Color "+ hexstring);
        keyLight.color.set(hexstring)
        render();
    });
    keyLightFolder.close();

    let fillLightFolder = guiController.addFolder("FillLight");
    fillLightFolder.add(guiObject.light,"visible")
    .name("switchOn")
    .onChange(function(flag){
        console.log("FIllLight is " + (flag?"on":"off"));
        fillLight.visible = flag;
        render();
    })

    fillLightFolder.add(guiObject.light,"intensity").min(0).max(1).step(0.1)
    .name("Intensity")
    .onChange(function(val){
        console.log("Intensity: " + val);
        fillLight.intensity = val;
        render();
    });

    fillLightFolder.addColor(guiObject.light,"color")
    .name("Color")
    .onChange(function(hexstring){
        console.log("Fill Color " + hexstring);
        fillLight.color.set(hexstring);
        render();
    });

    let backLightFolder = guiController.addFolder("BackLight");
    backLightFolder.add(guiObject.light,"visible")
    .name("switchOn")
    .onChange(function(flag){
        console.log("BackLight is " + (flag?"on":"off"));
        backLight.visible = flag;
        render();
    })

    backLightFolder.add(guiObject.light,"intensity").min(0).max(1).step(0.1)
    .name("Intensity")
    .onChange(function(val){
        console.log("Intensity: " + val);
        backLight.intensity = val;
        render();
    });

    backLightFolder.addColor(guiObject.light,"color")
    .name("Color")
    .onChange(function(hexstring){
        console.log("Back Color " + hexstring);
        backLight.color.set(hexstring);
        render();
    });

    keyLightFolder.close();
    fillLightFolder.close();
    backLightFolder.close();
}

function render() {
    renderer.render(scene, camera);
}

init();
render();