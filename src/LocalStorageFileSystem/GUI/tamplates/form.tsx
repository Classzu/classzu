import Config from "@/config"
import { createElementFromHTML } from "@/utils"

import * as React from 'react';


const { clear, file, directory, debug } = Config.GUI.storage.local;

class FormHTML {
    constructor() { }
    get() {
        return (
            <div className="bg-black p-2 m-2"  style={{ pointerEvents: "all"}}>
                <div className="overflow-auto local-system-form" >
                    <details className="bg-white p-2 m-2 rounded">
                        <summary>LocalStorage</summary>
                        <div><button className={`btn ${clear}`}>drop</button></div>
                        <div><button className={`btn ${debug.showFileAll}`}>files all</button></div>
                        <div><button className={`btn ${debug.showDirAll}`}>directories all</button></div>
                    </details>

                    <details className="bg-white p-2 m-2 rounded">
                        <summary>Directory</summary>

                        <label><strong>Current Directory</strong></label>
                        <div className={directory.show}>
                            <div><input type="text" name="id" placeholder="id" disabled /></div>
                            <div><input type="text" name="name" placeholder="name" disabled /></div>
                            <div><input type="text" name="directoryId" placeholder="directory id" disabled /></div>
                        </div>

                        <label><strong>Update</strong></label>
                        <div className={`${directory.edit}`}>
                            <div><input type="text" name="name" placeholder="name" /></div>
                            <div className="d-flex justify-content-end">
                                <button className={`${directory.update} btn`}>Update</button>
                            </div>
                        </div>

                        <label><strong>Create</strong></label>
                        <div className={`${directory.new}`}>
                            <div><input type="text" name="name" placeholder="name"/></div>
                            <div className="d-flex justify-content-end">
                                <button className={`${directory.create} btn`}>Create</button>
                            </div>
                        </div>
                    </details>

                    <details className="bg-white p-2 m-2 rounded">
                        <summary>File</summary>

                        <label><strong>Current File</strong></label>
                        <div className={`${file.show}`}>
                            <div><input type="text" name="id" placeholder="id" disabled /></div>
                            <div><input type="text" name="name" placeholder="name" disabled /></div>
                            <div><input type="text" name="directoryId" placeholder="directory id" disabled /></div>
                        </div>

                        <label><strong>Update </strong></label>
                        <div className={`${file.edit}`}>
                            <div><input type="text" name="name" placeholder="name" /></div>
                            <div className="d-flex justify-content-end">
                                <button className={`${file.update} btn`}>Update</button>
                            </div>
                        </div>

                        <label><strong>Create</strong></label>
                        <div className={`${file.new}`}>
                            <div><input type="text" name="name" placeholder="name"/></div>
                            <div className="d-flex justify-content-end">
                                <button className={`${file.create} btn`}>Create</button>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        )
    }
}

export default FormHTML