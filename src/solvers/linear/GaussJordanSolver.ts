// src/solvers/linear/GaussJordanSolver.ts
import { SolutionType } from '../../core/enums.js';
import { SingularMatrixError } from '../../core/errors.js';
import { Matrix } from '../../core/Matrix.js';
import type { LinearSystemProblem } from '../../problems/LinearSystemProblem.js';
import { LinearSystemSolver } from './LinearSystemSolver.js';

/**
 * Gauss-Jordan: ทำ [A | b] ให้อยู่ในรูป Reduced Row Echelon Form [I | x]
 * อัลกอริทึม rref() เป็น static เพื่อให้คลาสอื่นนำไปใช้ซ้ำได้ (เช่น MatrixInversionSolver)
 */
export class GaussJordanSolver extends LinearSystemSolver {
    constructor(problem: LinearSystemProblem) {
        super(problem, SolutionType.GAUSS_JORDAN);
    }

    getMethodName(): string {
        return 'Gauss-Jordan Elimination';
    }

    protected compute(): { values: number[]; answer: string } {
        const A = this.problem.getMatrixA();
        const n = A.rows;
        const aug = A.augment(this.problem.getVectorB());
        this.addStep('สร้าง Augmented Matrix [A | b]', undefined, aug);

        GaussJordanSolver.rref(aug, n, (title, m) => this.addStep(title, undefined, m));

        const x = aug.column(n);
        this.addStep('ได้ [I | x] คำตอบอยู่ที่คอลัมน์สุดท้าย', this.formatSolution(x));
        return { values: x, answer: this.formatSolution(x) };
    }

    /**
     * Reduced Row Echelon Form (ทำงานกับ n คอลัมน์แรก)
     * 1) Partial pivoting  2) หารแถว pivot ให้ตัวนำเป็น 1  3) กำจัดคอลัมน์นั้นในแถวอื่นทั้งหมด
     */
    static rref(m: Matrix, n: number, onStep?: (title: string, m: Matrix) => void): Matrix {
        for (let k = 0; k < n; k++) {
            let best = k;
            for (let r = k + 1; r < m.rows; r++) if (Math.abs(m.get(r, k)) > Math.abs(m.get(best, k))) best = r;
            if (Math.abs(m.get(best, k)) < 1e-12) throw new SingularMatrixError();
            if (best !== k) {
                m.swapRows(best, k);
                onStep?.(`สลับแถว R${k + 1} ↔ R${best + 1} (Partial Pivoting)`, m);
            }
            const pivot = m.get(k, k);
            m.scaleRow(k, 1 / pivot);
            for (let i = 0; i < m.rows; i++) {
                if (i === k) continue;
                const f = m.get(i, k);
                if (f !== 0) m.addRowMultiple(i, k, -f);
            }
            onStep?.(`R${k + 1} = R${k + 1} / ${Matrix.format(pivot)} แล้วกำจัดคอลัมน์ที่ ${k + 1} ในแถวอื่น`, m);
        }
        return m;
    }
}
