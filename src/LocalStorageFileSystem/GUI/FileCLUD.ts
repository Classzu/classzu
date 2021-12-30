import GUI from "./GUI";
import File, { FileNullable } from '../models/File'
import Config from '@/config'
import ClasszuLoader from "@/ClasszuLoader";

const selector = Config.GUI.storage.local

class FileCLUD {

    public superThis: GUI;

    constructor(superThis: GUI) {

        this.superThis = superThis

    }
    show(a: number | File) {
                
        const file: File = (typeof a === "number") ? new this.superThis.superThis.ORM.File().getFile(a) : a;

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
        this.superThis.superThis.classzu.stage = new ClasszuLoader(file.data, this.superThis.superThis.classzu.rootElementId).create();
        console.log(this.superThis)
        console.log(file)
        this.superThis.Directory.show(file.directoryId)


        this.superThis.reRenderFileTree()
        this.superThis.reListenFileTree()

    }
    create() {

        const newNameSelector = `.${selector.file.new} input[name="name"]`
        const dirShowIdSelector = `.${selector.directory.show} input[name="id"]`

        const newName: HTMLInputElement | null = document.querySelector(newNameSelector)
        const dirShowId: HTMLInputElement | null = document.querySelector(dirShowIdSelector)

        if (!newName) throw new Error(`Cannot find Element with selector: '${newNameSelector}'`)
        if (!dirShowId) throw new Error(`Cannot find Element with selector: '${dirShowIdSelector}'`)
        console.log(this.superThis)

        const newStage = this.superThis.superThis.classzu.stage.clone()
        newStage.getLayers()[0].destroyChildren()
        
        const newFile: FileNullable = new FileNullable({
            name: newName.value,
            data: newStage.toJSON(),
            directoryId: parseInt(dirShowId.value)
        })

        newName.value = ''

        const file = new this.superThis.superThis.ORM.File().createFile(newFile)
        this.show(file)

    }
    update() {

        const editNameSelector = `.${selector.file.edit} input[name="name"]`
        const showIdSelector = `.${selector.file.show} input[name="id"]`
        const showDirIdSelector = `.${selector.file.show} input[name="directoryId"]`

        const editName: HTMLInputElement | null = document.querySelector(editNameSelector)
        const showId: HTMLInputElement | null = document.querySelector(showIdSelector)
        const showDirId: HTMLInputElement | null = document.querySelector(showDirIdSelector)

        if (!editName) throw new Error(`Cannot find Element with selector: '${editNameSelector}'`)
        if (!showId) throw new Error(`Cannot find Element with selector: '${showIdSelector}'`)
        if (!showDirId) throw new Error(`Cannot find Element with selector: '${showDirIdSelector}'`)

        const oldFile: File = new this.superThis.superThis.ORM.File().getFile(parseInt(showId.value))
        const newFile: FileNullable = new FileNullable({
            name: editName.value,
            data: this.superThis.superThis.classzu.stage.toJSON(),
            directoryId: parseInt(showDirId.value)
        })

        const file = new this.superThis.superThis.ORM.File().updateFile(oldFile, newFile)
        this.show(file)

    }
    delete(file: File) {

        const dirId = file.directoryId
        const fileCLUD = new this.superThis.superThis.ORM.File()
        fileCLUD.deleteFile(file.ID)

         /**
         * delete後は親ディレクトリを表示
         * だけど、今はまだフォームに値を入れてるだけなのでちょっと無理、
         * とりあえず、空白のファイルを作成する
         */

        // new this.DirectoryREST().show(dirId)
        //↓
        let files: File[] = new this.superThis.superThis.ORM.File().getFilesBy("directoryId", dirId)
        if (files.length !== 0) {
            const redirectFile: File = files.shift()!
            this.show(redirectFile)
        } else {

            const newFile: FileNullable = new FileNullable({
                name: "Untitled",
                directoryId: dirId,
            })
            const redirectFile: File = new this.superThis.superThis.ORM.File().createFile(newFile)
            this.show(redirectFile)
        }

    }

}

export default FileCLUD;