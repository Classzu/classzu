import Config from "../../config"
import { createElementFromHTML } from "../../utils"

const getGuiHTML = () => {
    return createElementFromHTML(
    `
        <div  class="bg-black p-2 m-2 flex justify-center" pointer-events="all">
            <button class="btn btn-blue ${Config.GUI.class.create}">Create Class</button>
        </div>
    `
    ) as Element
}
export default getGuiHTML