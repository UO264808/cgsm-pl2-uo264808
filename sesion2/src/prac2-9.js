import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
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
//////////////////////////////////////////////////
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
//////////////////////////////////////////////////

// Create camera a set a position
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 4, 0, 8 );

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

/////////////////////////////////////////
earth.receiveShadow = true;
/////////////////////////////////////////

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

/////////////////////////////////////////
atm.receiveShadow = true;
/////////////////////////////////////////

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
    
    const moon_translation = ( delta * Math.PI * 2 ) / (10);
    moonGroup.rotation.y += moon_translation;

    uniforms[ "time" ].value += 0.4 * delta;

    issobj.rotation.y += rotation;
    
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

/////////////////////////////////////////
moon.castShadow = true;
/////////////////////////////////////////

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

// Create sun
const NOISEMAP = '../textures/sun_noise.png';
const SUNMAP = '../textures/surface_sun.jpg';
const sun_textureLoader = new THREE.TextureLoader( );
const uniforms = {
    "fogDensity": { value: 0 },
    "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
    "time": { value: 1.0 },
    "uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
    "texture1": { value: sun_textureLoader.load( NOISEMAP ) },
    "texture2": { value: sun_textureLoader.load( SUNMAP ) }
};

uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

const vertexShader = require( '../shaders/vertex.glsl' );
const fragmentShader = require( '../shaders/fragment.glsl' );

const sun_material = new THREE.ShaderMaterial( {
    uniforms,
    vertexShader,
    fragmentShader
} );

const sun_geometry = new THREE.SphereGeometry( 5 );
const sun = new THREE.Mesh( sun_geometry, sun_material );
sun.position.set( 50, 5, -80 );
scene.add(sun);

// Create iss
const modelUrl = "../models/iss/models/iss.dae";
let iss;

const issobj = new THREE.Object3D();

const loadingManager = new THREE.LoadingManager( ( ) => {
    issobj.add(iss)
    scene.add( issobj );
    console.log( 'Model loaded' );
} );

const loader = new ColladaLoader( loadingManager );
loader.load( modelUrl, ( collada ) => {

    iss = collada.scene;
    iss.scale.x = iss.scale.y = iss.scale.z = 0.001;
    iss.position.set( 1.1, 0, 0 );
    iss.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    iss.updateMatrix( );
} );

// Add light
const light = new THREE.DirectionalLight( 0xFFFFFFFF, 2);
light.position.set( 50, 0, -80 /*95, 0, 0*/ );

/////////////////////////////////////////
light.castShadow = true;
/////////////////////////////////////////

scene.add( light );

// Animate the Earth and the atmosphere
animate();
