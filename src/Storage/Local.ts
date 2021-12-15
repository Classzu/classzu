import Config from "../config";
import { Directory, File, FileParams } from ".";


export default class LocalStorageFileSystem {
    private rootDir: Directory

    public constructor() {

        const jsonData: string | null = localStorage.getItem(Config.Storage.local.name)
        let data;

        if (!jsonData) {
            data = new Directory({name:"root"})
            localStorage.setItem(Config.Storage.local.name, JSON.stringify(data))
        } else {
            data = JSON.parse(jsonData)
        }

        this.rootDir = data;
    }
    public get(): Directory {
        return this.rootDir;
    }
    public save(): void {
        const data = JSON.stringify(this.rootDir);
        localStorage.setItem(Config.Storage.local.name, data)
    }
    public getDataByPath(path: string): Directory | File {
        let data: Directory | File = this.rootDir
        const names = path.split('/')

        if (names[0] === '.' || names[0] === '') names.shift();

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (!data || !data.type) {
                new Error(`
                Provided path was not correct to reach expecting file.
                Provided path: '${path}'.
                `)
            }
            else if (data.type === "Directory") {
                const directory: Directory = data as Directory
                data = directory.files[name]
            } else if (data.type === "File") {
                return data
            }

        }
        return data

    }
    public createDirectory(basePath: string, name: string): void {
        const data: Directory | File = this.getDataByPath(basePath);
        if (data.type !== "Directory") {
            new Error('Directory can only be created in Directory')
            return
        }
        const directory = data as Directory
        directory.files[name] = new Directory({name})
        console.log(this.rootDir)

        this.save()
    }
    public createFile(basePath: string, params: FileParams): void {
        const data: Directory | File = this.getDataByPath(basePath);
        if (data.type !== "Directory") {
            new Error('File can only be created in Directory')
            return
        }

        if(!params.name) params.name = 'UntitledFile'

        const directory = data as Directory
        directory.files[params.name] = new File(params)

        console.log(this.rootDir)

        this.save()
    }
    public updateFile(basePath: string, params: FileParams): void {
        const data: Directory | File = this.getDataByPath(basePath);
        if (data.type !== "Directory") {
            new Error('File can only be created in Directory')
            return
        }
        
        const directory = data as Directory
        if (!params.name || !directory.files[params.name]) {
            new Error('Cannot find target file')
            return;
        }

        directory.files[params.name] = new File(params)
        this.save()
    }
    public getFile(directPath: string): File | null {

        const data: Directory | File = this.getDataByPath(directPath);
        
        if (data.type !== "File") {
            new Error('Provided path doesn\'t reach to a File')
            return null;
        }
        const file = data as File
        
        return file;

    }
    public delete(basePath: string, name: string) {
        const data: Directory | File = this.getDataByPath(basePath);
        if (data.type !== "Directory") {
            new Error('File can only be created in Directory')
            return
        }

        const directory = data as Directory
        if (!directory.files[name]) {
            new Error('Cannot find target file')
            return;
        }

        delete directory.files[name]
        console.log(this.rootDir)
        this.save()
    }
}