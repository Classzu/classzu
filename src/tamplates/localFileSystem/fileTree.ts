import Config from "@/config"
import { Directory, File } from "@/Storage";
import { createElementFromHTML } from "@/utils"
import LocalStorageFileSystem from "@/Storage/Local";

const selector = Config.GUI.storage.local
const getDeleteIcon = (selector: string) => {
    return `
        <i class="${selector} fa fa-trash-o align-self-center"></i>
    `
}
/**
 * 再帰を使って一発でファイルツリーを作ってしまうことが可能。LocalStorageを操作する権限を持ってしまう。
 */

const getTreeHTMLFromDirectoryID = (dirID: number): string => {
    const lsfs = new LocalStorageFileSystem()
    const files: File[] = lsfs.getFilesBy("directoryId", dirID)
    const dirs : Directory[] = lsfs.getDirectoriesBy("parendDirectoryId", dirID)

    let html = ``
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        html += `
            <details class="directory bg-white p-2 m-2 rounded" data-directory-id="${dir.ID}">
                <summary class="justify-content-end">${dir.name} ${getDeleteIcon(selector.directory.delete)}</summary>
                ${getTreeHTMLFromDirectoryID(dir.ID)}
            </details>
        `
    }
    html += getFilesHTML(files)

    return html
}
/**
 *  本来LocalStorageFileSystemを扱う権限を持たせたくないので後々このメソッドを拡張していく
 */
const getDirectoriesHTML = (directories: Directory[]): string => {
    let html = ``
    for (let i = 0; i < directories.length; i++) {
        const dir = directories[i];
        // html += `
        //     <div class="file" data-directory-id="${dir.ID}">${dir.name}</div>
        // `
        html += `
            <details class="directory bg-white p-2 m-2 rounded" data-directory-id="${dir.ID}">
                <summary><div class="d-flex justify-content-between ">${dir.name} ${getDeleteIcon(selector.directory.delete)}</div></summary>
                ${getTreeHTMLFromDirectoryID(dir.ID)}
            </details>
        `
    }

    return html
}

/**
 * こっから下はそのまま使いたい。
 */
const getFilesHTML = (files: File[]): string => {
    let html = ``
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        html += `
            <div class="file bg-white p-2 m-2 rounded d-flex justify-content-between" data-file-id="${file.ID}">
                ${file.name} 
                ${getDeleteIcon(selector.file.delete)}
            </div>
        `
    }

    return html
}

const getFileTreeHTML = ({ id, directories, files }: {
    id: string,
    directories: Directory[],
    files: File[]
}): string => {

    //RootDirectoryにはdata-directory-idをつけない
    //RootDirectoryはイメージ的には特別なディレクトリで他のモデルにしたい。
    //けど今はしない理由はDirectoryモデルにコメント済み。
    let html = `
        <div id="${id}"  style="cursor: default;" class="bg-dark p-2 m-2 pointer-events="all">
            <div  class="directory overflow-auto local-system-file-tree">
            ${getDirectoriesHTML(directories) }
            ${getFilesHTML(files) }
            </div>
        </div>
    `

    return html;
}

const getLocalFileSystemTreeHTML = ({ directories, files }: {
    directories: Directory[],
    files: File[]
}) => {
    return createElementFromHTML(
        getFileTreeHTML({
            id: selector.fileTree,
            directories,
            files
        })
    ) as Element
}
export default getLocalFileSystemTreeHTML