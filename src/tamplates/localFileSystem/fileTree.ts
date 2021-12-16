import Config from "../../config"
import { Directory } from "../../Storage";
import { createElementFromHTML } from "../../utils"

const getFileTreeHTML = ({ id, rootDir }: { id: string, rootDir: Directory}) => {

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

const getLocalFileSystemTreeHTML = (rootDir: Directory) => {
    return createElementFromHTML(
        getFileTreeHTML({
            id: Config.GUI.storage.local.fileTree,
            rootDir: rootDir
        })
    ) as Element
}
export default getLocalFileSystemTreeHTML