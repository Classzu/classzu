import Config from "../../config"
import { Directory } from "../../Storage";
import LocalStorageFileSystem from "../../Storage/Local";
import { createElementFromHTML } from "../../utils"

const getFileTreeHTML = (id: string) => {
    const rootDir: Directory = new LocalStorageFileSystem().get()
    let ite = rootDir.files;

    let fileTreeHTML = `
        <div id="${id}" style="cursor: default;" class="bg-dark p-2 m-2" pointer-events="all">
    `
    for (const key in ite) {
        if (ite[key].type === "File") {
            const file = ite[key]
            fileTreeHTML += `
                <div class="file ${file.name}">${file.name}</div>
            `
        }
    }
    fileTreeHTML +=`
        </div>
    `

    return fileTreeHTML;
}

const getLocalFileSystemTreeHTML = () => {
    return createElementFromHTML(
        getFileTreeHTML(Config.GUI.storage.local.fileTree)
    ) as Element
}
export default getLocalFileSystemTreeHTML