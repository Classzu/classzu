import Konva from 'konva';
import Config from '../config';

class Class extends Konva.Group {
    private rect: Konva.Rect;
    public constructor() {
        super()

        this.rect = new Konva.Rect({
            x: 20,
            y: 20,
            width: 100,
            height: 50,
            fill: Config.Class.colors.white,
            stroke: Config.Class.fillColors.gray,
            strokeWidth: 4,
            draggable: true,
        })

        this.add(this.rect)

    }

}

export default Class