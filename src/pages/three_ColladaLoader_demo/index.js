import '../../stylus/index.styl'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initThree, initStats} from "../../util/util";
import {ColladaLoader} from "../../libs/loaders/ColladaLoader";
import {Vector3} from "../../libs/three.module";

async function init () {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();
    camera.position.set(8, 10, 8);
    camera.lookAt(new Vector3(0,3,0));

    let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    let directionLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionLight.position.set(1,1,0).normalize();
    scene.add(directionLight);

    let colladaLoader = new ColladaLoader();
    let load = () => new Promise((resolve, reject) => {
        colladaLoader.setPath('../../static/modules/elf/');
        colladaLoader.load('elf.dae', (object) => {
            resolve(object);
        }, null, (err) => {
            reject(err);
        });
    });
    let obj = (await load()).scene;
    scene.add(obj);
    function render(){
        stats.update();
        obj.rotation.z += 0.01;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}
init();