import { getUniqueStr } from "@/utils"

const GUI = {
    class: {
        create: 'gui-create-class'
    },
    storage: {
        local: {
            directory: {
                new: `new-${getUniqueStr()}`,
                create: `create-${getUniqueStr()}`,
                show: `show-${getUniqueStr()}`,
                edit: `edit-${getUniqueStr()}`,
                update: `update-${getUniqueStr()}`,
                delete: `delete-${getUniqueStr()}`,
            },
            file: {
                new: `new-${getUniqueStr()}`,
                create: `create-${getUniqueStr()}`,
                show: `show-${getUniqueStr()}`,
                edit: `edit-${getUniqueStr()}`,
                update: `update-${getUniqueStr()}`,
                delete: `delete-${getUniqueStr()}`,
            },
            clear: 'gui-storage-local-clear',
            fileTree: "file-tree"
        },
    }
}


export default GUI