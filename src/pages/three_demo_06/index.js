import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initStats,initTrackballControls} from '../../util/util'

function init() {
    let stats = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    scene.add(camera);

    let planeGeomerty = new THREE.PlaneGeometry(60,40,1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeomerty, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.set(2048, 2048);
    pointLight.decay = 0.1
    scene.add(pointLight);
    // 光源辅助线
    let helper = new THREE.PointLightHelper(pointLight);
    scene.add(helper);
    // 阴影辅助线
    let shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera)
    scene.add(shadowHelper)

    let ambientLight = new THREE.AmbientLight(0x353535, 1);
    scene.add(ambientLight);
    // 创建球模拟光源
    let sphereLight = new THREE.SphereGeometry(0.2);
    let sphereLightMaterial = new THREE.MeshBasicMaterial({
        color: 0xac6c25
    });
    let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.position.set(0, 8, 2);
    scene.add(sphereLightMesh);

    let gui = new dat.GUI();
    let controls = new function(){
        this.intensity = pointLight.intensity;
        this.pointColor = pointLight.color.getStyle();
        this.distance = pointLight.distance;
        this.visible = pointLight.visible;
    };
    gui.add(controls, 'intensity', 0, 2).onChange(value => {
        pointLight.color = new THREE.Color(controls.pointColor);
        pointLight.intensity = controls.intensity;
    });
    gui.addColor(controls, 'pointColor').onChange(value => {
        pointLight.color = new THREE.Color(controls.pointColor);
        pointLight.intensity = controls.intensity;
    });
    gui.add(controls, 'distance', 0, 100);
    gui.add(controls, 'visible');
    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.x = 2;
    cube.position.y = 2;
    cube.position.z = 2;
    scene.add(cube);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(scene.position);
    document.body.appendChild(renderer.domElement);
    let trackballControls = initTrackballControls(camera, renderer);
    let step = 0;
    function render(){
        helper.update();
        shadowHelper.update();
        stats.update();
        trackballControls.update();
        step += 0.01;
        sphereLightMesh.position.x = 20 + (10 * Math.cos(step));
        sphereLightMesh.position.y = 2 + (10* Math.abs(Math.sin(step)));
        sphereLightMesh.translateX(-18);
        // 球的位置赋给光源
        pointLight.position.copy(sphereLightMesh.position);
        pointLight.distance = controls.distance;
        pointLight.visible = controls.visible;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

window.onload = init();