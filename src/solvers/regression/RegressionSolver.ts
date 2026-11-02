// src/solvers/regression/RegressionSolver.ts
import type { SolutionType } from '../../core/enums.js';
import { Matrix } from '../../core/Matrix.js';
import type { Problem } from '../../core/Problem.js';
import { ProblemSolver } from '../../core/ProblemSolver.js';
import { LinearSystemProblem } from '../../problems/LinearSystemProblem.js';
import { GaussEliminationSolver } from '../linear/GaussEliminationSolver.js';

/**
 * <<abstract>> RegressionSolver
 * Least-squares regression ทุกแบบจบที่การแก้ "Normal Equations"  (XᵀX)a = Xᵀy
 * คลาสนี้จึงสร้าง LinearSystemProblem + GaussEliminationSolver ขึ้นมาใช้งานภายใน
 * → ตัวอย่างการนำคลาสอื่นมาประกอบใช้ (Composition / Reuse) แทนการเขียนโค้ดแก้สมการใหม่
 */
export abstract class RegressionSolver<P extends Problem> extends ProblemSolver<P> {
    protected coefficients: number[] = [];

    constructor(problem: P, solutionType: SolutionType) {
        super(problem, solutionType);
    }

    getCoefficients(): number[] {
        return [...this.coefficients];
    }

    /** แก้ระบบสมการ Normal equation ด้วย Gauss Elimination */
    protected solveNormalEquations(M: Matrix, rhs: number[]): number[] {
        const subProblem = new LinearSystemProblem(JSON.stringify({ matrixA: M.toArray(), arrayB: rhs }));
        const subSolver = new GaussEliminationSolver(subProblem);
        const result = subSolver.solve();
        this.addMatricesStep('Normal Equations (แก้ด้วย Gauss Elimination)', [
            { label: 'Matrix', matrix: M },
            { label: 'b', matrix: Matrix.columnVector(rhs) },
        ]);
        return result.values;
    }

    protected formatCoefficients(): string {
        return this.coefficients.map((a, i) => `a${i} = ${Matrix.format(a)}`).join(',  ');
    }
}
