// src/core/ProblemSolver.ts
import { SolutionType } from './enums.js';
import type { ISolvable, SolveResult, Step } from './interfaces.js';
import type { Matrix } from './Matrix.js';
import type { Problem } from './Problem.js';

/**
 * <<abstract>> ProblemSolver<P>
 * - Composition: มี attribute problem (วัตถุของคลาส Problem) อยู่ภายใน
 * - Generic <P extends Problem> ทำให้คลาสลูกระบุชนิดของปัญหาที่ตัวเองแก้ได้
 * - Template Method: solve() กำหนดลำดับขั้น (validate → compute → สรุปผล)
 *   ส่วนการคำนวณจริงอยู่ใน compute() ซึ่งเป็น abstract ให้คลาสลูก implement
 */
export abstract class ProblemSolver<P extends Problem = Problem> implements ISolvable {
    protected readonly problem: P;
    protected readonly solutionType: SolutionType;
    protected steps: Step[] = [];
    protected output?: SolveResult;

    constructor(problem: P, solutionType: SolutionType) {
        this.problem = problem;
        this.solutionType = solutionType;
    }

    /** Template method — คลาสลูกไม่ต้อง override */
    solve(): SolveResult {
        this.problem.validate();
        this.steps = [];
        const t0 = performance.now();
        const { values, answer } = this.compute();
        const elapsedMs = performance.now() - t0;
        this.output = { values, answer, steps: this.steps, elapsedMs };
        return this.output;
    }

    /** หัวใจของแต่ละวิธี — คลาสลูกต้อง implement (Abstract method) */
    protected abstract compute(): { values: number[]; answer: string };

    /** ชื่อวิธีที่อ่านง่าย — คลาสลูกต้อง implement */
    abstract getMethodName(): string;

    // ---------- Helper ที่คลาสลูกใช้ร่วมกัน ----------
    protected addStep(title: string, text?: string, matrix?: Matrix): void {
        this.steps.push({ title, text, matrix: matrix?.clone() });
    }

    protected addMatricesStep(title: string, matrices: { label: string; matrix: Matrix }[], text?: string): void {
        this.steps.push({ title, text, matrices: matrices.map((m) => ({ label: m.label, matrix: m.matrix.clone() })) });
    }

    getProblem(): P {
        return this.problem;
    }

    getSolutionType(): SolutionType {
        return this.solutionType;
    }

    getOutput(): SolveResult | undefined {
        return this.output;
    }
}
