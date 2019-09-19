import '../../stylus/index.styl'
import * as THREE from 'three'
import {initTrackballControls, initThree, initStats} from "../../util/util";
import {BabylonLoader} from "../../libs/loaders/BabylonLoader";
import {MeshPhongMaterial} from "../../libs/three.module";

async function init () {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();
    let trackballControls = initTrackballControls(camera, renderer);
    camera.position.set(0, 10, 100);

    let ambientLight = new THREE.AmbientLight(0xcccccc, 0.3);
    scene.add(ambientLight);

    let babylonLoader = new BabylonLoader();
    babylonLoader.setPath('../../static/modules/babylon/');
    let load = () => new Promise((resolve, reject) => {
        babylonLoader.load('skull.babylon', (object) => {
            resolve(object);
        }, null, (err) => {
            reject(err);
        });
    }) ;
    let obj = await load();
    obj.traverse((item) => {
        if (item.isMesh) {
            item.material = new MeshPhongMaterial({
                color: 0xffffff * Math.random()
            })
        }
    });
    // 重新设置对象位置
    obj.children.forEach( item => {
        if (item.type === 'Mesh') {
            item.position.set(0,0,0);
        }
    });
    scene.add(obj);

    function render() {
        stats.update();
        trackballControls.update();
        obj.rotation.y += 0.005;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

init();