import '../../stylus/index.styl'
import * as THREE from 'three'
import {initTrackballControls, initThree, initStats} from "../../util/util"
import {TGALoader} from "../../libs/loaders/TGALoader"

function init () {
    let stats = initStats();
    let {camera, renderer, scene} = initThree();
    let trackballControls = initTrackballControls(camera, renderer);

    let light = new THREE.SpotLight(0xffffff);
    light.position.set(-50, 80, 70);
    scene.add(light);
    let ambientLight = new THREE.AmbientLight(0xdddddd, 0.5);
    scene.add(ambientLight);

    let loader = new TGALoader();
    let texture = loader.load('../../static/modules/tga/crate_color8.tga');
    let boxGeometry = new THREE.BoxBufferGeometry(20,20, 20);
    let material = new THREE.MeshPhongMaterial({
        map: texture,
        color: 0xffffff
    });
    let box  = new THREE.Mesh(boxGeometry, material);
    scene.add(box);

    let render = () => {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

init();