// src/solvers/linear/CholeskySolver.ts
import { SolutionType } from '../../core/enums.js';
import { ValidationError } from '../../core/errors.js';
import { Matrix } from '../../core/Matrix.js';
import type { LinearSystemProblem } from '../../problems/LinearSystemProblem.js';
import { DecompositionSolver } from './DecompositionSolver.js';

/**
 * Cholesky Decomposition: A = L · Lᵀ  (A ต้องสมมาตรและเป็น Positive definite)
 * Override decompose() ของคลาสแม่ — โค้ดส่วน Forward/Back substitution ใช้ของคลาสแม่ได้ทันที
 */
export class CholeskySolver extends DecompositionSolver {
    constructor(problem: LinearSystemProblem) {
        super(problem, SolutionType.CHOLESKY_DECOMPOSITION);
    }

    getMethodName(): string {
        return 'Cholesky Decomposition';
    }

    protected decompose(A: Matrix): { L: Matrix; U: Matrix } {
        if (!A.isSymmetric()) throw new ValidationError('Cholesky ใช้ได้กับเมทริกซ์สมมาตร (A = Aᵀ) เท่านั้น');
        const n = A.rows;
        const L = Matrix.zeros(n, n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;
                for (let k = 0; k < j; k++) sum += L.get(i, k) * L.get(j, k);
                if (i === j) {
                    const d = A.get(i, i) - sum;
                    if (d <= 0) throw new ValidationError('เมทริกซ์ไม่เป็น Positive definite จึงใช้ Cholesky ไม่ได้');
                    L.set(i, i, Math.sqrt(d));
                } else {
                    L.set(i, j, (A.get(i, j) - sum) / L.get(j, j));
                }
            }
        }
        this.addStep('สูตร', 'l_ii = √(a_ii − Σ l_ik²),   l_ij = (a_ij − Σ l_ik·l_jk) / l_jj');
        return { L, U: L.transpose() };
    }
}
