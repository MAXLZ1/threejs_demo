import '../../stylus/index.styl'
import * as THREE from 'three'
import { initThree, initStats} from "../../util/util"
import {OBJLoader} from "../../libs/loaders/OBJLoader"
import {FlyControls} from "../../libs/contorls/FlyControls"

function init (){
    let stats = initStats();
    let {scene, camera, renderer} = initThree();
    camera.position.set(-100, 10, 90);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-300, 300, 130);
    scene.add(spotLight);

    let loader = new OBJLoader();
    loader.load('../../static/modules/city/city.obj', (obj) => {
        setRandomColors(obj);
        scene.add(obj);
    });

    let controls = new FlyControls(camera, renderer.domElement);
    controls.rollSpeed = Math.PI / 12; // 翻滚速度
    controls.autoForward = true; //自动向前移动
    controls.dragToLook = false;
    controls.movementSpeed = 25;
    let clock = new THREE.Clock();

    let render = () => {
        stats.update();
        controls.update(clock.getDelta());
        renderer.render(scene,camera);
        requestAnimationFrame(render);
    };
    render();
}

function setRandomColors(object) {
    let children = object.children;
    if (children && children.length > 0) {
        children.forEach(function (e) {
            setRandomColors(e)
        });
    } else {
        if (object.type === 'Mesh') {
            if (object.material instanceof Array) {
                object.material.forEach(function(m) {
                    m.color = new THREE.Color(Math.random(),Math.random(),Math.random());
                    if (m.name.indexOf("building") == 0) {
                        m.emissive = new THREE.Color(0x444444);
                        m.transparent = true;
                        m.opacity = 0.8;
                    }
                });
            } else {
                object.material.color = new THREE.Color(Math.random(),Math.random(),Math.random());
                if (object.material.name.indexOf("building") == 0) {
                    object.material.emissive = new THREE.Color(0x444444);
                    object.material.transparent = true;
                    object.material.opacity = 0.8;
                }
            }
        }
    }
}

init();