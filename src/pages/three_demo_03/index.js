import '../../stylus/index.styl'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {initStats,initTrackballControls, createMultiMaterialObject} from '../../util/util';

function init() {
    let stats = initStats();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    scene.add(camera);

    let axes = new THREE.AxesHelper(30);
    scene.add(axes);

    let planeGeometry = new THREE.PlaneGeometry(60, 40,1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let ambientLight = new THREE.AmbientLight(0x494949);
    scene.add(ambientLight);

    let verties = [
        new THREE.Vector3(1,4,1),
        new THREE.Vector3(1,4,-1),
        new THREE.Vector3(1,0,1),
        new THREE.Vector3(1,0,-1),
        new THREE.Vector3(-1,4,-1),
        new THREE.Vector3(-1,4,1),
        new THREE.Vector3(-1,0,-1),
        new THREE.Vector3(-1,0,1)
    ];
    let faces = [
        new THREE.Face3(0,2,1),
        new THREE.Face3(2,3,1),
        new THREE.Face3(4,6,5),
        new THREE.Face3(6,7,5),
        new THREE.Face3(4,5,1),
        new THREE.Face3(5,0,1),
        new THREE.Face3(7,6,2),
        new THREE.Face3(6,3,2),
        new THREE.Face3(5,7,0),
        new THREE.Face3(7,2,0),
        new THREE.Face3(1,3,4),
        new THREE.Face3(3,6,4)
    ];
    let geometry = new THREE.Geometry();
    geometry.vertices = verties;
    geometry.faces = faces;
    geometry.computeFaceNormals();
    let materials = [
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
        new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
    ];
    let mesh = createMultiMaterialObject(geometry, materials);
    mesh.castShadow = true;
    mesh.children.forEach(item => item.castShadow = true);
    scene.add(mesh);

    let spotLight = new THREE.SpotLight(0xffffff,1,150,120);
    // 阴影贴图设置,值越大，阴影越清晰，占用资源也越大
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.position.set(-40, 30, 30);
    spotLight.castShadow = true;
    spotLight.lookAt(mesh);
    scene.add(spotLight);

    camera.position.x = -20;
    camera.position.y = 25;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(5, 0, 0));
    document.body.appendChild(renderer.domElement);
    let trackballControls = initTrackballControls(camera, renderer);
    let controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));
    function render () {
        stats.update();
        trackballControls.update();
        let verties = [];
        controlPoints.forEach(point => {
            verties.push(new THREE.Vector3(point.x, point.y, point.z));
        });
        mesh.children.forEach(function (e) {
            e.geometry.vertices = verties;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
            delete e.geometry.__directGeometry
        });
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
    function addControl(x,y,z){
        return new function(){
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    let gui = new dat.GUI();
    gui.add(new function(){
        this.clone = function(){
            let clonedGeometry = mesh.children[0].geometry.clone();
            let materials = [
                new THREE.MeshLambertMaterial({opacity: 0.8, color: 0xff44ff, transparent: true}),
                new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
            ];

            let mesh2 = createMultiMaterialObject(clonedGeometry, materials);
            mesh2.children.forEach(function (e) {
                e.castShadow = true
            });

            mesh2.translateX(5);
            mesh2.translateZ(5);
            mesh2.name = "clone";
            scene.remove(scene.getChildByName("clone"));
            scene.add(mesh2);
        }
    }, 'clone');
    for(let i = 0; i < 8; i++) {
        let folder = gui.addFolder(`顶点${i+1}`);
        folder.add(controlPoints[i], 'x', -10, 10);
        folder.add(controlPoints[i], 'y', -10, 10);
        folder.add(controlPoints[i], 'z', -10, 10);
    }
}

window.onload = init();