const circumCircle = require('circumcircle');

class DelaunayTriangulator {
    /**
     * @see https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
     * @param {{x:int, y:int}[]} nodes
     * @returns {*[]}
     */
    bowyerWatson(nodes) {
        const triangulator = this;
        let triangulation = [];
        let superTriangle = this.getSuperTriangle(nodes);
        triangulation.push(superTriangle);
        for (let node of nodes) {
            let badTriangles = [];
            for (let triangle of triangulation) {
                let c = circumCircle([
                    [triangle[0].x, triangle[0].y],
                    [triangle[1].x, triangle[1].y],
                    [triangle[2].x, triangle[2].y],
                ]);
                let distance = Math.sqrt(Math.pow(c.x - node.x, 2) + Math.pow(c.y - node.y, 2));
                if (distance < c.r) {
                    badTriangles.push(triangle);
                }
            }
            let polygon = [];
            for (let badTriangle of badTriangles) {
                let edges = this.getEdges(badTriangle);
                let sharedEdges = [];
                for (let compareTriangle of badTriangles) {
                    if (badTriangle === compareTriangle) {
                        continue;
                    }
                    let compareEdges = this.getEdges(compareTriangle);
                    for (let edge of edges) {
                        for (let compareEdge of compareEdges) {
                            if (this.compareEdges(edge, compareEdge)) {
                                sharedEdges.push(edge);
                            }
                        }
                    }
                }
                edges.filter((edge) => {
                    for (let sharedEdge of sharedEdges) {
                        if (this.compareEdges(edge, sharedEdge)) {
                            return false;
                        }
                    }
                    return true;
                }).forEach((edge) => {
                    polygon.push(edge)
                });
            }
            triangulation = triangulation.filter((triangle) => {
                return !badTriangles.find((badTri) => triangulator.compareTriangles(triangle, badTri));
            });
            for (let edge of polygon) {
                triangulation.push(Object.seal([
                    edge[0],
                    edge[1],
                    {x: node.x, y: node.y}
                ]))
            }
        }

        let trianglesToRemove = [];
        for (let triangle of triangulation) {
            if (superTriangle.find((node) => node === triangle[0])
                || superTriangle.find((node) => node === triangle[1])
                || superTriangle.find((node) => node === triangle[2])) {
                trianglesToRemove.push(triangle);
            }
        }

        triangulation = triangulation.filter(function (triangle) {
            return !trianglesToRemove.find((triToRemove) => triangulator.compareTriangles(triToRemove, triangle));
        });

        return triangulation;
    }

    /**
     * @param {[{x:number, y:number}]} triangle
     * @return {[[{x:number, y:number}]]}
     */
    getEdges(triangle) {
        return Object.seal([
            Object.seal([triangle[0], triangle[1]]),
            Object.seal([triangle[1], triangle[2]]),
            Object.seal([triangle[2], triangle[0]]),
        ]);
    }

    /**
     * @param {{x:number, y:number}} vertexA
     * @param {{x:number, y:number}} vertexB
     * @param {int} precision
     * @return boolean
     */
    compareVertices(vertexA, vertexB, precision = 6) {
        return vertexA.x.toPrecision(precision) === vertexB.x.toPrecision(precision)
        && vertexA.y.toPrecision(precision) === vertexB.y.toPrecision(precision);
    }

    /**
     * @param {[{x:number, y:number},{x:number, y:number}]} edgeA
     * @param {[{x:number, y:number},{x:number, y:number}]} edgeB
     * @return boolean
     */
    compareEdges(edgeA, edgeB) {
        return this.compareVertices(edgeA[0], edgeB[0]) && this.compareVertices(edgeA[1], edgeB[1])
        || this.compareVertices(edgeA[0], edgeB[1]) && this.compareVertices(edgeA[1], edgeB[0]);
    }

    /**
     * @param {[{x:number, y:number},{x:number, y:number},{x:number, y:number}]} triangleA
     * @param {[{x:number, y:number},{x:number, y:number},{x:number, y:number}]} triangleB
     * @return boolean
     */
    compareTriangles(triangleA, triangleB) {
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

    getSuperTriangle(nodes) {
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
        return [
            {x: minX - width, y: minY - 10},
            {x: maxX + width, y: minY - 10},
            {x: minX + width / 2, y: maxY + height},
        ];
    }
}

export default DelaunayTriangulator;
