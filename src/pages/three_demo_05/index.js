import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initStats} from '../../util/util'

function init() {
    let stats = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    scene.add(camera);

    let planeGeomerty = new THREE.PlaneGeometry(60,40,1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeomerty, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let spotLight = new THREE.SpotLight(0xffffff, 1,180, Math.PI / 4);
    spotLight.castShadow = true;
    spotLight.position.set(-30, 40, -10);
    spotLight.shadow.mapSize.set(2048, 2048);
    scene.add(spotLight);

    let ambientLight = new THREE.AmbientLight(0x606008, 1);
    scene.add(ambientLight);

    let gui = new dat.GUI();
    let controls = new function(){
        this.intensity = ambientLight.intensity;
        this.ambientColor = ambientLight.color.getStyle();
    };
    gui.add(controls, 'intensity', 0, 1).onChange(value => {
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity;
    });
    gui.addColor(controls, 'ambientColor').onChange(value => {
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity;
    });

    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.x = 2;
    cube.position.y = 2;
    cube.position.z = 2;
    scene.add(cube);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(scene.position);
    document.body.appendChild(renderer.domElement);
    render();
    function render(){
        stats.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}

window.onload = init();