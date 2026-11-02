// src/solvers/linear/DecompositionSolver.ts
import { Matrix } from '../../core/Matrix.js';
import { LinearSystemSolver } from './LinearSystemSolver.js';

/**
 * <<abstract>> DecompositionSolver
 * แนวคิดเดียวกันของ LU และ Cholesky: แยก A = L·U แล้วแก้ 2 ขั้น
 *   (1) Ly = b  (Forward substitution)
 *   (2) Ux = y  (Back substitution)
 * ต่างกันแค่ "วิธีแยกเมทริกซ์" → จึงให้ decompose() เป็น abstract (Polymorphism)
 */
export abstract class DecompositionSolver extends LinearSystemSolver {
    /** แต่ละวิธีต้องบอกว่าจะแยก A เป็น L และ U อย่างไร */
    protected abstract decompose(A: Matrix): { L: Matrix; U: Matrix };

    protected compute(): { values: number[]; answer: string } {
        const A = this.problem.getMatrixA();
        const b = this.problem.getArrayB();
        this.addStep('เมทริกซ์ A', undefined, A);

        const { L, U } = this.decompose(A);
        this.addMatricesStep('แยกเมทริกซ์ A = L · U', [
            { label: 'L', matrix: L },
            { label: 'U', matrix: U },
        ]);

        const y = this.forwardSubstitution(L, b);
        this.addStep('แก้ Ly = b ด้วย Forward Substitution', this.formatSolution(y, 'y'));

        const x = this.backSubstitution(U, y);
        this.addStep('แก้ Ux = y ด้วย Back Substitution', this.formatSolution(x));
        return { values: x, answer: this.formatSolution(x) };
    }
}
