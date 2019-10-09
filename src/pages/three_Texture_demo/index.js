import '../../stylus/index.styl'
import * as THREE from 'three'
import {initThree, initStats, initTrackballControls} from "../../util/util"

function init(){
    let stats = initStats();
    let {renderer, scene, camera} = initThree();
    let trackballControls = initTrackballControls(camera, renderer);
    camera.position.set(-30, 90, 100);

    let planeGeometry = new THREE.PlaneBufferGeometry(500, 500);
    let planeTexture = new THREE.TextureLoader().load('../../static/general/floor-wood.jpg');
    let planeMaterial = new THREE.MeshPhongMaterial({
        map:planeTexture
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - Math.PI / 2;
    plane.position.set(0,0,0);
    plane.receiveShadow = true;
    scene.add(plane);

    let spotLight = new THREE.SpotLight( 0xffffff);
    spotLight.position.set( 15, 100, 55 );
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.05;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    scene.add( spotLight );
    let ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);

    let stoneTexture = new THREE.TextureLoader().load('../../static/stone/stone.jpg');
    let bumpStoneTexture = new THREE.TextureLoader().load('../../static/stone/stone-bump.jpg');
    let boxGeometry1 = new THREE.BoxBufferGeometry(30,30,30);
    let boxMaterial1 = new THREE.MeshPhongMaterial({
        map: stoneTexture
    });
    let box1 = new THREE.Mesh(boxGeometry1, boxMaterial1);
    box1.position.set(-40, 15, -20);
    box1.castShadow = true;
    scene.add(box1);
    let boxMaterial2 = new THREE.MeshPhongMaterial({
        map: stoneTexture,
        bumpMap: bumpStoneTexture,
        bumpScale: 0.2
    });
    let box2 = new THREE.Mesh(boxGeometry1, boxMaterial2);
    box2.position.set(10, 15, -20);
    box2.castShadow = true;
    scene.add(box2);

    let boxMaterial3 = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../../static/general/plaster.jpg')
    });
    let box3 = new THREE.Mesh(boxGeometry1, boxMaterial3);
    box3.position.set(-40, 15,30);
    box3.castShadow = true;
    scene.add(box3);
    let boxMaterial4 = boxMaterial3.clone();
    boxMaterial4.normalMap = new THREE.TextureLoader().load('../../static/general/plaster-normal.jpg');
    let box4 = new THREE.Mesh(boxGeometry1, boxMaterial4);
    box4.position.set(10, 15,30);
    box4.castShadow = true;
    scene.add(box4);

    let render = () => {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
}

init();
