import '../../stylus/index.styl';

import {initStats} from "../../util/util";
const OrbitControls = require('three-orbitcontrols')

import * as THREE from 'three';
import * as dat from 'dat.gui';

function init(){
    let stats = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1, 1000);
    camera.position.set(65, 8,-10);
    let renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    scene.add(camera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    let  control = new OrbitControls( camera, renderer.domElement );
    control.addEventListener( 'change', render );
    control.minDistance = 30;
    control.maxDistance = 500;
    control.enablePan = false;

    let planeGeometry = new THREE.PlaneBufferGeometry(2000,2000);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0x808080});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - Math.PI * 0.5;
    plane.position.set(0,0,0);
    plane.receiveShadow = true;
    scene.add(plane);

    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
    let cubeMaterial = new THREE.MeshPhongMaterial({color:0x3896fe});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0,10,0);
    cube.castShadow = true;
    scene.add(cube);

    let ambientLight = new THREE.AmbientLight(0xc2c2c2);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.position.set(0,20,-10);
    directionalLight.shadow.camera.near = 10;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.target = cube;
    scene.add(directionalLight);

    let helper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(helper);

    let lightShadow = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(lightShadow);

    let controls = {
        lightColor: directionalLight.color.getHex(),
        castShadow: directionalLight.castShadow,
        x: directionalLight.position.x,
        y: directionalLight.position.y,
        z: directionalLight.position.z
    };

    let gui = new dat.GUI();
    gui.addColor(controls, 'lightColor');
    gui.add(controls, 'castShadow');
    let positionGUI = gui.addFolder('position');
    positionGUI.add(controls, 'x', -20, 20);
    positionGUI.add(controls, 'y', 0, 20);
    positionGUI.add(controls, 'z', -20, 20);

    function render(){
        stats.update();
        helper.update();
        lightShadow.update();
        directionalLight.color.setHex(controls.lightColor);
        directionalLight.castShadow = controls.castShadow;
        directionalLight.position.set(controls.x, controls.y, controls.z);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    control.target.copy(cube.position);
    control.update();
    render();
}

init();