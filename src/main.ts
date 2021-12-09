import Konva from 'konva';

const style = {
    fillColor:"white",
    strokeColor: '#bbc8d3',
}


export default class Classzu {
    
    constructor() {
        
    }
    public setup(id:string) {
        const element: HTMLElement | null = document.getElementById(id)
        if (element === null) throw Error('Cannot find HTMLElement.')

        const stage = new Konva.Stage({
            container: id,
            width: element.clientWidth,
            height: element.clientHeight,
        })

        const layer = new Konva.Layer();
        const rect = new Konva.Rect({
            x: 20,
            y: 20,
            width: 100,
            height: 50,
            fill: style.fillColor,
            stroke: style.strokeColor,
            strokeWidth: 4,
            draggable: true,
        })

        layer.add(rect);
        stage.add(layer);

    }
}