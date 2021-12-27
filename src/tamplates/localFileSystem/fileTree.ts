import Config from "@/config"
import { Directory, File } from "@/Storage";
import { createElementFromHTML } from "@/utils"
import LocalStorageFileSystem from "@/Storage/Local";


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
                <summary>${dir.name}</summary>
        `
        html += getTreeHTMLFromDirectoryID(dir.ID)
        html += `
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
                <summary>${dir.name}</summary>
        `
        html += getTreeHTMLFromDirectoryID(dir.ID)
        html += `
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
            <div class="file bg-white p-2 m-2 rounded" data-file-id="${file.ID}">${file.name}</div>
        `
    }

    return html
}

const getFileTreeHTML = ({ id, directories, files }: {
    id: string,
    directories: Directory[],
    files: File[]
}): string => {


    let html = `
        <div id="${id}"  style="cursor: default;" class="bg-dark p-2 m-2 pointer-events="all">
            <div data-directory-id="1" class="overflow-auto local-system-file-tree">
    `
    html += getDirectoriesHTML(directories) 
    html += getFilesHTML(files) 
    html +=`
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
            id: Config.GUI.storage.local.fileTree,
            directories,
            files
        })
    ) as Element
}
export default getLocalFileSystemTreeHTML