import Konva from 'konva';
import Config from './config'

import { createElementFromHTML } from './utils/index'
import { KonvaJsonData } from './types';


const ClassNameConfig = {
    className: "Class",
    rect: "ClassRect"
}


const useMenu = (_class: Class, html: HTMLElement) => {
    const id = `class_${_class._id}`;
    const colorNames = Object.keys(Config.Class.color)
    const { x, y } = _class.getTopLeftPosition()

    let menuString = `
        <div id="${id}" style="top: ${y}px; left: ${x}px; cursor: default; position: absolute;" class="bg-dark p-2">
    `;
    for (let i = 0; i < colorNames.length; i++) {
        const colorName = colorNames[i];
        menuString += `
            <button class="btn ${colorName}">${colorName}</button>
        `
    }
    menuString += `
        </div>
    `;

    const element = createElementFromHTML(menuString)
    if (element !== null) {
        
        html.append(element);
    };

    const menu = document.querySelector(`#${id}`);
    

    for (let i = 0; i < colorNames.length; i++) {
        const colorName = colorNames[i];
        document.querySelector(`.${colorName}`)?.addEventListener('click', (e) => {
            _class.setColor(Config.Class.color[colorName])
            menu?.remove();
        })

    }

}
export default class Class extends Konva.Group {
    private rect: Konva.Rect;
    public className: string

    public constructor(data?: KonvaJsonData[]) {
        super()
        this.className = ClassNameConfig.className

        let obj = {}
        
        if (data === undefined || data === null) {
            
            const { position, size, color, fillColor} = Config.Class
            obj = {
                name: ClassNameConfig.rect,
                x: position.x,
                y: position.y,
                width: size.width,
                height: size.height,
                fill: color.white,
                stroke: fillColor.gray,
                strokeWidth: 4,
                draggable: true,
            }
            
        } else if (data){
            for (let i = 0; i < data.length; i++) {
                const konvaJsonData: KonvaJsonData = data[i];
                if (konvaJsonData.attrs.name === ClassNameConfig.rect) {
                    obj = konvaJsonData.attrs
                }
            }
        }

        this.rect = new Konva.Rect(obj)
        
    }
    static generate(data?: KonvaJsonData[]): Class {
        return new Class(data).group()/* .listen() */
    }
    public listen(html: HTMLElement): Class{
        this.rect.on('click', () => {
            useMenu(this, html)
        })
        return this;
    }
    public group(): Class {
        this.add(this.rect)
        return this;
    }
    public setColor(colorCode: string): void {
        this.rect.fill(colorCode);
    }
    public getTopLeftPosition(): {x:number, y:number} {
        return this.rect.getAbsolutePosition()
    }

}