import Classzu from "..";
import * as ORM from './ORM'

class LocalStorageFileSystem {

    public classzu: Classzu
    public ORM: typeof ORM = ORM

    constructor(classzu: Classzu) {

        this.classzu = classzu;

    }
    
}


export default LocalStorageFileSystem;