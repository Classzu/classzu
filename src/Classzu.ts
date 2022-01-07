import Konva from 'konva';
import { getUniqueStr, getClasszuElement } from './utils/index'
import { render } from 'react-dom';

// import 'css/style.min.css'

/**
 * HTML getters
 */
import ClasszuGUI from './ClasszuGUI'
import LocalStorageFileSystem from './LocalStorageFileSystem';
import ClasszuBase from './ClasszuBase';

export default class Classzu {
    
    private _rootElementId: string
    private _stage: Konva.Stage
    public Node: any = Node

    constructor(id?: string) {

        /**
         *  Build Classzu Base
         */
        if (id === undefined || id === null) {
            id = getUniqueStr()
            new ClasszuBase({ id: id }).createRootInBody()
        }
        const base = new ClasszuBase({ id: id })
        base.customRoot()

        render(
            base.render(),
            document.getElementById(id)!
        )
        
        /**
         * Setup Konva
         */
        const konvaElement: HTMLDivElement = getClasszuElement(id, 'konva') as HTMLDivElement
        const stage =  new Konva.Stage({
            container: konvaElement,
            width: konvaElement.clientWidth,
            height: konvaElement.clientHeight,
        });
        
        const layer: Konva.Layer = new Konva.Layer();
        stage.add(layer);

        /**
         *  Set variables
         */
        this._rootElementId = id
        this._stage = stage

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
        const classzuGui = new ClasszuGUI({classzu: this})
        render(
            classzuGui.render(),
            guiElement
        )
        return this;

    }
    public useLocalFileSystem(): Classzu{

        const lsfsElement: HTMLElement = getClasszuElement(this._rootElementId, "localStorageFileSystem")
        const localStorageFileSystem = new LocalStorageFileSystem(this)
        render(
            localStorageFileSystem.GUI.render(),
            lsfsElement
        )

        localStorageFileSystem.GUI.listen()// for debug
        
        return this;

    }
}
