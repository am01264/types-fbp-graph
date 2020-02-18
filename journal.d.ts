declare module "fbp-graph/journal" {
    
    import { EventEmitter } from "events";
    import { Graph } from "fbp-graph/graph"

    type Callback<T> = (err : Error | null, result : T) => void;

    export class Journal {
        graph : Graph | null;
        entries : Journal.Entry[];
        subscribed : boolean;

        constructor( graph : Graph, metadata : Journal.ObjectMap, store : JournalStore);
        startTransaction(id : string, meta : Journal.ObjectMap) : void;
        endTransaction(id : string, meta : Journal.ObjectMap) : void;
        appendCommand(cmd : string, args : Journal.ObjectMap , rev : Journal.Revision) : void;
    
        executeEntry(entry : Journal.Entry);
        executeEntryInversed(entry : Journal.Entry);

        moveToRevision(revId : Journal.Revision) : void;
        undo() : void;
        canUndo() : boolean ;
        redo() : void;
        canRedo() : boolean ;
        toPrettyString(startRev : Journal.Revision, endRev : Journal.Revision) : string;
        toJSON(startRev : Journal.Revision, endRev : Journal.Revision) : string;
        save(file : string, success : Callback<Buffer>) : void;

    }

    namespace Journal {

        // TODO: Define this type properly
        type Entry = any;

        interface ObjectMap {
            // TODO: Remove all references to this type
            [key : string] : string
        }

        type Revision = number;

    }

    export class JournalStore extends EventEmitter {
        constructor( graph : Graph );
        putTransaction(revId : Journal.Revision, entries : Journal.Entry[]) : this;
        fetchTransaction(revId : Journal.Revision, entries : Journal.Entry[]) : Journal.Entry;

        on(event : 'transaction', listener : (revId : Journal.Revision) => void);
    }

    export class MemoryJournalStore extends JournalStore {
        /* No extras, just inherit JournalStore */
    }

}