// src/problems/MultipleRegressionProblem.ts
import { ProblemType } from '../core/enums.js';
import { ValidationError } from '../core/errors.js';
import { Problem } from '../core/Problem.js';

export interface MultipleRegressionInput {
    xs: number[][];      // แต่ละแถว = [x1, x2, ..., xk] ของข้อมูล 1 ชุด
    y: number[];
    xTarget: number[];   // ค่า [x1..xk] ที่ต้องการทำนาย
}

/** ปัญหา Multiple Linear Regression: y = a0 + a1x1 + ... + akxk */
export class MultipleRegressionProblem extends Problem {
    protected readonly xs: number[][];
    protected readonly y: number[];
    protected readonly xTarget: number[];

    constructor(input: string) {
        super(input, ProblemType.MULTIPLE_REGRESSION);
        const data = JSON.parse(input) as MultipleRegressionInput;
        this.xs = (data.xs ?? []).map((r) => r.map(Number));
        this.y = (data.y ?? []).map(Number);
        this.xTarget = (data.xTarget ?? []).map(Number);
    }

    getXs(): number[][] {
        return this.xs.map((r) => [...r]);
    }

    getY(): number[] {
        return [...this.y];
    }

    getXTarget(): number[] {
        return [...this.xTarget];
    }

    getVariableCount(): number {
        return this.xs[0]?.length ?? 0;
    }

    validate(): void {
        const k = this.getVariableCount();
        if (k < 1) throw new ValidationError('ต้องมีตัวแปรต้นอย่างน้อย 1 ตัว');
        if (this.xs.length !== this.y.length) throw new ValidationError('จำนวนข้อมูล x และ y ต้องเท่ากัน');
        if (this.xs.length < k + 1) throw new ValidationError(`ตัวแปร ${k} ตัว ต้องมีข้อมูลอย่างน้อย ${k + 1} ชุด`);
        if ([...this.xs.flat(), ...this.y].some((v) => !Number.isFinite(v)))
            throw new ValidationError('ข้อมูลทั้งหมดต้องเป็นตัวเลข');
        if (this.xTarget.length !== k || this.xTarget.some((v) => !Number.isFinite(v)))
            throw new ValidationError(`กรุณาระบุค่าที่ต้องการทำนายให้ครบ ${k} ตัวแปร`);
    }

    describe(): string {
        return `${this.xs.length} ชุดข้อมูล, ${this.getVariableCount()} ตัวแปร`;
    }
}
