import ORM from "./ORM";
import File from '../models/File'
import Directory, { DirectoryNullable } from "../models/Directory";
import FileORM from './FileORM'

class DirectoryORM extends ORM {

    constructor() {

        super()

    }
    public getDirectories() {

        const lsFields: localStorageDB_fields[] = this.db.queryAll(Directory.name, {})
        const dirs: Directory[] = lsFields.map(field => new Directory(field as Directory))
        return dirs;

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
    public createDirectory(newDir: DirectoryNullable): Directory {
        
        const ID = this.db.insert(Directory.name, newDir)
        this.db.commit()
        return this.getDirectory(ID)

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
    public getDirectory(ID: number): Directory {

        const data = this.db.query(Directory.name, function (row: localStorageDB_fields) { return row.ID == ID }).shift()
        if (!data) throw new Error(`Data not found. Find by ID: ${ID}`)
        
        return new Directory(data as Directory)
        
    }
    /**
     * @name deleteDirectory
     * ORM的にはdependentがtrueかどうかを確認して関連しているファイルを削除するかを決定するべきだけど、
     * このモジュールはORMというよりかは、DirectoryORMということで、ディレクトリーの関係を管理する存在なので
     * 今回は、ここで削除するディレクトリに依存する(中にある)ファイルやディレクトリたちも削除することにする。
     */
    public deleteDirectory(ID: number): boolean {

        // 論理エラー、何処かで値渡しが起きているのかなぜかGUI側で呼び出した時に
        //GUI側で確認するdbとORM側で確認するdbに違いがある。ひとまず。直接削除することに、
        const files: File[] = new FileORM().getFilesBy("directoryId", ID)
        files.forEach(file => {
            const num = this.db.deleteRows(File.name, { ID: file.ID })
            // new FileORM().deleteFile(file.ID)
        })
        
        const innerDirectories: Directory[] = this.getDirectoriesBy("parentDirectoryId", ID)
        innerDirectories.forEach(dir => {
            this.deleteDirectory(dir.ID)
        })

        this.db.commit()

        // IDでファイルが削除できない場合、Errorをthrowしないのはフロント側でエラーが起きたことをどう処理するかを任せることができるため、代わりにbooleanを返す。
        // また、他のメソッドも後々そうするべきかも。
        const num = this.db.deleteRows(Directory.name, { ID: ID })
        if (num === 0) new Error(`Failed to delete Directory by ID: ${ID}`)
        this.db.commit()
        return num !== 0 // deleteRows returns 0 when rows not found.

    }
    
}

export default DirectoryORM