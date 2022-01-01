import ORM from "./ORM";
import File, { FileNullable } from '../models/File'
import Directory from "../models/Directory";

class FileORM extends ORM {

    constructor() {

        super()

    }
    public selectAll() {

        const lsFields: localStorageDB_fields[] = this.db.queryAll(File.name, {})
        const files: File[] = lsFields.map(field => new File(field as File))
        return files;

    }
    public selectBy(key:string, value?: any): File[]{

        if (!value) value = this.rootDirectoryId
        const lsFields: localStorageDB_fields[] = this.db.queryAll(File.name, {
            query: function(row: localStorageDB_fields){
                return row[key] === value
            }  
        })
        const files: File[] = lsFields.map(field => new File(field as File))
        return files;

    }
    public create(newFile: FileNullable): File {

        const ID = this.db.insert(File.name, newFile)
        this.db.commit()
        return this.selectByID(ID);

    }
    public update(oldFile: File, newFile: FileNullable): File {

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
        return this.selectByID(oldFile.ID)

    }
    public selectByID(ID: number): File {

        const data = this.db.query(File.name, { ID: ID }).shift()
        if (!data) throw new Error(`Data not found. Find by ID: ${ID}`)
        
        return new File(data as File)

    }
    public delete(ID:number): boolean {

        const num = this.db.deleteRows(File.name, { ID: ID })
        this.db.commit()
        return num !== 0 // deleteRows returns 0 when rows not found.

    }
}

export default FileORM