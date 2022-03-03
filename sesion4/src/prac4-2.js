import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

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
camera.position.set( 0, 10, 100 );

// Overlay
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => init(), false);

function init() {
    var overlay = document.getElementById('overlay');
    overlay.remove();
}

// Define grid
const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
helper.position.y = 0.1;
scene.add(helper);

// Add light
const light = new THREE.DirectionalLight( 0xFFFFFFFF, 1.5);
light.position.set( 0, 0.5, 100 );
scene.add( light );

// Add and assing AudioListener to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

const audioLoader = new THREE.AudioLoader();

// Assing sound to the first box
const sound_music = new THREE.PositionalAudio( listener );
audioLoader.load( "../sounds/376737_Skullbeatz___Bad_Cat_Maste.ogg", ( buffer ) => {
    sound_music.setBuffer( buffer );
    sound_music.setRefDistance( 20 );
    sound_music.setLoop( true );
    sound_music.setRolloffFactor( 1 );
    sound_music.play(); // Modern browsers do not allow sound to start without user interaction
});

// Assing sound to the second box
const sound_dog = new THREE.PositionalAudio( listener );
audioLoader.load( "../sounds/dog.ogg", ( buffer ) => {
    sound_dog.setBuffer( buffer );
    sound_dog.setRefDistance( 20 );
    sound_dog.setLoop( true );
    sound_dog.setRolloffFactor( 1 );
    sound_dog.play(); // Modern browsers do not allow sound to start without user interaction
});

const textureLoader = new THREE.TextureLoader();  // The object used to load textures
const specialFaceMaterial = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/button_cube.png", ( loaded ) => { renderer.render( scene, camera ); } ),
        bumpMap: textureLoader.load( "../textures/button_cube_map.png", ( loaded ) => { renderer.render( scene, camera ); } )
    } );// Material for a face
const regularFaceMaterial =  new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick.jpg", ( loaded ) => { renderer.render( scene, camera ); } ),
        bumpMap: textureLoader.load( "../textures/brick-map.jpg", ( loaded ) => { renderer.render( scene, camera ); } )
    } );// Material for the rest of the faces

// A box has 6 faces
const materials = [
    specialFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
];

// Create the mesh with the material array as parameter
const geometry = new THREE.BoxGeometry( 50, 50, 50 );
const box_1 = new THREE.Mesh( geometry, materials );
const box_2 = new THREE.Mesh( geometry, materials );

// Add sounds
box_1.add( sound_music );
box_2.add( sound_dog );

// Add name to the mesh
box_1.name = "box_1";
box_2.name = "box_2"; 

// Add boxes to the scene
scene.add( box_1 );
scene.add( box_2 );

// Rotate box_2 to get to the correcto position
box_2.rotation.set( 0, Math.PI, 0 );

// Fix postion of the boxes
box_1.position.set( -200, 25, 0 );
box_2.position.set( 200, 25, 0 );

// Create raycaster type
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;

// Add event listener
document.body.addEventListener( 'mousemove', ( event ) => {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}, false );

// Add hemispheric light
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xf0f0f0, 0.6 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

// Add controls to scene
const controls = new FirstPersonControls( camera );
controls.movementSpeed = 70;
controls.lookSpeed = 0.05;
controls.noFly = false;
controls.lookVertical = false;

// Clock needed to register time
const clock = new THREE.Clock( );

// Animate function
animate();

function animate( ) {

    const delta = clock.getDelta( ); // Elapsed time in seconds
    controls.update( delta );

    rayCaster.setFromCamera( mouse, camera );

    // Look for all the intersected objects
    const intersects = rayCaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {

        // Sorted by Z (close to the camera)
        if ( intersectedObject != intersects[ 0 ].object ) {

            intersectedObject = intersects[ 0 ].object;
            console.log( 'New intersected object: ' + intersectedObject.name );
        }
    } else {

        intersectedObject = null;
    }

    // Render the scene
    renderer.render( scene, camera );

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame( animate );
};