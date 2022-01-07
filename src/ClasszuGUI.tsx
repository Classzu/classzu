import * as React from 'react'
import Classzu from '.'
import Class from './Class'
import Config from './config'
import { getClasszuElement } from './utils'

class ClasszuGUI extends React.Component {
    state:{classzu:Classzu}
    constructor(props: {classzu: Classzu}) {
        super(props)
        this.state = {
            classzu: props.classzu
        }
    }
    createClass = (e: React.MouseEvent) => {

        const guiElement: HTMLElement = getClasszuElement(this.state.classzu.rootElementId, "gui")
        const _class = new Class().group().listen(guiElement)
        const layer = this.state.classzu.stage.getLayers()[0]
        layer.add(_class)

        e.preventDefault()
        e.stopPropagation()

    }
    render() {
        return (
            <>
                <div  className={`bg-black p-2 m-2 flex justify-center`} style={{ pointerEvents: 'all' }}>
                    <button className={`btn btn-blue ${Config.GUI.class.create}`} onClick={e => this.createClass(e) }>Create Class</button>
                </div>
            </>
        )
    }
}

export default ClasszuGUI