import ORM from "./ORM";
import File, { FileNullable } from '../models/File'
import Directory from "../models/Directory";

class FileORM extends ORM {

    constructor() {

        super()

    }
    public getFiles() {

        const lsFields: localStorageDB_fields[] =  this.db.queryAll(File.name, {})
        const files: File[] = lsFields.map(field => new File(field as File))
        return files;

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
    public createFile(newFile: FileNullable): File {

        const ID = this.db.insert(File.name, newFile)
        this.db.commit()
        return this.getFile(ID);

    }
    public updateFile(oldFile: File, newFile: FileNullable): File {

        //https://github.com/knadh/localStorageDB # update()
        // >  returns the number of rows affected
        // but it seems returnning nunmbe as booelan?
        const ID = this.db.update(File.name, { ID: oldFile.ID }, function (row) {
            for (const key in newFile) {
                if (key !== "ID") {
                    row[key] = newFile[key as keyof FileNullable];
                }
            }
            return row
        })
        this.db.commit()
        return this.getFile(oldFile.ID)

    }
    public getFile(ID: number): File {

        const data = this.db.query(File.name, { ID: ID }).shift()
        if (!data) throw new Error(`Data not found. Find by ID: ${ID}`)
        
        return new File(data as File)

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
    
}

export default FileORM