import '../../stylus/index.styl'
import * as THREE from 'three'
import * as gui from 'dat.gui'
import {initTrackballControls, initThree, initStats} from '../../util/util'
import {PCDLoader} from '../../libs/loaders/PCDLoader';

async function init() {
    let stats = initStats();
    let {camera, scene, renderer} = initThree();
    let trackballControls = initTrackballControls(camera, renderer);
    let loader = new PCDLoader();
    camera.position.set(0.2, 0.5, -0.5);
    camera.up.y = -1;

    let load = () => new Promise((resolve, reject) => {
        loader.load('../../static/modules/pcd/Zaghetto.pcd', (points) => {
            if (points ){
                resolve(points);
            } else {
                reject(new Error('文件加载失败'));
            }
        });
    });
    let points = await load();
    points.material.color.set(0xfff000);
    scene.add(points);
    let center = points.geometry.boundingSphere.center;
    trackballControls.target.set( center.x, center.y, center.z );
    trackballControls.update();
    let render = () => {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    };
    render();
}

init();