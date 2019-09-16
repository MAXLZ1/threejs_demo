import '../../stylus/index.styl'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import sprite from  '../../assets/images/sprite.png'
import {initThree, initStats, initTrackballControls} from "../../util/util";

function init () {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();
    camera.position.set(0, 0 ,200);
    // let createSprites = function () {
    //     let texture = new THREE.TextureLoader().load(sprite);
    //     let spriteMaterial = new THREE.SpriteMaterial({map: texture, color: 0xff0000});
    //     for (let x = -5; x < 5; x++) {
    //         for (let y = -5; y < 5; y++) {
    //             let sprite = new THREE.Sprite(spriteMaterial);
    //             sprite.position.set(x*10, y*10, 0);
    //             scene.add(sprite);
    //         }
    //     }
    // };
    let points;
    let createSprites = function () {
        let texture = new THREE.TextureLoader().load(sprite);
        let pointsMaterial = new THREE.PointsMaterial({map: texture, color: 0xffffff, size: 10});
        let pointsGeometry = new THREE.Geometry();
        for (let x = -10; x < 10; x++) {
            for (let y = -10; y < 10; y++) {
                for (let z = -10; z < 10; z++) {
                    pointsGeometry.vertices.push(new THREE.Vector3(x*5, y*5, z*5));
                }
            }
        }
        points = new THREE.Points(pointsGeometry, pointsMaterial);
        scene.add(points);
    };

    createSprites();

    let trackball = initTrackballControls(camera, renderer);
    function render() {
        stats.update();
        trackball.update();
        points.rotation.x += 0.002;
        points.rotation.y += 0.002;
        points.rotation.z += 0.002;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

init();