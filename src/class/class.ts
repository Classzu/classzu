import Konva from 'konva';
import Config from '../config'
type KonvaJsonData = {
    attrs: {
        name: string
    }
    children: KonvaJsonData[]
    className: string
}

const ClassNameConfig = {
    this: "Class",
    rect: "ClassRect"
}

class Class extends Konva.Group {
    private rect: Konva.Rect;
    public className: string

    public constructor(data?: KonvaJsonData[]) {
        super()
        this.className = ClassNameConfig.this

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
    public listen(){
        this.rect.on('click', () => {
            this.rect.fill('#aa0000')
        })
        return this;
    }
    public load(data: any) {
        
    }
    public group() {
        this.add(this.rect)
        return this;
    }

    static generate(data?: KonvaJsonData[]) {
        return new Class(data).group().listen()
    }

}

export default Class