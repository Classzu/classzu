import Config from "@/config"
import Directory from "../../models/Directory";
import File from "../../models/File";
import { createElementFromHTML } from "@/utils"
import * as ORM from "@/LocalStorageFileSystem/ORM";
const fileTreeSelector = Config.GUI.fileTree
const selector = Config.GUI.storage.local
const icon = {
    trash: 'fa fa-trash-o',
    caretRight: 'fa fa-caret-right',
    caretDown: 'fa fa-caret-down'
}

class FileTreeHTML {
    private rootDirectories: Directory[]
    private rootFiles: File[]    

    constructor({  rootDirectories, rootFiles }: {
        rootDirectories: Directory[],
        rootFiles: File[]    
    }) {
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
    /**
     * 再帰を使って一発でファイルツリーを作ってしまうことが可能。LocalStorageを操作する権限を持ってしまう。
     */
    
    treeHTMLFromDirectoryID = (dirID: number): string => {

        const files: File[] = new ORM.File().selectBy("directoryId", dirID)
        const dirs : Directory[] = new ORM.Directory().selectBy("parentDirectoryId", dirID)
    
        let html = ``
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            html += `
                <div class="directory bg-white p-2 m-2 rounded" data-directory-id="${dir.ID}" >
                    <div class="d-flex justify-content-between align-items-center">
                        <i class="${fileTreeSelector.directory.open} ${icon.caretRight}"></i>
                        <i class="${fileTreeSelector.directory.close} ${icon.caretDown}" hidden></i>
                        <div>${dir.name}</div>
                        <i class="${selector.directory.delete} ${icon.trash}"></i>
                    </div>
                    <div class="${fileTreeSelector.directory.children}" hidden>
                        ${this.treeHTMLFromDirectoryID(dir.ID)}
                    </div>
                </div>
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
            html += `
                <div class="directory bg-white p-2 m-2 rounded" data-directory-id="${dir.ID}" >
                    <div class="d-flex justify-content-between align-items-center">
                        <i class="${fileTreeSelector.directory.open} ${icon.caretRight}"></i>
                        <i class="${fileTreeSelector.directory.close} ${icon.caretDown}" hidden></i>
                        <div>${dir.name}</div>
                        <i class="${selector.directory.delete} ${icon.trash}"></i>
                    </div>
                    <div class="${fileTreeSelector.directory.children}" hidden>
                        ${this.treeHTMLFromDirectoryID(dir.ID)}
                    </div>
                </div>
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
                    <i class="${selector.file.delete} ${icon.trash} align-self-center"></i>
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