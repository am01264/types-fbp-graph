declare module "fbp-graph/lib/graph" {

    import {EventEmitter} from "events";
    import {Component} from "noflo";

    type Callback<T> = (err? : Error | null, result? : T) => void;

    export class Graph extends EventEmitter {
        
        name : string;
        caseSensitive : boolean;
        properties : Graph.PropertyMap;
        nodes : Graph.Node[];
        edges : Graph.Edge[];
        initializers : Graph.Initializer[];
        inports : { [key : string] : Graph.Port };
        outports : { [key : string] : Graph.Port };
        groups : Graph.Group[];
        transaction : { id : Graph.TransactionID | null, depth : number }

        constructor(name : string, options? : Graph.ConstructorOptions);

        getPortName( port : string ) : string;
        startTransaction(id : Graph.TransactionID, metadata : Graph.TransactionMetadata) : void;            
        endTransaction(id : Graph.TransactionID, metadata : Graph.TransactionMetadata) : void;

        checkTransactionStart() : void;
        checkTransactionEnd() : void;

        setProperties(properties : Graph.PropertyMap) : void;
        
        addInport(publicPort : string, nodeKey : Graph.NodeID, portKey : Graph.PortID, metadata : Graph.NodeMetadata) : void;
        removeInport(publicPort : string) : void;
        renameInport(oldPort : string, newPort : string) : void;
        setInportMetadata(publicPort : string, metadata : Graph.NodeMetadata) : void;

        addOutport(publicPort : string, nodeKey : Graph.NodeID, portKey : Graph.PortID, metadata : Graph.NodeMetadata) : void;
        removeOutport(publicPort : string) : void;
        renameOutport(oldPort : string, newPort : string) : void;
        setOutportMetadata(publicPort : string, metadata : Graph.NodeMetadata) : void;

        addGroup(group : string, nodes : Graph.Node[], metadata : Graph.GroupMetadata) : void;
        renameGroup(oldName : string, newName : string) : void;
        removeGroup(groupName : string) : void;
        setGroupMetadata(groupName : string, metadata : Graph.GroupMetadata) : void;

        addNode(id : string, component : Component, metadata : Graph.NodeMetadata) : Graph.Node
        removeNode(id : string) : void;
        getNode(id : string) : Graph.Node | null;
        renameNode(oldId : string, newId : string) : void;
        setNodeMetadata(id : string, metadata : Graph.NodeMetadata) : void;
    
        addEdge(outNode : Graph.NodeID, outPort : Graph.PortID, inNode : Graph.NodeID, inPort : Graph.PortID, metadata : Graph.EdgeMetadata) : Graph.Edge;
        addEdgeIndex(outNode : Graph.NodeID, outPort : Graph.PortID, outIndex : number, inNode : Graph.NodeID, inPort : Graph.PortID, inIndex : number, metadata : Graph.EdgeMetadata) : Graph.Edge;
        removeEdge(node : Graph.NodeID, port : Graph.PortID, node2 : Graph.NodeID, port2 : string) : void;
        getEdge(node : Graph.NodeID, port : Graph.PortID, node2 : Graph.NodeID, port2 : Graph.PortID) : Graph.Edge;
        setEdgeMetadata(node : Graph.NodeID, port : Graph.PortID, node2 : Graph.NodeID, port2 : Graph.PortID, metadata : Graph.EdgeMetadata) : void;

        addInitial(data : any, node : Graph.NodeID, port : Graph.PortID, metadata : Graph.InitializerMetadata) : Graph.Initializer;
        addInitialIndex(data : any, node : Graph.NodeID, port : Graph.PortID, index : number | string, metadata : Graph.InitializerMetadata) : Graph.Initializer;
        addGraphInitial(data : any, node : Graph.NodeID, metadata : Graph.InitializerMetadata) : Graph.Initializer;
        addGraphInitialIndex(data : any, node : Graph.NodeID, index : number | string, metadata : Graph.InitializerMetadata) : Graph.Initializer;
        removeInitial(node : Graph.Node, port : Graph.PortID) : void;
        removeGraphInitial(node : Graph.Node) : void;

        toDOT() : string;
        toYUML() : string;
        toJSON() : string;

        save(file : string, callback : Callback<string>) : void;

        /** Events */

        on( event : 'addNode', listener : (node : Graph.Node) => void) : this;
        on( event : 'removeNode', listener: (node : Graph.Node) => void) : this;
        on( event : 'renameNode', listener: (oldId : string, newId : string) => void) : this;
        on( event : 'changeNode', listener: (node : Graph.Node, oldMeta : ObjectMap) => void) : this;
        
        on( event : 'addEdge', listener: (edge : Graph.Edge) => void) : this;
        on( event : 'removeEdge', listener: (edge : Graph.Edge) => void) : this;
        on( event : 'changeEdge', listener: (edge : Graph.Edge) => void) : this;
        
        on( event : 'addInitial', listener: (iip : Graph.Initializer) => void) : this;
        on( event : 'removeInitial', listener: (iip : Graph.Initializer) => void) : this;
        
        on( event : 'changeProperties', listener: (newProps : ObjectMap, oldProps : ObjectMap) => void) : this;
        
        on( event : 'addGroup', listener: (group : Graph.Group) => void) : this;
        on( event : 'renameGroup', listener: (oldName : string, newName : string) => void) : this;
        on( event : 'removeGroup', listener: (group : Graph.Group) => void) : this;
        on( event : 'changeGroup', listener: (group : Graph.Group, before : Graph.Group, metadata : Graph.GroupMetadata) => void) : this;


        on( event : 'addInport', listener : (name : Graph.PortID, port :  Graph.EventPortData) => void) : this;
        on( event : 'removeInport', listener : (name : Graph.PortID, port : Graph.EventPortData) => void) : this;
        on( event : 'renameInport', listener : (oldId : Graph.PortID, newId : Graph.PortID) => void) : this;
        on( event : 'changeInport', listener : (name : Graph.PortID, port : Graph.EventPortData, before : Graph.PortMetadata, metadata : Graph.PortMetadata) => void) : this;
        
        on( event : 'addOutport', listener : (name : Graph.PortID, port : Graph.EventPortData) => void) : this;
        on( event : 'removeOutport', listener : (name : Graph.PortID, port : Graph.EventPortData) => void) : this;
        on( event : 'renameOutport', listener : (oldId : Graph.PortID, newId : Graph.PortID) => void) : this;
        on( event : 'changeOutport', listener : (name : Graph.PortID, port : Graph.EventPortData, before : Graph.PortMetadata, metadata : Graph.PortMetadata) => void) : this;
    
        on( event : 'startTransaction', listener : (id : Graph.TransactionID, meta : Graph.TransactionMetadata) => void) : this;
        on( event : 'endTransaction', listener : (id : Graph.TransactionID, meta : Graph.TransactionMetadata) => void) : this;

    }

    namespace Graph {

        interface ConstructorOptions {
            caseSensitive : boolean;
        }

        type TransactionID = string;
        type TransactionMetadata = any;

        type PropertyMap = { [key : string] : any };

        type PortID = string;
        type PortMetadata = ObjectMap;
        interface Port {
            process : Component;
            port: PortID;
            metadata: PortMetadata;
        }

        type NodeID = string;
        type NodeMetadata = ObjectMap;
        interface Node {
            id : NodeID;
            component : Component;
            metadata : NodeMetadata;
        }

        type EdgeMetadata = ObjectMap;
        interface Edge {
            from: {
                node: Node;
                port : string;
            };
            to: {
                node: Node;
                port: string;
            };
            metadata: EdgeMetadata;
        }

        type InitializerMetadata = EdgeMetadata;
        interface Initializer {
            from: {
                data: any;
            };
            to: {
                node: Node;
                port: string;
            };
            metadata: InitializerMetadata;
        }

        interface EventPortData {
            // TODO: Link up this with the correct typings
            process : Component;
            port : PortID;
            metadata : PortMetadata
        }
    
        type GroupMetadata = ObjectMap;
        interface Group {
            // TODO: Rename to something more appropriate
            name : string,
            nodes : Node[],
            metadata : GroupMetadata
        }
    }


    interface ObjectMap { 
        // TODO: Remove all uses of this type with stricter equivalents
        [key : string] : any 
    }

    export function createGraph(name : string, options : Graph.ConstructorOptions) : Graph;
    export function loadJSON(definition : string | Object, callback : Callback<Graph>, metadata : ObjectMap) : void;
    export function loadFBP(fbpData : string, callback : Callback<Graph>, metadata : ObjectMap, caseSensitive : boolean) : void;
    
    export function loadHTTP(url : string, callback : Callback<string>) : void;
    export function loadFile(file : string, callback : Callback<Graph>, metadata : ObjectMap, caseSensitive : boolean) : void;

    export function equivalent(a : any, b : any, options : Object) : boolean;
    export function mergeResolveTheirsNaive(base : Graph, to : Graph) : Graph;

}
