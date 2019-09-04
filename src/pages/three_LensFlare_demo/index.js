import '../../stylus/index.styl'
import * as THREE from 'three';
import image1 from '../../assets/images/lensflare0.png';
import image2 from '../../assets/images/lensflare3.png';
import {Lensflare,LensflareElement} from "../../libs/Lensflare";
import * as dat from 'dat.gui';
import {initStats,initTrackballControls} from "../../util/util";

function init(){
    let states = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(-40,30,30);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    scene.add(camera);

    let planeGeometry = new THREE.PlaneGeometry(100,100,1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - 0.5 * Math.PI;
    plane.position.set(0,0,0);
    plane.receiveShadow = true;
    scene.add(plane);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(30, 30, 0);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let ambienLight = new THREE.AmbientLight(0xc2c2c2, 0.2);
    scene.add(ambienLight);

    // 光晕
    let textureLoader = new THREE.TextureLoader();
    let textureFlare1 = textureLoader.load( image1 );
    let textureFlare2 = textureLoader.load( image2 );
    let pointLight = new THREE.PointLight( 0xff0000, 1.5, 2000 );
    pointLight.position.set( 15, 15, 0 );
    scene.add( pointLight );
    let lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare1, 100, 0, pointLight.color ) );
    lensflare.addElement( new LensflareElement( textureFlare2, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare2, 70, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare2, 120, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare2, 70, 1 ) );
    pointLight.add( lensflare );

    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });

    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(2,4, 2);
    cube.castShadow = true;
    scene.add(cube);

    camera.lookAt(scene.position);
    let trackballControls = initTrackballControls(camera, renderer);
    function render() {
        states.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
    render();
}

init();