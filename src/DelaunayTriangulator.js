const circumCircle = require('circumcircle');

class DelaunayTriangulator {
    /**
     * @see https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
     * @param {{x:int, y:int}[]} nodes
     * @returns {*[]}
     */
    bowyerWatson(nodes) {
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
                let edges = [
                    [badTriangle[0], badTriangle[1]],
                    [badTriangle[1], badTriangle[2]],
                    [badTriangle[2], badTriangle[0]],
                ];
                let sharedEdges = [];
                for (let compareTriangle of badTriangles) {
                    if (badTriangle === compareTriangle) {
                        continue;
                    }
                    let compareEdges = [
                        [compareTriangle[0], compareTriangle[1]],
                        [compareTriangle[1], compareTriangle[2]],
                        [compareTriangle[2], compareTriangle[0]],
                    ];
                    for (let edge of edges) {
                        for (let compareEdge of compareEdges) {
                            if (((edge[0] === compareEdge[0]) && (edge[1] === compareEdge[1]))
                                || ((edge[1] === compareEdge[0]) && (edge[0] === compareEdge[1]))) {
                                sharedEdges.push(edge);
                            }
                        }
                    }
                }
                edges.filter((edge) => {
                    for (let sharedEdge in sharedEdges) {
                        if (((edge[0] === sharedEdge[0]) && (edge[1] === sharedEdge[1]))
                            || ((edge[1] === sharedEdge[0]) && (edge[0] === sharedEdge[1]))) {
                            return false;
                        }
                    }
                    return true;
                }).forEach((edge) => {
                    polygon.push(edge)
                });
            }
            triangulation = triangulation.filter((triangle) => {
                return !badTriangles.find((badTri) => {
                    return (((badTri[0] === triangle[0]) && (badTri[1] === triangle[1]) && (badTri[2] === triangle[2]))
                        || ((badTri[0] === triangle[0]) && (badTri[1] === triangle[2]) && (badTri[2] === triangle[1]))
                        || ((badTri[0] === triangle[1]) && (badTri[1] === triangle[0]) && (badTri[2] === triangle[2]))
                        || ((badTri[0] === triangle[2]) && (badTri[1] === triangle[1]) && (badTri[2] === triangle[0])));
                });
            });
            for (let edge of polygon) {
                triangulation.push([
                    edge[0],
                    edge[1],
                    {x: node.x, y: node.y}
                ])
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
            return !trianglesToRemove.find((triToRemove) => {
                return (((triToRemove[0] === triangle[0]) && (triToRemove[1] === triangle[1]) && (triToRemove[2] === triangle[2]))
                    || ((triToRemove[0] === triangle[0]) && (triToRemove[1] === triangle[2]) && (triToRemove[2] === triangle[1]))
                    || ((triToRemove[0] === triangle[1]) && (triToRemove[1] === triangle[0]) && (triToRemove[2] === triangle[2]))
                    || ((triToRemove[0] === triangle[2]) && (triToRemove[1] === triangle[1]) && (triToRemove[2] === triangle[0])));
            });
        });

        return triangulation;
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
