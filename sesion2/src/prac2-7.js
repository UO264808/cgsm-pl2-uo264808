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
camera.position.set( 0, 0, 10 );

// Create and specify texture
const mapUrl = "../textures/earth.gif";   // The file used as texture
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const map = textureLoader.load(
    // resource URL
    mapUrl,
    
    // onLoad callback
    ( loaded ) => { renderer.render( scene, camera ); }
);

// Create Earth
const geometry_earth = new THREE.SphereGeometry( 1 );
const material_earth = new THREE.MeshPhongMaterial(  { map: map } );
const earth = new THREE.Mesh( geometry_earth, material_earth );
earth.position.set( 0, 0, 0 );
//scene.add( earth );

// Create and specify texture
const atm_mapUrl = "../textures/atmosphere.png";   // The file used as texture
const atm_textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const atm_map = atm_textureLoader.load(
    // resource URL
    atm_mapUrl,
    
    // onLoad callback
    ( loaded ) => { renderer.render( scene, camera ); }
);

// Create atmosphere
const atm_geometry = new THREE.SphereGeometry( 1.01 );
const atm_material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: atm_map, transparent: true } );
const atm = new THREE.Mesh( atm_geometry, atm_material );
//scene.add( atm );
atm.position.set( 0, 0, 0 );

// Combine Earth and atmosphere in one Object3D to be rotated
const earth_atm = new THREE.Object3D();
earth_atm.add(earth);
earth_atm.add(atm);

// Add to scene
scene.add(earth_atm);

// Rotate the Object3D 23 degrees in order to obtain more realism
earth_atm.rotation.set( 0, 0, -0.36 ); 

const clock = new THREE.Clock( );

function animate( ) {

    const delta = clock.getDelta( ); // Elapsed time in seconds

    // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
    const rotation = ( delta * Math.PI * 2 ) / 24;
    earth.rotation.y += rotation;
    atm.rotation.y += rotation * 0.95;
    
    const moon_translation = ( delta * Math.PI * 2 ) / (24 * 28);
    moonGroup.rotation.y += moon_translation;
    
    // Render the scene
    renderer.render( scene, camera );

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame( animate );
};

// Create moon
const moonMapUrl = '../textures/moon_1024.jpg';
const moon_textureloader = new THREE.TextureLoader();
const moonMap = moon_textureloader.load( moonMapUrl, function(loaded) { renderer.render( scene, camera ); } );
const moon_material = new THREE.MeshLambertMaterial( { map: moonMap, color: 0x888888 } );

//... TODO: create the Moon and compute the distance to the Earth
const moon_geometry = new THREE.SphereGeometry( 0.27 );
const moon = new THREE.Mesh( moon_geometry, moon_material );

// Number of Earth radius between the Moon and Earth
const distance = 60.27;

// Move the Moon away from the coordinate origin (the Earth)
// NOT TO SCALE. Real value: Math.sqrt( distance * distance / 2 )
moon.position.set( Math.sqrt( distance / 2 ), 0, -Math.sqrt( distance / 2 ) );

// Rotate the Moon to face visible side to the Earth (tidal locking)
moon.rotation.y = Math.PI;

// Moon should rotate around the Earth: an Object3D is needed
const moonGroup = new THREE.Object3D( );
moonGroup.add( moon );
scene.add( moonGroup );
// The Moon orbit is a bit tilted
moonGroup.rotation.x = 0.089;

// Add light
const light = new THREE.PointLight( 0xFFFFFFFF, 2);
light.position.set( 95, 0, 0 );
scene.add( light );

// Animate the Earth and the atmosphere
animate();
