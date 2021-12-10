type ClassConfig = {
    color: {
        [key:string]: string
    },
    fillColor: {
        [key:string]: string
    },
    position: {
        x: number,
        y: number,
    },
    size: {
        width: number,
        height: number,
    }
}

const Class: ClassConfig = {
    color: {
        black: "#000000",
        red: "#ff0000",
    },
    fillColor: {
        gray: "#bbc8d3",
        red: "#ff0000"
    },
    position: {
        x: 200,
        y: 200,
    },
    size: {
        width: 100, 
        height: 100,
    }
}

export default Class;