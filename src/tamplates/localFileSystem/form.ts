import Config from "../../config"
import { createElementFromHTML } from "../../utils"



const getLocalFileSystemFormHTML = () => {
    const { clear, file, directory } = Config.GUI.storage.local;

    return createElementFromHTML(
    `
       <div style="cursor: default;" class="bg-dark p-2 m-2" pointer-events="all">
            <div>
                <button class="btn ${clear}">clear</button>
            </div>
            <div>
                <div class="${file.update}">
                    <input type="text"/>
                    <button class="btn">Save File</button>
                </div>
                <div class="${file.create}">
                    <input type="text"/>
                    <button class="btn">Add File</button>
                </div>
            </div>
        </div>
    `
    ) as Element
}
export default getLocalFileSystemFormHTML