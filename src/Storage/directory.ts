export default class Directory {
    public name: string
    public parentDirectoryId: number
    
    public constructor({ name, parentDirectoryId }: {
        name: string,
        parentDirectoryId: number,
    }) {
        this.name = name
        this.parentDirectoryId = parentDirectoryId
    }
}

export class DirectoryNullable{

    public name: string | null
    public parentDirectoryId: number | null
    constructor(obj?: { [key: string]: any }) {
        this.name = obj?.name || null
        this.parentDirectoryId = obj?.parentDirectoryId || null
    }
}