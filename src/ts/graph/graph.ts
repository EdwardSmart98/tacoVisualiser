import { edgeData, transaction, nodeData } from "../dataHandlers/types";

export class Graph {
  public nodes: nodeData[] = [];
  public edges: edgeData[] = [];


  constructor(rawTransactions: transaction[]) {
      rawTransactions.forEach(x => {
          if(!x.tacos){
              console.log(x)
          }
      })
    this.nodes = this.createNodes(rawTransactions);
    this.edges = this.createEdges(this.nodes, rawTransactions);
  }

  public createNodes(rawTransactions: transaction[]): nodeData[] {
    const addedUid = {};
    const nodes: nodeData[] = [];

    rawTransactions.forEach((transaction) => {
      if (addedUid[transaction.giver_uid] === undefined) {
        nodes.push({
          uid: transaction.giver_uid,
          username: transaction.giver_username,
          edges : []
        });
        addedUid[transaction.giver_uid] = true;
      }
      if (addedUid[transaction.receiver_uid] === undefined) {
        nodes.push({
          uid: transaction.receiver_uid,
          username: transaction.receiver_username,
          edges : []
        });
        addedUid[transaction.receiver_uid] = true;
      }
    });
    return nodes;
  }

  public createEdges(nodes: nodeData[], rawTransactions: transaction[]): edgeData[] {
    const edges: edgeData[] = [];
    const nodeDictionary = {}; //make a dictionary for quick lookup
    nodes.forEach((node) => (nodeDictionary[node.uid] = node));
    rawTransactions.forEach((transaction) => {
      const node_one = nodeDictionary[transaction.receiver_uid];
      const node_two = nodeDictionary[transaction.giver_uid];
      const currentEdge = this.findEdge(node_one, node_two, edges);
      if (currentEdge) {
        currentEdge.messages.push(transaction.message);
        currentEdge.tacos += transaction.tacos;
      } else {
        edges.push(
          this.newEdge(
            node_one,
            node_two,
            transaction.tacos,
            transaction.message
          )
        );
      }
    });
    return edges
  }

  newEdge(node_one: nodeData, node_two: nodeData, tacos: number, message: string): edgeData {
    //order to simplify searching
    if(!node_one || !node_two){
        return undefined
    }
    if (node_two.uid < node_one.uid) {
      const temp_node = node_two;
      node_two = node_one;
      node_one = temp_node;
    }
    const new_edge = {
        node_one: node_one,
        node_two: node_two,
        tacos: tacos,
        messages: [message],
      };
    node_one.edges.push(new_edge);
    node_two.edges.push(new_edge);
    return new_edge;
  }

  private findEdge(node_one: nodeData, node_two: nodeData, connections: edgeData[]): edgeData {
    if(!node_one || !node_two){
        return undefined
    }
    //order to simplify searching
    if (node_two.uid < node_one.uid) {
      const temp_node = node_two;
      node_two = node_one;
      node_one = temp_node;
    }
    return connections.find(
      (x) => x.node_one === node_one && x.node_two === node_two
    );
  }

  private onlyUnique<T>(value: T, index: number, self: T[]) {
    self.indexOf(value) === index;
  }
}
