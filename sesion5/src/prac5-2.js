import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

// Resize scene
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}, false );

// Overlay
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => init(), false);

function init() {
    var overlay = document.getElementById('overlay');
    overlay.remove();

    // Do stuff
    const video = document.getElementById('video');
    video.play();
    // Video stuff
    const url = "http://localhost:60080/sintel.mpd";
    const player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);
}


// Create scene and renderer
const scene = new THREE.Scene();
const renderer = WEBGL.isWebGLAvailable() ? new THREE.WebGLRenderer( {antialias: true} ) : new THREE.CanvasRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create camera a set a position
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 500 );

// Obtain vide html element
const video = document.getElementById( 'video' );

const image = document.createElement( 'canvas' );
image.width = 480;  // Video width
image.height = 204; // Video height
const imageContext = image.getContext( '2d' );
imageContext.fillStyle = '#000000';
imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );
const texture = new THREE.Texture( image );

const material = new THREE.MeshBasicMaterial( { map: texture } );
const wall = new THREE.Mesh( new THREE.PlaneGeometry( image.width, image.height, 4, 4 ), material );
scene.add(wall);

// Add light
const light = new THREE.PointLight( 0xFFFFFFFF, 1.5);
light.position.set( 0, 0, 8 );
scene.add( light );

const clock = new THREE.Clock( );

animate();

function animate( ) {

    // Animate the plane
    const delta = clock.getDelta( ); // Elapsed time in seconds
    const rotation = ( delta * Math.PI * 2 ) / 14;
    wall.rotation.y += rotation;-

    // Render the scene
    renderer.render( scene, camera );

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame( animate );

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

        imageContext.drawImage( video, 0, 0 );
        if ( texture ) texture.needsUpdate = true;
    }
};