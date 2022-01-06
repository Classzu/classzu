import Config from "@/config"
import Directory from "../../models/Directory";
import File from "../../models/File";
import { createElementFromHTML } from "@/utils"
import * as ORM from "@/LocalStorageFileSystem/ORM";
import * as React from 'react';

const fileTreeSelector = Config.GUI.fileTree
const selector = Config.GUI.storage.local
const icon = {
    trash: 'fas fa-trash-alt',
    caretRight: 'fa fa-caret-right',
    caretDown: 'fa fa-caret-down'
}
class FileHTML extends React.Component {
    private file: File
    constructor(props:{file:File}) {
        super(props)
        this.file = props.file
    }
    render(): React.ReactNode {
        return (
            <>
                <div className="file bg-white flex justify-between p-2 m-2 rounded" data-file-id={this.file.ID}>
                    <div>{this.file.name}</div>
                    <i className={`self-center ${selector.file.delete} ${icon.trash} align-self-center`}></i>
                </div>
            </>
        )
    }
}
class DirectoryHTML extends React.Component {
    state = {
        isOpen: false
    }
    directory: Directory
    constructor(props:{directory: Directory, isOpen?: boolean}) {
        super(props)
        this.directory = props.directory
        this.state = {
            isOpen: props.isOpen || false
        }
    }
    toggle = () => this.setState({ isOpen: !this.state.isOpen });
    render(): React.ReactNode {
        const files: File[] = new ORM.File().selectBy("directoryId", this.directory.ID)
        const dirs: Directory[] = new ORM.Directory().selectBy("parentDirectoryId", this.directory.ID)
        return (
            <>
                <div className={`directory bg-white p-2 m-2 rounded`} data-directory-id={this.directory.ID} >
                    <div className={`flex justify-between`}>
                        <i className={`self-center ${fileTreeSelector.directory[this.state.isOpen ? "open":"close"]} ${ this.state.isOpen ? icon.caretDown : icon.caretRight}`} onClick={this.toggle}></i>
                        <div>{this.directory.name}</div>
                        <i className={`self-center ${selector.directory.delete} ${icon.trash}`}></i>
                    </div>
                    {
                        this.state.isOpen && <>
                            <div className={`${fileTreeSelector.directory.children}`} >
                                {
                                    dirs.map((dir, index) => {
                                        return (<DirectoryHTML {...{ directory: dir }} key={index} />)
                                    })
                                }
                                {
                                    files.map((file, index) => {
                                        return (<FileHTML {...{ file: file }} key={index} />)
                                    })
                                }
                            </div>
                        </>
                    }
                </div>
            </>
        )
    }
}
class FileTreeHTML extends React.Component {
    private rootDirectories: Directory[]
    private rootFiles: File[]    

    constructor(props: {
        rootDirectories: Directory[],
        rootFiles: File[]    
    }) {
        super(props)
        this.rootDirectories = props.rootDirectories
        this.rootFiles = props.rootFiles
    }
    render() {
        return (
            <>
                <div id={selector.fileTree} className="bg-black p-2 m-2"  style={{pointerEvents: "all"}}>
                    <div  className="directory overflow-auto local-system-file-tree">
                        {
                            this.rootDirectories.map((dir, index) => {
                                return (<DirectoryHTML {...{ directory: dir }} key={index} />)
                            })
                        }
                        {
                            this.rootFiles.map((file, index) => {
                                return (<FileHTML {...{ file: file }} key={index} />)
                            })
                        }
                    </div>
                </div>
                
            </>
        )
    }
}
export default FileTreeHTML
