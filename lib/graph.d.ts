declare module "fbp-graph/lib/graph" {

    import {EventEmitter} from "events";
    import {Component} from "noflo";

    type Callback<T> = (err? : Error | null, result? : T) => void;

    export class Graph extends EventEmitter {
        getPortName( port : string ) : string;
        startTransaction(id : any, metadata : ObjectMap) : boolean;            
        endTransaction(id : any, metadata : ObjectMap) : boolean;

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

        addGroup(group : string, nodes : Graph.Node[], metadata : Object) : boolean;
        renameGroup(oldName : string, newName : string) : boolean;
        removeGroup(groupName : string) : boolean;
        setGroupMetadata(groupName : string, metadata : Object) : boolean;

        addNode(id : string, component : Component, metadata : Object) : Graph.Node
        removeNode(id : string) : boolean;
        getNode(id : string) : Graph.Node | null;
        renameNode(oldId : string, newId : string) : boolean;
        setNodeMetadata(id : string, metadata : Object) : boolean;
    
        addEdge(outNode : Graph.Node, outPort : string, inNode : Graph.Node, inPort : string, metadata : Object) : Graph.Edge;
        addEdgeIndex(outNode : Graph.Node, outPort : string, outIndex : number, inNode : Graph.Node, inPort : string, inIndex : number, metadata : Object) : Graph.Edge;
        removeEdge(node : Graph.Node, port : string, node2 : Graph.Node, port2 : string) : boolean;
        getEdge(node : Graph.Node, port : string, node2 : Graph.Node, port2 : string) : Graph.Edge;
        setEdgeMetadata(node : Graph.Node, port : string, node2 : Graph.Node, port2 : string, metadata : Object) : boolean;

        addInitial(data : any, node : Graph.Node, port : string, metadata : Object) : Graph.Initializer;
        addInitialIndex(data : any, node : Graph.Node, port : string, index : number | string, metadata : Object) : Graph.Initializer;
        addGraphInitial(data : any, node : Graph.Node, metadata : Object) : Graph.Initializer;
        addGraphInitialIndex(data : any, node : Graph.Node, index : number | string, metadata : Object) : Graph.Initializer;
        removeInitial(node : Graph.Node, port : string) : boolean;
        removeGraphInitial(node : Graph.Node) : boolean;

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
        
        on( event : 'addGroup', listener: (group : Graph.EventGroupData) => void) : this;
        on( event : 'renameGroup', listener: (group : Graph.EventGroupData) => void) : this;
        on( event : 'removeGroup', listener: (group : Graph.EventGroupData) => void) : this;
        on( event : 'changeGroup', listener: (group : Graph.EventGroupData, oldMeta) => void) : this;

        on( event : 'addExport', listener : (exported) => void) : this;
        on( event : 'removeExport', listener : (exported) => void) : this;
    
        

        on( event : 'addInport', listener : (name : string, port :  Graph.EventPortData) => void) : this;
        on( event : 'removeInport', listener : (name : string, port : Graph.EventPortData) => void) : this;
        on( event : 'renameInport', listener : (oldId : string, newId : string) => void) : this;
        on( event : 'changeInport', listener : (name : string, port : Graph.EventPortData, oldMeta : ObjectMap) => void) : this;
        
        on( event : 'addOutport', listener : (name : string, port : Graph.EventPortData) => void) : this;
        on( event : 'removeOutport', listener : (name : string, port : Graph.EventPortData) => void) : this;
        on( event : 'renameOutport', listener : (oldId : string, newId : string) => void) : this;
        on( event : 'changeOutport', listener : (name : string, port : Graph.EventPortData, oldMeta : ObjectMap) => void) : this;
    
        on( event : 'startTransaction', listener : (id : string, meta : ObjectMap) => void) : this;
        on( event : 'endTransaction', listener : (id : string, meta : ObjectMap) => void) : this;

    }

    namespace Graph {
        type ConstructorOptions = Object;

        interface Node {
            id : string;
            component : Component;
            metadata : Object
        }

        interface Edge {
            from: {
                node: Node;
                port : string;
            };
            to: {
                node: Node;
                port: string;
            };
            metadata: ObjectMap;
        }

        interface Initializer {
            from: {
                data: any;
            };
            to: {
                node: Node;
                port: string;
            };
            metadata: ObjectMap;
        }

        interface EventPortData {
            // TODO: Link up this with the correct typings
            process : Component;
            port : string;
            metadata : ObjectMap
        }
    
        interface EventGroupData {
            // TODO: Rename to something more appropriate
            name : string,
            nodes : Component[],
            metadata : ObjectMap
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
