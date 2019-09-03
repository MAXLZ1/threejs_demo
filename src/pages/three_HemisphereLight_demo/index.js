import '../../stylus/index.styl';
import image from '../../assets/images/grasslight-big.jpg'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {initStats,initTrackballControls} from "../../util/util";

function init() {
    let stats = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(-30,30,30);
    let renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let textureGrass = new THREE.TextureLoader().load(image);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(10, 10);
    let planeGeometry = new THREE.PlaneBufferGeometry(500, 500,20,20);
    let planeMaterial = new THREE.MeshLambertMaterial({
        map: textureGrass
    });
    let plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,0,0);
    scene.add(plane);

    let spotLight = new THREE.SpotLight(0xcccccc);
    spotLight.position.set(-40, 60, -10);
    scene.add(spotLight);

    let hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    hemisphereLight.castShadow = true;
    hemisphereLight.position.set( 0, 500, 0 );
    scene.add(hemisphereLight);

    let dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(30, 10, -50);
    dirLight.castShadow = true;
    dirLight.target = plane;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.mapSize.set(2048, 2048);
    scene.add(dirLight);

    let ambientLight = new THREE.AmbientLight(0xc2c2c2);
    scene.add(ambientLight);

    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff3333
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.set(-4,3,0);
    scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
    let sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x7777ff
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10,5,10);
    sphere.castShadow = true;
    scene.add(sphere);
    let gui = new dat.GUI();
    let controls = {
        visible: hemisphereLight.visible,
        skyColor: hemisphereLight.color.getStyle(),
        groundColor: hemisphereLight.groundColor.getStyle(),
        intensity: hemisphereLight.intensity
    };
    gui.add(controls, 'visible');
    gui.addColor(controls, 'skyColor');
    gui.addColor(controls, 'groundColor');
    gui.add(controls, 'intensity', 0, 2);
    let trackballControl = initTrackballControls(camera, renderer);
    function render(){
        stats.update();
        trackballControl.update();
        hemisphereLight.visible = controls.visible;
        hemisphereLight.color = new THREE.Color(controls.skyColor);
        hemisphereLight.groundColor = new THREE.Color(controls.groundColor);
        hemisphereLight.intensity = controls.intensity;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}
init();