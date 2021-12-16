import Config from "../../config"
import { createElementFromHTML } from "../../utils"

const getGuiHTML = () => {
    return createElementFromHTML(
    `
        <div  style="cursor: default;" class="bg-dark p-2 m-2" pointer-events="all">
            <button class="btn ${Config.GUI.class.create}">Create Class</button>
        </div>
    `
    ) as Element
}
export default getGuiHTML