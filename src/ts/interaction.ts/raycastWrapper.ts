import * as THREE from "three";


export class RaycastWrapper{

    private mouse : THREE.Vector2 = new THREE.Vector2();
    private raycaster : THREE.Raycaster = new THREE.Raycaster();
    private camera : THREE.Camera

    constructor(camera : THREE.Camera) {
        this.camera = camera
        document.addEventListener('mousemove',(event) => this.onMouseMove(event),false);
    }


    public getInstanceIntersect(mesh : THREE.InstancedMesh) : number{
        this.raycaster.setFromCamera(this.mouse,this.camera);
        const intersection = this.raycaster.intersectObject(mesh);
        if(intersection.length > 0){
            return intersection[0].instanceId;
        }else{
            return -1
        }
    } 



    private onMouseMove( event : MouseEvent ) {
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }


}




