import Classzu from '../src/index'
import '../src/css/style.css'
import localStorageDB from 'localStorageDB'


const classzu = new Classzu('myDiv').useGUI().useLocalFileSystem()

const lib = new localStorageDB("test")
if (lib.isNew()) {
    lib.createTable("files", ["ID","name", "data", "directoryId"])
    lib.insert('files', { ID: 19, name: "ggg", data: "data==", directoryId: 2 })
    lib.insert('files', { ID: 19, name: "ggg", data: "data==", directoryId: 2 })
    lib.commit()
}

const num = lib.insert('files', { ID: 19, name: "ggg", data: "data==", directoryId: 2 })
console.log(num)

const d = lib.deleteRows('files', { ID: 19 })
console.log(d)
const all = lib.queryAll('files', {});
console.log(all)
