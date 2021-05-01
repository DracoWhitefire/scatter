type node = {x: number, y: number, radius: number};
class EdgeNodeGenerator {
    /**
     * @param {int} width
     * @param {int} height
     * @param {int} minDistance
     * @param {int} maxDistance
     * @returns {node[]}
     */
    static generate(width: number, height: number, minDistance: number, maxDistance: number): node[] {
        const nodes = [];
        for (let x = Math.random() * maxDistance;
             x <= width;
             x += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: x, y: 0, radius: 0});
        }
        for (let x = Math.random() * maxDistance;
             x <= width;
             x += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: x, y: height, radius: 0});
        }
        for (let y = Math.random() * maxDistance;
             y <= width;
             y += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: 0, y: y, radius: 0});
        }
        for (let y = Math.random() * maxDistance;
             y <= width;
             y += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: width, y: y, radius: 0});
        }

        return nodes.concat([
            {x: 0, y: 0, radius: 0},
            {x: 0, y: height, radius: 0},
            {x: width, y: 0, radius: 0},
            {x: width, y: height, radius: 0}
        ]);
    }
}

export default EdgeNodeGenerator;
