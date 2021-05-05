import Definitions from "./Definitions";
import triangle = Definitions.triangle;
import edge = Definitions.edge;
import vertex = Definitions.vertex;

class Geo
{

    /**
     * @param {vertex} nodeA
     * @param {vertex} nodeB
     *
     * @return {number}
     */
    static getDistance(nodeA: vertex, nodeB: vertex): number {
        return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    }

    /**
     * @param {triangle} triangle
     * @return {[edge<vertex>, edge<vertex>, edge<vertex>]}
     */
    static getEdges(triangle: triangle<vertex>): [edge<vertex>, edge<vertex>, edge<vertex>] {
        return Object.seal([
            <edge<vertex>> Object.seal([triangle[0], triangle[1]]),
            <edge<vertex>> Object.seal([triangle[1], triangle[2]]),
            <edge<vertex>> Object.seal([triangle[2], triangle[0]]),
        ]);
    }

    /**
     * @param {vertex} vertexA
     * @param {vertex} vertexB
     * @param {int} precision
     * @return boolean
     */
    static compareVertices(vertexA: vertex, vertexB: vertex, precision: number = 6): boolean {
        return vertexA.x.toPrecision(precision) === vertexB.x.toPrecision(precision)
            && vertexA.y.toPrecision(precision) === vertexB.y.toPrecision(precision);
    }

    /**
     * @param {edge<vertex>} edgeA
     * @param {edge<vertex>} edgeB
     * @return boolean
     */
    static compareEdges(edgeA: edge<vertex>, edgeB: edge<vertex>): boolean {
        return this.compareVertices(edgeA[0], edgeB[0]) && this.compareVertices(edgeA[1], edgeB[1])
            || this.compareVertices(edgeA[0], edgeB[1]) && this.compareVertices(edgeA[1], edgeB[0]);
    }

    /**
     * @param {triangle} triangleA
     * @param {triangle} triangleB
     * @return boolean
     */
    static compareTriangles(triangleA: triangle<vertex>, triangleB: triangle<vertex>): boolean {
        return this.compareVertices(triangleA[0], triangleB[0])
            && this.compareVertices(triangleA[1], triangleB[1])
            && this.compareVertices(triangleA[2], triangleB[2])
            || this.compareVertices(triangleA[0], triangleB[0])
            && this.compareVertices(triangleA[2], triangleB[1])
            && this.compareVertices(triangleA[1], triangleB[2])
            || this.compareVertices(triangleA[0], triangleB[1])
            && this.compareVertices(triangleA[1], triangleB[0])
            && this.compareVertices(triangleA[2], triangleB[2])
            || this.compareVertices(triangleA[0], triangleB[2])
            && this.compareVertices(triangleA[1], triangleB[1])
            && this.compareVertices(triangleA[2], triangleB[0])
            ;
    }
}

export default Geo;