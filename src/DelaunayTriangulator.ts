import vertex = Definitions.vertex;

const circumCircle = require('circumcircle');
import Definitions from "./Definitions";
import edge = Definitions.edge;
import triangle = Definitions.triangle;

class DelaunayTriangulator {
    /**
     * @see https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
     * @param {vertex[]} nodes
     * @returns {triangle[]}
     */
    bowyerWatson(nodes: vertex[]): triangle[] {
        let triangulation: triangle[] = [];
        let superTriangle = DelaunayTriangulator.getSuperTriangle(nodes);
        triangulation.push(superTriangle);
        for (let node of nodes) {
            let badTriangles: triangle[] = [];
            for (let triangle of triangulation) {
                let c = circumCircle([
                    [triangle[0].x, triangle[0].y],
                    [triangle[1].x, triangle[1].y],
                    [triangle[2].x, triangle[2].y],
                ]);
                let distance = DelaunayTriangulator.getDistance(c, node);
                if (distance < c.r) {
                    badTriangles.push(triangle);
                }
            }
            let polygon: edge[] = [];
            for (let badTriangle of badTriangles) {
                let edges = this.getEdges(badTriangle);
                let sharedEdges: edge[] = [];
                for (let compareTriangle of badTriangles) {
                    if (badTriangle === compareTriangle) {
                        continue;
                    }
                    let compareEdges = this.getEdges(compareTriangle);
                    for (let edge of edges) {
                        for (let compareEdge of compareEdges) {
                            if (DelaunayTriangulator.compareEdges(edge, compareEdge)) {
                                sharedEdges.push(edge);
                            }
                        }
                    }
                }
                edges.filter((edge: edge) => {
                    for (let sharedEdge of sharedEdges) {
                        if (DelaunayTriangulator.compareEdges(edge, sharedEdge)) {
                            return false;
                        }
                    }
                    return true;
                }).forEach((edge: edge) => {
                    polygon.push(edge)
                });
            }
            triangulation = triangulation.filter((triangle) => {
                return !badTriangles.find((badTri) => DelaunayTriangulator.compareTriangles(triangle, badTri));
            });
            for (let edge of polygon) {
                triangulation.push(Object.seal([
                    edge[0],
                    edge[1],
                    {x: node.x, y: node.y}
                ]))
            }
        }

        let trianglesToRemove: triangle[] = [];
        for (let triangle of triangulation) {
            if (superTriangle.find((node: vertex) => node === triangle[0])
                || superTriangle.find((node: vertex) => node === triangle[1])
                || superTriangle.find((node: vertex) => node === triangle[2])) {
                trianglesToRemove.push(triangle);
            }
        }

        triangulation = triangulation.filter(function (triangle) {
            return !trianglesToRemove.find((triToRemove) => DelaunayTriangulator.compareTriangles(triToRemove, triangle));
        });

        return triangulation;
    }

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
     * @return {[edge, edge, edge]}
     */
    getEdges(triangle: triangle): [edge, edge, edge] {
        return Object.seal([
            <edge> Object.seal([triangle[0], triangle[1]]),
            <edge> Object.seal([triangle[1], triangle[2]]),
            <edge> Object.seal([triangle[2], triangle[0]]),
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
     * @param {edge} edgeA
     * @param {edge} edgeB
     * @return boolean
     */
    static compareEdges(edgeA: edge, edgeB: edge): boolean {
        return this.compareVertices(edgeA[0], edgeB[0]) && this.compareVertices(edgeA[1], edgeB[1])
            || this.compareVertices(edgeA[0], edgeB[1]) && this.compareVertices(edgeA[1], edgeB[0]);
    }

    /**
     * @param {triangle} triangleA
     * @param {triangle} triangleB
     * @return boolean
     */
    static compareTriangles(triangleA: triangle, triangleB: triangle): boolean {
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

    /**
     * @param {vertex[]} nodes
     * @return {triangle} triangle
     */
    static getSuperTriangle(nodes: vertex[]): triangle {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;
        for (let node of nodes) {
            if (node.x < minX) {
                minX = node.x;
            }
            if (node.x > maxX) {
                maxX = node.x;
            }
            if (node.y < minY) {
                minY = node.y;
            }
            if (node.y > maxY) {
                maxY = node.y;
            }
        }
        const width = maxX - minX;
        const height = maxY - minY;
        return <triangle> [
            {x: minX - width, y: minY - 10},
            {x: maxX + width, y: minY - 10},
            {x: minX + width / 2, y: maxY + height},
        ];
    }
}

export default DelaunayTriangulator;
