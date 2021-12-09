type ClassConfig = {
    colors: {
        [key:string]: string
    },
    fillColors: {
        [key:string]: string
    },
    size: {
        width: number,
        height: number,
    }
}

const Class: ClassConfig = {
    colors: {
        black: "#000000",
        red: "#ff0000",
    },
    fillColors: {
        gray: "#bbc8d3",
        red: "#ff0000"
    },
    size: {
        width: 100, 
        height: 100,
    }
}

export default Class;