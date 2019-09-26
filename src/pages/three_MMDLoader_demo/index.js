import '../../stylus/index.styl'
import * as THREE from 'three'
import {initTrackballControls, initThree, initStats} from "../../util/util";
const AmmoObj = require('../../libs/ammo');
import {MMDLoader} from "../../libs/loaders/MMDLoader";
import {MMDAnimationHelper} from "../../libs/animation/MMDAnimationHelper";
import {OutlineEffect} from '../../libs/OutlineEffect';
AmmoObj().then( function ( AmmoLib ) {
    Ammo = AmmoLib;
    init();
} );

async function init() {
    let stats = initStats();
    let {camera, scene, renderer} = initThree({
        color: 0xffffff
    });
    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

    let ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
    scene.add(ambientLight);

    let directionLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionLight.position.set(20, 40, 30);
    directionLight.castShadow = true;
    directionLight.shadow.mapSize.set(2048, 2048);
    directionLight.shadow.camera.near = 10;
    directionLight.shadow.camera.far = 70;
    directionLight.shadow.camera.left = -10;
    directionLight.shadow.camera.right = 10;
    directionLight.shadow.camera.top = 30;
    directionLight.shadow.camera.bottom = -10;
    scene.add(directionLight);

    // let helperLight = new THREE.DirectionalLightHelper(directionLight);
    // scene.add(helperLight);
    //
    // let lightShadow = new THREE.CameraHelper(directionLight.shadow.camera);
    // scene.add(lightShadow);

    let planeGeometry = new THREE.PlaneBufferGeometry(60,60, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let mmdLoader = new MMDLoader();
    let load = () => new Promise((resolve, reject) => {
        mmdLoader.loadWithAnimation('../../static/modules/mmd/miku/miku_v2.pmd',
            ['../../static/modules/mmd/vmds/wavefile_v2.vmd'], (object) => {
            resolve(object);
        }, null, (error) => {
            reject(error);
        });
    });
    let obj = await load();
    let {mesh, animation} = obj;
    directionLight.target = mesh;
    mesh.castShadow = true;
    scene.add(mesh);
    let helper = new MMDAnimationHelper();
    helper.add( mesh, {
        animation,
        physics: true
    });

    // let ikHelper = helper.objects.get( mesh ).ikSolver.createHelper();
    // ikHelper.visible = false;
    // scene.add( ikHelper );
    //
    // let physicsHelper = helper.objects.get(mesh).physics.createHelper();
    // physicsHelper.visible = false;
    // scene.add( physicsHelper );


    function render() {
        stats.update();
        trackballControls.update();
        helper.update(clock.getDelta());
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

