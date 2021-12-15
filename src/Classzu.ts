import Konva from 'konva';

import Class from './Class';
import Config from './config/index'
import { getUniqueStr, getPxString, getClasszuElement, getClasszuElementId, createElementFromHTML } from './utils/index'
import ClasszuLoader from './ClasszuLoader'
import LocalStorageFileSystem from './Storage/Local';
import { Directory, File } from './Storage';

export default class Classzu {
    
    private rootElementId: string
    private stage: Konva.Stage

    public Node: any = Node

    public currentFilePath: string | null = null

    constructor(id?: string) {

        /**
         *  build root Element
         */
        if (id === undefined || id === null) {
            id = getUniqueStr()
            const element = document.createElement('div')
            element.id = id;
            element.style.width = getPxString(innerWidth)
            element.style.height = getPxString(innerHeight)
            document.body.append(element);
        }

        const rootElement: HTMLElement | null = document.getElementById(id)
        if (rootElement === null) throw Error('Cannot find HTMLElement.')
        rootElement.innerHTML = "";
        rootElement.style.position = "relative"


        /**
         * build konva Element
         */
        const konvaElement: HTMLDivElement = document.createElement('div')
        konvaElement.id = getClasszuElementId(id, "konva")
        konvaElement.style.width = getPxString(rootElement.clientWidth)
        konvaElement.style.height = getPxString(rootElement.clientHeight)
        rootElement.append(konvaElement)

        /**
         * build GUI Element
         */
        const guiElement: HTMLDivElement = document.createElement('div')
        guiElement.id = getClasszuElementId(id, "gui")
        guiElement.style.position = "absolute"
        guiElement.style.top = "0px"

        rootElement.append(guiElement)


        this.rootElementId = id
        this.stage =  new Konva.Stage({
            container: konvaElement,
            width: konvaElement.clientWidth,
            height: konvaElement.clientHeight,
        });

        const layer: Konva.Layer = new Konva.Layer();
        this.stage.add(layer);

    }
    public useGUI(): Classzu {
        const guiElement : HTMLElement = getClasszuElement(this.rootElementId, "gui")

        guiElement.innerHTML = `
            <div  style="cursor: default;" class="bg-dark p-2 m-2" pointer-events="all">
                <button class="btn ${Config.GUI.class.create}">Create Class</button>
            </div>
        `

        const createClass = (e: Event): void => {
            
            const html: HTMLElement = getClasszuElement(this.rootElementId, "gui")
            const _class = new Class().group().listen(html)

            const layer = this.stage.getLayers()[0]
            layer.add(_class)
            console.log(_class)

            return e.preventDefault()
        }

        document.querySelector(`.${Config.GUI.class.create}`)?.addEventListener('click', createClass.bind(this))

        return this;

    }
    public useLocalFileSystem() {

        const guiElement: HTMLElement = getClasszuElement(this.rootElementId, "gui")

        /**
         * Create Buttons
         */

        let buttonsHTML = `
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

        guiElement.append(createElementFromHTML(buttonsHTML) as Element)

        /**
         * Add Listeners to BUttons
         */
        const saveStage = (e: Event): void => {

            /**
             * need to refactor. not reusable
             */
            const input = document.querySelector('.update-file input') as HTMLInputElement
            const obj = {
                name: input.value,
                data: this.stage.toJSON()
            }

            if (input.name !== this.currentFilePath) {
                new LocalStorageFileSystem().delete('', this.currentFilePath as string)
                new LocalStorageFileSystem().createFile('', obj)
            }

            new LocalStorageFileSystem().updateFile('', obj)
            reRenderFileTree()
            reListenFileTree()
            return e.preventDefault();
        }
        const clearStorage = (e: Event): void => {
            localStorage.removeItem(Config.Storage.local.name)
            reRenderFileTree()
            reListenFileTree()
        }
        const addFile = (e: Event) => {
            const input = document.querySelector('.add-file input') as HTMLInputElement
            const newStage = this.stage.clone()
            newStage.getLayers()[0].destroyChildren()

            const obj = {
                name: input.value,
                data: newStage.toJSON()
            }
            new LocalStorageFileSystem().createFile('', obj)

            reRenderFileTree()
            reListenFileTree()

            input.value = ''
            return e.preventDefault();
        }

        document.querySelector(`.${Config.GUI.storage.local.clear}`)?.addEventListener('click', clearStorage.bind(this))
        document.querySelector(`.update-file button`)?.addEventListener('click', saveStage.bind(this))
        document.querySelector(`.add-file button`)?.addEventListener('click', addFile.bind(this))


        /**
         * Create FileTree
         */
        const getFileTreeHTML = (id: string) => {
            const rootDir: Directory = new LocalStorageFileSystem().get()
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
        const renderFileTree =() => {
            const fileTreeHTML = getFileTreeHTML(Config.GUI.storage.local.fileTree)
            guiElement.append(createElementFromHTML(fileTreeHTML) as Element)
        }
        const reRenderFileTree = () => {
            document.getElementById(Config.GUI.storage.local.fileTree)?.remove()
            renderFileTree()
        }

        renderFileTree()

        /**
         * Add Listeners to Files
         */
        const setFileNameToUpdateInput = (name: string) => {
            const input = document.querySelector('.update-file input') as HTMLInputElement
            input.value = name;
        }
        const loadStage = (directPath: string): void => {
            const file: File | null = new LocalStorageFileSystem().getFile(directPath)
            if ( file === null || file.data === null ) {
                new Error('LocalStorage is Empty')
                return;
            }
            setFileNameToUpdateInput(file.name)
            this.stage = new ClasszuLoader(file.data, this.rootElementId).create();
            this.currentFilePath = file.name
        }

        const getLoadFileListener = (directPath: string) => {
            return (e: Event) => {
                loadStage(directPath);
                return e.preventDefault();
            }
        }
        const listenFileTree = () => {
            const fileElements = document.querySelectorAll(`#${Config.GUI.storage.local.fileTree} div`);

            fileElements.forEach(fileElement => {
                // 今は名前だけでパスとする。本当は親ディレクトリとかの名前もゲットしてパスを作り上げたい。
                const directPath = fileElement.innerHTML
                console.log(directPath)
                fileElement.addEventListener('click', getLoadFileListener(directPath))
            });
        }
        const reListenFileTree = () => {
            listenFileTree()
        }


        listenFileTree()
        
        return this;

    }
}
