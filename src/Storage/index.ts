export type FileParams = { name?: string, data: string }
export class File {
    public type: string = "File"
    public name: string
    public data: string

    public constructor({ name, data }: FileParams) {
        this.name = name || "UntitledFile"
        this.data = data
    }
}

export type DirectoryParams = { name: string, files?: { [key: string]: File }};
export class Directory {
    public type: string = "Directory"
    public name: string
    public files: {[key: string]: File | Directory}

    public constructor({ name, files }: DirectoryParams) {
        this.name = name || "UntitledDirectory"
        this.files = files || {}
    }
}