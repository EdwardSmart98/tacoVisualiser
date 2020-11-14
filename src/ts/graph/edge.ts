import { edgeData } from "../dataHandlers/types";
import { Node } from "./node";
import { MathUtils } from "three";
import { ConfigValues } from "../configValues";



//Increasing this number, the edge pulls at its' full strength quicker
const distanceOffByFactor = 1


export class Edge{

    private data : edgeData
    private nodeOne : Node
    private nodeTwo : Node
    private maxTacos : number 

    constructor(data : edgeData,node_one : Node,node_two : Node,maxTacos : number){
        this.data = data;
        this.nodeOne = node_one;
        this.nodeTwo = node_two;
        this.nodeOne.addEdge(this);
        this.nodeTwo.addEdge(this);
        this.maxTacos = maxTacos;
    }


    public getOtherNode(node : Node) : Node{
        if(node === this.nodeOne){
            return this.nodeTwo
        }else{
            return this.nodeOne
        }
    }

    public getNodes() : Node[]{
        return [this.nodeOne,this.nodeTwo]
    }

    public getTacos() : number{
        return this.data.tacos;
    }

    public getStartPoint() : THREE.Vector3{
        return this.nodeOne.getPosition();
    }

    public getEndPoint() : THREE.Vector3{
        return this.nodeTwo.getPosition();
    }

    private desiredLength() : number{
        return MathUtils.lerp(ConfigValues.maxLength,ConfigValues.minLength, Math.pow(this.data.tacos/this.maxTacos,0.2))
    }

    private strength() : number{
        return  MathUtils.lerp(ConfigValues.minStrength,ConfigValues.maxStrength,Math.pow(this.data.tacos/this.maxTacos,2))
    }

    public update(deltaTime : number) : void{
        if(this.data.tacos < ConfigValues.minTacoEffect){
            return;
        }
        const forceVector = this.getVector();
        const length = forceVector.length();
        const desiredLength = this.desiredLength();
        const strength = this.strength();
        const lengthDesireChange = desiredLength - length;
        //how far off we are as a ratio of the desired length
        const offByFactor = Math.abs(lengthDesireChange/desiredLength)
        const force = strength * Math.sign(lengthDesireChange) * Math.min(1,offByFactor)
        const toAdd = forceVector.normalize().multiplyScalar(force * deltaTime);
        this.nodeTwo.addEdgeForce(toAdd);
        this.nodeOne.addEdgeForce(toAdd.multiplyScalar(-1));
        return
    }

    public getVector() : THREE.Vector3{
        return this.nodeTwo.getPosition().sub(this.nodeOne.getPosition());
    }
}