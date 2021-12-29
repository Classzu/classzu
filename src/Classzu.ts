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

        const selector = Config.GUI.storage.local;

        /**
         * REST functions for Directory form listeners
         */
        class DirectoryREST {


            constructor() { }
            show(a: number | Directory) {
                
                const dir: Directory = (typeof a === "number") ? new LocalStorageFileSystem().getDirectory(a) : a;

                const showIdSelector = `.${selector.directory.show} input[name="id"]`
                const showNameSelector = `.${selector.directory.show} input[name="name"]`
                const editNameSelector = `.${selector.directory.edit} input[name="name"]`
                const showDirIdSelector = `.${selector.directory.show} input[name="directoryId"]`

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
                console.log(dir)
            }
            create() {
                const newNameSelector = `.${selector.directory.new} input[name="name"]`
                const showIdSelector = `.${selector.directory.show} input[name="id"]`

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
                this.show(dir)
            }
            update() {
                const editNameSelector = `.${selector.directory.edit} input[name="name"]`
                const showIdSelector = `.${selector.directory.show} input[name="id"]`
                const showDirIdSelector = `.${selector.directory.show} input[name="directoryId"]`

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
                this.show(dir)
            }
            delete(directory: Directory) {
                // 関連しているファイルたちはLocalStorageFileSystem側で削除している理由はメソッド内にコメント済み
                new LocalStorageFileSystem().deleteDirectory(directory.ID)
            }
            /**
             * このstaticメソッドたちはインスタンスメソッドがrefactorされた後に必要かどうか判断する。
             * RESTというかCLUDの処理をなぜあえてstaticで書き直したかというと匿名関数にしちゃうと単純に可読性が低かったから。
             */
            static create() {
                new DirectoryREST().create()
                reRenderFileTree()
                reListenFileTree()
            }
            static update() {
                new DirectoryREST().update()
                reRenderFileTree()
                reListenFileTree()
            }
            static delete(dir: Directory) {
                new DirectoryREST().delete(dir)

                /**
                 * 本当は親フォルダを表示させたい。
                 * けど親フォルダのshowが出来上がってないので、今は、
                 * ファイル内の最初のファイル
                 * でいこう。。。
                 */

                // new DirectoryREST().show(dirId)
                //↓

                let files: File[] = new LocalStorageFileSystem().getFiles()
                if (files.length !== 0) {
                    const redirectFile: File = files.shift()!
                    new FileREST().show(redirectFile)
                } else {

                    const newFile: FileNullable = new FileNullable({
                        name: "Untitled",
                        directoryId: dir.ID,
                    })
                    const redirectFile: File = new LocalStorageFileSystem().createFile(newFile)
                    new FileREST().show(redirectFile)
                }



                reRenderFileTree()
                reListenFileTree()
            }
        }

        

        new DirectoryREST().show(1)
        document.querySelector(`.${selector.clear}`)?.addEventListener('click', () => new LocalStorageFileSystem().drop())
        document.querySelector(`.${selector.directory.create}`)?.addEventListener('click', DirectoryREST.create)
        document.querySelector(`.${selector.directory.update}`)?.addEventListener('click', DirectoryREST.update)

        /**
         * REST functions for File form listeners
         */
        const loadFile = (file: File) => {
            
            this.stage = new ClasszuLoader(file.data, this.rootElementId).create();
            console.log(this.stage)
        }
        const getStage = (): Konva.Stage => {
            return this.stage
        }
        const superThis = this
        class FileREST {
            public superThis: Classzu = superThis
            constructor() {}
            
            show(a: number | File) {
                
                const file: File = (typeof a === "number") ? new LocalStorageFileSystem().getFile(a) : a;

                const showIdSelector = `.${selector.file.show} input[name="id"]`
                const showNameSelector = `.${selector.file.show} input[name="name"]`
                const editNameSelector = `.${selector.file.edit} input[name="name"]`
                const showDirIdSelector = `.${selector.file.show} input[name="directoryId"]`

                const showId: HTMLInputElement | null = document.querySelector(showIdSelector)
                const showName: HTMLInputElement | null = document.querySelector(showNameSelector)
                const editName: HTMLInputElement | null = document.querySelector(editNameSelector)
                const showDirId: HTMLInputElement | null = document.querySelector(showDirIdSelector)

                if (!showId) throw new Error(`Cannot find Element with selector: '${showIdSelector}'`)
                if (!showName) throw new Error(`Cannot find Element with selector: '${showNameSelector}'`)
                if (!editName) throw new Error(`Cannot find Element with selector: '${editNameSelector}'`)
                if (!showDirId) throw new Error(`Cannot find Element with selector: '${showDirIdSelector}'`)
                
                showId.value = String(file.ID)
                showName.value = file.name
                editName.value = file.name
                showDirId.value = String(file.directoryId)
                // loadFile(file)
                this.superThis.stage = new ClasszuLoader(file.data, this.superThis.rootElementId).create();
                console.log(this.superThis)
                console.log(file)
                new DirectoryREST().show(file.directoryId)
            }
            create(stage: Konva.Stage) {
                const newNameSelector = `.${selector.file.new} input[name="name"]`
                const dirShowIdSelector = `.${selector.directory.show} input[name="id"]`

                const newName: HTMLInputElement | null = document.querySelector(newNameSelector)
                const dirShowId: HTMLInputElement | null = document.querySelector(dirShowIdSelector)

                if (!newName) throw new Error(`Cannot find Element with selector: '${newNameSelector}'`)
                if (!dirShowId) throw new Error(`Cannot find Element with selector: '${dirShowIdSelector}'`)
                console.log(this.superThis)
                const stagew: Konva.Stage = this.superThis.stage
                const newStage = stagew.clone()
                
                newStage.getLayers()[0].destroyChildren()
                
                const newFile: FileNullable = new FileNullable({
                    name: newName.value,
                    data: newStage.toJSON(),
                    directoryId: parseInt(dirShowId.value)
                })

                newName.value = ''

                const file = new LocalStorageFileSystem().createFile(newFile)
                this.show(file)
            }
            update(stage: Konva.Stage) {
                const editNameSelector = `.${selector.file.edit} input[name="name"]`
                const showIdSelector = `.${selector.file.show} input[name="id"]`
                const showDirIdSelector = `.${selector.file.show} input[name="directoryId"]`

                const editName: HTMLInputElement | null = document.querySelector(editNameSelector)
                const showId: HTMLInputElement | null = document.querySelector(showIdSelector)
                const showDirId: HTMLInputElement | null = document.querySelector(showDirIdSelector)

                if (!editName) throw new Error(`Cannot find Element with selector: '${editNameSelector}'`)
                if (!showId) throw new Error(`Cannot find Element with selector: '${showIdSelector}'`)
                if (!showDirId) throw new Error(`Cannot find Element with selector: '${showDirIdSelector}'`)

                const oldFile: File = new LocalStorageFileSystem().getFile(parseInt(showId.value))
                const newFile: FileNullable = new FileNullable({
                    name: editName.value,
                    data: this.superThis.stage.toJSON(),
                    directoryId: parseInt(showDirId.value)
                })

                const file = new LocalStorageFileSystem().updateFile(oldFile, newFile)
                this.show(file)
            }
            delete(file: File) {
                new LocalStorageFileSystem().deleteFile(file.ID)
            }

            static create(stage: Konva.Stage) {
                new FileREST().create(stage)
                reRenderFileTree()
                reListenFileTree()
            }
            static update(stage: Konva.Stage) {
                new FileREST().update(stage)
                reRenderFileTree()
                reListenFileTree()
            }
            static delete(file: File) {
                const dirId = file.directoryId
                const fileRest = new FileREST()
                fileRest.delete(file)
                
                /**
                 * delete後は親ディレクトリを表示
                 * だけど、今はまだフォームに値を入れてるだけなのでちょっと無理、
                 * とりあえず、空白のファイルを作成する
                 */

                // new DirectoryREST().show(dirId)
                //↓
                let files: File[] = new LocalStorageFileSystem().getFilesBy("directoryId", dirId)
                if (files.length !== 0) {
                    const redirectFile: File = files.shift()!
                    fileRest.show(redirectFile)
                } else {

                    const newFile: FileNullable = new FileNullable({
                        name: "Untitled",
                        directoryId: dirId,
                    })
                    const redirectFile: File = new LocalStorageFileSystem().createFile(newFile)
                    new FileREST().show(redirectFile)
                }

                reRenderFileTree()
                reListenFileTree()
            }
        }

        /**
         * Add Listeners to form items
         */

        document.querySelector(`.${selector.file.create}`)?.addEventListener('click', () => FileREST.create(this.stage))
        document.querySelector(`.${selector.file.update}`)?.addEventListener('click', () => FileREST.update(this.stage))


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

            document.getElementById(selector.fileTree)?.remove()
            renderFileTree()

        }

        renderFileTree()

        /**
         * Add Listeners to Files
         */
        const listenFiles = () => {
            const fileElements = getClasszuElement(this.rootElementId, "gui").querySelectorAll(`#${selector.fileTree} [data-file-id]`);
            fileElements.forEach(fileElement => {
                const id = parseInt(fileElement.getAttribute("data-file-id")!)
                const file = new LocalStorageFileSystem().getFile(id)
                /**
                 * add show event
                 */
                fileElement.addEventListener('click', (e: Event) => {
                    new FileREST().show(file)
                    e.stopPropagation();
                    e.preventDefault()
                })
                /**
                 * add delete event
                 */
                const trashIcon: HTMLElement = fileElement.querySelector(`.${selector.file.delete}`)!
                trashIcon.addEventListener('click', (e:Event) =>{
                    FileREST.delete(file)
                    e.stopPropagation();
                    e.preventDefault()
                })
            });            
        }
        const listenDirectories = () => {
            const dirElements = getClasszuElement(this.rootElementId, "gui").querySelectorAll(`#${selector.fileTree} [data-directory-id]`);
            dirElements.forEach(dirElement => {
                const id = parseInt(dirElement.getAttribute("data-directory-id")!)
                const dir = new LocalStorageFileSystem().getDirectory(id)
                /**
                 * add show event
                 */
                dirElement.addEventListener('click', (e:Event) => {
                    new DirectoryREST().show(dir)
                    e.stopPropagation();
                    //details タグを使っているためコメントアウト
                    // e.preventDefault()
                })
                /**
                 * add delete event
                 */
                const trashIcon: HTMLElement = dirElement.querySelector(`i`)!
                trashIcon.addEventListener('click', (e: Event) => {
                    DirectoryREST.delete(dir)
                    e.stopPropagation();
                    e.preventDefault()
                })
            });  
        }
        const listenFileTree = () => {
            listenFiles()
            listenDirectories()
        }
        const reListenFileTree = () => {

            listenFileTree()

        }

        listenFileTree()
        
        return this;

    }
}
