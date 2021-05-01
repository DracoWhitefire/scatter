import PoissonDiskSampler from "./PoissonDiskSampler";
import DelaunayTriangulator from "./DelaunayTriangulator";
import EdgeNodeGenerator from "./EdgeNodeGenerator";

const minRadius = 30;
const maxRadius = 600;
const width = 1024;
const height = 768;
const iterations = 150;

const sampler = new PoissonDiskSampler();
const nodes = sampler.findPoints(width, height, minRadius, maxRadius, iterations)
    .concat(EdgeNodeGenerator.generate(width, height, minRadius, maxRadius));


const canvas = <HTMLCanvasElement> document.querySelector('canvas#main');
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
    c.fillStyle = "rgb(" + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
    c.beginPath();
    c.moveTo(drawNode[0].x, drawNode[0].y);
    c.lineTo(drawNode[1].x, drawNode[1].y);
    c.lineTo(drawNode[2].x, drawNode[2].y);
    c.lineTo(drawNode[0].x, drawNode[0].y);
    // c.stroke();
    c.fill();
}