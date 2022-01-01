import Config from "@/config";
import File, { FileNullable } from '../models/File'
import Directory, { DirectoryNullable } from "../models/Directory";
import localStorageDB from 'localStorageDB'

class ORM {

    protected rootDirectoryId: number
    protected db: localStorageDB

    public constructor() {

        const db = new localStorageDB(Config.Storage.local.name)

        if (db.isNew()) {
            const directoryProps: string[] = Object.keys(new DirectoryNullable())
            const fileProps: string[] = Object.keys(new FileNullable())

            db.createTable(Directory.name, directoryProps)
            db.createTable(File.name, fileProps)

            const dir = new Directory({ ID: 1, name: "Root", parentDirectoryId: null })
            db.insert(Directory.name, dir)
            db.commit()
        } 

        const rootDir = db.queryAll(Directory.name, {}).shift()
        if (!rootDir) throw new Error('Can not find root Directry')
        if(rootDir.ID !== 1) new Error(`Unexpected RootDirectory found ID: ${rootDir.ID}.`) //expect 1. always. throw Error for feature debug
        this.rootDirectoryId = rootDir.ID
        this.db = db
        
    }
    
}

export default ORM