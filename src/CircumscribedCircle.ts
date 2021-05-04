import Definitions from "./Definitions";
import triangle = Definitions.triangle;
import vertex = Definitions.vertex;

class CircumscribedCircle {
    /**
     * @see https://nl.wikipedia.org/wiki/Omgeschreven_cirkel
     * @param triangle
     */
    static findCenterForTriangle(triangle: triangle): vertex {
        const d: number = 2 * (
            (triangle[0].x * (triangle[1].y - triangle[2].y))
            + (triangle[1].x * (triangle[2].y - triangle[0].y))
            + (triangle[2].x * (triangle[0].y - triangle[1].y))
        );
        return {
            x: (((Math.pow(triangle[0].x, 2) + Math.pow(triangle[0].y, 2)) * (triangle[1].y - triangle[2].y))
                + ((Math.pow(triangle[1].x, 2) + Math.pow(triangle[1].y, 2)) * (triangle[2].y - triangle[0].y))
                + ((Math.pow(triangle[2].x, 2) + Math.pow(triangle[2].y, 2)) * (triangle[0].y - triangle[1].y)))
                / d,
            y: (((Math.pow(triangle[0].x, 2) + Math.pow(triangle[0].y, 2)) * (triangle[2].x - triangle[1].x))
                + ((Math.pow(triangle[1].x, 2) + Math.pow(triangle[1].y, 2)) * (triangle[0].x - triangle[2].x))
                + ((Math.pow(triangle[2].x, 2) + Math.pow(triangle[2].y, 2)) * (triangle[1].x - triangle[0].x)))
                / d,
        };
    }
}

export default CircumscribedCircle;
