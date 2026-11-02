// src/solvers/regression/MultipleLinearRegressionSolver.ts
import { SolutionType } from '../../core/enums.js';
import { Matrix } from '../../core/Matrix.js';
import type { MultipleRegressionProblem } from '../../problems/MultipleRegressionProblem.js';
import { RegressionSolver } from './RegressionSolver.js';

/**
 * Multiple Linear Regression:  f(x1..xk) = a0 + a1x1 + ... + akxk
 * ใช้รูปเมทริกซ์ (XᵀX)a = Xᵀy  โดย X มีคอลัมน์แรกเป็น 1
 * (คลาสนี้ไม่ implement IGraphable เพราะข้อมูลหลายมิติวาดเป็นกราฟ 2D ไม่ได้)
 */
export class MultipleLinearRegressionSolver extends RegressionSolver<MultipleRegressionProblem> {
    constructor(problem: MultipleRegressionProblem) {
        super(problem, SolutionType.MULTIPLE_LINEAR_REGRESSION);
    }

    getMethodName(): string {
        return 'Multiple Linear Regression';
    }

    protected compute(): { values: number[]; answer: string } {
        const X = new Matrix(this.problem.getXs().map((r) => [1, ...r]));
        const y = Matrix.columnVector(this.problem.getY());
        this.addMatricesStep('สร้างเมทริกซ์ X (คอลัมน์แรกเป็น 1) และ y', [
            { label: 'X', matrix: X },
            { label: 'y', matrix: y },
        ]);

        const Xt = X.transpose();
        const XtX = Xt.multiply(X);
        const Xty = Xt.multiply(y).column(0);
        this.addMatricesStep('คำนวณ XᵀX และ Xᵀy', [
            { label: 'XᵀX', matrix: XtX },
            { label: 'Xᵀy', matrix: Matrix.columnVector(Xty) },
        ]);

        this.coefficients = this.solveNormalEquations(XtX, Xty);
        this.addStep('สัมประสิทธิ์', this.formatCoefficients());

        const target = this.problem.getXTarget();
        const yT = this.predictVector(target);
        const eq = this.coefficients
            .map((a, i) => (i === 0 ? Matrix.format(a) : `${Matrix.format(a)}x${i}`))
            .join(' + ')
            .replace(/\+ -/g, '− ');
        const args = target.map((v) => Matrix.format(v)).join(', ');
        this.addStep('สมการที่ได้และค่าที่ทำนาย', `f = ${eq}\nf(${args}) = ${Matrix.format(yT)}`);
        return { values: this.coefficients, answer: `f = ${eq}\nf(${args}) = ${Matrix.format(yT)}` };
    }

    /** Overload แนวคิด: ทำนายจากเวกเตอร์ของตัวแปรต้น */
    predictVector(xs: number[]): number {
        return this.coefficients.reduce((s, a, i) => s + a * (i === 0 ? 1 : xs[i - 1]), 0);
    }
}
