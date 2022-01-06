// import Classzu from '../dist/index'

import Classzu from '../src/index'
import '../src/css/style.scss'


// import localStorageDB from 'localStorageDB'


const classzu = new Classzu('myDiv').useGUI().useLocalFileSystem()

// const lib = new localStorageDB("test")
// if (lib.isNew()) {
//     lib.createTable("files", ["ID","name", "data", "directoryId"])
//     lib.insert('files', { ID: 19, name: "ggg", data: "data==", directoryId: 2 })
//     lib.insert('files', { ID: 19, name: "ggg", data: "data==", directoryId: 2 })
//     lib.commit()
// }

// const num = lib.insert('files', { ID: 19, name: "ggg", data: "data==", directoryId: 2 })
// console.log(num)

// const d = lib.deleteRows('files', { ID: 19 })
// console.log(d)
// const all = lib.queryAll('files', {});
// console.log(all)

// class Outer {
//     public val: number
//     constructor() {
//         this.val = 1337;
//     }

//     get Inner() {
//         return class {

//             constructor(public Outer:Outer){}
//             accessVal() { return Outer.val; }
//         }
//     }

// }
// const outer = new Outer()
// const inner1 = new outer.Inner()
// console.log(inner1.accessVal())
// console.log(inner1.outer.val)

// outer.val = 1000

// const inner2 = new outer.Inner()
// console.log(inner1.accessVal())
// console.log(inner1.outer.val)
// console.log(inner2.accessVal())
// console.log(inner2.outer.val)
