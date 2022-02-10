import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

// Create scene and renderer
const scene = new THREE.Scene();
const renderer = WEBGL.isWebGLAvailable() ? new THREE.WebGLRenderer( {antialias: true} ) : new THREE.CanvasRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create camera a set a position
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 3 );

// Create box object
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( );
const box = new THREE.Mesh( geometry, material );
scene.add( box );

// Render object into scene
renderer.render( scene, camera );
