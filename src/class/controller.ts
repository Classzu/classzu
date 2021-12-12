import Konva from "konva";
import Class from "./class"

class ClassController {
    private _class: Class
    private stage: Konva.Stage 
    constructor(_class: Class, stage: Konva.Stage) {
        this._class = _class
        this.stage = stage
    }

    static create() {
        const _class = new Class().group()
    }

    openGUI() {
        
    }
    closeGUI() {
        
    }

}