import { getClasszuElement, getClasszuElementId } from "./utils"
import { Util } from 'konva/lib/Util';
import { Konva as KonvaGlobal } from 'konva/lib/Global'
import ClasszuNode from "./Node";

/**
 * Quote
 * https://github.com/konvajs/konva/blob/80802f59f1001caa25aea9d702a735f24a631449/src/Node.ts#L2562-L2616
 * 
 */
export default class ClasszuLoader {
    private json: string
    private classzuId: string


    public constructor(json: string, classzuId: string) {
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


        if (ClasszuNode[className as keyof typeof ClasszuNode]) {
            const NodeClass = ClasszuNode[className as keyof typeof ClasszuNode];
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