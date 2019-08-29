import '../../stylus/index.styl'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {initStats,initTrackballControls} from '../../util/util';

function init() {
    let stats =  initStats();
    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
        );
    // 添加白色雾化
    scene.fog = new THREE.Fog(0xffffff, 10, 100);
    scene.overrideMaterial = new THREE.MeshLambertMaterial({
        color: 0x3489fe
    });
    scene.add(camera);

    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // let axes = new THREE.AxesHelper(40);
    // scene.add(axes);

    let planeGeometry = new THREE.PlaneGeometry(60, 40, 1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    let spotLight = new THREE.SpotLight(0xffffff,1.2, 150, 120);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);

    camera.position.x = -30;
    camera.position.y = 50;
    camera.position.z = 40;
    camera.lookAt(scene.position);
    document.body.appendChild(renderer.domElement);
    let controls = new function() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;
        this.addCube = function () {
            let cubeSize = Math.ceil((Math.random() * 3));
            let cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
            let cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff * Math.random()
            });
            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
            cube.position.y = Math.ceil(Math.random() * 3) + 2;
            cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);
            cube.name = `cube-${this.numberOfObjects}`;
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };
        this.removeCube = function () {
            let allChilden = scene.children;
            let lastObject = allChilden[allChilden.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };
    };
    let gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'numberOfObjects').listen();
    let clock = new THREE.Clock();
    let trackballControls = initTrackballControls(camera, renderer);
    function render() {
        trackballControls.update();
        stats.update();
        scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj != plane) {
                obj.rotation.x += controls.rotationSpeed;
                obj.rotation.y += controls.rotationSpeed;
                obj.rotation.z += controls.rotationSpeed;
            }
        });
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

window.onload = init();