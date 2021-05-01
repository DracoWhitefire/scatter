type node = { x: number, y: number, radius: number };

class PoissonDiskSampler {
    private readonly nodes: node[] = [];
    private readonly index!: Record<number, Record<number, node[]>>;

    /**
     * @param {int} width
     * @param {int} height
     * @param {int} minRadius
     * @param {int} maxRadius
     * @param {int} iterations
     * @returns {node[]}
     */
    findPoints(width: number, height: number, minRadius: number, maxRadius: number, iterations: number): node[] {
        for (let i = 0; i < iterations; i++) {
            this.iterate(width, height, minRadius, maxRadius, Math.round(Math.sqrt(Math.pow(maxRadius, 2) / 2)));
        }

        return this.nodes;
    }

    /**
     * @param {int} width
     * @param {int} height
     * @param {int} minRadius
     * @param {int} maxRadius
     * @param {number} cellSize
     */
    iterate(width: number, height: number, minRadius: number, maxRadius: number, cellSize: number): void {
        for (let boxY = 0; boxY < height; boxY += cellSize) {
            for (let boxX = 0; boxX < width; boxX += cellSize) {
                let y = boxY + Math.round(Math.random() * (cellSize));
                let x = boxX + Math.round(Math.random() * (cellSize));
                let radius = Math.round(Math.pow(Math.random(), 3) * (maxRadius - minRadius)) + minRadius;
                let node: { x: number, y: number, radius: number, boxX: number, boxY: number }
                    = {x: x, y: y, radius: radius, boxX: boxX, boxY: boxY};
                if (node.x + radius > width || node.y + radius > height) {
                    continue;
                }
                if (node.x - radius < 0 || node.y - radius < 0) {
                    continue;
                }
                let occupied = false;
                /** check 5x5 grid */
                for (let checkBoxY = boxY - (cellSize * 2);
                     checkBoxY < (boxY + cellSize * 3);
                     checkBoxY += cellSize) {
                    for (let checkBoxX = boxX - (cellSize * 2);
                         checkBoxX < (boxX + cellSize * 3);
                         checkBoxX += cellSize) {
                        if (!(checkBoxX in this.index)) {
                            continue;
                        }
                        for (let checkNode of this.index[checkBoxX][checkBoxY] ?? []) {
                            let distance = Math.sqrt(
                                Math.pow((checkNode.x - x), 2) + Math.pow((checkNode.y - y), 2)
                            );
                            if (distance <= checkNode.radius || distance <= radius) {
                                occupied = true;
                            }
                        }
                    }
                }
                if (occupied) {
                    continue;
                }

                this.nodes.push(node);
                if (!(boxX in this.index)) {
                    this.index[boxX] = {};
                }
                if (!(boxY in this.index[boxX])) {
                    this.index[boxX][boxY] = [];
                }
                this.index[boxX][boxY].push(node);
            }
        }
    }
}

export default PoissonDiskSampler;