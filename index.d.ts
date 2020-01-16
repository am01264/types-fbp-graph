declare module "fbp-graph" {

    import {EventEmitter} from "events";

    type Callback<T> = (err? : Error | null, result? : T) => void;

    // TODO: namespace journal

    namespace graph {

        class Graph extends EventEmitter {
            getPortName( port : string ) : string;
            startTransaction(id : any, metadata : any) : boolean;            
            endTransaction(id : any, metadata : any) : boolean;

            checkTransactionStart() : boolean;
            checkTransactionEnd() : boolean;

            setProperties(properties : Object) : boolean;
            
            addInport(publicPort : string, nodeKey : string, portKey : string, metadata : Object) : boolean;
            removeInport(publicPort : string) : boolean;
            renameInport(oldPort : string, newPort : string) : boolean
            setInportMetadata(publicPort : string, metadata : Object) : boolean

            addOutport(publicPort : string, nodeKey : string, portKey : string, metadata : Object) : boolean;
            removeOutport(publicPort : string) : boolean;
            renameOutport(oldPort : string, newPort : string) : boolean;
            setOutportMetadata(publicPort : string, metadata : Object) : boolean;

            addGroup(group : string, nodes : any[], metadata : Object) : boolean;
            renameGroup(oldName : string, newName : string) : boolean;
            removeGroup(groupName : string) : boolean;
            setGroupMetadata(groupName : string, metadata : Object) : boolean;

            addNode(id : string, component : any, metadata : Object) : Graph.Node
            removeNode(id : string) : boolean;
            getNode(id : string) : Graph.Node;
            renameNode(oldId : string, newId : string) : boolean;
            setNodeMetadata(id : string, metadata : Object) : boolean;
        
            addEdge(outNode : string, outPort : string, inNode : string, inPort : string, metadata : Object) : Graph.Edge;
            addEdgeIndex(outNode : string, outPort : string, outIndex : number, inNode : string, inPort : string, inIndex : number, metadata : Object) : Graph.Edge;
            removeEdge(node : string, port : string, node2 : string, port2 : string) : boolean;
            getEdge(node : string, port : string, node2 : string, port2 : string) : Graph.Edge;
            setEdgeMetadata(node : string, port : string, node2 : string, port2 : string, metadata : Object) : boolean;

            addInitial(data : any, node : string, port : string, metadata : Object) : Graph.Initializer;
            addInitialIndex(data : any, node : string, port : string, index : number | string, metadata : Object) : Graph.Initializer;
            addGraphInitial(data : any, node : string, metadata : Object) : Graph.Initializer;
            addGraphInitialIndex(data : any, node : string, index : number | string, metadata : Object) : Graph.Initializer;
            removeInitial(node : string, port : string) : boolean;
            removeGraphInitial(node : string) : boolean;

            toDOT() : string;
            toYUML() : string;
            toJSON() : string;

            save(file : string, callback : Callback<string>) : void;
        }

        namespace Graph {
            type ConstructorOptions = Object;

            interface Node {
                id : string;
                component : any /* noflo.Component */;
                metadata : Object
            }

            interface Edge {
                from: {
                    node: string;
                    port : string;
                };
                to: {
                    node: string;
                    port: string;
                };
                metadata: Object;
            }

            interface Initializer {
                from: {
                    data: any;
                };
                to: {
                    node: string;
                    port: string;
                };
                metadata: Object;
            }
        }

        type Metadata = Object

        export function createGraph(name : string, options : Graph.ConstructorOptions) : Graph;
        export function loadJSON(definition : string | Object, callback : Callback<Graph>, metadata : Metadata) : void;
        export function loadFBP(fbpData : string, callback : Callback<Graph>, metadata : Metadata, caseSensitive : boolean) : void;
        
        export function loadHTTP(url : string, callback : Callback<string>) : void;
        export function loadFile(file : string, callback : Callback<Graph>, metadata : Metadata, caseSensitive : boolean) : void;

        export function equivalent(a : any, b : any, options : Object) : boolean;
        export function mergeResolveTheirsNaive(base : Graph, to : Graph) : Graph;
    }

    export {graph as Graph}

}
