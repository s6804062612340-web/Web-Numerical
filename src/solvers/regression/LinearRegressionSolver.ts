// src/solvers/regression/LinearRegressionSolver.ts
import { SolutionType } from '../../core/enums.js';
import type { RegressionProblem } from '../../problems/RegressionProblem.js';
import { PolynomialRegressionSolver } from './PolynomialRegressionSolver.js';

/**
 * Linear Regression คือ Polynomial Regression ที่ดีกรี = 1
 * จึง Inherit จาก PolynomialRegressionSolver แล้ว override แค่ getOrder() และชื่อวิธี
 */
export class LinearRegressionSolver extends PolynomialRegressionSolver {
    constructor(problem: RegressionProblem) {
        super(problem, SolutionType.LINEAR_REGRESSION);
    }

    override getMethodName(): string {
        return 'Linear Regression  f(x) = a0 + a1x';
    }

    protected override getOrder(): number {
        return 1;
    }
}
