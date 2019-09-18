import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initTrackballControls, initThree, initStats} from "../../util/util"

async function init() {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();

    let gui = new dat.GUI();
    let storage = {};
    let objLoader = new THREE.ObjectLoader();

    function load() {
        return new Promise((resolve, reject) => {
            objLoader.load('../../static/json/trousKnot.json', (obj) => {
                obj.position.set(20, 0, 0);
                scene.add(obj);
                resolve(obj);
            }, null, (err) => {
                reject(err);
            });
        })
    }

    let torusKnot = await load();
    let controls = {
        save: function () {
            let json = torusKnot.toJSON();
            storage.torusKnot = json;
        },
        load: function () {
            if (storage.torusKnot) {
                let obj = objLoader.parse(storage.torusKnot);
                obj.position.set(-20, 0, 0);
                scene.add(obj);
            }
        }
    };
    gui.add(controls, 'save');
    gui.add(controls, 'load');
    let trackballControls = initTrackballControls(camera, renderer);

    function render() {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    render();
}

init();