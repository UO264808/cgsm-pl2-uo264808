import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}, false );

const scene = new THREE.Scene();
const renderer = WEBGL.isWebGLAvailable() ? new THREE.WebGLRenderer( {antialias: true} ) : new THREE.CanvasRenderer();
                                            renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 7 );

const geometry_box = new THREE.BoxGeometry( 1, 1, 1 );
const material_box = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
const box = new THREE.Mesh( geometry_box, material_box );
//box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
scene.add( box );
box.position.set( -3, 0, 0 );

const geometry_sphere = new THREE.SphereGeometry( 1 );
const material_sphere = new THREE.MeshBasicMaterial(  {color: 0x008000} );
const sphere = new THREE.Mesh( geometry_sphere, material_sphere );
scene.add( sphere );
sphere.position.set( 3, 0, 0 );

const geometry_cylinder = new THREE.CylinderGeometry( 0.5, 0.5, 1, 50 );
const material_cylinder = new THREE.MeshBasicMaterial( {color: 0x0000FF} );
const cylinder = new THREE.Mesh( geometry_cylinder, material_cylinder );
cylinder.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
scene.add( cylinder );
cylinder.position.set( 0, 0, 0 );

renderer.render( scene, camera );
