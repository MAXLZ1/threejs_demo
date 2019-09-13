import '../../stylus/index.styl'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initTrackballControls,initStats, initThree} from "../../util/util";
import {LineBasicMaterial, RingGeometry, WireframeGeometry} from "../../libs/three.module";

function init() {
    let stats = initStats();
    let {camera, scene, renderer} = initThree({
        sceneOption: {
            color: 0x444444
        }
    });
    camera.position.set(-50, 60, 70);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 40, 40);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(2048, 2048);
    scene.add(spotLight);

    let planeGeometry = new THREE.PlaneGeometry(100, 60,1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = - 0.5 * Math.PI;
    plane.position.set(0,0,0);
    scene.add(plane);

    // 矩形
    let planeGeometry2 = new THREE.PlaneGeometry(10, 10,5,5);
    let planeMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x3896fe,
        side: THREE.DoubleSide
    });
    let plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
    plane2.castShadow = true;
    plane2.position.set(30, 8, 0);
    scene.add(plane2);

    // 圆形
    let circleGeometry = new THREE.CircleGeometry(4, 32,0,2*Math.PI);
    console.log(circleGeometry.parameters)
    let circleMaterial = new THREE.MeshStandardMaterial({
        color: 0x8088E2,
        side: THREE.DoubleSide
    });
    let circle = new THREE.Mesh(circleGeometry,circleMaterial);
    circle.position.set(20,8,0);
    circle.castShadow = true;
    scene.add(circle);

    // 圆环
    let ringGeometry = new THREE.RingGeometry(2,5,40,8, 0, 2*Math.PI);
    let ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x5BB665,
        side: THREE.DoubleSide
    });
    let ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.castShadow = true;
    ring.position.set(10, 8,0);
    scene.add(ring);

    // shape
    let heartShape = new THREE.Shape();
    let x = 0, y = 0;
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
    let shapeGeometry = new THREE.ShapeGeometry(heartShape,12);
    let shapeMaterial = new THREE.MeshStandardMaterial({
        color: 0xE8E057,
        side: THREE.DoubleSide
    });
    let shape = new THREE.Mesh(shapeGeometry,shapeMaterial);
    shape.rotation.x = Math.PI;
    shape.scale.set(0.7,0.7,0.7);
    shape.position.set(-10, 15, 0);
    shape.castShadow = true;
    scene.add(shape);

    // 网格几何体
    let wireframe = new THREE.WireframeGeometry(shapeGeometry);
    let line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.position.set(-30, 15, 0);
    line.rotation.copy(shape.rotation);
    line.scale.copy(shape.scale);
    line.castShadow = true;
    scene.add( line );

    let gui = new dat.GUI();
    let planeControls = {
        width: 10,
        height: 10,
        widthSegments: 5,
        heightSegments: 5,
        wireframe: planeMaterial2.wireframe
    };
    let planeGUI = gui.addFolder('PlaneGeometry');
    let updatePlane = function(mesh){
        mesh.geometry = new THREE.PlaneGeometry(planeControls.width, planeControls.height,
            Math.round(planeControls.widthSegments), Math.round(planeControls.heightSegments));
    };
    planeGUI.add(planeControls, 'width',0,10).onChange(value => updatePlane(plane2));
    planeGUI.add(planeControls, 'height',0,10).onChange(value => updatePlane(plane2));
    planeGUI.add(planeControls, 'widthSegments',0,20).onChange(value => updatePlane(plane2));
    planeGUI.add(planeControls, 'heightSegments',0,20).onChange(value => updatePlane(plane2));
    planeGUI.add(planeControls, 'wireframe').onChange(value => planeMaterial2.wireframe = value);
    let circleGUI = gui.addFolder('CircleGeometry');
    let circleControls = {
        radius: circleGeometry.parameters.radius,
        segments: circleGeometry.parameters.segments,
        thetaStart: circleGeometry.parameters.thetaStart,
        thetaLength: circleGeometry.parameters.thetaLength,
        wireframe: circleMaterial.wireframe
    };
    let updateCircle = function(){
        circle.geometry = new THREE.CircleGeometry(circleControls.radius,circleControls.segments,
            circleControls.thetaStart,circleControls.thetaLength);
    };
    circleGUI.add(circleControls, 'radius', 0, 5).onChange(value => updateCircle());
    circleGUI.add(circleControls, 'segments', 3, 40).onChange(value => updateCircle());
    circleGUI.add(circleControls, 'thetaStart', 0 , 2*Math.PI).onChange(value => updateCircle());
    circleGUI.add(circleControls, 'thetaLength', 0, 2*Math.PI).onChange(value => updateCircle());
    circleGUI.add(circleControls, 'wireframe').onChange(value => circleMaterial.wireframe = value);
    let ringGUI = gui.addFolder('RingGeometry');
    let ringControls = {
        innerRadius: ringGeometry.parameters.innerRadius,
        outerRadius: ringGeometry.parameters.outerRadius,
        thetaSegments: ringGeometry.parameters.thetaSegments,
        phiSegments: ringGeometry.parameters.phiSegments,
        thetaStart: ringGeometry.parameters.thetaStart,
        thetaLength: ringGeometry.parameters.thetaLength,
        wireframe: ringMaterial.wireframe
    };
    let updateRing = function(){
        ring.geometry = new RingGeometry(ringControls.innerRadius, ringControls.outerRadius,
            Math.round(ringControls.thetaSegments), Math.round(ringControls.phiSegments), ringControls.thetaStart, ringControls.thetaLength);
    };
    ringGUI.add(ringControls, 'innerRadius', 0, 5).onChange(value => updateRing());
    ringGUI.add(ringControls, 'outerRadius', 0, 5).onChange(value => updateRing());
    ringGUI.add(ringControls, 'thetaSegments', 3, 50).onChange(value => updateRing());
    ringGUI.add(ringControls, 'phiSegments', 1, 10).onChange(value => updateRing());
    ringGUI.add(ringControls, 'thetaStart', 0, 2 * Math.PI).onChange(value => updateRing());
    ringGUI.add(ringControls, 'thetaLength', 0, 2 * Math.PI).onChange(value => updateRing());
    ringGUI.add(ringControls, 'wireframe').onChange(value => ringMaterial.wireframe = value);
    let shapeGUI = gui.addFolder('ShapeGeometry');
    let shapeControls = {
        curveSegments: shapeGeometry.parameters.curveSegments,
        wireframe: shapeMaterial.wireframe
    };
    let updateShape = function(){
        shape.geometry = new THREE.ShapeGeometry(heartShape, shapeControls.curveSegments);
    };
    shapeGUI.add(shapeControls, 'curveSegments',0,40).onChange(value => updateShape());
    shapeGUI.add(shapeControls, 'wireframe').onChange(value => shapeMaterial.wireframe = value);
    let trackballControls = initTrackballControls(camera, renderer);
    render();
    function render(){
        stats.update();
        trackballControls.update();
        // rotate([plane2, circle, ring]);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    function rotate(geoArr) {
        geoArr.forEach(item => {
            item.rotation.x += 0.005;
            item.rotation.y += 0.005;
            item.rotation.z += 0.005;
        });
    }
}
init();