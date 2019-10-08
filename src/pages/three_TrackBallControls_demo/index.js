import '../../stylus/index.styl'
import * as THREE from 'three'
import {initThree, initStats} from "../../util/util"
import {TrackballControls} from "../../libs/contorls/TrackballControls"

function init () {
    let stats = initStats();
    let {camera, renderer, scene} = initThree();
    camera.position.set(400,400,400);

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let addObjs = () => {
        for (let i = 0; i < 300; i++) {
            let boxGeometry = new THREE.BoxBufferGeometry(Math.random()*10+10, Math.random()*10 + 5,Math.random()*10 + 2);
            let boxMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random())
            });
            let box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(Math.random()*300 - 150, Math.random()*300 - 150, Math.random()*300 - 150);
            box.castShadow = true;
            scene.add(box);
        }
    };

    addObjs();

    let controls = new TrackballControls(camera, renderer.domElement);
    // 旋转速度
    controls.rotateSpeed = 2.0;
    // 变焦速度
    controls.zoomSpeed = 2.2;
    // 平移速度
    controls.panSpeed = 1.8;
    // 是否不缩放
    controls.noZoom = false;
    // 是否不平移
    controls.noPan = false;
    // 是否开启移动惯性
    controls.staticMoving = true;
    // 动态阻尼系数 就是灵敏度
    controls.dynamicDampingFactor = 0.3;
    // 设置最大距离
    controls.maxDistance = 600;

    let render = () => {
        stats.update();
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
}

init();