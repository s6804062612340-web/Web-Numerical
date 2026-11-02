// src/solvers/interpolation/LagrangeInterpolationSolver.ts
import { SolutionType } from '../../core/enums.js';
import { Matrix } from '../../core/Matrix.js';
import type { InterpolationProblem } from '../../problems/InterpolationProblem.js';
import type { Point } from '../../problems/PointsProblem.js';
import { InterpolationSolver } from './InterpolationSolver.js';

/**
 * Lagrange Interpolation
 * f(x) = Σ Li(x)·f(xi)   โดย  Li(x) = Π (x − xj)/(xi − xj),  j ≠ i
 */
export class LagrangeInterpolationSolver extends InterpolationSolver {
    constructor(problem: InterpolationProblem) {
        super(problem, SolutionType.LAGRANGE_INTERPOLATION);
    }

    protected getBaseName(): string {
        return 'Lagrange';
    }

    /** Li(x) ของจุดที่ i */
    private basis(i: number, x: number): number {
        let L = 1;
        for (let j = 0; j < this.nodes.length; j++) if (j !== i) L *= (x - this.nodes[j].x) / (this.nodes[i].x - this.nodes[j].x);
        return L;
    }

    protected prepare(nodes: Point[]): void {
        const xT = this.problem.getXTarget();
        const lines = nodes.map((p, i) => {
            const num = nodes.filter((_, j) => j !== i).map((q) => `(${Matrix.format(q.x)} − x)`).join('');
            const den = nodes.filter((_, j) => j !== i).map((q) => `(${Matrix.format(q.x)} − ${Matrix.format(p.x)})`).join('');
            return `L${i} = ${num} / ${den}  →  L${i}(${xT}) = ${Matrix.format(this.basis(i, xT))}`;
        });
        this.addStep('คำนวณ Li(x)', lines.join('\n'));
        const sum = nodes.map((p, i) => `(${Matrix.format(this.basis(i, xT))})(${Matrix.format(p.y)})`).join(' + ');
        this.addStep('f(x) = Σ Li(x)·f(xi)', `f(${xT}) = ${sum}`);
    }

    predict(x: number): number {
        return this.nodes.reduce((s, p, i) => s + this.basis(i, x) * p.y, 0);
    }
}
