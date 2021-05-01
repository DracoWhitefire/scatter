class EdgeNodeGenerator {
    /**
     * @param {int} width
     * @param {int} height
     * @param {int} minDistance
     * @param {int} maxDistance
     * @returns {{x:int, y:int}[]}
     */
    static generate(width, height, minDistance, maxDistance) {
        const nodes = [];
        for (let x = Math.random() * maxDistance; x<= width; x += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: x, y: 0});
        }
        for (let x = Math.random() * maxDistance; x<= width; x += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: x, y: height});
        }
        for (let y = Math.random() * maxDistance; y<= width; y += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: 0, y: y});
        }
        for (let y = Math.random() * maxDistance; y<= width; y += minDistance + (Math.pow(Math.random(), 3) * (maxDistance - minDistance))) {
            nodes.push({x: width, y: y});
        }

        return nodes.concat([{x: 0, y:0},{x:0, y:height}, {x:width, y:0}, {x:width, y:height}]);
    }
}

export default EdgeNodeGenerator;
