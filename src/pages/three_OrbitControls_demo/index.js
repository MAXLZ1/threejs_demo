import '../../stylus/index.styl'
import * as THREE from 'three'
import {initThree, initStats} from "../../util/util"
import {OrbitControls} from "../../libs/contorls/OrbitControls"

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

    let controls = new OrbitControls(camera, renderer.domElement);
    // 设置最大距离
    controls.maxDistance = 600;
    // 设置自动旋转
    controls.autoRotate = true;
    // 设置自动旋转速度
    controls.autoRotateSpeed = 2.0;

    let render = () => {
        stats.update();
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
}

init();