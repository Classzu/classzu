import Konva from 'konva';

import Class from './Class';
import Config from './config/index'
import { getUniqueStr, getPxString, getClasszuElement, getClasszuElementId, createElementFromHTML } from './utils/index'
import ClasszuLoader from './ClasszuLoader'
import LocalStorageFileSystem from './Storage/Local';
import { Directory, File, FileNullable } from './Storage';

/**
 * HTML getters
 */
import getGuiHTML from './tamplates/gui/index'
import getLocalFileSystemFormHTML from './tamplates/localFileSystem/form';
import getLocalFileSystemTreeHTML from './tamplates/localFileSystem/fileTree';

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

        const guiElement: HTMLElement = getClasszuElement(this.rootElementId, "gui")
        guiElement.append(getGuiHTML())

        const createClass = (e: Event): void => {
            
            const _class = new Class().group().listen(guiElement)
            const layer = this.stage.getLayers()[0]
            layer.add(_class)
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

        const formHTML = getLocalFileSystemFormHTML()
        guiElement.append(formHTML)

        /**
         * Add Listeners to form items
         */
        const { clear, file, directory } = Config.GUI.storage.local;

        const saveStage = (e: Event): void => {

            /**
             * need to refactor. not reusable
             */
            const input = document.querySelector(`.${file.update} input`) as HTMLInputElement
            const obj = {
                name: input.value,
                data: this.stage.toJSON()
            }

            if (input.name !== this.currentFilePath) {
                // new LocalStorageFileSystem().delete('', this.currentFilePath as string)
                // new LocalStorageFileSystem().createFile('', obj)
            }

            // new LocalStorageFileSystem().updateFile('', obj)
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

            const input = document.querySelector(`.${file.create} input`) as HTMLInputElement
            const directoryId = 0 // FIXME:

            const newStage = this.stage.clone()
            newStage.getLayers()[0].destroyChildren()

            const newFile = new FileNullable({
                name: input.value,
                data: newStage.toJSON(),
                directoryId: directoryId
            })
            new LocalStorageFileSystem().createFile(newFile)

            reRenderFileTree()
            reListenFileTree()

            input.value = ''
            return e.preventDefault();

        }

        
        document.querySelector(`.${clear}`)?.addEventListener('click', clearStorage.bind(this))
        document.querySelector(`.${file.update} button`)?.addEventListener('click', saveStage.bind(this))
        document.querySelector(`.${file.create} button`)?.addEventListener('click', addFile.bind(this))


        /**
         * Create FileTree
         */
        const renderFileTree = () => {
            const lsfs = new LocalStorageFileSystem()
            const rootFiles = lsfs.getFilesBy("directoryId")
            const rootDirs = lsfs.getDirectoriesBy("parentDirectoryId")

            const fileTreeHTML = getLocalFileSystemTreeHTML({
                directories: rootDirs,
                files: rootFiles
            })
            guiElement.append(fileTreeHTML)

        }
        const reRenderFileTree = () => {

            document.getElementById(Config.GUI.storage.local.fileTree)?.remove()
            renderFileTree()

        }

        // renderFileTree()

        /**
         * Add Listeners to Files
         */
        const setFileNameToUpdateInput = (name: string) => {

            const input = document.querySelector('.update-file input') as HTMLInputElement
            input.value = name;

        }
        const loadStage = (directPath: string): void => {

            // const file: File | null = new LocalStorageFileSystem().getFile(directPath)
            // if ( file === null || file.data === null ) {
            //     new Error('LocalStorage is Empty')
            //     return;
            // }
            // setFileNameToUpdateInput(file.name)
            // this.stage = new ClasszuLoader(file.data, this.rootElementId).create();
            // this.currentFilePath = file.name

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

        // listenFileTree()
        
        return this;

    }
}
