import PoissonDiskSampler from "./PoissonDiskSampler";
import DelaunayTriangulator from "./DelaunayTriangulator";

const minRadius = 30;
const maxRadius = 400;
const width = 800;
const height = 600;
const iterations = 5;

const sampler = new PoissonDiskSampler();
const nodes = sampler.findPoints(width, height, minRadius, maxRadius, iterations);

const canvas = document.querySelector('canvas#main');
const c = canvas.getContext('2d');


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
for (let drawNode of triangulator.bowyerWatson(nodes)) {
    // console.log(drawNode);
    c.beginPath();
    c.moveTo(drawNode[0].x, drawNode[0].y);
    c.lineTo(drawNode[1].x, drawNode[1].y);
    c.lineTo(drawNode[2].x, drawNode[2].y);
    c.lineTo(drawNode[0].x, drawNode[0].y);
    c.stroke();
}