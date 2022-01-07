import * as React from 'react'
import { getClasszuElementId, getPxString } from './utils'


class ClasszuBase extends React.Component {
    state:{id:string}
    constructor(props: {id: string}) {
        super(props)
        this.state = {
            id: props.id
        }
    }
    createRootInBody() {
        const element = document.createElement('div')
        element.id = this.state.id;
        element.style.width = getPxString(innerWidth)
        element.style.height = getPxString(innerHeight)
        document.body.append(element);
    }
    customRoot() { 

        const rootElement: HTMLElement | null = document.getElementById(this.state.id)!
        if (rootElement === null) throw new Error('Cannot find HTMLElement.')
        rootElement.innerHTML = "";
        rootElement.style.position = "relative"

    }
    render() {

        const rootElement: HTMLElement | null = document.getElementById(this.state.id)!
        return (
            <>
                <div
                    id={getClasszuElementId(this.state.id, "konva")}
                    style={{
                        width: rootElement.clientWidth,
                        height: rootElement.clientHeight,
                    }}
                ></div>
                <div
                    className='flex'
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: 0,
                        height: 0,
                    }}
                >
                    <div id={getClasszuElementId(this.state.id, "localStorageFileSystem")}></div>
                    <div id={getClasszuElementId(this.state.id, "gui")}></div>
                </div>
            </>
        )

    }
}


export default ClasszuBase