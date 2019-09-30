import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {FirstPersonControls} from '../../libs/contorls/FirstPersonControls'
import {initTrackballControls, initThree, initStats} from "../../util/util"

function init() {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();
    camera.far = 5000;
    camera.position.set(0, 110, 0);

    let light = new THREE.SpotLight(0xffffff);
    light.shadow.mapSize.set(2048, 2048);
    light.castShadow = true;
    light.position.set(-700, 440, 730);
    scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xdddddd, 0.4);
    scene.add(ambientLight);

    let planeGeometry = new THREE.PlaneBufferGeometry(14000, 10000);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let getBoxes = () => {
        for (let i = 0; i < 300; i++) {
            let boxGeometry = new THREE.BoxBufferGeometry(20, Math.round(Math.random()*100 + 50), 20);
            let boxMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                transparent: true,
                opacity: 0.7
            });
            let box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(Math.random()*-1390 + 690, box.geometry.parameters.height/2, Math.random()*-990 + 490);
            scene.add(box);
        }
    };
    getBoxes();

    let controls = new FirstPersonControls(camera, document.body);
    controls.lookSpeed = 0.2; //鼠标移动查看的速度
    controls.movementSpeed = 30; //相机移动速度
    controls.noFly = true;
    controls.constrainVertical = true; //约束垂直
    controls.verticalMin = 1.0;
    controls.verticalMax = 2.0;
    controls.lon = 0; //进入初始视角x轴的角度
    controls.lat = 0; //初始视角进入后y轴的角度

    let clock = new THREE.Clock();
    let render = () => {
        stats.update();
        controls.update(clock.getDelta());
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
        stats.update();

    }
    render();
}

init();

