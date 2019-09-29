import '../../stylus/index.styl'
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import {initStats,initThree,initTrackballControls} from "../../util/util"

function init() {
    let stats = initStats();
    let {camera, renderer, scene} = initThree();
    let trackballControls = initTrackballControls(camera, renderer);

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-20, 40, 30);
    scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    let boxGeometry = new THREE.BoxBufferGeometry(10,10,10);
    let boxMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa12233
    });
    let box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.castShadow = true;
    scene.add(box);
    let size1 = {width: 10, height: 10, depth: 10};
    let size2 = {width: 5, height: 5, depth: 5};
    // 缩小
    let tween1 = new TWEEN.Tween(size1).to({width: 5, height: 5, depth: 5}, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            if (size1.width <= 5) {
                tween2.start();
            }
            box.geometry = new THREE.BoxBufferGeometry(size1.width, size1.height, size1.depth);
        });
    // 放大
    let tween2 = new TWEEN.Tween(size2).to({width: 10, height: 10, depth: 10}, 1000)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
            box.geometry = new THREE.BoxBufferGeometry(size2.width, size2.height, size2.depth);
            if (size2.width >= 10) {
                tween1.start();
            }
        });
    tween1.start();

    let render = () => {
        stats.update();
        trackballControls.update();
        renderer.render(scene, camera);
        TWEEN.update();
        requestAnimationFrame(render);
    }
    render();
}
init();