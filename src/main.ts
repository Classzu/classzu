import Konva from 'konva';
import { Util } from 'konva/lib/Util';
import { Konva as KonvaGlobal } from 'konva/lib/Global'
import Class from './class/class';
import Config from './config/index'


type ClasszuNodeType = {
    Class: any
}

const ClasszuNode: ClasszuNodeType = {
    "Class": Class
}

/**
 * Quote
 * https://github.com/konvajs/konva/blob/80802f59f1001caa25aea9d702a735f24a631449/src/Node.ts#L2562-L2616
 * need to refactor type
 */
class Node {


    static create(data: string, container?: string) {
        if (Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    }

    static _createNode(obj: any, container?: string) {

        var className: string = obj.className ,
        children = obj.children,
        no,
        len,
        n;

        // if container was passed in, add it to attrs
        if (container) {
            obj.attrs.container = container;
        }

        const createChildren = (parent: any) => {
            if (children) {
                len = children.length;
                for (n = 0; n < len; n++) {
                    parent.add(Node._createNode(children[n]));
                }
            }
        }
        const ClasszuLoadation = (NodeClass: any) => {
            no = new NodeClass(obj.children);
            no.group()
            no.listen()
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

        } else if (KonvaGlobal[className as keyof typeof KonvaGlobal]) {
            const NodeClass = KonvaGlobal[className as keyof typeof KonvaGlobal]
            return KonvaLoadation(NodeClass)
        } else {
            Util.warn(
                'Can not find a node with class name "' +
                className +
                '". Fallback to "Shape".'
            );
            className = 'Shape';
            const NodeClass = KonvaGlobal[className as keyof typeof KonvaGlobal]
            return KonvaLoadation(NodeClass);
        }
    }
}


export default class Classzu {
    
    private elementId: string | undefined
    private stage: Konva.Stage
    private html: HTMLElement

    public Node: any = Node

    constructor() {

        const element: HTMLDivElement = document.createElement('div')
        element.style.width = String(innerWidth)
        element.style.height = String(innerHeight)

        document.body.append(element);

        this.elementId = undefined
        this.html = element;
        this.stage =  new Konva.Stage({
            container: element,
            width: element.clientWidth,
            height: element.clientHeight,
        });

    }
    public setup(id: string): Classzu {
        
        const element: HTMLElement | null = document.getElementById(id)
        if (element === null) throw Error('Cannot find HTMLElement.')

        this.elementId = id;
        this.stage = new Konva.Stage({
            container: id,
            width: element.clientWidth,
            height: element.clientHeight,
        })

        const layer: Konva.Layer = new Konva.Layer();
        this.stage.add(layer);

        return this;

    }
    public useGUI(): Classzu {
        
        this.html.innerHTML = `
            <div style="top: 10px; left: 10px; cursor: default; position: absolute;" class="bg-dark p-2">
                <button class="btn ${Config.GUI.class.create}">button</button>
                <button class="btn ${Config.GUI.storage.local.save}">save</button>
                <button class="btn ${Config.GUI.storage.local.load}">load</button>
            </div>
        `

        const clickToCreateClass = (e: Event): void => {
            const layer = this.stage.getLayers()[0]
            const _class = Class.generate()
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
            const data = JSON.parse(json ? json : '')

            this.stage = this.Node.create(json, this.elementId);
            console.log(this.stage.getLayers()[0].getChildren())
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