import * as THREE from 'three';
import { TextureLoader } from 'three';
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
camera.position.set( 0, 0, 3 );

// Create and specify texture
const mapUrl = "../textures/earth.gif";   // The file used as texture
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const map = textureLoader.load(
    // resource URL
    mapUrl,
    
    // onLoad callback
    ( loaded ) => { renderer.render( scene, camera ); },

    // onProgress callback
    undefined,

    // onError callback
    undefined
);

// Create Earth
const geometry_earth = new THREE.SphereGeometry( 1 );
const material_earth = new THREE.MeshPhongMaterial(  { map: map } );
const earth = new THREE.Mesh( geometry_earth, material_earth );
scene.add( earth );
earth.position.set( 0, 0, 0 );

// Add light
const light = new THREE.PointLight( 0xFFFFFFFF, 2);
light.position.set( 95, 0, 0 );
scene.add( light );

// Render object into scene
renderer.render( scene, camera );