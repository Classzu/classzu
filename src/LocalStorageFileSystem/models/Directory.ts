/**
 * RootDirectoryは他とは違う、ワークスペースにたいなモデルにしたい。けどそれだといくつか問題がある。
 * 
 * 1. Directoryに workspace_idを持たせる。
 *      これはparentDirectoryIdと同様にnullを許容してしまうことが問題。
 * 2. */
 
export default class Directory {
    public ID: number
    public name: string
    public parentDirectoryId: number | null
    
    public constructor({ ID, name, parentDirectoryId }: {
        ID: number,
        name: string,
        parentDirectoryId: number | null,
    }) {
        this.ID = ID
        this.name = name
        this.parentDirectoryId = parentDirectoryId
    }
}

export class DirectoryNullable{
    public ID: number | null
    public name: string | null
    public parentDirectoryId: number | null
    constructor(obj?: { [key: string]: any }) {
        this.ID = obj?.ID || null
        this.name = obj?.name || null
        this.parentDirectoryId = obj?.parentDirectoryId || null
    }
}