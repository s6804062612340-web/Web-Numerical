// src/problems/MatrixProblem.ts
import { ProblemType } from '../core/enums.js';
import { ValidationError } from '../core/errors.js';
import { Matrix } from '../core/Matrix.js';
import { Problem } from '../core/Problem.js';

export interface MatrixInput {
    matrixA: number[][];
}

/**
 * ปัญหาที่มีเมทริกซ์จัตุรัส A เป็นข้อมูลหลัก (ใช้กับ Matrix Inversion)
 * Inheritance: MatrixProblem → Problem
 */
export class MatrixProblem extends Problem {
    protected readonly matrixA: Matrix;

    constructor(input: string, problemType: ProblemType = ProblemType.MATRIX_INVERSION) {
        super(input, problemType);
        const data = JSON.parse(input) as MatrixInput;
        this.matrixA = new Matrix(data.matrixA ?? [[]]);
    }

    getMatrixA(): Matrix {
        return this.matrixA.clone();
    }

    validate(): void {
        if (!this.matrixA.isSquare) throw new ValidationError('เมทริกซ์ A ต้องเป็นเมทริกซ์จัตุรัส');
        if (this.matrixA.rows > 10) throw new ValidationError('รองรับขนาดเมทริกซ์ไม่เกิน 10×10');
        if (this.matrixA.toArray().flat().some((v) => !Number.isFinite(v)))
            throw new ValidationError('ข้อมูลในเมทริกซ์ A ต้องเป็นตัวเลขทั้งหมด');
    }

    describe(): string {
        return `A ขนาด ${this.matrixA.rows}×${this.matrixA.cols}`;
    }
}
