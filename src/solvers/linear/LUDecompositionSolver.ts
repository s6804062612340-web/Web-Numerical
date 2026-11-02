// src/solvers/linear/LUDecompositionSolver.ts
import { SolutionType } from '../../core/enums.js';
import { SingularMatrixError } from '../../core/errors.js';
import { Matrix } from '../../core/Matrix.js';
import type { LinearSystemProblem } from '../../problems/LinearSystemProblem.js';
import { DecompositionSolver } from './DecompositionSolver.js';

/** LU Decomposition (Doolittle: เส้นทแยงของ L เป็น 1) */
export class LUDecompositionSolver extends DecompositionSolver {
    constructor(problem: LinearSystemProblem) {
        super(problem, SolutionType.LU_DECOMPOSITION);
    }

    getMethodName(): string {
        return 'LU Decomposition (Doolittle)';
    }

    protected decompose(A: Matrix): { L: Matrix; U: Matrix } {
        const n = A.rows;
        const L = Matrix.identity(n);
        const U = Matrix.zeros(n, n);
        for (let i = 0; i < n; i++) {
            // แถวที่ i ของ U
            for (let k = i; k < n; k++) {
                let sum = 0;
                for (let j = 0; j < i; j++) sum += L.get(i, j) * U.get(j, k);
                U.set(i, k, A.get(i, k) - sum);
            }
            if (Math.abs(U.get(i, i)) < 1e-12)
                throw new SingularMatrixError(`u${i + 1}${i + 1} = 0 ทำ LU (ไม่สลับแถว) ไม่ได้ ลองใช้ Gauss Elimination แทน`);
            // คอลัมน์ที่ i ของ L
            for (let k = i + 1; k < n; k++) {
                let sum = 0;
                for (let j = 0; j < i; j++) sum += L.get(k, j) * U.get(j, i);
                L.set(k, i, (A.get(k, i) - sum) / U.get(i, i));
            }
        }
        return { L, U };
    }
}
