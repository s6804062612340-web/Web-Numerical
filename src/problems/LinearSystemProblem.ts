// src/problems/LinearSystemProblem.ts
import { ProblemType } from '../core/enums.js';
import { ValidationError } from '../core/errors.js';
import { Matrix } from '../core/Matrix.js';
import { MatrixProblem, type MatrixInput } from './MatrixProblem.js';

export interface LinearSystemInput extends MatrixInput {
    arrayB: number[];
}

/**
 * ปัญหาระบบสมการเชิงเส้น Ax = b
 * Inheritance หลายชั้น: LinearSystemProblem → MatrixProblem → Problem
 * (นำ matrixA และการตรวจสอบเมทริกซ์จัตุรัสจากคลาสแม่มาใช้ซ้ำ แล้วเพิ่มเวกเตอร์ b)
 */
export class LinearSystemProblem extends MatrixProblem {
    protected readonly arrayB: number[];

    constructor(input: string) {
        super(input, ProblemType.LINEAR_ALGEBRA_EQUATION);
        const data = JSON.parse(input) as LinearSystemInput;
        this.arrayB = [...(data.arrayB ?? [])];
    }

    getArrayB(): number[] {
        return [...this.arrayB];
    }

    getVectorB(): Matrix {
        return Matrix.columnVector(this.arrayB);
    }

    /** Override: ตรวจสอบของคลาสแม่ก่อน (super) แล้วตรวจ b เพิ่ม */
    override validate(): void {
        super.validate();
        if (this.arrayB.length !== this.matrixA.rows)
            throw new ValidationError('ขนาดของเวกเตอร์ b ต้องเท่ากับจำนวนแถวของ A');
        if (this.arrayB.some((v) => !Number.isFinite(v))) throw new ValidationError('ข้อมูลใน b ต้องเป็นตัวเลขทั้งหมด');
    }

    override describe(): string {
        return `Ax = b, ${this.matrixA.rows} ตัวแปร`;
    }
}
