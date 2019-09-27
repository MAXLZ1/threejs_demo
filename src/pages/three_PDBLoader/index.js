import '../../stylus/index.styl'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initThree, initStats, initTrackballControls} from '../../util/util'
import {PDBLoader} from '../../libs/loaders/PDBLoader'
import {CSS2DObject, CSS2DRenderer} from '../../libs/CSS2DRenderer'
const path = '../../static/modules/molecules/';
const MODULES = [
    'Al2O3.pdb',
    'aspirin.pdb',
    'buckyball.pdb',
    'caf2.pdb',
    'caffeine.pdb',
    'cholesterol.pdb',
    'cocaine.pdb',
    'cu.pdb',
    'cubane.pdb',
    'diamond.pdb',
    'ethanol.pdb',
    'glucose.pdb',
    'graphite.pdb',
    'lsd.pdb',
    'lycopene.pdb',
    'nacl.pdb',
    'nicotine.pdb',
    'ybco.pdb'
];

async function init () {
    let stats = initStats();
    let {camera, renderer, scene} = initThree();
    camera.position.z = 1000;
    let trackballControls = initTrackballControls(camera, renderer);

    let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    let light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light2.position.set( - 1, - 1, -1 );
    scene.add( light2 );

    let loader = new PDBLoader();
    let offset = new THREE.Vector3();
    let root = new THREE.Group();
    let labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild( labelRenderer.domElement );
    scene.add(root);
    let load = (url) => new Promise((resolve, reject) => {
        loader.load(url, (pdb) => {
            if (pdb) {
                let {geometryAtoms, geometryBonds, json} = pdb;
                let boxGeometry = new THREE.BoxBufferGeometry(1,1,1);
                let sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 3);
                geometryAtoms.computeBoundingBox();
                geometryAtoms.boundingBox.getCenter(offset).negate();
                geometryAtoms.translate(offset.x, offset.y, offset.z);
                geometryBonds.translate(offset.x, offset.y, offset.z);
                let positions = geometryAtoms.getAttribute( 'position' );
                let colors = geometryAtoms.getAttribute( 'color' );
                let position = new THREE.Vector3();
                let color = new THREE.Color();
                // 创建原子
                for (let i = 0; i < positions.count; i++) {
                    position.set(positions.getX(i), positions.getY(i), positions.getZ(i));
                    color.setRGB(colors.getX(i), colors.getY(i), colors.getZ(i));
                    let material = new THREE.MeshPhongMaterial({color});
                    let obj = new THREE.Mesh(sphereGeometry, material);
                    obj.position.copy(position);
                    obj.position.multiplyScalar( 75 );
                    obj.scale.multiplyScalar( 25 );
                    root.add(obj);
                    let  atom = json.atoms[ i ];
                    let text = document.createElement( 'div' );
                    text.className = 'label';
                    text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
                    text.textContent = atom[ 4 ];
                    let label = new CSS2DObject( text );
                    label.position.copy( obj.position );
                    root.add( label );
                }

                positions = geometryBonds.getAttribute( 'position' );
                let start = new THREE.Vector3();
                let end = new THREE.Vector3();
                // 创建原子间的键
                for (let i = 0; i < positions.count; i+=2) {
                    start.set(positions.getX(i), positions.getY(i), positions.getZ(i));
                    end.set(positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1));
                    start.multiplyScalar( 75 );
                    end.multiplyScalar( 75 );
                    let obj = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
                    obj.position.copy( start );
                    obj.position.lerp( end, 0.5 );
                    obj.scale.set( 5, 5, start.distanceTo( end ) );
                    obj.lookAt( end );
                    root.add( obj );
                }
                resolve(pdb);
            } else {
                reject(new Error(`${url}读取失败！`));
            }
        });
    });
    await load(path+'caffeine.pdb');

    let gui = new dat.GUI();
    let controls = {
        modules: 'caffeine.pdb'
    };
    gui.add(controls, 'modules', MODULES).onChange(async item => {
        while (root.children.length > 0) {
            let object = root.children[ 0 ];
            object.parent.remove( object );
        }
        await load(path + item);
    });
    
    let render = () => {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    render();
}

init();