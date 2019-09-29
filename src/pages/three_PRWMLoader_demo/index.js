import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initTrackballControls, initThree, initStats} from "../../util/util";
import {PRWMLoader} from "../../libs/loaders/PRWMLoader";

async function init () {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();
    let trackballControls = initTrackballControls(camera, renderer);
    camera.position.set(0, 0, 10);
    let loader = new PRWMLoader();
    let load = (url) => new Promise((resolve, reject) => {
        loader.load(url, (bufferGeometry) => {
            let object = new THREE.Mesh( bufferGeometry, new THREE.MeshNormalMaterial() );
            scene.add( object );
            resolve(object);
        });
    });
    let obj = await load('../../static/modules/prwm/faceted-nefertiti.be.prwm');
    let render = () => {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    let gui = new dat.GUI();
    let controls = {
        modules: 'faceted-nefertiti.be.prwm'
    };
    gui.add(controls, 'modules', [
        'faceted-nefertiti.be.prwm',
        'faceted-nefertiti.le.prwm',
        'smooth-suzanne.be.prwm',
        'smooth-suzanne.le.prwm',
        'vive-controller.be.prwm',
        'vive-controller.le.prwm'
    ]).onChange(async item => {
        scene.remove(obj);
        obj = await load(`'../../static/modules/prwm/${item}`);
    });

    render();
}

init();