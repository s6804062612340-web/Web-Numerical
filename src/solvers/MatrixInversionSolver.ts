// src/solvers/MatrixInversionSolver.ts
import { SolutionType } from '../core/enums.js';
import { Matrix } from '../core/Matrix.js';
import { ProblemSolver } from '../core/ProblemSolver.js';
import type { MatrixProblem } from '../problems/MatrixProblem.js';
import { GaussJordanSolver } from './linear/GaussJordanSolver.js';

/** หาเมทริกซ์ผกผัน A⁻¹ โดยทำ Gauss-Jordan กับ [A | I] → [I | A⁻¹] */
export class MatrixInversionSolver extends ProblemSolver<MatrixProblem> {
    private inverse?: Matrix;

    constructor(problem: MatrixProblem) {
        super(problem, SolutionType.MATRIX_INVERSION);
    }

    getMethodName(): string {
        return 'Matrix Inversion (Gauss-Jordan)';
    }

    getInverse(): Matrix | undefined {
        return this.inverse?.clone();
    }

    protected compute(): { values: number[]; answer: string } {
        const A = this.problem.getMatrixA();
        const n = A.rows;
        const aug = A.augment(Matrix.identity(n));
        this.addStep('สร้าง [A | I]', undefined, aug);

        // นำ static method ของ GaussJordanSolver มาใช้ซ้ำ (Code reuse)
        GaussJordanSolver.rref(aug, n, (title, m) => this.addStep(title, undefined, m));

        this.inverse = aug.sliceColumns(n, 2 * n);
        this.addMatricesStep('ผลลัพธ์ [I | A⁻¹]', [{ label: 'A⁻¹', matrix: this.inverse }]);
        this.addMatricesStep('ตรวจสอบ: A · A⁻¹ ควรได้ I', [{ label: 'A·A⁻¹', matrix: A.multiply(this.inverse) }]);

        return {
            values: this.inverse.toArray().flat(),
            answer: 'A⁻¹ =\n' + this.inverse.toString(),
        };
    }
}
