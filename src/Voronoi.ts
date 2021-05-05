import Definitions from "./Definitions";
import triangle = Definitions.triangle;
import polygon = Definitions.polygon;
import Geo from "./Geo";
import CircumscribedCircle from "./CircumscribedCircle";
import vertex = Definitions.vertex;
import node = Definitions.node;

class Voronoi
{
    getPolygons(nodes: node[], delaunyTriangles: triangle<vertex>[]) {
        const voronoiPolys = [];
        for (let node of nodes) {
            let connectedTris = delaunyTriangles.filter(
                (triangle: triangle<vertex>) => Geo.compareVertices(node, triangle[0])
                    || Geo.compareVertices(node, triangle[1])
                    || Geo.compareVertices(node, triangle[2])
            );
            console.log(connectedTris.length, 'connected');
            let copy = connectedTris.slice();
            console.log(copy.length, 'copy')
            let sortedTris = [];
            // @ts-ignore
            let current: triangle<vertex> = copy.pop();
            let next: triangle<vertex>;
            let innerNode: boolean = true;
            while (copy.length) {
                sortedTris.push(current);
                // @ts-ignore
                next = copy.find((triangle: triangle<vertex>) => {
                    if (Geo.compareTriangles(triangle, current)) {
                        return false;
                    }
                    for (let connectedVertex of triangle) {
                        if (current && current.find((vertex: vertex) =>
                            !Geo.compareVertices(node, vertex)
                            && Geo.compareVertices(connectedVertex, vertex))) {
                            return true;
                        }
                    }
                    return false;
                });
                if (!next) {
                    innerNode = false;
                    break;
                }
                current = next;
                copy = copy.filter((triangle: triangle<vertex>) => !Geo.compareTriangles(triangle, current));
            }

            // // exit;
            let triNodes: { [key: string]: number } = {};
            for (let connectedTri of sortedTris) {
                for (let connectedVertex of connectedTri) {
                    let vertexString = JSON.stringify(connectedVertex);
                    if (!(vertexString in triNodes)) {
                        triNodes[vertexString] = 1;
                    } else {
                        triNodes[vertexString]++;
                    }

                }
            }
            console.log(triNodes);
            for (let key in triNodes) {
                // @ts-ignore
                if (triNodes[key] < 2) {
                    innerNode = false;
                    break;
                }
            }
            // for (let connectedTri of sortedTris) {
            //     let centerForTriangle = CircumscribedCircle.findCenterForTriangle(connectedTri);
            //     c.fillStyle = 'green';
            //     c.fillRect(centerForTriangle.x - 1, centerForTriangle.y - 1, 3, 3);
            // }
            if (innerNode) {
                let voronoiPoly: polygon = {
                    souceVertex: node,
                    edgeVertices: [],
                };
                for (let connectedTri of sortedTris) {
                    let centerForTriangle = CircumscribedCircle.findCenterForTriangle(connectedTri);

                    voronoiPoly.edgeVertices.push(centerForTriangle);
                }
                voronoiPolys.push(voronoiPoly);
            }

        }
        return voronoiPolys;
    }
}

export default Voronoi;