import Konva from 'konva';

import Class from './Class';
import Config from './config/index'
import { getUniqueStr, getPxString, getClasszuElement, getClasszuElementId } from './utils/index'
import ClasszuLoader from './ClasszuLoader'


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
        const guiElement : HTMLElement = getClasszuElement(this.rootElementId, "gui")

        guiElement.innerHTML = `
            <div style="top: 10px; left: 10px; cursor: default; position: absolute;" class="bg-dark p-2" pointer-events="all">
                <button class="btn ${Config.GUI.class.create}">button</button>
                <button class="btn ${Config.GUI.storage.local.save}">save</button>
                <button class="btn ${Config.GUI.storage.local.load}">load</button>
            </div>
        `

        const clickToCreateClass = (e: Event): void => {
            
            const html: HTMLElement = getClasszuElement(this.rootElementId, "gui")
            const _class = new Class().group().listen(html)

            const layer = this.stage.getLayers()[0]
            layer.add(_class)
            console.log(_class)

            return e.preventDefault()
        }

        const clickToSaveStage = (e: Event): void => {
            const data = this.stage.toJSON()
            localStorage.setItem(Config.Storage.local.name, data);
            return e.preventDefault();
        }

        const clickToLoadStage = (e: Event): void => {
            const json = localStorage.getItem(Config.Storage.local.name)
            if (json === null) {
                new Error('LocalStorage is Empty')
                return;
            }
            this.stage = new ClasszuLoader(json, this.rootElementId).create();
            return e.preventDefault();
        }

        document.querySelector(`.${Config.GUI.class.create}`)?.addEventListener('click', clickToCreateClass.bind(this))
        document.querySelector(`.${Config.GUI.storage.local.save}`)?.addEventListener('click', clickToSaveStage.bind(this))
        document.querySelector(`.${Config.GUI.storage.local.load}`)?.addEventListener('click', clickToLoadStage.bind(this))

        return this;

    }
    public useLocalDirectorySystem() {
        
        return this;

    }
}