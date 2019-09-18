import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initTrackballControls, initThree, initStats} from "../../util/util"
import {LegacyJSONLoader} from "../../libs/LegacyJSONLoader"

function init() {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 200, 300);
    spotLight.shadow.camera.far = 1400;
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    let planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let jsonLoader = new LegacyJSONLoader();
    jsonLoader.load('../../static/modules/house/house.json', (geo, mater) => {
        let house = new THREE.Mesh(geo, mater);
        house.castShadow  = true;
        house.receiveShadow = true;
        house.position.set(0,2,15);
        scene.add(house);
        spotLight.target = house;
    });

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