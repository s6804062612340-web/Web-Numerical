// src/problems/PointsProblem.ts
import { ProblemType } from '../core/enums.js';
import { ValidationError } from '../core/errors.js';
import { Problem } from '../core/Problem.js';

export interface Point {
    x: number;
    y: number;
}

/**
 * <<abstract>> PointsProblem
 * ปัญหาที่ข้อมูลเป็นชุดจุด (x, y) — ใช้ร่วมกันระหว่าง Regression และ Interpolation
 */
export abstract class PointsProblem extends Problem {
    protected readonly points: Point[];

    constructor(input: string, problemType: ProblemType) {
        super(input, problemType);
        const data = JSON.parse(input) as { points: Point[] };
        this.points = (data.points ?? []).map((p) => ({ x: Number(p.x), y: Number(p.y) }));
    }

    getPoints(): Point[] {
        return this.points.map((p) => ({ ...p }));
    }

    /** ตรวจสอบพื้นฐานที่ทุกปัญหาแบบจุดต้องผ่าน — คลาสลูกเรียก super.validate() ได้ */
    validate(): void {
        if (this.points.length < 2) throw new ValidationError('ต้องมีข้อมูลอย่างน้อย 2 จุด');
        if (this.points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y)))
            throw new ValidationError('ค่า x และ y ทุกจุดต้องเป็นตัวเลข');
    }
}
