import Config from "../../config"
import { createElementFromHTML } from "../../utils"



const getLocalFileSystemFormHTML = () => {
    const { clear, file, directory } = Config.GUI.storage.local;

    return createElementFromHTML(
    `
       <div style="cursor: default;" class="bg-dark p-2 m-2" pointer-events="all">
            <details class="bg-white p-2 m-2 rounded">
                <summary>LocalStorage</summary>
                <div>
                    <button class="btn ${clear}">drop</button>
                </div>
            </details>

            <details class="bg-white p-2 m-2 rounded" open>
                <summary>Directory</summary>

                <label>Current Directory</label>
                <div class="${directory.show}">
                    <input type="text" name="id" disabled /> ID
                    <input type="text" name="name" disabled /> Name
                    <input type="text" name="directoryId" disabled /> DirID
                </div>

                <label>Update Directory</label>
                <div class="${directory.edit}">
                    <input type="text" name="name" />
                    <button class="${directory.update} btn">Update</button>
                </div>

                <label>Create Directory</label>
                <div class="${directory.new}">
                    <input type="text" name="name"/>
                    <button class="${directory.create} btn">Create</button>
                </div>
            </details>

            <details class="bg-white p-2 m-2 rounded" open>
                <summary>File</summary>

                <label>Current File</label>
                <div class="${file.show}">
                    <input type="text" class="id" disabled /> ID
                    <input type="text" name="name" disabled /> Name
                    <input type="text" class="directoryId" disabled /> DirID
                </div>

                <label>Update File</label>
                <div class="${file.edit}">
                    <input type="text" name="name" />
                    <button class="${file.update} btn">Update</button>
                </div>

                <label>Create File</label>
                <div class="${file.new}">
                    <input type="text" name="name"/>
                    <button class="${file.create} btn">Create</button>
                </div>
            </details>

        </div>
    `
    ) as Element
}
export default getLocalFileSystemFormHTML