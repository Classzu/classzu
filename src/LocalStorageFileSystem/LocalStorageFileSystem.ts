import Classzu from "..";
import * as ORM from './ORM'
import GUI from './GUI'

class LocalStorageFileSystem {

    public classzu: Classzu
    public ORM: typeof ORM = ORM
    public GUI: GUI = new GUI(this)
    constructor(classzu: Classzu) {

        this.classzu = classzu;

    }
    
}

export default LocalStorageFileSystem;