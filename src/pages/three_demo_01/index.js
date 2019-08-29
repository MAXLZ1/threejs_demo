import './index.styl';
import * as THREE from 'three';
import Stats from 'stats-js';
import * as dat from 'dat.gui';

window.onload = init();
var scence;
var camera;
var renderer;
function init() {
    var stats = initStats();
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    // 创建场景
    scence = new THREE.Scene();
    // 创建相机
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        0.1,
        1000);
    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // 轴
    var axes = new THREE.AxisHelper(20);
    scence.add(axes);
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5*Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 5;
    cube.position.z = 0;
    cube.castShadow = true;

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;


    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024,1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;

    scence.add(plane);
    scence.add(cube);
    scence.add(sphere);
    scence.add(spotLight);

    var ambienLight = new THREE.AmbientLight(0x353535);
    scence.add(ambienLight);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scence.position);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    renderScence();
    var step = 0;
    function renderScence() {
        stats.update();
        // 立方体旋转
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        // 小球跳动
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * Math.cos(step));
        sphere.position.y = 2 + (10* Math.abs(Math.sin(step)));
        requestAnimationFrame(renderScence);
        renderer.render(scence, camera);
    }

}
window.addEventListener('resize', onResize, false);
function initStats(){
    var stats = new Stats();
    stats.showPanel(0);
    document.getElementById('Stats-output').appendChild(stats.domElement);
    return stats;
}
function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}