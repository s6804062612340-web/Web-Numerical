// src/solvers/interpolation/NewtonDividedDifferenceSolver.ts
import { SolutionType } from '../../core/enums.js';
import { Matrix } from '../../core/Matrix.js';
import type { InterpolationProblem } from '../../problems/InterpolationProblem.js';
import type { Point } from '../../problems/PointsProblem.js';
import { InterpolationSolver } from './InterpolationSolver.js';

/**
 * Newton's Divided-Difference
 * f(x) = C0 + C1(x−x0) + C2(x−x0)(x−x1) + ... + Cn(x−x0)...(x−xn−1)
 */
export class NewtonDividedDifferenceSolver extends InterpolationSolver {
    private c: number[] = [];

    constructor(problem: InterpolationProblem) {
        super(problem, SolutionType.NEWTON_DIVIDED_DIFFERENCE);
    }

    protected getBaseName(): string {
        return "Newton's Divided-Difference";
    }

    protected prepare(nodes: Point[]): void {
        const n = nodes.length;
        // table[i][j] = f[x_i, ..., x_{i+j}]
        const table: number[][] = nodes.map((p) => [p.y]);
        for (let j = 1; j < n; j++)
            for (let i = 0; i < n - j; i++)
                table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (nodes[i + j].x - nodes[i].x);

        const display = new Matrix(Array.from({ length: n }, () => new Array(n + 1).fill(NaN)));
        for (let i = 0; i < n; i++) {
            display.set(i, 0, nodes[i].x);
            for (let j = 0; j < n - i; j++) display.set(i, j + 1, table[i][j]);
        }
        this.addStep('ตาราง Divided-Difference', 'คอลัมน์: x | f[x] | f[ , ] | f[ , , ] | ...', display);

        this.c = table[0].slice(0, n);
        const terms = this.c.map((ci, i) => {
            const factors = nodes.slice(0, i).map((p) => `(x − ${Matrix.format(p.x)})`).join('');
            return `${Matrix.format(ci)}${factors}`;
        });
        this.addStep('สัมประสิทธิ์ C',
            this.c.map((v, i) => `C${i} = ${Matrix.format(v)}`).join('\n') + `\n\nf(x) = ${terms.join(' + ').replace(/\+ -/g, '− ')}`);
    }

    predict(x: number): number {
        let result = 0;
        let term = 1;
        for (let i = 0; i < this.c.length; i++) {
            result += this.c[i] * term;
            term *= x - this.nodes[i].x;
        }
        return result;
    }
}
