import '../../stylus/index.styl'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {initTrackballControls, initStats} from '../../util/util'

function init(){
    let stats = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    scene.add(camera);

    let axes = new THREE.AxesHelper(30);
    scene.add(axes);

    let planeGeometry = new THREE.PlaneGeometry(60, 40,1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5*Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    let cubeGeometry = new THREE.BoxGeometry(5,10,5);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x3896fe,
        opacity: .6
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = 2.5;
    cube.position.y = 5;
    cube.position.z = 2.5;
    cube.castShadow = true;
    scene.add(cube);

    let spotLight = new THREE.SpotLight(0xffffff,1,150,120);
    spotLight.shadow.mapSize = new THREE.Vector2(2048,2048);
    spotLight.position.set(-40, 40, 30);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let ambientLight = new THREE.AmbientLight(0x494949);
    scene.add(ambientLight);

    camera.position.x = -30;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    document.body.appendChild(renderer.domElement);
    // 添加控制变量
    let controls = new function(){
        this.positionX = 2.5;
        this.positionY = 5;
        this.positionZ = 2.5;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;
        this.visible = true;
        this.translate = function() {
            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);
            // 平移之后位置发生变化，重新给位置赋值
            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;
        };
    }
    let gui = new dat.GUI();
    let guiPosition = gui.addFolder('position');
    let posX = guiPosition.add(controls, 'positionX', -10, 10).listen();
    let posY = guiPosition.add(controls, 'positionY', 5, 10).listen();
    let posZ = guiPosition.add(controls, 'positionZ', -10, 10).listen();
    posX.onChange(value => cube.position.x = value);
    posY.onChange(value => cube.position.y = value);
    posZ.onChange(value => cube.position.z = value);
    let guiRotation = gui.addFolder('rotation');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);
    let guiScale = gui.addFolder('scale');
    guiScale.add(controls, 'scaleX', 0, 3);
    guiScale.add(controls, 'scaleY', 0, 3);
    guiScale.add(controls, 'scaleZ', 0, 3);
    let guiTranslate = gui.addFolder('translate');
    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', 5, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');
    gui.add(controls, 'visible');
    let trackballControls = initTrackballControls(camera, renderer);
    function render(){
        stats.update();
        trackballControls.update();
        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;
        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
        cube.visible = controls.visible;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();

}

window.onload = init();