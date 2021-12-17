const getNameWithPrefix = (name: string) => {
    const prefix = "classzu.";
    return prefix + name;
}

const Storage = {
    local: {
        name: 'classzu',
        tables: {
            files: {
                name: getNameWithPrefix("files")
            },
            directories: {
                name: getNameWithPrefix("directories")
            }
        }
    }
}

export default Storage;