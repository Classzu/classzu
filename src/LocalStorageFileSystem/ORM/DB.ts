import ORM from "./ORM";

class DB extends ORM {

    constructor() {

        super()

    }
    /**
     * only for development
     */
    public drop() {

        this.db.drop()
        console.log('dropped!')

    }
    
}

export default DB