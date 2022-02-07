import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WEBGL.isWebGLAvailable() ) {
    // WebGL is available
    alert("WEBGL sí está disponible en el navegador")
}
else{
    alert("WEBGL no está disponible para el navegador")
}