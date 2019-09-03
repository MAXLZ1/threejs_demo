import * as THREE from 'three';
import Stats from 'stats-js';
const TrackballControls = require('three-trackballcontrols');

// 检测动画运行时帧数，在执行动画处执行stats.update()
function initStats () {
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.domElement);
    return stats;
}
// 添加缩放等手势动作
function initTrackballControls(camera, renderer){
    let trackballControls = new TrackballControls(camera,renderer.domElement);
    // 旋转速度
    trackballControls.rotateSpeed = 2.0;
    // 变焦速度
    trackballControls.zoomSpeed = 2.2;
    // 平移速度
    trackballControls.panSpeed = 1.8;
    // 是否不变焦
    trackballControls.noZoom = false;
    // 是否不平移
    trackballControls.noPan = false;
    // 是否开启移动惯性
    trackballControls.staticMoving = true;
    // 动态阻尼系数 就是灵敏度
    trackballControls.dynamicDampingFactor = 0.3;
    // ???
    trackballControls.keys = [65, 83, 68];
    return trackballControls;
}

function createMultiMaterialObject (geometry, materials) {
    let group = new THREE.Group();
    materials.forEach(material => {
        group.add(new THREE.Mesh(geometry, material));
    });
    return group;
}
export {
    initStats,
    initTrackballControls,
    createMultiMaterialObject
}