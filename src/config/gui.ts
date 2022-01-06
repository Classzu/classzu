import { getUniqueStr } from "@/utils"

const GUI = {
    class: {
        create: 'gui-create-class'
    },
    fileTree: {
        directory: {
            open: `filetree-directory-open-${getUniqueStr()}`,
            close: `filetree-directory-close-${getUniqueStr()}`,
            children: `filetree-directory-children-${getUniqueStr()}`,
        }
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
            fileTree: "file-tree"
        },
    }
}


export default GUI