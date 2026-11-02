// src/solvers/linear/GaussEliminationSolver.ts
import { SolutionType } from '../../core/enums.js';
import { Matrix } from '../../core/Matrix.js';
import type { LinearSystemProblem } from '../../problems/LinearSystemProblem.js';
import { LinearSystemSolver } from './LinearSystemSolver.js';

/** Gauss Elimination: Forward elimination → เมทริกซ์สามเหลี่ยมบน → Back substitution */
export class GaussEliminationSolver extends LinearSystemSolver {
    constructor(problem: LinearSystemProblem) {
        super(problem, SolutionType.GAUSS_ELIMINATION);
    }

    getMethodName(): string {
        return 'Gauss Elimination';
    }

    protected compute(): { values: number[]; answer: string } {
        const A = this.problem.getMatrixA();
        const n = A.rows;
        const aug = A.augment(this.problem.getVectorB());
        this.addStep('สร้าง Augmented Matrix [A | b]', undefined, aug);

        // ----- Forward elimination -----
        for (let k = 0; k < n - 1; k++) {
            this.partialPivot(aug, k, k);
            for (let i = k + 1; i < n; i++) {
                const factor = aug.get(i, k) / aug.get(k, k);
                if (factor === 0) continue;
                aug.addRowMultiple(i, k, -factor);
            }
            this.addStep(`กำจัดตัวแปร x${k + 1} ออกจากแถวที่ ${k + 2}–${n}`,
                `Ri = Ri − (a_i${k + 1} / a_${k + 1}${k + 1}) × R${k + 1}`, aug);
        }

        // ----- Back substitution -----
        const U = aug.sliceColumns(0, n);
        const y = aug.column(n);
        const x = this.backSubstitution(U, y);
        const lines = [];
        for (let i = n - 1; i >= 0; i--) {
            const terms = [];
            for (let j = i + 1; j < n; j++) terms.push(`(${Matrix.format(U.get(i, j))})(${Matrix.format(x[j])})`);
            lines.push(`x${i + 1} = [ ${Matrix.format(y[i])}${terms.length ? ' − ' + terms.join(' − ') : ''} ] / ${Matrix.format(U.get(i, i))} = ${Matrix.format(x[i])}`);
        }
        this.addStep('Back Substitution', lines.join('\n'));
        return { values: x, answer: this.formatSolution(x) };
    }
}
