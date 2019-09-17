import '../../stylus/index.styl'
import * as THREE from 'three'
import snow1 from '../../assets/images/snowflake1.png'
import snow2 from '../../assets/images/snowflake2.png'
import snow3 from '../../assets/images/snowflake3.png'
import snow4 from '../../assets/images/snowflake4.png'
import snow5 from '../../assets/images/snowflake5.png'
import {initTrackballControls, initThree, initStats} from "../../util/util";

function init(){
    let stats = initStats();
    let {scene, camera, renderer} = initThree();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
    camera.position.set(0,0, 1000);
    camera.far = 20000;

    let geometry = new THREE.BufferGeometry();
    let textureLoader = new THREE.TextureLoader();
    let snowTexture1 = textureLoader.load(snow1);
    let snowTexture2 = textureLoader.load(snow2);
    let snowTexture3 = textureLoader.load(snow3);
    let snowTexture4 = textureLoader.load(snow4);
    let snowTexture5 = textureLoader.load(snow5);
    let parameters = [
        [[ 1.0, 0.2, 0.5 ], snowTexture2, 20 ],
        [[ 0.95, 0.1, 0.5 ], snowTexture3, 15 ],
        [[ 0.90, 0.05, 0.5 ], snowTexture1, 10 ],
        [[ 0.85, 0, 0.5 ], snowTexture5, 8 ],
        [[ 0.80, 0, 0.5 ], snowTexture4, 5 ]
    ];
    let vertices = [], materials = [];
    for(let i = 0; i < 10000; i++) {
        let x = Math.random() * 2000 - 1000;
        let y = Math.random() * 2000 - 1000;
        let z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    for (let i = 0; i < parameters.length; i++) {
        let color = parameters[i][0];
        let sprite = parameters[i][1];
        let size = parameters[i][2];
        materials[i] = new THREE.PointsMaterial({
            color,
            map: sprite,
            size,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        materials[i].color.setHSL(...color);
        let points = new THREE.Points(geometry, materials[i]);
        points.rotation.x = Math.random() * 6;
        points.rotation.y = Math.random() * 6;
        points.rotation.z = Math.random() * 6
        scene.add(points);
    }

    let trackball = initTrackballControls(camera, renderer);
    trackball.maxDistance = 1500;

    function render(){
        let time = Date.now() * 0.00005;
        stats.update();
        trackball.update();
        camera.position.x += 0.05;
        camera.position.y += 0.05;
        camera.lookAt(scene.position);
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i] instanceof THREE.Points) {
                scene.children[i].rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }
        // 颜色随时间变化
        for ( let i = 0; i < materials.length; i ++ ) {
            let color = parameters[ i ][ 0 ];
            let h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
            materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

init();