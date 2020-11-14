import * as THREE from "three";
import { OrbitControls } from './lib/orbitControls';
import Stats from "stats.js";
import { Color } from "three";
import { DatabaseConnection } from "@/ts/dataHandlers/databaseConnection";
import { StoreLocal } from "./dataHandlers/storeLocal";
import { LocalDataConnection } from "./dataHandlers/localDataConnection";
import { Graph } from "./graph/graph";
import { GraphRenderer } from "./graph/graphRenderer";
import { ConfigValues } from "./configValues";

import "@/css/main.css";

let container : HTMLDivElement;
let scene : THREE.Scene;
let camera : THREE.PerspectiveCamera;
let renderer : THREE.WebGLRenderer;
let controls : OrbitControls;


let graph : GraphRenderer
let gui = ConfigValues.setup()

//Display FPS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild( stats.dom );
init();
animate();


function init(){
    container = document.createElement('div');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight);
    camera.position.setZ(60);
    camera.position.setX(50);
    camera.position.setY(50);
    renderer = new THREE.WebGLRenderer({alpha : true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    scene.background = new THREE.Color(0x000000);


    //Add light to the scene
    const DirectionalLight = new THREE.DirectionalLight( 0x0F0F0F,5);
    DirectionalLight.position.setZ(2);
    DirectionalLight.position.setY(2);
	DirectionalLight.rotation.set(0,0,-Math.PI/2);
    scene.add(DirectionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff,0.3);
    scene.add(ambientLight);
    
    window.addEventListener( "resize", onWindowResize, false );
	container.appendChild( renderer.domElement );
    document.body.appendChild( container );
    
    controls = new OrbitControls(camera,renderer.domElement);

    const dbConnection = new LocalDataConnection();
    dbConnection.connect();
    dbConnection.requestTransactions(10000).then(result => {
        const store = new StoreLocal()
        const g = new Graph(result);
        graph =  new GraphRenderer(g,scene,camera);
    })
}

function animate(){
    
    stats.begin();
    requestAnimationFrame(animate);
    render();
    stats.end();
}

function render(){
    if(controls){
        controls.update();
    }
    if(graph){
        graph.update(0.5);
    }
    renderer.clear();
    renderer.render(scene,camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}