import Config from "../config";
import File, { FileNullable } from './file'
import Directory, { DirectoryNullable } from "./directory";
import localStorageDB from 'localStorageDB'

// interface DirectoryOrFile {
//     (directory: Directory): Directory
//     (file:File):File
// }
// interface ArrayOfDirectoryOrFile {
//     (directory: Directory): Directory[]
//     (file:File):File[]
// }


export default class LocalStorageFileSystem {
    private rootDirectoryId: number
    private db: localStorageDB

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
        if(!rootDir) throw new Error('Can not find root Directry')
        if(rootDir.ID !== 1) throw new Error(`Unexpected RootDirectory found ID: ${rootDir.ID}.`) //expect 1. always. throw Error for feature debug
        this.rootDirectoryId = rootDir.ID
        this.db = db
    }
    public getDirectoriesBy(key:string, value?:any): Directory[] {
        if (!value) value = this.rootDirectoryId
        const lsFields: localStorageDB_fields[] = this.db.queryAll(Directory.name, {
            query: function(row: localStorageDB_fields){
                return row[key] === value
            }  
        })
        const directories: Directory[] = lsFields.map(field => new Directory(field as Directory))
        return directories;
    }
    public getFilesBy(key:string, value?: any): File[]{
        if (!value) value = this.rootDirectoryId
        const lsFields: localStorageDB_fields[] = this.db.queryAll(File.name, {
            query: function(row: localStorageDB_fields){
                return row[key] === value
            }  
        })
        const files: File[] = lsFields.map(field => new File(field as File))
        return files;
    }
    public createDirectory(newDir: DirectoryNullable): Directory {
        const ID = this.db.insert(Directory.name, newDir)
        this.db.commit()
        return this.getDirectory(ID)
    }
    public createFile(newFile: FileNullable): File {
        const ID = this.db.insert(File.name, newFile)
        this.db.commit()
        return this.getFile(ID);
    }
    public updateFile(oldFile: File, newFile: FileNullable): File {
        const ID = this.db.update(File.name, { ID: oldFile.ID }, function (row) {
            for (const key in newFile) {
                if (key !== "ID") {
                    row[key] = newFile[key as keyof FileNullable];
                }
            }
            return row
        })
        this.db.commit()
        return this.getFile(ID)
    }
    public updateDirectory(oldDirectory: Directory, newDirectory: DirectoryNullable): Directory {
        //https://github.com/knadh/localStorageDB # update()
        // >  returns the number of rows affected
        // but it seems returnning nunmbe as booelan?
        const ID = this.db.update(Directory.name, { ID: oldDirectory.ID }, function (row) {
            for (const key in newDirectory) {
                if (key !== "ID") {
                    row[key] = newDirectory[key as keyof DirectoryNullable];
                }
            }
            return row
        })
        this.db.commit()
        return this.getDirectory(oldDirectory.ID)
    }
    public getFile(ID: number): File {
        const data = this.db.query(File.name, { ID: ID }).shift()
        if (!data) throw new Error(`Data not found. Find by ID: ${ID}`)
        
        return new File(data as File)
    }
    public getDirectory(ID: number): Directory {
        const data = this.db.query(Directory.name, function (row: localStorageDB_fields) { return row.ID == ID }).shift()
        if (!data) throw new Error(`Data not found. Find by ID: ${ID}`)
        
        return new Directory(data as Directory)
    }
    public deleteFile(ID:number): boolean {
        const num = this.db.deleteRows(File.name, { ID: ID })
        this.db.commit()
        return num !== 0 // deleteRows returns 0 when rows not found.
    }
    public showFiles() {
        const all = this.db.queryAll(File.name, {});
        console.log(all)
    }
    public showDirectories() {
        const all = this.db.queryAll(Directory.name, {});
        console.log(all)
    }

    /**
     * develop method
     */
    public drop() {
        this.db.drop()
    }
}