import Config from "@/config"
import Directory from "../../models/Directory";
import File from "../../models/File";
import { createElementFromHTML } from "@/utils"
import * as ORM from "@/LocalStorageFileSystem/ORM";

const selector = Config.GUI.storage.local


class FileTreeHTML {
    private orm: typeof ORM
    private rootDirectories: Directory[]
    private rootFiles: File[]    

    constructor({ orm, rootDirectories, rootFiles }: {
        orm: typeof ORM,
        rootDirectories: Directory[],
        rootFiles: File[]    
    }) {
        this.orm = orm;
        this.rootDirectories = rootDirectories
        this.rootFiles = rootFiles
    }
    get() {
        return createElementFromHTML(
            this.fileTreeHTML({
                id: selector.fileTree,
                directories: this.rootDirectories,
                files: this.rootFiles,
            })
        ) as Element
    }
    deleteIcon(selector: string){
        return `
            <i class="${selector} fa fa-trash-o align-self-center"></i>
        `
    }
    /**
     * 再帰を使って一発でファイルツリーを作ってしまうことが可能。LocalStorageを操作する権限を持ってしまう。
     */
    
    treeHTMLFromDirectoryID = (dirID: number): string => {

        const files: File[] = new this.orm.File().getFilesBy("directoryId", dirID)
        const dirs : Directory[] = new this.orm.Directory().getDirectoriesBy("parentDirectoryId", dirID)
    
        let html = ``
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            html += `
                <details class="directory bg-white p-2 m-2 rounded" data-directory-id="${dir.ID}">
                    <summary class="justify-content-end">${dir.name} ${this.deleteIcon(selector.directory.delete)}</summary>
                    ${this.treeHTMLFromDirectoryID(dir.ID)}
                </details>
            `
        }
        html += this.filesHTML(files)
    
        return html
    }
    /**
     *  本来LocalStorageFileSystemを扱う権限を持たせたくないので後々このメソッドを拡張していく
     */
    directoriesHTML = (directories: Directory[]): string => {
        let html = ``
        for (let i = 0; i < directories.length; i++) {
            const dir = directories[i];
            // html += `
            //     <div class="file" data-directory-id="${dir.ID}">${dir.name}</div>
            // `
            html += `
                <details class="directory bg-white p-2 m-2 rounded" data-directory-id="${dir.ID}">
                    <summary>
                        <div class="d-flex justify-content-between ">
                            ${dir.name} ${this.deleteIcon(selector.directory.delete)}
                        </div>
                    </summary>
                    ${this.treeHTMLFromDirectoryID(dir.ID)}
                </details>
            `
        }
    
        return html
    }
    
    /**
     * こっから下はそのまま使いたい。
     */
    filesHTML = (files: File[]): string => {
        let html = ``
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            html += `
                <div class="file bg-white p-2 m-2 rounded d-flex justify-content-between" data-file-id="${file.ID}">
                    ${file.name} 
                    ${this.deleteIcon(selector.file.delete)}
                </div>
            `
        }
    
        return html
    }
    
    fileTreeHTML({ id, directories, files }: {
        id: string,
        directories: Directory[],
        files: File[]
    }): string {
    
        //RootDirectoryにはdata-directory-idをつけない
        //RootDirectoryはイメージ的には特別なディレクトリで他のモデルにしたい。
        //けど今はしない理由はDirectoryモデルにコメント済み。
        let html = `
            <div id="${id}"  style="cursor: default;" class="bg-dark p-2 m-2 pointer-events="all">
                <div  class="directory overflow-auto local-system-file-tree">
                ${this.directoriesHTML(directories) }
                ${this.filesHTML(files) }
                </div>
            </div>
        `
    
        return html;
    }
    
}
export default FileTreeHTML