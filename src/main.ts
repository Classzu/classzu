import Konva from 'konva';
import Class from './models/class';
import Config from './config/index'

export default class Classzu {
    
    private elementId: string | undefined
    private stage: Konva.Stage
    private html: HTMLElement


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
            layer.add(new Class())
            return e.preventDefault()
        }

        const clickToSaveStage = (e: Event): void => {
            const data = this.stage.toJSON()
            localStorage.setItem(Config.Storage.local.name, data);
            return e.preventDefault();
        }

        const clickToLoadStage = (e: Event): void => {
            const data = localStorage.getItem(Config.Storage.local.name)
            this.stage = Konva.Node.create(data, this.elementId);
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