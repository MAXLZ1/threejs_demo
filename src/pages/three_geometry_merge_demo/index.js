import '../../stylus/index.styl'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {initTrackballControls, initStats, initThree} from "../../util/util";

function init () {
    let stats = initStats();
    let {scene, camera, renderer} = initThree();
    camera.position.set(-100, 100, 80);
    let cubeMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.8
    });
    let addCube = () => {
        let cubeGeometry =  new THREE.BoxGeometry(4,4,4,4);
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = - 100 + Math.round(Math.random() * 200);
        cube.position.y =  Math.round(Math.random() * 10);
        cube.position.z = - 100 + Math.round(Math.random() * 200);
        return cube;
    };

    for (let i = 0; i < 500; i++) {
        scene.add(addCube());
    }

    let gui = new dat.GUI();
    let guiControls = {
        cubeNumber: 500,
        merge: false,
        redraw: function () {
            let removeArr = [];
            scene.children.forEach(item => {
                item instanceof THREE.Mesh && removeArr.push(item);
            });
            removeArr.forEach(item => scene.remove(item));
            if ( this.merge ) {
                let geometry = new THREE.Geometry();
                for (let i = 0; i < this.cubeNumber; i++) {
                    let cubeMesh = addCube();
                    cubeMesh.updateMatrix();
                    geometry.merge(cubeMesh.geometry, cubeMesh.matrix);
                }
                scene.add(new THREE.Mesh(geometry, cubeMaterial));
            } else {
                for (let i = 0; i < this.cubeNumber; i++) {
                    scene.add(addCube());
                }
            }
            addCube();
        }
    };
    gui.add(guiControls, 'cubeNumber');
    gui.add(guiControls, 'merge');
    gui.add(guiControls, 'redraw');
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