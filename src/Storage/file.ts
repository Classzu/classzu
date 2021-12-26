export default class File {
    public ID: number
    public name: string
    public data: string
    public directoryId: number
    public constructor({ ID, name, data, directoryId }: {
        ID: number,
        name: string,
        data: string,
        directoryId: number
    }) {
        this.ID = ID
        this.name = name
        this.data = data
        this.directoryId = directoryId
    }
}
export class FileNullable {
    public ID: number | null
    public name: string | null
    public data: string | null
    public directoryId: number | null
    public constructor(obj?: { [key: string]: any }) {
        this.ID = obj?.ID || null
        this.name = obj?.name || null
        this.data = obj?.data || null
        this.directoryId = obj?.directoryId || null
    }
}