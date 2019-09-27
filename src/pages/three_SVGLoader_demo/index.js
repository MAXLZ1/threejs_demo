import * as THREE from 'three'
import {initTrackballControls, initThree, initStats} from "../../util/util";
import {SVGLoader} from '../../libs/loaders/SVGLoader'

async function init () {
    let stats = initStats();
    let {camera, scene, renderer} = initThree({
        color: 0xffffff
    });
    camera.position.set(0,0, 500);
    let trackballControls = initTrackballControls(camera, renderer);

    let loader = new SVGLoader();
    let load = () => new Promise((resolve, reject) => {
        loader.load('../../static/modules/svg/tiger.svg', (data) => {
            let {paths} = data;
            let group = new THREE.Group();
            group.scale.multiplyScalar( 0.25 );
            group.position.x = - 70;
            group.position.y = 70;
            group.scale.y *= - 1;
            paths.forEach((item, index) => {
                let path = item;
                let fillColor = path.userData.style.fill;
                if (fillColor && fillColor !== 'none') {
                    let material = new THREE.MeshBasicMaterial( {
                        color: new THREE.Color().setStyle( fillColor ),
                        opacity: path.userData.style.fillOpacity,
                        transparent: path.userData.style.fillOpacity < 1,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: false
                    } );
                    let shapes = path.toShapes( true );
                    for ( let j = 0; j < shapes.length; j ++ ) {
                        let shape = shapes[ j ];
                        let geometry = new THREE.ShapeBufferGeometry( shape );
                        let mesh = new THREE.Mesh( geometry, material );
                        group.add( mesh );
                    }
                }
                let strokeColor = path.userData.style.stroke;
                if (strokeColor && strokeColor !== 'none' ) {
                    let material = new THREE.MeshBasicMaterial( {
                        color: new THREE.Color().setStyle( strokeColor ),
                        opacity: path.userData.style.strokeOpacity,
                        transparent: path.userData.style.strokeOpacity < 1,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: false
                    } );
                    for ( let j = 0, jl = path.subPaths.length; j < jl; j ++ ) {
                        let subPath = path.subPaths[ j ];
                        let geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );
                        if ( geometry ) {
                            let mesh = new THREE.Mesh( geometry, material );
                            group.add( mesh );
                        }
                    }
                }
            });
            scene.add(group);
            resolve(data);
        });
    });
    await load();

    let render = () => {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
}

init();