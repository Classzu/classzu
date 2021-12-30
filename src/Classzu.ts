import Konva from 'konva';

import Class from './Class';
import Config from './config/index'
import { getUniqueStr, getPxString, getClasszuElement, getClasszuElementId, createElementFromHTML } from './utils/index'
import ClasszuLoader from './ClasszuLoader'
// import { Directory, DirectoryNullable, File, FileNullable } from '@/LocalStorageFileSystem/models';

/**
 * HTML getters
 */
import getGuiHTML from './tamplates/gui/index'
import LocalStorageFileSystem from './LocalStorageFileSystem';

export default class Classzu {
    
    private _rootElementId: string
    private _stage: Konva.Stage

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


        this._rootElementId = id
        this._stage =  new Konva.Stage({
            container: konvaElement,
            width: konvaElement.clientWidth,
            height: konvaElement.clientHeight,
        });

        const layer: Konva.Layer = new Konva.Layer();
        this._stage.add(layer);

    }
    get rootElementId(): string {
        return this._rootElementId
    }
    get stage(): Konva.Stage {
        return this._stage
    }
    set stage(value: Konva.Stage) {
        this._stage = value;
    }
    public useGUI(): Classzu {

        const guiElement: HTMLElement = getClasszuElement(this._rootElementId, "gui")
        guiElement.append(getGuiHTML())

        const createClass = (e: Event): void => {
            
            const _class = new Class().group().listen(guiElement)
            const layer = this._stage.getLayers()[0]
            layer.add(_class)
            return e.preventDefault()

        }

        document.querySelector(`.${Config.GUI.class.create}`)?.addEventListener('click', createClass.bind(this))

        return this;

    }
    public useLocalFileSystem() {

        new LocalStorageFileSystem(this).GUI.set()
        // form create file
        // - error確認
        // - ファイルが作成される
        // - renderが更新される
        // - currentファイルの情報があっているか

        // form update file
        // - error確認
        // - ファイルがアップデートされる(create Class, change name)
        // - renderが更新される
        // - currentファイルの情報があっているか
        // - 他のファイルと切り替えてみる

        // delete file
        // - error確認
        // - ファイルが削除される(create Class, change name)
        // - renderが更新される
        // - currentファイルの遷移先があっているか
        // - 最後の一つのファイルを削除してUnTitledファイルが作成されるか
        // - 最後のファイル削除後に新しいファイルを作成できるか *


        
        // form create Directory
        // - error確認
        // - ディレクトリが作成される
        // - renderが更新される
        // - currentディレクトリの情報があっているか

        // form update Directory
        // - error確認
        // - ディレクトリがアップデートされる(create Class, change name)
        // - renderが更新される
        // - currentディレクトリの情報があっているか
        // - 他のディレクトリと切り替えてみる

        // delete Directory
        // - error確認
        // - ディレクトリが削除される
        // - renderが更新される
        // - currentディレクトリの遷移先があっているか
        // - 最後の一つのディレクトリを削除してUnTitledファイルが作成されるか
        // - 最後のディレクトリ削除後に新しいファイル or ディレクトリを作成できるか *

    }
}
