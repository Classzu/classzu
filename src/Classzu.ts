import Konva from 'konva';

import Class from './Class';
import Config from './config/index'
import { getUniqueStr, getPxString, getClasszuElement, getClasszuElementId, createElementFromHTML } from './utils/index'
import ClasszuLoader from './ClasszuLoader'
import LocalStorageFileSystem from './Storage/Local';
import { Directory, DirectoryNullable, File, FileNullable } from './Storage';

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
         * Create forms
         */

        const formHTML = getLocalFileSystemFormHTML()
        guiElement.append(formHTML)

        const { clear, file, directory } = Config.GUI.storage.local;

        /**
         * REST functions for Directory form listeners
         */
        class DirectoryREST {


            constructor() { }
            show(ID: number) {
                const dir: Directory = new LocalStorageFileSystem().getDirectory(ID)

                const showIdSelector = `.${directory.show} input[name="id"]`
                const showNameSelector = `.${directory.show} input[name="name"]`
                const editNameSelector = `.${directory.edit} input[name="name"]`
                const showDirIdSelector = `.${directory.show} input[name="directoryId"]`

                const showId: HTMLInputElement | null = document.querySelector(showIdSelector)
                const showName: HTMLInputElement | null = document.querySelector(showNameSelector)
                const editName: HTMLInputElement | null = document.querySelector(editNameSelector)
                const showDirId: HTMLInputElement | null = document.querySelector(showDirIdSelector)

                if (!showId) throw new Error(`Cannot find Element with selector: '${showIdSelector}'`)
                if (!showName) throw new Error(`Cannot find Element with selector: '${showNameSelector}'`)
                if (!editName) throw new Error(`Cannot find Element with selector: '${editNameSelector}'`)
                if (!showDirId) throw new Error(`Cannot find Element with selector: '${showDirIdSelector}'`)
                
                showId.value = String(dir.ID)
                showName.value = dir.name
                editName.value = dir.name
                showDirId.value = String(dir.parentDirectoryId)
                new LocalStorageFileSystem().showDirectories()
            }
            create() {
                const newNameSelector = `.${directory.new} input[name="name"]`
                const showIdSelector = `.${directory.show} input[name="id"]`

                const newName: HTMLInputElement | null = document.querySelector(newNameSelector)
                const showId: HTMLInputElement | null = document.querySelector(showIdSelector)

                if (!newName) throw new Error(`Cannot find Element with selector: '${newNameSelector}'`)
                if (!showId) throw new Error(`Cannot find Element with selector: '${showIdSelector}'`)

                const newDir: DirectoryNullable = new DirectoryNullable({
                    name: newName.value,
                    parentDirectoryId: parseInt(showId.value)
                })

                newName.value = ''

                const dir = new LocalStorageFileSystem().createDirectory(newDir)
                this.show(dir.ID)
            }
            update() {
                const editNameSelector = `.${directory.edit} input[name="name"]`
                const showIdSelector = `.${directory.show} input[name="id"]`
                const showDirIdSelector = `.${directory.show} input[name="directoryId"]`

                const editName: HTMLInputElement | null = document.querySelector(editNameSelector)
                const showId: HTMLInputElement | null = document.querySelector(showIdSelector)
                const showDirId: HTMLInputElement | null = document.querySelector(showDirIdSelector)

                if (!editName) throw new Error(`Cannot find Element with selector: '${editNameSelector}'`)
                if (!showId) throw new Error(`Cannot find Element with selector: '${showIdSelector}'`)
                if (!showDirId) throw new Error(`Cannot find Element with selector: '${showDirIdSelector}'`)

                const oldDir: Directory = new LocalStorageFileSystem().getDirectory(parseInt(showId.value))
                const newDir: DirectoryNullable = new DirectoryNullable({
                    name: editName.value,
                    parentDirectoryId: parseInt(showDirId.value)
                })

                const dir = new LocalStorageFileSystem().updateDirectory(oldDir, newDir)
                this.show(dir.ID)
            }
            delete() {
                
            }
            static create() {
                new DirectoryREST().create()
            }
            static update() {
                new DirectoryREST().update()
            }
        }

        new DirectoryREST().show(1)
        document.querySelector(`.${clear}`)?.addEventListener('click', ()=>new LocalStorageFileSystem().drop())
        document.querySelector(`.${directory.create}`)?.addEventListener('click', DirectoryREST.create)
        document.querySelector(`.${directory.update}`)?.addEventListener('click', DirectoryREST.update)

        /**
         * REST functions for File form listeners
         */
        const saveStage = (e: Event): void => {

            /**
             * need to refactor. not reusable
             */
            const input = document.querySelector(`.${file.edit} input`) as HTMLInputElement
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

            const input = document.querySelector(`.${file.new} input`) as HTMLInputElement
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

        /**
         * Add Listeners to form items
         */        
        // document.querySelector(`.${clear}`)?.addEventListener('click', clearStorage.bind(this))
        document.querySelector(`.${file.edit} button`)?.addEventListener('click', saveStage.bind(this))
        document.querySelector(`.${file.new} button`)?.addEventListener('click', addFile.bind(this))


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
