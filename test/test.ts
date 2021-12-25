import Classzu from '../src/index'
import '../src/css/style.css'
import localStorageDB from 'localStorageDB'


const classzu = new Classzu('myDiv').useGUI().useLocalFileSystem()

const lib = new localStorageDB("test")

if (lib.isNew()) {
    lib.createTable("files", ["name", "data", "directory_id"])

    lib.insert('files', { name: "ggg", data: "data==", directory_id: 2 })
    lib.commit()
}


const all = lib.queryAll('files', {});
console.log(all)