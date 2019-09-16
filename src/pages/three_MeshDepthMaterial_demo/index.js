import '../../stylus/index.styl'

import {initStats,initThree,initTrackballControls} from "../../util/util";
import * as THREE from 'three'
import * as dat from 'dat.gui'

function init(){
    let {camera, scene, renderer} = initThree({
        color: 0x444444
    });
    camera.near = 15;
    camera.updateProjectionMatrix();
    let stats = initStats();

    let torusGeometry = new THREE.TorusKnotGeometry(10,3, 100, 16);
    let torusMaterial = new THREE.MeshDepthMaterial();
    let torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    let gui = new dat.GUI();
    let controls = {
        near: camera.near,
        far: camera.far
    };
    let cameragui = gui.addFolder('camera');
    cameragui.add(controls,'near', 0, 50).onChange(value => {
        camera.near = value;
        camera.updateProjectionMatrix()
    });
    cameragui.add(controls, 'far', 0, 1000).onChange(value => {
        camera.far = value;
        camera.updateProjectionMatrix();
    });

    let trackballControls = initTrackballControls(camera, renderer);
    render();
    function render(){
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
init();