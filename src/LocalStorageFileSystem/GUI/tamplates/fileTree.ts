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

    constructor(){}
    getBase({ directories, files }: {
        directories: Directory[],
        files: File[]
    }) {
        return createElementFromHTML(
            this.baseHTML({ directories, files })
        ) as Element
    }
    getChildren({ directories, files }: {
        directories: Directory[],
        files: File[]
    }) {
        return createElementFromHTML(
            this.childrenHTML({ directories, files })
        ) as Element
    }
    baseHTML({ directories, files }: {
        directories: Directory[],
        files: File[]
    }): string {
        // 中にあるdivタグはディレクトリ自体を表しているので、本来はこの部分はbaseではなくdirectoryHTML()というメソッドからHTMlを受け取るべきだし、他のメソッドもその観点から少し実装の仕方が少しずれているけど今はコメントを残すだけにしておく。
        // ディレクトリが開かれているかどうかなどの状態を管理できるようになった際にはこのずれを修正したい。rootDirectoryは今は開いていてほしい。
        // ここでの考え方は、rootがいくつものファイルとディクトりから始まるのか、それとも一つのディレクトリから始まるのかっていう考え方から変わってくる。
        const rootDirID = 1;
        let html = `
            <div id="${selector.fileTree}"  style="cursor: default;" class="bg-dark p-2 m-2 pointer-events="all">
                <div  class="directory overflow-auto local-system-file-tree" data-directory-id="${rootDirID}">
                    <div class="${fileTreeSelector.directory.children}" >
                        <div class="d-flex justify-content-between align-items-center" >
                            <i class="${fileTreeSelector.directory.open} ${icon.caretRight}" hidden></i>
                            <i class="${fileTreeSelector.directory.close} ${icon.caretDown}" hidden></i>
                        </div>
                        ${this.childrenHTML({
                            directories,
                            files
                        })}
                    </div>
                </div>
            </div>
        `
        return html;
    }
    childrenHTML({ directories, files }: {
        directories: Directory[],
        files: File[]
    }): string {
        return `
            <div class="${fileTreeSelector.directory.children}">
                ${this.directoriesHTML(directories)}
                ${this.filesHTML(files)}
            </div>
        `
    }
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
                    </div>
                </div>
            `
        }
    
        return html
    }
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
    
}
export default FileTreeHTML