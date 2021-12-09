import Konva from 'konva';
import Class from './models/class';

export default class Classzu {
    
    private stage: Konva.Stage
    private html: HTMLElement

    constructor() {

        const element: HTMLDivElement = document.createElement('div')
        element.style.width = String(innerWidth)
        element.style.height = String(innerHeight)

        document.body.append(element);

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

        this.stage = new Konva.Stage({
            container: id,
            width: element.clientWidth,
            height: element.clientHeight,
        })

        const layer = new Konva.Layer();
        this.stage.add(layer);

        /**
         *  test object
         */
        const _class: Class = new Class()
        layer.add(_class)

        return this;

    }
    public useGUI(): Classzu {
        
        this.html.innerHTML = `
            <button class="btn">button</button>
        `
        const clickToCreateClass = (e: Event) => {
            e.preventDefault()
            const layer = this.stage.getLayers()[0]
            layer.add(new Class())
        }

        document.querySelector('.btn')?.addEventListener('click', clickToCreateClass.bind(this))

        return this;

    }
    public useLocalDirectorySystem() {
        
        return this;

    }
}