import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initTrackballControls, initThree, initStats} from "../../util/util";

function init(){
    let stats = initStats();
    let {camera, scene, renderer} = initThree();

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 30, 50);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(2048, 2048);
    scene.add(spotLight);

    let axes = new THREE.AxesHelper(20);
    scene.add(axes);

    let planeGeometry = new THREE.PlaneBufferGeometry(60, 40, 1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5*Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let cubeGeometry = new THREE.BoxBufferGeometry(5,5,5,5,5,5);
    let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff
    });
    let cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube1.position.set(-6, 5, 0);
    let cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube2.position.set(6, 5, 5);

    let group = new THREE.Group();
    group.add(cube1, cube2);
    scene.add(group);

    let gui = new dat.GUI();
    let cube1GUI = gui.addFolder('cube1');
    let cube2GUI = gui.addFolder('cube2');
    let groupGUI = gui.addFolder('group');
    let cube1Controls = {
        positionX: cube1.position.x,
        positionY: cube1.position.y,
        positionZ: cube1.position.z,
        scale: 1
    };
    let cube2Controls = {
        positionX: cube2.position.x,
        positionY: cube2.position.y,
        positionZ: cube2.position.z,
        scale: 1
    };
    let groupControls = {
        positionX: group.position.x,
        positionY: group.position.y,
        positionZ: group.position.z,
        scale: 1
    };
    cube1GUI.add(cube1Controls, 'positionX', -10, -6);
    cube1GUI.add(cube1Controls, 'positionY', 5, 10);
    cube1GUI.add(cube1Controls, 'positionZ', 0, 10);
    cube1GUI.add(cube1Controls, 'scale', 0, 3);
    cube2GUI.add(cube2Controls, 'positionX', 6, 10);
    cube2GUI.add(cube2Controls, 'positionY', 5, 10);
    cube2GUI.add(cube2Controls, 'positionZ', 5, 10);
    cube2GUI.add(cube2Controls, 'scale', 0, 3);
    groupGUI.add(groupControls, 'positionX', -10, 10);
    groupGUI.add(groupControls, 'positionY', 0, 10);
    groupGUI.add(groupControls, 'positionZ', -10, 10);
    groupGUI.add(groupControls, 'scale', 0, 3);
    let trackballControls = initTrackballControls(camera, renderer);
    function render(){
        stats.update();
        trackballControls.update();
        cube1.position.set(cube1Controls.positionX, cube1Controls.positionY, cube1Controls.positionZ);
        cube1.scale.set(cube1Controls.scale, cube1Controls.scale, cube1Controls.scale);
        cube2.position.set(cube2Controls.positionX, cube2Controls.positionY, cube2Controls.positionZ);
        cube2.scale.set(cube2Controls.scale, cube2Controls.scale, cube2Controls.scale);
        group.position.set(groupControls.positionX, groupControls.positionY, groupControls.positionZ);
        group.scale.set(groupControls.scale, groupControls.scale, groupControls.scale);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}
init();