import '../../stylus/index.styl'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats-js';

import {initTrackballControls, initStats} from "../../util/util";
import {RectAreaLightUniformsLib} from '../../libs/RectAreaLightUniformsLib'
const OrbitControls = require('three-orbitcontrols')
var renderer, scene, camera;
var origin = new THREE.Vector3();
var rectLight;
var param = {};
var stats;
init();
animate();
function init() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 20, 35 );
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );
    RectAreaLightUniformsLib.init();
    rectLight = new THREE.RectAreaLight( 0xffffff, 1, 10, 10 );
    rectLight.position.set( 5, 0, 0 );
    scene.add( rectLight );
    var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.BackSide } ) );
    rectLightMesh.scale.x = rectLight.width;
    rectLightMesh.scale.y = rectLight.height;
    rectLight.add( rectLightMesh );
    var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
    rectLightMesh.add( rectLightMeshBack );
    var geoFloor = new THREE.BoxBufferGeometry( 2000, 0.1, 2000 );
    var matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0, metalness: 0 } );
    var mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    mshStdFloor.position.set(0,0,0);
    scene.add( mshStdFloor );
    var matStdObjects = new THREE.MeshStandardMaterial( { color: 0xA00000, roughness: 0, metalness: 0 } );
    var geoBox = new THREE.BoxBufferGeometry( Math.PI, Math.sqrt( 2 ), Math.E );
    var mshStdBox = new THREE.Mesh( geoBox, matStdObjects );
    mshStdBox.position.set( 0, 5, 0 );
    mshStdBox.rotation.set( 0, Math.PI / 2.0, 0 );
    mshStdBox.castShadow = true;
    mshStdBox.receiveShadow = true;
    scene.add( mshStdBox );

    var geoSphere = new THREE.SphereBufferGeometry( 1.5, 32, 32 );
    var mshStdSphere = new THREE.Mesh( geoSphere, matStdObjects );
    mshStdSphere.position.set( - 5, 5, 0 );
    mshStdSphere.castShadow = true;
    mshStdSphere.receiveShadow = true;
    scene.add( mshStdSphere );
    var geoKnot = new THREE.TorusKnotBufferGeometry( 1.5, 0.5, 100, 16 );
    var mshStdKnot = new THREE.Mesh( geoKnot, matStdObjects );
    mshStdKnot.position.set( 5, 5, 0 );
    mshStdKnot.castShadow = true;
    mshStdKnot.receiveShadow = true;
    scene.add( mshStdKnot );
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.target.copy( mshStdBox.position );
    controls.update();
    // GUI
    var gui = new dat.GUI( { width: 300 } );
    gui.open();
    param = {
        motion: true,
        width: rectLight.width,
        height: rectLight.height,
        color: rectLight.color.getHex(),
        intensity: rectLight.intensity,
        'ambient': ambient.intensity,
        'floor color': matStdFloor.color.getHex(),
        'object color': matStdObjects.color.getHex(),
        'roughness': matStdFloor.roughness,
        'metalness': matStdFloor.metalness
    };
    gui.add( param, 'motion' );
    var lightFolder = gui.addFolder( 'Light' );
    lightFolder.add( param, 'width', 1, 20 ).step( 0.1 ).onChange( function ( val ) {
        rectLight.width = val;
        rectLightMesh.scale.x = val;
    } );
    lightFolder.add( param, 'height', 1, 20 ).step( 0.1 ).onChange( function ( val ) {
        rectLight.height = val;
        rectLightMesh.scale.y = val;
    } );
    lightFolder.addColor( param, 'color' ).onChange( function ( val ) {
        rectLight.color.setHex( val );
        rectLightMesh.material.color.copy( rectLight.color ).multiplyScalar( rectLight.intensity );
    } );
    lightFolder.add( param, 'intensity', 0.0, 4.0 ).step( 0.01 ).onChange( function ( val ) {
        rectLight.intensity = val;
        rectLightMesh.material.color.copy( rectLight.color ).multiplyScalar( rectLight.intensity );
    } );
    lightFolder.add( param, 'ambient', 0.0, 0.2 ).step( 0.01 ).onChange( function ( val ) {
        ambient.intensity = val;
    } );
    lightFolder.open();
    var standardFolder = gui.addFolder( 'Standard Material' );
    standardFolder.addColor( param, 'floor color' ).onChange( function ( val ) {
        matStdFloor.color.setHex( val );
    } );
    standardFolder.addColor( param, 'object color' ).onChange( function ( val ) {
        matStdObjects.color.setHex( val );
    } );
    standardFolder.add( param, 'roughness', 0.0, 1.0 ).step( 0.01 ).onChange( function ( val ) {
        matStdObjects.roughness = val;
        matStdFloor.roughness = val;
    } );
    standardFolder.add( param, 'metalness', 0.0, 1.0 ).step( 0.01 ).onChange( function ( val ) {
        matStdObjects.metalness = val;
        matStdFloor.metalness = val;
    } );
    standardFolder.open();
    stats = new Stats();
    document.body.appendChild( stats.dom );
}
function animate() {
    requestAnimationFrame( animate );
    if ( param.motion ) {
        var t = ( Date.now() / 2000 );
        var r = 15.0;
        var lx = r * Math.cos( t );
        var lz = r * Math.sin( t );
        var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
        rectLight.position.set( lx, ly, lz );
        rectLight.lookAt( origin );
    }
    renderer.render( scene, camera );
    stats.update();
}