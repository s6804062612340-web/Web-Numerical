// src/solvers/interpolation/InterpolationSolver.ts
import { InterpolationMode, type SolutionType } from '../../core/enums.js';
import type { IGraphable, IPredictor, PlotSeries } from '../../core/interfaces.js';
import { Matrix } from '../../core/Matrix.js';
import { ProblemSolver } from '../../core/ProblemSolver.js';
import type { InterpolationProblem } from '../../problems/InterpolationProblem.js';
import type { Point } from '../../problems/PointsProblem.js';

const MODE_NAME: Record<InterpolationMode, string> = {
    [InterpolationMode.LINEAR]: 'Linear',
    [InterpolationMode.QUADRATIC]: 'Quadratic',
    [InterpolationMode.POLYNOMIAL]: 'Polynomial',
};

/**
 * <<abstract>> InterpolationSolver
 * ขั้นตอนเหมือนกันทุกวิธี: เลือกจุด → เตรียมสัมประสิทธิ์ (prepare) → หา f(x)
 * Newton และ Lagrange ต่างกันแค่ prepare() และ predict() → abstract ให้คลาสลูกเขียนเอง
 * (Linear / Quadratic / Polynomial = จำนวนจุดที่เลือก 2 / 3 / n)
 */
export abstract class InterpolationSolver extends ProblemSolver<InterpolationProblem> implements IPredictor, IGraphable {
    protected nodes: Point[] = [];

    constructor(problem: InterpolationProblem, solutionType: SolutionType) {
        super(problem, solutionType);
    }

    /** ชื่อวิธีหลัก เช่น "Newton's Divided-Difference" */
    protected abstract getBaseName(): string;

    /** เตรียมข้อมูล/สัมประสิทธิ์จากจุดที่เลือก และบันทึกขั้นตอน */
    protected abstract prepare(nodes: Point[]): void;

    /** หาค่า f(x) จากข้อมูลที่ prepare ไว้ */
    abstract predict(x: number): number;

    getMethodName(): string {
        return `${MODE_NAME[this.problem.getMode()]} Interpolation — ${this.getBaseName()}`;
    }

    protected compute(): { values: number[]; answer: string } {
        this.nodes = this.problem.getSelectedPoints();
        this.addStep('จุดที่ใช้',
            this.nodes.map((p, i) => `x${i} = ${Matrix.format(p.x)},  f(x${i}) = ${Matrix.format(p.y)}`).join('\n'));
        this.prepare(this.nodes);
        const xT = this.problem.getXTarget();
        const y = this.predict(xT);
        this.addStep('คำตอบ', `f(${xT}) ≈ ${Matrix.format(y)}`);
        return { values: [y], answer: `f(${xT}) ≈ ${Matrix.format(y)}` };
    }

    getPlotData(): PlotSeries[] {
        const all = this.problem.getPoints();
        const xT = this.problem.getXTarget();
        const xs = this.nodes.map((p) => p.x);
        const lo = Math.min(...xs, xT);
        const hi = Math.max(...xs, xT);
        const curveX = Array.from({ length: 200 }, (_, i) => lo + ((hi - lo) * i) / 199);
        return [
            { name: 'ข้อมูลทั้งหมด', x: all.map((p) => p.x), y: all.map((p) => p.y), mode: 'markers' },
            { name: 'จุดที่ใช้', x: xs, y: this.nodes.map((p) => p.y), mode: 'markers' },
            { name: 'Polynomial', x: curveX, y: curveX.map((x) => this.predict(x)), mode: 'lines' },
            { name: `f(${xT})`, x: [xT], y: [this.predict(xT)], mode: 'markers' },
        ];
    }
}
