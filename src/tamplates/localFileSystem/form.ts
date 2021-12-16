import Config from "../../config"
import { createElementFromHTML } from "../../utils"



const getLocalFileSystemFormHTML = () => {
    return createElementFromHTML(
    `
       <div style="cursor: default;" class="bg-dark p-2 m-2" pointer-events="all">
            <div>
                <button class="btn ${Config.GUI.storage.local.clear}">clear</button>
            </div>
            <div>
                <div class="update-file">
                    <input type="text"/>
                    <button class="btn">save</button>
                </div>
                <div class="add-file">
                    <input type="text"/>
                    <button class="btn">Add File</button>
                </div>
            </div>
        </div>
    `
    ) as Element
}
export default getLocalFileSystemFormHTML