// src/problems/InterpolationProblem.ts
import { InterpolationMode, ProblemType } from '../core/enums.js';
import { ValidationError } from '../core/errors.js';
import { PointsProblem, type Point } from './PointsProblem.js';

export interface InterpolationInput {
    points: Point[];
    xTarget: number;
    mode: InterpolationMode;
    selected: number[]; // index ของจุดที่ผู้ใช้เลือกใช้
}

/** ปัญหาการประมาณค่าในช่วง (Linear / Quadratic / Polynomial) */
export class InterpolationProblem extends PointsProblem {
    protected readonly xTarget: number;
    protected readonly mode: InterpolationMode;
    protected readonly selected: number[];

    /** จำนวนจุดที่ต้องใช้ของแต่ละ mode (Polynomial = ไม่จำกัด) */
    static readonly REQUIRED_POINTS: Record<InterpolationMode, number | null> = {
        [InterpolationMode.LINEAR]: 2,
        [InterpolationMode.QUADRATIC]: 3,
        [InterpolationMode.POLYNOMIAL]: null,
    };

    constructor(input: string) {
        super(input, ProblemType.INTERPOLATION);
        const data = JSON.parse(input) as InterpolationInput;
        this.xTarget = Number(data.xTarget);
        this.mode = data.mode ?? InterpolationMode.POLYNOMIAL;
        this.selected = data.selected?.length ? [...data.selected] : this.points.map((_, i) => i);
    }

    getXTarget(): number {
        return this.xTarget;
    }

    getMode(): InterpolationMode {
        return this.mode;
    }

    /** คืนเฉพาะจุดที่ถูกเลือก เรียงตาม x */
    getSelectedPoints(): Point[] {
        return this.selected.map((i) => ({ ...this.points[i] })).sort((a, b) => a.x - b.x);
    }

    override validate(): void {
        super.validate();
        const need = InterpolationProblem.REQUIRED_POINTS[this.mode];
        if (need !== null && this.selected.length !== need)
            throw new ValidationError(`${this.mode} Interpolation ต้องเลือกจุด ${need} จุดพอดี (เลือกไว้ ${this.selected.length} จุด)`);
        if (this.selected.length < 2) throw new ValidationError('ต้องเลือกจุดอย่างน้อย 2 จุด');
        const xs = this.getSelectedPoints().map((p) => p.x);
        if (new Set(xs).size !== xs.length) throw new ValidationError('ค่า x ของจุดที่เลือกต้องไม่ซ้ำกัน');
        if (!Number.isFinite(this.xTarget)) throw new ValidationError('กรุณาระบุค่า x ที่ต้องการหาค่า');
    }

    describe(): string {
        return `${this.mode}, ใช้ ${this.selected.length} จุด, x = ${this.xTarget}`;
    }
}
