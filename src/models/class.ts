import Konva from 'konva';
import Config from '../config';

class Class extends Konva.Group {
    private rect: Konva.Rect;
    public constructor() {
        super()

        const { position, size, color, fillColor} = Config.Class

        this.rect = new Konva.Rect({
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
            fill: color.white,
            stroke: fillColor.gray,
            strokeWidth: 4,
            draggable: true,
        })

        this.add(this.rect)

    }

}

export default Class