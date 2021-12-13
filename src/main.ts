import Konva from 'konva';
import { Util } from 'konva/lib/Util';
import { Konva as KonvaGlobal } from 'konva/lib/Global'
import Class from './class/class';
import Config from './config/index'
import { getUniqueStr } from './utils/index'

type ClasszuNodeType = {
    Class: any
}

const ClasszuNode: ClasszuNodeType = {
    "Class": Class
}


function getPxString(num: number): string {
    return `${num}px`
}
const ElementIds = {
    konva: 'konva-stage',
    gui: 'gui-div'
}

function getClasszuElement(id: string, id2: keyof typeof ElementIds): HTMLElement{
    const uniqueId = getClasszuElementId(id, id2);
    const guiElement : HTMLElement | null = document.getElementById(uniqueId)

    if (!guiElement) {
        new Error(`Cannot find element to add GUI, Searched by (#${uniqueId}`)
        const damyElement = document.createElement('div')
        return damyElement
    }

    return guiElement;
}
function getClasszuElementId(id: string, id2: keyof typeof ElementIds) {
    return `${id}-${ElementIds[id2]}`
}

/**
 * Quote
 * https://github.com/konvajs/konva/blob/80802f59f1001caa25aea9d702a735f24a631449/src/Node.ts#L2562-L2616
 * need to refactor type
 */
class ClasszuLoader {
    private json: string
    private classzuId: string


    constructor(json: string, classzuId: string) {
        this.json = json
        this.classzuId = classzuId
    }
    public create() {
        if (Util._isString(this.json)) {
            const data = JSON.parse(this.json);
            const konvaId = getClasszuElementId(this.classzuId, "konva")
            return this._createNode(data, konvaId);
        }
    }

    private _createNode(obj: any, konvaId?: string) {

        let className: string = obj.className ,
        children = obj.children,
        no,
        len,
        n;

        // if container was passed in, add it to attrs
        if (konvaId) {
            obj.attrs.container = konvaId;
        }

        const createChildren = (parent: any) => {
            if (children) {
                len = children.length;
                for (n = 0; n < len; n++) {
                    parent.add(this._createNode(children[n]));
                }
            }
        }
        const ClasszuLoadation = (NodeClass: any) => {
            const element: HTMLElement = getClasszuElement(this.classzuId, "gui")
            no = new NodeClass(obj.children).group().listen(element);
            return no;
        }
        const KonvaLoadation = (NodeClass: any) => {
            no = new NodeClass(obj.attrs);
            createChildren(no)
            return no
        }


        if (ClasszuNode[className as keyof ClasszuNodeType]) {
            const NodeClass = ClasszuNode[className as keyof ClasszuNodeType];
            return ClasszuLoadation(NodeClass)
        } else {
            if (!KonvaGlobal[className as keyof typeof KonvaGlobal]) {
                Util.warn(
                    'Can not find a node with class name "' +
                    className +
                    '". Fallback to "Shape".'
                );
                className = 'Shape';
            } 
            const NodeClass = KonvaGlobal[className as keyof typeof KonvaGlobal]
            return KonvaLoadation(NodeClass);
        }
    }
}

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
        konvaElement.id = `${id}-${ElementIds.konva}`
        konvaElement.style.width = getPxString(rootElement.clientWidth)
        konvaElement.style.height = getPxString(rootElement.clientHeight)
        rootElement.append(konvaElement)

        /**
         * build GUI Element
         */
        const guiElement: HTMLDivElement = document.createElement('div')
        guiElement.id = `${id}-${ElementIds.gui}`
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