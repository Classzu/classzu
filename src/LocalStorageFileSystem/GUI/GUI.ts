import { getClasszuElement } from "@/utils";
import LocalStorageFileSystem from "..";
import DirectoryCLUD from "./DirectoryCLUD";
import FileCLUD from "./FileCLUD";
import FileTreeHTML from "./tamplates/fileTree";
import FormHTML from "./tamplates/form";
import * as ORM from '../ORM'

import Config from "@/config";
const fileTreeSelector = Config.GUI.fileTree
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
            new ORM.DB().drop()
            this.reRenderFileTree()
            this.reListenFileTree()
        })
        document.querySelector(`.${selector.debug.showFileAll}`)?.addEventListener('click', () =>{
            console.log(new ORM.File().selectAll())
        })
        document.querySelector(`.${selector.debug.showDirAll}`)?.addEventListener('click', () =>{
            console.log(new ORM.Directory().selectAll())
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

        const rootFiles = new ORM.File().selectBy("directoryId")
        const rootDirs = new ORM.Directory().selectBy("parentDirectoryId")

        const fileTreeHTML = new FileTreeHTML({
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
                const file = new ORM.File().selectByID(id)
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
                const dir = new ORM.Directory().selectByID(id)
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
                 * add open and close event
                 */
                const caretRightIcon: HTMLElement = dirElement.querySelector(`.${fileTreeSelector.directory.open}`)!
                const caretDownIcon: HTMLElement = dirElement.querySelector(`.${fileTreeSelector.directory.close}`)!
                const dirChildren: HTMLElement = dirElement.querySelector(`.${fileTreeSelector.directory.children}`)!
                caretRightIcon.addEventListener('click', () => {

                    caretRightIcon.hidden = true;
                    caretDownIcon.hidden = false;
                    dirChildren.hidden = false;
                    
                })
                caretDownIcon.addEventListener('click', () => {

                    caretRightIcon.hidden = false;
                    caretDownIcon.hidden = true;
                    dirChildren.hidden = true;
                    
                })
                /**
                 * add delete event
                 */

                const trashIcon: HTMLElement = dirElement.querySelector(`.${selector.directory.delete}`)!
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