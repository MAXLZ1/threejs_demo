import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import brickImage from '../../assets/images/brick_roughness.jpg'
import nx from '../../assets/images/nx.jpg';
import ny from '../../assets/images/ny.jpg';
import nz from '../../assets/images/nz.jpg';
import px from '../../assets/images/px.jpg';
import py from '../../assets/images/py.jpg';
import pz from '../../assets/images/pz.jpg';
import {initStats, initTrackballControls, initThree} from "../../util/util";
import {
    BackSide,
    CubeRefractionMapping,
    DoubleSide,
    FrontSide,
    RepeatWrapping, RGBFormat,
    TextureLoader
} from "../../libs/three.module";

function init(){
    let stats = initStats();
    let {camera, scene, renderer} = initThree({
        color: 0x444444
    });

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    let fog = new THREE.Fog(0xff0000, 0, 200);
    scene.fog = fog;
    // 创建环形管道
    let torusGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    let torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        skinning: true
    });
    let torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    // 创建贴图加载器
    let textureLoader = new THREE.TextureLoader();
    let cubeTextureLoader = new THREE.CubeTextureLoader();
    let maps = (function(){
        // 创建贴图
        let bricks = textureLoader.load(brickImage);
        bricks.wrapS = RepeatWrapping;
        bricks.wrapT = RepeatWrapping;
        bricks.repeat.set(9,1);
        return {
            none: null,
            bricks
        }
    })();

    let envMaps = (function(){
        let urls = [px, nx, py, ny, pz, nz];
        let reflection = cubeTextureLoader.load(urls);
        reflection.format = RGBFormat;
        let refraction = cubeTextureLoader.load(urls);
        refraction.format = RGBFormat;
        refraction.mapping = CubeRefractionMapping;
        return {
            none: null,
            reflection,
            refraction
        }
    })();

    let gui = new dat.GUI();
    let controls = {
        color: torusMaterial.color.getStyle(),
        alphaTest: torusMaterial.alphaTest,
        transparent: torusMaterial.transparent,
        opacity: torusMaterial.opacity,
        side: torusMaterial.side,
        depthTest:torusMaterial.depthTest,
        depthWrite: torusMaterial.depthWrite,
        fog: torusMaterial.fog,
        vertexColors: torusMaterial.vertexColors,
        wireframe: torusMaterial.wireframe,
        envMap: Object.keys(envMaps)[0],
        map: Object.keys(maps)[0],
        reflectivity: torusMaterial.reflectivity,
        refractionRatio: torusMaterial.refractionRatio
    };
    let fogControls = {
        fog: scene.fog != null,
        color: fog.color.getStyle()
    };
    let fogGui = gui.addFolder('THREE.Fog');
    let basicGui = gui.addFolder('Material');
    let selfGui = gui.addFolder('MeshBasicMaterial');
    let contains = {
        side: {
            'THREE.FrontSide': THREE.FrontSide,
            'THREE.BackSide': THREE.BackSide,
            'THREE.DoubleSide': THREE.DoubleSide
        },
        vertexColors: {
            'THREE.NoColors':THREE.NoColors,
            'THREE.VertexColors': THREE.VertexColors,
            'THREE.FaceColors': THREE.FaceColors
        }
    };
    fogGui.add(fogControls, 'fog').onChange(value => value ? scene.fog = fog : scene.fog = null);
    fogGui.addColor(fogControls, 'color').onChange(value => fog.color.setStyle(value));
    basicGui.addColor(controls, 'color').onChange(value => torusMaterial.color.setStyle(value));
    basicGui.add(controls, 'transparent').onChange(value => torusMaterial.transparent = value);
    basicGui.add(controls, 'alphaTest', 0, 1).onChange(value => torusMaterial.alphaTest = value);
    basicGui.add(controls, 'opacity', 0, 1).onChange(value => torusMaterial.opacity = value);
    basicGui.add(controls, 'fog').onChange(value => {
        torusMaterial.fog = value;
        torusMaterial.needsUpdate = true;
    });
    basicGui.add(controls, 'side', contains.side).onChange(value => {
        // 这里必须parseInt😡
        torusMaterial.side = parseInt(value);
        torusMaterial.needsUpdate = true;
    });
    basicGui.add(controls, 'depthTest').onChange(value => torusMaterial.depthTest = value);
    basicGui.add(controls, 'depthWrite').onChange(value => torusMaterial.depthWrite = value);
    basicGui.add(controls, 'vertexColors',contains.vertexColors).onChange(value => {
        torusMaterial.vertexColors = parseInt(value);
        torusMaterial.needsUpdate = true;
    });
    selfGui.add(controls, 'wireframe').onChange(value => torusMaterial.wireframe = value);
    selfGui.add(controls, 'map', Object.keys(maps)).onChange(value =>{
        torusMaterial.map = maps[value];
        torusMaterial.needsUpdate = true;
    });
    selfGui.add(controls, 'envMap', Object.keys(envMaps)).onChange(value => {
        torusMaterial.envMap = envMaps[value];
        torusMaterial.needsUpdate = true;
    });
    selfGui.add(controls, 'reflectivity', 0, 1).onChange(value => torusMaterial.reflectivity = value);
    selfGui.add(controls, 'refractionRatio', 0, 1).onChange(value => torusMaterial.refractionRatio = value);
    let trackballControls = initTrackballControls(camera, renderer);
    render();
    function render(){
        stats.update();
        trackballControls.update();
        torus.rotation.x += 0.005;
        torus.rotation.y += 0.005;
        torus.rotation.z += 0.005;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
init();