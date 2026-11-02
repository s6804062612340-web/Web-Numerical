// src/solvers/regression/PolynomialRegressionSolver.ts
import { SolutionType } from '../../core/enums.js';
import type { IGraphable, IPredictor, PlotSeries } from '../../core/interfaces.js';
import { Matrix } from '../../core/Matrix.js';
import type { RegressionProblem } from '../../problems/RegressionProblem.js';
import { RegressionSolver } from './RegressionSolver.js';

/**
 * Polynomial Regression:  f(x) = a0 + a1x + a2x² + ... + amxᵐ
 * implement 2 interfaces: IPredictor (ทำนายค่า) และ IGraphable (วาดกราฟได้)
 */
export class PolynomialRegressionSolver extends RegressionSolver<RegressionProblem> implements IPredictor, IGraphable {
    constructor(problem: RegressionProblem, solutionType: SolutionType = SolutionType.POLYNOMIAL_REGRESSION) {
        super(problem, solutionType);
    }

    getMethodName(): string {
        return `Polynomial Regression (m = ${this.getOrder()})`;
    }

    /** ดีกรีของพหุนาม — คลาสลูก (LinearRegressionSolver) override ให้เป็น 1 */
    protected getOrder(): number {
        return this.problem.getOrder();
    }

    protected compute(): { values: number[]; answer: string } {
        const pts = this.problem.getPoints();
        const m = this.getOrder();
        const n = pts.length;

        // Σ xᵏ สำหรับ k = 0..2m และ Σ y·xᵏ สำหรับ k = 0..m
        const sumX = Array.from({ length: 2 * m + 1 }, (_, k) => pts.reduce((s, p) => s + p.x ** k, 0));
        const sumXY = Array.from({ length: m + 1 }, (_, k) => pts.reduce((s, p) => s + p.y * p.x ** k, 0));
        this.addStep('คำนวณผลรวม',
            [`n = ${n}`,
            ...sumX.slice(1).map((v, i) => `Σx${i + 1 > 1 ? '^' + (i + 1) : ''} = ${Matrix.format(v)}`),
            ...sumXY.map((v, i) => `Σ${i === 0 ? '' : i === 1 ? 'x' : 'x^' + i}y = ${Matrix.format(v)}`)].join('\n'));

        const M = Matrix.zeros(m + 1, m + 1);
        for (let i = 0; i <= m; i++) for (let j = 0; j <= m; j++) M.set(i, j, sumX[i + j]);

        this.coefficients = this.solveNormalEquations(M, sumXY);
        this.addStep('สัมประสิทธิ์', this.formatCoefficients());

        const eq = this.equationString();
        const xT = this.problem.getXTarget();
        const yT = this.predict(xT);
        this.addStep('สมการที่ได้และค่าที่ทำนาย', `f(x) = ${eq}\nf(${xT}) = ${Matrix.format(yT)}`);
        return { values: this.coefficients, answer: `f(x) = ${eq}\nf(${xT}) = ${Matrix.format(yT)}` };
    }

    predict(x: number): number {
        return this.coefficients.reduce((s, a, i) => s + a * x ** i, 0);
    }

    protected equationString(): string {
        return this.coefficients
            .map((a, i) => `${Matrix.format(a)}${i === 0 ? '' : i === 1 ? 'x' : `x^${i}`}`)
            .join(' + ')
            .replace(/\+ -/g, '− ');
    }

    getPlotData(): PlotSeries[] {
        const pts = this.problem.getPoints();
        const xs = pts.map((p) => p.x);
        const xT = this.problem.getXTarget();
        const lo = Math.min(...xs, xT);
        const hi = Math.max(...xs, xT);
        const curveX = Array.from({ length: 200 }, (_, i) => lo + ((hi - lo) * i) / 199);
        return [
            { name: 'ข้อมูล', x: xs, y: pts.map((p) => p.y), mode: 'markers' },
            { name: 'Regression', x: curveX, y: curveX.map((x) => this.predict(x)), mode: 'lines' },
            { name: `f(${xT})`, x: [xT], y: [this.predict(xT)], mode: 'markers' },
        ];
    }
}
