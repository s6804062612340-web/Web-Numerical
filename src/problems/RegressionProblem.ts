// src/problems/RegressionProblem.ts
import { ProblemType } from '../core/enums.js';
import { ValidationError } from '../core/errors.js';
import { PointsProblem, type Point } from './PointsProblem.js';

export interface RegressionInput {
    points: Point[];
    order: number;   // ดีกรีของพหุนาม (Linear = 1)
    xTarget: number; // ค่า x ที่ต้องการทำนาย
}

/** ปัญหา Least-squares Regression แบบตัวแปรเดียว (Linear / Polynomial) */
export class RegressionProblem extends PointsProblem {
    protected readonly order: number;
    protected readonly xTarget: number;

    constructor(input: string) {
        super(input, ProblemType.REGRESSION);
        const data = JSON.parse(input) as RegressionInput;
        this.order = Math.trunc(Number(data.order ?? 1));
        this.xTarget = Number(data.xTarget);
    }

    getOrder(): number {
        return this.order;
    }

    getXTarget(): number {
        return this.xTarget;
    }

    override validate(): void {
        super.validate();
        if (this.order < 1) throw new ValidationError('ดีกรี (m) ต้องมีค่าอย่างน้อย 1');
        if (this.points.length < this.order + 1)
            throw new ValidationError(`ดีกรี ${this.order} ต้องใช้ข้อมูลอย่างน้อย ${this.order + 1} จุด`);
        if (!Number.isFinite(this.xTarget)) throw new ValidationError('กรุณาระบุค่า x ที่ต้องการทำนาย');
    }

    describe(): string {
        return `${this.points.length} จุด, m = ${this.order}, x = ${this.xTarget}`;
    }
}
