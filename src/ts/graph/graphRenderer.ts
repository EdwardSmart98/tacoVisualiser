import { Node } from "./node";
import { Edge } from "./edge";
import { Graph } from "./graph";
import * as THREE from 'three';
import { ConfigValues } from "../configValues";
import { RaycastWrapper } from "../interaction.ts/raycastWrapper";

const startAreaRadius = 50

export class GraphRenderer{



    private nodes: Node[] = []
    private edges: Edge[] = []
    private nodeMesh : THREE.InstancedMesh
    private lineMesh : THREE.LineSegments
    private interserctor :  RaycastWrapper


    constructor(graph : Graph,scene : THREE.Scene,camera : THREE.Camera){
        this.interserctor = new RaycastWrapper(camera) 
        this.nodes = this.createNodes(graph);
        this.edges = this.createEdges(graph,this.nodes);
        this.nodes.forEach(node => node.updateWeight());
        this.nodeMesh = this.createNodeMesh(graph.nodes.length);
        this.lineMesh = this.createLineMesh(graph.edges.length);
        scene.add(this.nodeMesh);
        scene.add(this.lineMesh);
    }

    public update(deltaTime : number){
        this.edges.forEach(edge => edge.update(deltaTime));
        this.nodes.forEach(node => node.update(deltaTime));
        this.updateRender();
    }


    private updateRender() {
        const intersect = this.interserctor.getInstanceIntersect(this.nodeMesh);
        let nodesToShow = new Set()
        let edgesToShow : Edge[] = []
        if(intersect > -1){
            const startNode = this.nodes[intersect]
            nodesToShow.add(intersect);
            edgesToShow = startNode.getEdges().filter(edge => edge.getTacos() >= ConfigValues.minTacosDisplay);
            const otherNodes = edgesToShow.map(edge => edge.getOtherNode(startNode))
            otherNodes.forEach(node => nodesToShow.add(this.nodes.indexOf(node)));
        }else{
            edgesToShow = this.edges.filter(x => x.getTacos() >= ConfigValues.minTacosDisplay);
            const allNodes = edgesToShow.map(x => x.getNodes())
            const flat_all_Nodes : Node[] = [].concat.apply([],allNodes);
            for(let i = 0; i < flat_all_Nodes.length; i++){
                nodesToShow.add(this.nodes.indexOf(flat_all_Nodes[i]));
            }
        }


        const lineGeo : THREE.Vector3[] = []
        this.nodes.forEach((node,index) => {
            const matrix = new THREE.Matrix4().setPosition(node.getPosition());
            const scale = nodesToShow.has(index) ? 1 + (node.getWeight() * ConfigValues.weightScale) : 0;
            const scaleMatrix = new THREE.Matrix4().makeScale(scale,scale,scale);
            this.nodeMesh.setMatrixAt(index,matrix.multiply(scaleMatrix));
        })
        this.nodeMesh.instanceMatrix.needsUpdate = true;
        edgesToShow.forEach((edge) => {
            if(edge.getTacos() >= ConfigValues.minTacosDisplay){
                lineGeo.push(edge.getStartPoint());
                lineGeo.push(edge.getEndPoint());
            }
        })
        this.lineMesh.geometry.setFromPoints(lineGeo);

    }




    private createNodes(graph: Graph): Node[] {
        const nodes : Node[] = []
        graph.nodes.forEach(node => {
            const startPoint = new THREE.Vector3().random().multiplyScalar(startAreaRadius);
            nodes.push( new Node(node,startPoint))
        })
        return nodes
    }

    private createEdges(graph: Graph, nodes: Node[]): Edge[] {
        const edges : Edge[] = [];
        const nodesDict = {}
        nodes.forEach(node => {
            nodesDict[node.getUid()] = node
        })

        const maxTacos = Math.max(...graph.edges.map(x => x.tacos));
        graph.edges.forEach(edge => {
            edges.push(new Edge(edge,nodesDict[edge.node_one.uid],nodesDict[edge.node_two.uid],maxTacos));
        })
        return edges;
    }


    private createNodeMesh(count: number) : THREE.InstancedMesh {
        const mesh = new THREE.SphereBufferGeometry(0.1,20,20);
        const material = new THREE.MeshLambertMaterial({color : 0x00ff00});
        const instancedMesh = new THREE.InstancedMesh(mesh,material,count)
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        instancedMesh.matrixAutoUpdate = true;
        return instancedMesh;
    }

    private createLineMesh(count: number): THREE.LineSegments {
        const geo = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({color : 0x00ff00});
        const mesh = new THREE.LineSegments(geo,material);
        return mesh;
    }



}