export default class File {
    public name: string
    public data: string
    public directoryId: number
    public constructor({ name, data, directoryId }: {
        name: string,
        data: string,
        directoryId: number
    }) {
        this.name = name
        this.data = data
        this.directoryId = directoryId
    }
}
export class FileNullable {
    public name: string | null
    public data: string | null
    public directoryId: number | null
    public constructor(obj?: {[key:string]:any}) {
        this.name = obj?.name || null
        this.data = obj?.data || null
        this.directoryId = obj?.directoryId || null
    }
}

new FileNullable()