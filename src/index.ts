import PoissonDiskSampler from "./PoissonDiskSampler";
import DelaunayTriangulator from "./DelaunayTriangulator";
import EdgeNodeGenerator from "./EdgeNodeGenerator";
import CircumscribedCircle from "./CircumscribedCircle";
import Definitions from "./Definitions";
import triangle = Definitions.triangle;
import vertex = Definitions.vertex;

type polygon = {
    souceVertex: vertex,
    edgeVertices: vertex[],
};

const minRadius = 30;
const maxRadius = 600;
const width = 1024;
const height = 768;
const iterations = 150;

const sampler = new PoissonDiskSampler();
const nodes = sampler.findPoints(width, height, minRadius, maxRadius, iterations)
//     // .concat(EdgeNodeGenerator.generate(width, height, minRadius, maxRadius))
;


const canvas = <HTMLCanvasElement>document.querySelector('canvas#main');
const c = <CanvasRenderingContext2D>canvas.getContext('2d');


canvas.width = width;
canvas.height = height;
c.fillStyle = 'red';
c.strokeStyle = 'grey';

for (let node of nodes) {
    c.fillRect(node.x - 1, node.y - 1, 3, 3);
    c.strokeStyle = 'lightgrey';
    c.beginPath();
    c.arc(node.x, node.y, node.radius / 2, 0, 2 * Math.PI);
    c.stroke();
}

c.strokeStyle = 'lightblue';
const triangulator = new DelaunayTriangulator();
const drawTriangles = triangulator.bowyerWatson(nodes);
const voronoiPolys = [];
debugger;
for (let node of nodes) {
    let connectedTris = drawTriangles.filter(
        (triangle: triangle) => DelaunayTriangulator.compareVertices(node, triangle[0])
            || DelaunayTriangulator.compareVertices(node, triangle[1])
            || DelaunayTriangulator.compareVertices(node, triangle[2])
    );
    let length = connectedTris.length;
    // console.log(connectedTris.length, 'connected');
    console.log(connectedTris, 'connected');
    let sortedTris = [];
    // @ts-ignore
    let current: triangle = connectedTris.pop();
    let next: triangle;
    while (connectedTris.length) {
        sortedTris.push(current);
        // @ts-ignore
        next = connectedTris.find((triangle: triangle) => {
            for (let connectedVertex of triangle) {
                if (current && current.find((vertex: vertex) =>
                    !DelaunayTriangulator.compareVertices(node, vertex)
                    && DelaunayTriangulator.compareVertices(connectedVertex, vertex))) {
                    return true;
                }
            }
            return false;
        });
        if (!next) {
            let newlength = connectedTris.length;
            break;
        }
        current = next;
        connectedTris = connectedTris.filter((triangle: triangle) => !DelaunayTriangulator.compareTriangles(triangle, current));
    }
    console.log(sortedTris, 'sorted');
    // exit;
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
    let innerNode = true;
    for (let key in triNodes) {
        // @ts-ignore
        if (triNodes[key] < 2) {
            innerNode = false;
            break;
        }
    }
    if (innerNode) {
        let voronoiPoly: polygon = {
            souceVertex: node,
            edgeVertices: [],
        };
        for (let connectedTri of connectedTris) {
            voronoiPoly.edgeVertices.push(CircumscribedCircle.findCenterForTriangle(connectedTri));
        }
        voronoiPolys.push(voronoiPoly);
    }

}
console.log(voronoiPolys);

for (let voronoiPoly of voronoiPolys) {
    c.beginPath();
    // @ts-ignore
    c.moveTo(voronoiPoly.edgeVertices[0].x, voronoiPoly.edgeVertices[0].y);
    for (let edgeVertex of voronoiPoly.edgeVertices) {
        c.lineTo(edgeVertex.x, edgeVertex.y);
    }
    // @ts-ignore
    c.lineTo(voronoiPoly.edgeVertices[0].x, voronoiPoly.edgeVertices[0].y);
    c.stroke();
    // exit;
}

// for (let drawTriangle of drawTriangles) {
//     console.log(drawTriangle, CircumscribedCircle.findCenterForTriangle(drawTriangle));
//     exit;
//
//     c.fillStyle = "rgb(" + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
//     c.beginPath();
//     c.moveTo(drawTriangle[0].x, drawTriangle[0].y);
//     c.lineTo(drawTriangle[1].x, drawTriangle[1].y);
//     c.lineTo(drawTriangle[2].x, drawTriangle[2].y);
//     c.lineTo(drawTriangle[0].x, drawTriangle[0].y);
//     c.stroke();
//     // c.fill();
// }