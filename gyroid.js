var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);  
//var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
//camera.position.set( 0, 300, 500 );
var renderer = new THREE.WebGLRenderer(); 
var mouse = { x: 0, y: 0 }, INTERSECTED;
var projector = new THREE.Projector();

renderer.sortObjects = false;
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
window.addEventListener( 'resize', onWindowResize, false );

var parent = new THREE.Object3D();
parent.rotation.x += Math.PI / 4
scene.add( parent );

var lowSaturation = 0.4;
var highSaturation = 0.6;
var lowBrightness = 0.7;
var highBrightness = 0.7;

var loader = new THREE.OBJLoader();
loader.load( "gyroid.obj", function ( object ) {
  scene.add( object );
} );


var fillMaterial = new THREE.MeshLambertMaterial( { 
	color: new THREE.Color().setHSV(hue, lowSaturation, lowBrightness),
	opacity: 1,
	transparent: true,
	side: THREE.DoubleSide,
	depthTest: true 
} );

var wireframeMaterial = new THREE.MeshBasicMaterial( { 
	color: new THREE.Color().setHSV(hue, lowSaturation, lowBrightness), 
	wireframe: true,  
	opacity: 0.5, 
	side: THREE.DoubleSide 
} );
	

var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, 1 );
scene.add( light );

light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, -1 );
scene.add( light );

camera.position.z = 4;

function render() { 
	parent.rotation.y += 0.002;
	requestAnimationFrame(render); 
	
	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.1 );
//	line.geometry.vertices[0] = vector;
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.subSelf( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( scene.children, true );
	
//	line.geometry.vertices[1] = vector.subSelf( camera.position ).normalize();

	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0].object) {
			if (INTERSECTED) 
				INTERSECTED.material.color = INTERSECTED.currentColor;

			INTERSECTED = intersects[0].object;
			INTERSECTED.currentColor = INTERSECTED.material.color;
		//	INTERSECTED.material.color = new THREE.Color().setHSV(INTERSECTED.hue, highSaturation, highBrightness);
		}
	} else {
		if (INTERSECTED) 
			INTERSECTED.material.color = INTERSECTED.currentColor;
			
		INTERSECTED = null;
	}
	
	
	renderer.render(scene, camera);
} 

render();

function onDocumentMouseMove( event ) {
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}