// src/core/Matrix.ts
import { ValidationError } from './errors.js';

/**
 * คลาส Matrix — ตัวอย่าง Encapsulation
 * ข้อมูลภายใน (data) เป็น private ภายนอกเข้าถึงได้ผ่าน getter / method เท่านั้น
 */
export class Matrix {
    private readonly data: number[][];

    constructor(data: number[][]) {
        if (data.length === 0) throw new ValidationError('เมทริกซ์ต้องมีอย่างน้อย 1 แถว');
        const cols = data[0].length;
        if (data.some((r) => r.length !== cols)) throw new ValidationError('ทุกแถวต้องมีจำนวนคอลัมน์เท่ากัน');
        // copy เพื่อไม่ให้ภายนอกแก้ไขข้อมูลภายในได้ (defensive copy)
        this.data = data.map((r) => [...r]);
    }

    // ---------- Static factory methods ----------
    static zeros(rows: number, cols: number): Matrix {
        return new Matrix(Array.from({ length: rows }, () => new Array(cols).fill(0)));
    }

    static identity(n: number): Matrix {
        const m = Matrix.zeros(n, n);
        for (let i = 0; i < n; i++) m.set(i, i, 1);
        return m;
    }

    static columnVector(values: number[]): Matrix {
        return new Matrix(values.map((v) => [v]));
    }

    // ---------- Getters ----------
    get rows(): number {
        return this.data.length;
    }

    get cols(): number {
        return this.data[0].length;
    }

    get isSquare(): boolean {
        return this.rows === this.cols;
    }

    get(r: number, c: number): number {
        return this.data[r][c];
    }

    set(r: number, c: number, value: number): void {
        this.data[r][c] = value;
    }

    row(r: number): number[] {
        return [...this.data[r]];
    }

    column(c: number): number[] {
        return this.data.map((r) => r[c]);
    }

    toArray(): number[][] {
        return this.data.map((r) => [...r]);
    }

    clone(): Matrix {
        return new Matrix(this.data);
    }

    // ---------- Row operations (ใช้ใน Gauss / Gauss-Jordan) ----------
    swapRows(a: number, b: number): void {
        [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
    }

    scaleRow(r: number, factor: number): void {
        this.data[r] = this.data[r].map((v) => v * factor);
    }

    /** row[target] = row[target] + factor * row[source] */
    addRowMultiple(target: number, source: number, factor: number): void {
        this.data[target] = this.data[target].map((v, j) => v + factor * this.data[source][j]);
    }

    // ---------- Matrix operations ----------
    transpose(): Matrix {
        return new Matrix(this.data[0].map((_, c) => this.column(c)));
    }

    multiply(other: Matrix): Matrix {
        if (this.cols !== other.rows) throw new ValidationError('ขนาดเมทริกซ์ไม่สามารถคูณกันได้');
        const out = Matrix.zeros(this.rows, other.cols);
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < other.cols; j++) {
                let s = 0;
                for (let k = 0; k < this.cols; k++) s += this.data[i][k] * other.get(k, j);
                out.set(i, j, s);
            }
        return out;
    }

    /** ต่อเมทริกซ์ทางขวา เช่น [A | b] หรือ [A | I] */
    augment(other: Matrix): Matrix {
        if (this.rows !== other.rows) throw new ValidationError('จำนวนแถวไม่เท่ากัน');
        return new Matrix(this.data.map((r, i) => [...r, ...other.row(i)]));
    }

    /** ตัดเมทริกซ์ย่อยตามคอลัมน์ */
    sliceColumns(start: number, end: number): Matrix {
        return new Matrix(this.data.map((r) => r.slice(start, end)));
    }

    isSymmetric(eps = 1e-9): boolean {
        if (!this.isSquare) return false;
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < i; j++) if (Math.abs(this.data[i][j] - this.data[j][i]) > eps) return false;
        return true;
    }

    toString(): string {
        return this.data.map((r) => r.map((v) => Matrix.format(v)).join('\t')).join('\n');
    }

    /** จัดรูปแบบตัวเลขให้อ่านง่าย */
    static format(v: number, digits = 6): string {
        if (Number.isNaN(v)) return '';
        if (!Number.isFinite(v)) return String(v);
        const a = Math.abs(v);
        if (a < 1e-14) return '0';
        // ค่าที่เล็ก/ใหญ่มากใช้รูปแบบวิทยาศาสตร์ เพื่อไม่ให้ปัดเป็น 0
        if (a < 1e-3 || a >= 1e9) return v.toExponential(digits).replace(/\.?0+e/, 'e');
        return String(Number(v.toFixed(digits)));
    }
}
