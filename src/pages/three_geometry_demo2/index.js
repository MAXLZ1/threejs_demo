import '../../stylus/index.styl'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import {initTrackballControls,initStats, initThree} from "../../util/util";
import {ParametricGeometries} from '../../libs/ParametricGeometries'
function init() {
    let stats = initStats();
    let gui = new dat.GUI();
    let {camera, scene, renderer} = initThree({
        sceneOption: {
            color: 0x444444
        }
    });
    camera.position.set(-50, 60, 80);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 60, 60);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(4096, 4096);
    scene.add(spotLight);

    let planeGeometry = new THREE.PlaneGeometry(110, 90,1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = - 0.5 * Math.PI;
    plane.position.set(0,0,10);
    scene.add(plane);

    // 立方体
    let boxGeometry = new THREE.BoxGeometry(10,10,10,10,10,10);
    let boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x00FF80
    });
    let box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(40, 6, -10);
    box.castShadow = true;
    scene.add(box);

    // 圆锥
    let coneGeometry = new THREE.ConeGeometry(5,10,40,10,false,0, Math.PI * 2);
    let coneMaterial = new THREE.MeshStandardMaterial({
        color: 0xC7FFEC,
        side: THREE.DoubleSide
    });
    let cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(25, 6, -10);
    cone.castShadow = true;
    scene.add(cone);

    // 圆柱体
    let cylinderGeometry = new THREE.CylinderGeometry(5,5,10,40,10,false,0, Math.PI * 2);
    let cylinderMaterial = new THREE.MeshStandardMaterial({
        color: 0xDEA681,
        side: THREE.DoubleSide
    });
    let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(10, 6, -10);
    cylinder.castShadow = true;
    scene.add(cylinder);

    // 十二面体
    let dodecahedronGeometry = new THREE.DodecahedronGeometry(5,0);
    let dodecahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0xFD5B78
    });
    let dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
    dodecahedron.position.set(-5, 6, -10);
    dodecahedron.castShadow = true;
    scene.add(dodecahedron);

    // 挤压几何体
    let extrudeShape = new THREE.Shape();
    let x = 0, y = 0;
    extrudeShape.moveTo( x + 5, y + 5 );
    extrudeShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    extrudeShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    extrudeShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    extrudeShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    extrudeShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    extrudeShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
    let extrudeGeometry = new THREE.ExtrudeGeometry(extrudeShape, {
        curveSegments: 12,
        steps: 3,
        depth: 5,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    });
    let extrudeMaterial = new THREE.MeshStandardMaterial({
        color: 0x7CFC00
    });
    let extrude = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
    extrude.position.set(-15, 11, -10);
    extrude.scale.set(0.5,0.5,0.5);
    extrude.rotation.z = Math.PI;
    extrude.castShadow = true;
    scene.add(extrude);

    // 二十面几何体
    let icosahedronGeometry = new THREE.IcosahedronGeometry(5,0);
    let icosahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0xEEE8AA
    });
    let icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.position.set(-30, 6, -10);
    icosahedron.castShadow = true;
    scene.add(icosahedron);

    // 车削几何体
    let points = [];
    for ( let i = 0; i < 5; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5 + 4, ( i - 2 ) * 2 ) );
    }
    let latheGeometry = new THREE.LatheGeometry(points,12, 0, Math.PI * 2);
    let latheMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFA07B,
        side: THREE.DoubleSide
    });
    let lathe = new THREE.Mesh(latheGeometry, latheMaterial);
    lathe.position.set(40, 6, 20);
    lathe.castShadow = true;
    scene.add(lathe);

    // 八面几何体
    let octahedronGeometry = new THREE.OctahedronGeometry(5,0);
    let octahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3399
    });
    let octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(25, 6, 20);
    octahedron.castShadow = true;
    scene.add(octahedron);

    // 参数化几何体
    let parametricGeometry = new THREE.ParametricGeometry(ParametricGeometries.klein, 25, 25);
    let parametricMaterial = new THREE.MeshStandardMaterial({
        color:0xfdb933,
        side: THREE.DoubleSide
    });
    let parametric = new THREE.Mesh(parametricGeometry, parametricMaterial);
    parametric.position.set(10, 6, 20);
    parametric.castShadow = true;
    scene.add(parametric);

    // 多面几何体
    let verticesOfCube = [
        -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
        -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
    ];
    let indicesOfFaces = [
        2,1,0,    0,3,2,
        0,4,7,    7,3,0,
        0,1,5,    5,4,0,
        1,2,6,    6,5,1,
        2,3,7,    7,6,2,
        4,5,6,    6,7,4
    ];
    let polyhedronGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces,5, 2);
    let polyhedronMaterial = new THREE.MeshStandardMaterial({
        color:0x7bbfea
    });
    let polyhedron = new THREE.Mesh(polyhedronGeometry, polyhedronMaterial);
    polyhedron.position.set(-5, 6, 20);
    polyhedron.castShadow = true;
    scene.add(polyhedron);

    // 球
    let sphereGeometry = new THREE.SphereGeometry(5,25,25,0,2*Math.PI,0, 2*Math.PI);
    let sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF0090
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-20, 6, 20);
    sphere.castShadow = true;
    scene.add(sphere);

    // 四面几何体
    let tetrahedronGeometry = new THREE.TetrahedronGeometry(5,0);
    let tetrahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0xBF0A10
    });
    let tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
    tetrahedron.position.set(-35, 6, 20);
    tetrahedron.castShadow = true;
    scene.add(tetrahedron);

    // 文本几何体
    let fontLoader = new THREE.FontLoader();
    fontLoader.load('../../assets/fonts/FZJPKai-Z03S_Regular.json', (result) => {
        let textGeometry = new THREE.TextGeometry('你好！',{
            font: result,
            size: 5,
            height: 1,
            curveSegments: 10,
            bevelEnabled: false,
            bevelThickness: 2,
            bevelSize: 0,
            bevelSegments: 4
        });
        let textMaterial = new THREE.MeshStandardMaterial({
            color: 0x9999FF
        });
        let text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(30, 4, 40);
        text.castShadow = true;
        scene.add(text);
        let textGUI = gui.addFolder('TextGeometry');
        let textControls = {
            text: textGeometry.parameters.text,
            size: textGeometry.parameters.parameters.size,
            height: textGeometry.parameters.parameters.height,
            curveSegments: textGeometry.parameters.parameters.curveSegments,
            bevelEnabled: textGeometry.parameters.parameters.bevelEnabled,
            bevelThickness: textGeometry.parameters.parameters.bevelThickness,
            bevelSize: textGeometry.parameters.parameters.bevelSize,
            bevelSegments: textGeometry.parameters.parameters.bevelSegments,
            wireframe: textMaterial.wireframe
        };
        let updateText = function () {
            text.geometry = new THREE.TextGeometry(textControls.text, {
                font: result,
                size: textControls.size,
                height: textControls.height,
                curveSegments: textControls.curveSegments,
                bevelEnabled: textControls.bevelEnabled,
                bevelThickness: textControls.bevelThickness,
                bevelSize: textControls.bevelSize,
                bevelSegments: textControls.bevelSegments
            });
        };
        textGUI.add(textControls, 'text').onChange(value => updateText());
        textGUI.add(textControls, 'size', 0, 10).onChange(value => updateText());
        textGUI.add(textControls, 'height', 0, 10).onChange(value => updateText());
        textGUI.add(textControls, 'curveSegments', 0, 30).onChange(value => updateText());
        textGUI.add(textControls, 'bevelEnabled').onChange(value => updateText());
        textGUI.add(textControls, 'bevelThickness', 0, 20).onChange(value => updateText());
        textGUI.add(textControls, 'bevelSize', 0, 20).onChange(value => updateText());
        textGUI.add(textControls, 'bevelSegments', 0, 5).onChange(value => updateText());
        textGUI.add(textControls, 'wireframe').onChange(value => textMaterial.wireframe = value);
    });


    // 圆环
    let torusGeometry = new THREE.TorusGeometry( 5, 1.5, 16, 100, Math.PI * 2 );
    let torusMaterial = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
    let torus = new THREE.Mesh( torusGeometry, torusMaterial );
    torus.position.set(20, 8, 40);
    torus.castShadow = true;
    scene.add( torus );

    // 圆环扭结几何体
    let torusKnotGeometry = new THREE.TorusKnotGeometry( 5, 1.5, 100, 16 ,2,3);
    let torusKnotMaterial = new THREE.MeshStandardMaterial( { color: 0xAFE0E0 } );
    let torusKnot = new THREE.Mesh( torusKnotGeometry, torusKnotMaterial );
    torusKnot.position.set(0, 8, 40);
    torusKnot.castShadow = true;
    scene.add( torusKnot );

    // 管道几何体
    function CustomSinCurve( scale ) {
        THREE.Curve.call( this );
        this.scale = ( scale === undefined ) ? 1 : scale;
    }
    CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
    CustomSinCurve.prototype.constructor = CustomSinCurve;
    CustomSinCurve.prototype.getPoint = function ( t ) {
        let tx = t * 3 - 1.5;
        let ty = Math.sin( 2 * Math.PI * t );
        let tz = 0;
        return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
    };
    let tubePath = new CustomSinCurve( 5 );
    let tubeGeometry = new THREE.TubeGeometry( tubePath, 20, 2, 8, false );
    let tubeMaterial = new THREE.MeshStandardMaterial( { color: 0xFFEF61 ,side: THREE.DoubleSide} );
    let tube = new THREE.Mesh( tubeGeometry, tubeMaterial );
    tube.position.set(-25, 8, 40);
    tube.castShadow = true;
    scene.add( tube );

    let boxGUI = gui.addFolder('BoxGeometry');
    let boxControls = {
        width: boxGeometry.parameters.width,
        height: boxGeometry.parameters.height,
        depth: boxGeometry.parameters.depth,
        widthSegments: boxGeometry.parameters.widthSegments,
        heightSegments: boxGeometry.parameters.heightSegments,
        depthSegments: boxGeometry.parameters.depthSegments,
        wireframe: boxMaterial.wireframe
    };
    let updateBox = function(){
        box.geometry = new THREE.BoxGeometry(boxControls.width, boxControls.height, boxControls.depth,
            boxControls.widthSegments, boxControls.heightSegments, boxControls.depthSegments);
    }
    boxGUI.add(boxControls, 'width', 0, 10).onChange(value => updateBox());
    boxGUI.add(boxControls, 'height', 0, 10).onChange(value => updateBox());
    boxGUI.add(boxControls, 'depth', 0, 10).onChange(value => updateBox());
    boxGUI.add(boxControls, 'widthSegments', 0, 40).onChange(value => updateBox());
    boxGUI.add(boxControls, 'heightSegments', 0, 40).onChange(value => updateBox());
    boxGUI.add(boxControls, 'depthSegments', 0, 40).onChange(value => updateBox());
    boxGUI.add(boxControls, 'wireframe').onChange(value => boxMaterial.wireframe = value);
    let coneGUI = gui.addFolder('ConeGeometry');
    let coneControls = {
        radius: coneGeometry.parameters.radius,
        height: coneGeometry.parameters.height,
        radialSegments: coneGeometry.parameters.radialSegments,
        heightSegments: coneGeometry.parameters.heightSegments,
        openEnded: coneGeometry.parameters.openEnded,
        thetaStart: coneGeometry.parameters.thetaStart,
        thetaLength: coneGeometry.parameters.thetaLength,
        wireframe: coneMaterial.wireframe
    };
    let updateCone = function(){
        cone.geometry = new THREE.ConeGeometry(coneControls.radius, coneControls.height, coneControls.radialSegments,
            coneControls.heightSegments, coneControls.openEnded, coneControls.thetaStart, coneControls.thetaLength);
    };
    coneGUI.add(coneControls, 'radius', 0, 5).onChange(value => updateCone());
    coneGUI.add(coneControls, 'height', 0, 10).onChange(value => updateCone());
    coneGUI.add(coneControls, 'radialSegments', 0, 20).onChange(value => updateCone());
    coneGUI.add(coneControls, 'heightSegments', 0, 20).onChange(value => updateCone());
    coneGUI.add(coneControls, 'openEnded').onChange(value => updateCone());
    coneGUI.add(coneControls, 'thetaStart', 0, Math.PI * 2).onChange(value => updateCone());
    coneGUI.add(coneControls, 'thetaLength', 0, Math.PI * 2).onChange(value => updateCone());
    coneGUI.add(coneControls, 'wireframe').onChange(value => coneMaterial.wireframe = value);
    let cylinderGUI = gui.addFolder('CylinderGeometry');
    let cylinderControls = {
        radiusTop: cylinderGeometry.parameters.radiusTop,
        radiusBottom: cylinderGeometry.parameters.radiusBottom,
        height: cylinderGeometry.parameters.height,
        radialSegments: cylinderGeometry.parameters.radialSegments,
        heightSegments: cylinderGeometry.parameters.heightSegments,
        openEnded: cylinderGeometry.parameters.openEnded,
        thetaStart: cylinderGeometry.parameters.thetaStart,
        thetaLength: cylinderGeometry.parameters.thetaLength,
        wireframe: cylinderMaterial.wireframe
    };
    let updateCylinder = function(){
        cylinder.geometry = new THREE.CylinderGeometry(cylinderControls.radiusTop, cylinderControls.radiusBottom,
            cylinderControls.height, cylinderControls.radialSegments, cylinderControls.heightSegments,
            cylinderControls.openEnded, cylinderControls.thetaStart, cylinderControls.thetaLength);
    };
    cylinderGUI.add(cylinderControls, 'radiusTop', 0, 5).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'radiusBottom', 0, 5).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'height', 0, 10).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'radialSegments', 0, 20).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'heightSegments', 0, 20).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'openEnded').onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'thetaStart', 0, 2 * Math.PI).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'thetaLength', 0, 2 * Math.PI).onChange(value => updateCylinder());
    cylinderGUI.add(cylinderControls, 'wireframe').onChange(value => cylinderMaterial.wireframe = value);
    let tetrahedronGUI = gui.addFolder('TetrahedronGeometry');
    let tetrahedronControls = {
        radius: tetrahedronGeometry.parameters.radius,
        detail: tetrahedronGeometry.parameters.detail,
        wireframe: tetrahedronMaterial.wireframe
    };
    let updateTetrahedron = function(){
        tetrahedron.geometry = new THREE.TetrahedronGeometry(tetrahedronControls.radius, Math.round(tetrahedronControls.detail));
    };
    tetrahedronGUI.add(tetrahedronControls, 'radius', 0, 6).onChange(value => updateTetrahedron());
    tetrahedronGUI.add(tetrahedronControls, 'detail', 0, 5).onChange(value => updateTetrahedron());
    tetrahedronGUI.add(tetrahedronControls, 'wireframe').onChange(value => tetrahedronMaterial.wireframe = value);
    let octahedronGUI = gui.addFolder('OctahedronGeometry');
    let octahedronControls = {
        radius: octahedronGeometry.parameters.radius,
        detail: octahedronGeometry.parameters.detail,
        wireframe: octahedronMaterial.wireframe
    };
    let updateOctahedron = function () {
        octahedron.geometry = new THREE.OctahedronGeometry(octahedronControls.radius, Math.round(octahedronControls.detail));
    };
    octahedronGUI.add(octahedronControls, 'radius',0, 6).onChange(value => updateOctahedron());
    octahedronGUI.add(octahedronControls, 'detail',0, 5).onChange(value => updateOctahedron());
    octahedronGUI.add(octahedronControls, 'wireframe').onChange(value => octahedronMaterial.wireframe = value);
    let dodecahedronGUI = gui.addFolder('DodecahedronGeometry');
    let dodecahedronControls = {
        radius: dodecahedronGeometry.parameters.radius,
        detail: dodecahedronGeometry.parameters.detail,
        wireframe: dodecahedronMaterial.wireframe
    };
    let updateDodecahedron = function () {
        dodecahedron.geometry = new THREE.DodecahedronGeometry(dodecahedronControls.radius,
            Math.round(dodecahedronControls.detail));
    };
    dodecahedronGUI.add(dodecahedronControls, 'radius', 0, 6).onChange(value => updateDodecahedron());
    dodecahedronGUI.add(dodecahedronControls, 'detail',0,5).onChange(value => updateDodecahedron());
    dodecahedronGUI.add(dodecahedronControls, 'wireframe').onChange(value => dodecahedronMaterial.wireframe = value);
    let icosahedronGUI = gui.addFolder('IcosahedronGeometry');
    let icosahedronControls = {
        radius: icosahedronGeometry.parameters.radius,
        detail: icosahedronGeometry.parameters.detail,
        wireframe: icosahedronMaterial.wireframe
    };
    let updateIcosahedron = function () {
        icosahedron.geometry = new THREE.IcosahedronGeometry(icosahedronControls.radius,
            Math.round(icosahedronControls.detail));
    };
    icosahedronGUI.add(icosahedronControls, 'radius', 0, 6).onChange(value => updateIcosahedron());
    icosahedronGUI.add(icosahedronControls, 'detail', 0, 5).onChange(value => updateIcosahedron());
    icosahedronGUI.add(icosahedronControls, 'wireframe').onChange(value => icosahedronMaterial.wireframe = value);
    let extrudeGUI = gui.addFolder('ExtrudeGeometry');
    let extrudeControls = {
        curveSegments: extrudeGeometry.parameters.options.curveSegments,
        steps: extrudeGeometry.parameters.options.steps,
        depth: extrudeGeometry.parameters.options.depth,
        bevelEnabled: extrudeGeometry.parameters.options.bevelEnabled,
        bevelThickness: extrudeGeometry.parameters.options.bevelThickness,
        bevelSize: extrudeGeometry.parameters.options.bevelSize,
        bevelOffset: extrudeGeometry.parameters.options.bevelOffset,
        bevelSegments: extrudeGeometry.parameters.options.bevelSegments,
        wireframe: extrudeMaterial.wireframe
    };
    let updateExtrude = function () {
        extrude.geometry = new THREE.ExtrudeGeometry(extrudeShape, {
            curveSegments: extrudeControls.curveSegments,
            steps: Math.round(extrudeControls.steps),
            depth: extrudeControls.depth,
            bevelEnabled: extrudeControls.bevelEnabled,
            bevelThickness: extrudeControls.bevelThickness,
            bevelSize: extrudeControls.bevelSize,
            bevelOffset: extrudeControls.bevelOffset,
            bevelSegments: Math.round(extrudeControls.bevelSegments)
        });
    };
    extrudeGUI.add(extrudeControls, 'curveSegments', 0, 20).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'steps',0,10).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'depth',0,200).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'bevelEnabled').onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'bevelThickness',0,12).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'bevelSize',0,10).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'bevelOffset',0,10).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'bevelSegments',0,20).onChange(value => updateExtrude());
    extrudeGUI.add(extrudeControls, 'wireframe').onChange(value => extrudeMaterial.wireframe = value);
    let latheGUI = gui.addFolder('LatheGeometry');
    let latheControls = {
        segments: latheGeometry.parameters.segments,
        phiStart: latheGeometry.parameters.phiStart,
        phiLength: latheGeometry.parameters.phiLength,
        wireframe: latheMaterial.wireframe
    };
    let updateLathe = function () {
        lathe.geometry = new THREE.LatheGeometry(points, latheControls.segments,
            latheControls.phiStart, latheControls.phiLength);
    };
    latheGUI.add(latheControls, 'segments', 0, 40).onChange(value => updateLathe());
    latheGUI.add(latheControls, 'phiStart', 0, 2 * Math.PI).onChange(value => updateLathe());
    latheGUI.add(latheControls, 'phiLength', 0, 2 * Math.PI).onChange(value => updateLathe());
    latheGUI.add(latheControls, 'wireframe').onChange(value => latheMaterial.wireframe = value);
    let parametricGUI = gui.addFolder('ParametricGeometry');
    let parametricControls = {
        func: 'klein',
        slices: parametricGeometry.parameters.slices,
        stacks: parametricGeometry.parameters.stacks,
        wireframe: parametricMaterial.wireframe
    };
    let updateParametric = function () {
        parametric.geometry = new THREE.ParametricGeometry(ParametricGeometries[parametricControls.func],
            Math.round(parametricControls.slices), Math.round(parametricControls.stacks));
    };
    parametricGUI.add(parametricControls, 'func',{
        klein: 'klein',
        mobius3d: 'mobius3d'
    }).onChange(value => updateParametric());
    parametricGUI.add(parametricControls, 'slices',0 ,50).onChange(value => updateParametric());
    parametricGUI.add(parametricControls, 'stacks',0 ,50).onChange(value => updateParametric());
    parametricGUI.add(parametricControls, 'wireframe').onChange(value => parametricMaterial.wireframe = value);
    let polyhedronGUI = gui.addFolder('PolyhedronGeometry');
    let polyhedronContorls = {
        radius: polyhedronGeometry.parameters.radius,
        detail: polyhedronGeometry.parameters.detail,
        wireframe: polyhedronMaterial.wireframe
    };
    let updatePolyhedron = function () {
        polyhedron.geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces,
            polyhedronContorls.radius, Math.round(polyhedronContorls.detail));
    };
    polyhedronGUI.add(polyhedronContorls, 'radius', 0, 6).onChange(value => updatePolyhedron());
    polyhedronGUI.add(polyhedronContorls, 'detail', 0, 5).onChange(value => updatePolyhedron());
    polyhedronGUI.add(polyhedronContorls, 'wireframe').onChange(value => polyhedronMaterial.wireframe = value);
    let sphereGUI = gui.addFolder('SphereGeometry');
    let sphereControls = {
        radius: sphereGeometry.parameters.radius,
        widthSegments: sphereGeometry.parameters.widthSegments,
        heightSegments: sphereGeometry.parameters.heightSegments,
        phiStart: sphereGeometry.parameters.phiStart,
        phiLength: sphereGeometry.parameters.phiLength,
        thetaStart: sphereGeometry.parameters.thetaStart,
        thetaLength: sphereGeometry.parameters.thetaLength,
        wireframe: sphereMaterial.wireframe
    };
    let updateSphere = function () {
        sphere.geometry = new THREE.SphereGeometry(sphereControls.radius, sphereControls.widthSegments,
            sphereControls.heightSegments, sphereControls.phiStart, sphereControls.phiLength,
            sphereControls.thetaStart, sphereControls.thetaLength);
    };
    sphereGUI.add(sphereControls, 'radius', 0, 6).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'widthSegments', 0, 40).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'heightSegments', 0, 40).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'phiStart', 0, 2 * Math.PI).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'phiLength', 0, 2 * Math.PI).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'thetaStart', 0, 2 * Math.PI).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'thetaLength', 0, 2 * Math.PI).onChange(value => updateSphere());
    sphereGUI.add(sphereControls, 'wireframe').onChange(value => sphereMaterial.wireframe = value);
    let torusGUI = gui.addFolder('TorusGeometry');
    let torusControls = {
        radius: torusGeometry.parameters.radius,
        tube: torusGeometry.parameters.tube,
        radialSegments: torusGeometry.parameters.radialSegments,
        tubularSegments: torusGeometry.parameters.tubularSegments,
        arc: torusGeometry.parameters.arc,
        wireframe: torusMaterial.wireframe
    };
    let updateTrous = function () {
        torus.geometry = new THREE.TorusGeometry(torusControls.radius, torusControls.tube, torusControls.radialSegments,
            torusControls.tubularSegments, torusControls.arc);
    };
    torusGUI.add(torusControls, 'radius', 0, 6).onChange(value => updateTrous());
    torusGUI.add(torusControls, 'tube', 0, 2).onChange(value => updateTrous());
    torusGUI.add(torusControls, 'radialSegments', 0, 20).onChange(value => updateTrous());
    torusGUI.add(torusControls, 'tubularSegments', 0, 20).onChange(value => updateTrous());
    torusGUI.add(torusControls, 'arc',0, Math.PI * 2).onChange(value => updateTrous());
    torusGUI.add(torusControls, 'wireframe').onChange(value => torusMaterial.wireframe = value);
    let torusKnotGUI = gui.addFolder('TorusKnotGeometry');
    let torusKnotControls = {
        radius: torusKnotGeometry.parameters.radius,
        tube: torusKnotGeometry.parameters.tube,
        tubularSegments: torusKnotGeometry.parameters.tubularSegments,
        radialSegments: torusKnotGeometry.parameters.radialSegments,
        p: torusKnotGeometry.parameters.p,
        q: torusKnotGeometry.parameters.q,
        wireframe: torusKnotMaterial.wireframe
    };
    let updateTorusKnot = function () {
        torusKnot.geometry = new THREE.TorusKnotGeometry(torusKnotControls.radius, torusKnotControls.tube,
            torusKnotControls. tubularSegments, torusKnotControls.radialSegments, torusKnotControls.p,
            torusKnotControls.q);
    };
    torusKnotGUI.add(torusKnotControls, 'radius', 0, 6).onChange(value => updateTorusKnot());
    torusKnotGUI.add(torusKnotControls, 'tube', 0, 2).onChange(value => updateTorusKnot());
    torusKnotGUI.add(torusKnotControls, 'tubularSegments', 0, 100).onChange(value => updateTorusKnot());
    torusKnotGUI.add(torusKnotControls, 'radialSegments', 0, 20).onChange(value => updateTorusKnot());
    torusKnotGUI.add(torusKnotControls, 'p', 0, 10).onChange(value => updateTorusKnot());
    torusKnotGUI.add(torusKnotControls, 'q', 0, 10).onChange(value => updateTorusKnot());
    torusKnotGUI.add(torusKnotControls, 'wireframe').onChange(value => torusKnotMaterial.wireframe = value);
    let tubeGUI = gui.addFolder('TubeGeometry');
    let tubeControls = {
        tubularSegments: tubeGeometry.parameters.tubularSegments,
        radius: tubeGeometry.parameters.radius,
        radialSegments: tubeGeometry.parameters.radialSegments,
        closed: tubeGeometry.parameters.closed,
        wireframe: tubeMaterial.wireframe,
    };
    let updateTube = function () {
        tube.geometry = new THREE.TubeGeometry(tubePath, Math.round(tubeControls.tubularSegments),
            tubeControls.radius, Math.round(tubeControls.radialSegments), tubeControls.closed);
    };
    tubeGUI.add(tubeControls, 'tubularSegments',0,100).onChange(value => updateTube());
    tubeGUI.add(tubeControls, 'radius', 0, 4).onChange(value => updateTube());
    tubeGUI.add(tubeControls, 'radialSegments', 0, 20).onChange(value => updateTube());
    tubeGUI.add(tubeControls, 'closed').onChange(value => updateTube());
    tubeGUI.add(tubeControls, 'wireframe').onChange(value => tubeMaterial.wireframe = value);

    let trackballControls = initTrackballControls(camera, renderer);
    render();
    function render(){
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
init();