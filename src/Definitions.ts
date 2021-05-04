namespace Definitions {
    export type vertex = { x: number, y: number };
    export type node = {x: number, y: number, radius: number};
    export type edge = [vertex, vertex];
    export type triangle = [vertex, vertex, vertex];
}

export default Definitions;