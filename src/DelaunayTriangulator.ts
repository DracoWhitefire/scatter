import Definitions from "./Definitions";
import Geo from "./Geo";
import CircumscribedCircle from './CircumscribedCircle';
import edge = Definitions.edge;
import triangle = Definitions.triangle;
import vertex = Definitions.vertex;

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
                let c = CircumscribedCircle.findCenterForTriangle(triangle);
                let distance = Geo.getDistance(c, node);
                if (distance < Geo.getDistance(c, triangle[0])) {
                    badTriangles.push(triangle);
                }
            }
            let polygon: edge[] = [];
            for (let badTriangle of badTriangles) {
                let edges = Geo.getEdges(badTriangle);
                let sharedEdges: edge[] = [];
                for (let compareTriangle of badTriangles) {
                    if (badTriangle === compareTriangle) {
                        continue;
                    }
                    let compareEdges = Geo.getEdges(compareTriangle);
                    for (let edge of edges) {
                        for (let compareEdge of compareEdges) {
                            if (Geo.compareEdges(edge, compareEdge)) {
                                sharedEdges.push(edge);
                            }
                        }
                    }
                }
                edges.filter((edge: edge) => {
                    for (let sharedEdge of sharedEdges) {
                        if (Geo.compareEdges(edge, sharedEdge)) {
                            return false;
                        }
                    }
                    return true;
                }).forEach((edge: edge) => {
                    polygon.push(edge)
                });
            }
            triangulation = triangulation.filter((triangle) => {
                return !badTriangles.find((badTri) => Geo.compareTriangles(triangle, badTri));
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
            return !trianglesToRemove.find((triToRemove) => Geo.compareTriangles(triToRemove, triangle));
        });

        return triangulation;
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
        return <triangle>[
            {x: minX - width, y: minY - 10},
            {x: maxX + width, y: minY - 10},
            {x: minX + width / 2, y: maxY + height},
        ];
    }
}

export default DelaunayTriangulator;
