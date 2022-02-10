import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

// Resize scene
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}, false );

// Create scene and renderer
const scene = new THREE.Scene();
const renderer = WEBGL.isWebGLAvailable() ? new THREE.WebGLRenderer( {antialias: true} ) : new THREE.CanvasRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create camera a set a position
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 2, 0, 10 );

// Create box object
const geometry_box = new THREE.BoxGeometry( 1, 1, 1 );
const material_box = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
const box = new THREE.Mesh( geometry_box, material_box );
//box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
scene.add( box );
box.position.set( -3, 0, 0 );

// Create sphere object
const geometry_sphere = new THREE.SphereGeometry( 1 );
const material_sphere = new THREE.MeshPhongMaterial(  {color: 0x008000} );
const sphere = new THREE.Mesh( geometry_sphere, material_sphere );
scene.add( sphere );
sphere.position.set( 3, 0, 0 );

// Create cylinder object
const geometry_cylinder = new THREE.CylinderGeometry( 0.5, 0.5, 1, 50 );
const material_cylinder = new THREE.MeshLambertMaterial( {color: 0x0000FF} );
const cylinder = new THREE.Mesh( geometry_cylinder, material_cylinder );
cylinder.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
scene.add( cylinder );
cylinder.position.set( 0, 0, 0 );

// Create house object
const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array( [
	
    // Main body of the house I
    -1.0, -0.1,  1.0,
	 1.0, -0.1,  1.0,
	 1.0,  1.0,  1.0,

    // Main body of the house II
	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -0.1,  1.0,

    // Main body of the house III
    -1.0, -0.7, 1.0,
    -0.3, -0.7, 1.0,
    -0.3, -0.1, 1.0,

    // Main body of the house IV
    -1.0, -0.1, 1.0,
    -1.0, -0.7, 1.0,
    -0.3, -0.1, 1.0,

    // Main body of the house V
     0.3, -0.7, 1.0,
     1.0, -0.7, 1.0,
     0.3, -0.1, 1.0,

    // Main body of the house VI
     0.3, -0.1, 1.0,
     1.0, -0.7, 1.0,
     1-0, -0.1, 1.0,

    // Roof
    -1.3, 1.0, 1.0,
     1.3, 1.0, 1.0,
     0.0, 2.0, 1.0,

    // Chimney I
     0.3, 1.6, 1.0,
     0.6, 2.0, 1.0,
     0.3, 2.0, 1.0,

    // Chimney II
     0.6, 2.0, 1.0,
     0.3, 1.6, 1.0,
     0.6, 1.3, 1.0
    
] );

geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
const house = new THREE.Mesh( geometry, material );
scene.add(house);
house.position.set( 6, 0, 0 );

// White directional light from the top.
const directionalLight = new THREE.DirectionalLight( 0xFFFFFFFF, 0.8 );
directionalLight.position.set( 2 ,0 ,6 );
scene.add( directionalLight );

// Render objects into scene
renderer.render( scene, camera );
