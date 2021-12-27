import { getUniqueStr } from "@/utils"

const GUI = {
    class: {
        create: 'gui-create-class'
    },
    storage: {
        local: {
            directory: {
                create: getUniqueStr(),
                update: getUniqueStr(),
                delete: getUniqueStr(),
            },
            file: {
                create: getUniqueStr(),
                update: getUniqueStr(),
                delete: getUniqueStr(),
            },
            clear: 'gui-storage-local-clear',
            fileTree: "file-tree"
        },
    }
}


export default GUI