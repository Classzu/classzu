import { getClasszuElement } from "@/utils";
import LocalStorageFileSystem from "..";
import DirectoryCLUD from "./DirectoryCLUD";
import FileCLUD from "./FileCLUD";
import FileTreeHTML from "./tamplates/fileTree";
import FormHTML from "./tamplates/form";

import Config from "@/config";

const selector = Config.GUI.storage.local

class GUI {

    public superThis: LocalStorageFileSystem;
    public Directory: DirectoryCLUD = new DirectoryCLUD(this)
    public File: FileCLUD = new FileCLUD(this)

    constructor(superThis: LocalStorageFileSystem) {

        this.superThis = superThis;

    }
    set() {
        
        this.renderForm()
        this.listenForm()

    
        this.renderFileTree()
        this.listenFileTree()
        
        /**
         * default show
         */
        this.Directory.show(1)


        return this;

    }
    renderForm() {
        const guiElement: HTMLElement = getClasszuElement(this.superThis.classzu.rootElementId, "gui")
        const formHTML = new FormHTML().get()
        guiElement.append(formHTML)
    }
    listenForm() {

        document.querySelector(`.${selector.clear}`)?.addEventListener('click', () =>{
            new this.superThis.ORM.DB().drop()
            this.reRenderFileTree()
            this.reListenFileTree()
        })
        document.querySelector(`.${selector.directory.create}`)?.addEventListener('click', () =>{
            this.Directory.create()
            this.reRenderFileTree()
            this.reListenFileTree()
        })
        document.querySelector(`.${selector.directory.update}`)?.addEventListener('click', () =>{
            this.Directory.update()
            this.reRenderFileTree()
            this.reListenFileTree()
        })

        document.querySelector(`.${selector.file.create}`)?.addEventListener('click', () =>{
            this.File.create()
            this.reRenderFileTree()
            this.reListenFileTree()
        })
        document.querySelector(`.${selector.file.update}`)?.addEventListener('click', () =>{
            this.File.update()
            this.reRenderFileTree()
            this.reListenFileTree()
        })

    }
    renderFileTree() {
        
        const guiElement: HTMLElement = getClasszuElement(this.superThis.classzu.rootElementId, "gui")

        const rootFiles = new this.superThis.ORM.File().getFilesBy("directoryId")
        const rootDirs = new this.superThis.ORM.Directory().getDirectoriesBy("parentDirectoryId")

        const fileTreeHTML = new FileTreeHTML({
            orm: this.superThis.ORM,
            rootDirectories: rootDirs,
            rootFiles: rootFiles
        }).get()
        guiElement.append(fileTreeHTML)
    }
    reRenderFileTree() {
        document.getElementById(selector.fileTree)?.remove()
        this.renderFileTree()
    }
    listenFileTree() {
        
        const listenFiles = () => {
            const fileElements = getClasszuElement(this.superThis.classzu.rootElementId, "gui").querySelectorAll(`#${selector.fileTree} [data-file-id]`);
            fileElements.forEach(fileElement => {
                const id = parseInt(fileElement.getAttribute("data-file-id")!)
                const file = new this.superThis.ORM.File().getFile(id)
                /**
                 * add show event
                 */
                fileElement.addEventListener('click', (e: Event) => {
                    this.File.show(file)
                    e.stopPropagation();
                    e.preventDefault()
                })
                /**
                 * add delete event
                 */
                const trashIcon: HTMLElement = fileElement.querySelector(`.${selector.file.delete}`)!
                trashIcon.addEventListener('click', (e:Event) =>{
                    this.File.delete(file)
                    this.reRenderFileTree()
                    this.reListenFileTree()
                    e.stopPropagation();
                    e.preventDefault()
                })
            });            
        }
        const listenDirectories = () => {
            const dirElements = getClasszuElement(this.superThis.classzu.rootElementId, "gui").querySelectorAll(`#${selector.fileTree} [data-directory-id]`);
            dirElements.forEach(dirElement => {
                const id = parseInt(dirElement.getAttribute("data-directory-id")!)
                const dir = new this.superThis.ORM.Directory().getDirectory(id)
                /**
                 * add show event
                 */
                dirElement.addEventListener('click', (e: Event) => {
                    this.Directory.show(dir)
                    e.stopPropagation();
                    //details タグを使っているためコメントアウト
                    // e.preventDefault()
                })
                /**
                 * add delete event
                 */
                const trashIcon: HTMLElement = dirElement.querySelector(`i`)!
                trashIcon.addEventListener('click', (e: Event) => {
                    this.Directory.delete(dir)
                    this.reRenderFileTree()
                    this.reListenFileTree()
                    e.stopPropagation();
                    e.preventDefault()
                })
            });
        }

        listenFiles()
        listenDirectories()
    }
    reListenFileTree() {

        this.listenFileTree()

    }

}

export default GUI