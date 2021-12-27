import Config from "../../config"
import { createElementFromHTML } from "../../utils"



const getLocalFileSystemFormHTML = () => {
    const { clear, file, directory } = Config.GUI.storage.local;

    return createElementFromHTML(
    `
       <div class=" bg-dark p-2 m-2" style="cursor: default;"  pointer-events="all">
            <div class="overflow-auto local-system-form" >
                <details class="bg-white p-2 m-2 rounded">
                    <summary>LocalStorage</summary>
                    <div>
                        <button class="btn ${clear}">drop</button>
                    </div>
                </details>

                <details class="bg-white p-2 m-2 rounded" open>
                    <summary>Directory</summary>

                    <label><strong>Current Directory</strong></label>
                    <div class="${directory.show}">
                        <div><input type="text" name="id" placeholder="id" disabled /></div>
                        <div><input type="text" name="name" placeholder="name" disabled /></div>
                        <div><input type="text" name="directoryId" placeholder="directory id" disabled /></div>
                    </div>

                    <label><strong>Update</strong></label>
                    <div class="${directory.edit}">
                        <div><input type="text" name="name" placeholder="name" /></div>
                        <div class="d-flex justify-content-end">
                            <button class="${directory.update} btn">Update</button>
                        </div>
                    </div>

                    <label><strong>Create</strong></label>
                    <div class="${directory.new}">
                        <div><input type="text" name="name" placeholder="name"/></div>
                        <div class="d-flex justify-content-end">
                            <button class="${directory.create} btn">Create</button>
                        </div>
                    </div>
                </details>

                <details class="bg-white p-2 m-2 rounded" open>
                    <summary>File</summary>

                    <label><strong>Current File</strong></label>
                    <div class="${file.show}">
                        <div><input type="text" name="id" placeholder="id" disabled /></div>
                        <div><input type="text" name="name" placeholder="name" disabled /></div>
                        <div><input type="text" name="directoryId" placeholder="directory id" disabled /></div>
                    </div>

                    <label><strong>Update </strong></label>
                    <div class="${file.edit}">
                        <div><input type="text" name="name" placeholder="name" /></div>
                        <div class="d-flex justify-content-end">
                            <button class="${file.update} btn">Update</button>
                        </div>
                    </div>

                    <label><strong>Create</strong></label>
                    <div class="${file.new}">
                        <div><input type="text" name="name" placeholder="name"/></div>
                        <div class="d-flex justify-content-end">
                            <button class="${file.create} btn">Create</button>
                        </div>
                    </div>
                </details>
            </div>

        </div>
    `
    ) as Element
}
export default getLocalFileSystemFormHTML