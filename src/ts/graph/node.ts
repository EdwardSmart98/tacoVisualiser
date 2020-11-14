import { nodeData } from "../dataHandlers/types";
import * as THREE from 'three';
import { ConfigValues } from "../configValues";
import { Edge } from "./edge";

export class Node{


    private data : nodeData
    private position : THREE.Vector3 = new THREE.Vector3()
    private velocity : THREE.Vector3 = new THREE.Vector3()
    private weight : number = 1;
    private bufferedForce : THREE.Vector3 = new THREE.Vector3();
    private edges : Edge[] = []

    constructor(data : nodeData,startPosition : THREE.Vector3){
        this.position.copy(startPosition)
        this.data = data;
        this.weight = data.edges.map(x => x.tacos).reduce((prev,curr) => prev+curr,0);
    }

    public addEdge(edge : Edge) : void{
        this.edges.push(edge);
    }

    public updateWeight() : void{
        this.weight = this.data.edges.map(x => x.tacos).reduce((prev,curr) => prev+curr,0);
    }

    public getWeight() : number{
        return this.weight;
    }

    public getUid() : string{
        return this.data.uid;
    }

    public getPosition() : THREE.Vector3{
        return this.position.clone();
    }


    public update(deltaTime : number) : void{
        this.velocity.add(this.bufferedForce.multiplyScalar(1/this.weight));
        this.bufferedForce.set(0,0,0);
        const newSpeed = this.velocity.clone().multiplyScalar(1- ConfigValues.drag)
        this.velocity.lerp(newSpeed,deltaTime);
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime))
    }


    /**
     * add a force to be added on the next movement
     * @param force 
     */
    public addEdgeForce(force : THREE.Vector3){
        this.bufferedForce.add(force);
    }


    public getEdges() : Edge[] {
        return this.edges
    }


}