import GUI from "./GUI";
import Directory, { DirectoryNullable } from "../models/Directory";
import File, { FileNullable } from '../models/File'
import Config from '@/config'

const selector = Config.GUI.storage.local

class DirectoryCLUD {

    public superThis: GUI;

    constructor(superThis: GUI) {

        this.superThis = superThis

    }
    show(a: number | Directory) {
                
        const dir: Directory = (typeof a === "number") ? new this.superThis.superThis.ORM.Directory().getDirectory(a) : a;

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

        const dir = new this.superThis.superThis.ORM.Directory().createDirectory(newDir)
        this.show(dir)

        this.superThis.reRenderFileTree()
        this.superThis.reListenFileTree()

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

        const oldDir: Directory = new this.superThis.superThis.ORM.Directory().getDirectory(parseInt(showId.value))
        const newDir: DirectoryNullable = new DirectoryNullable({
            name: editName.value,
            parentDirectoryId: parseInt(showDirId.value)
        })

        const dir = new this.superThis.superThis.ORM.Directory().updateDirectory(oldDir, newDir)
        this.show(dir)
        
    }
    delete(directory: Directory) {

        // 関連しているファイルたちはLocalStorageFileSystem側で削除している理由はメソッド内にコメント済み
        new this.superThis.superThis.ORM.Directory().deleteDirectory(directory.ID)

        /**
         * 本当は親フォルダを表示させたい。
         * けど親フォルダのshowが出来上がってないので、今は、
         * ファイル内の最初のファイル
         * でいこう。。。
         */

        // new this.DirectoryREST().show(dirId)
        //↓

        let files: File[] = new this.superThis.superThis.ORM.File().getFiles()
        if (files.length !== 0) {
            const redirectFile: File = files.shift()!
            this.superThis.File.show(redirectFile)

        } else {

            const newFile: FileNullable = new FileNullable({
                name: "Untitled",
                directoryId: directory.ID,
            })
            const redirectFile: File = new this.superThis.superThis.ORM.File().createFile(newFile)
            this.superThis.File.show(redirectFile)
        }

    }
}

export default DirectoryCLUD;