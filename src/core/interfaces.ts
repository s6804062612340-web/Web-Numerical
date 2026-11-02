// src/core/interfaces.ts
import type { Matrix } from './Matrix.js';

/** ขั้นตอนการคำนวณ 1 ขั้น ที่จะแสดงให้ผู้ใช้เห็น */
export interface Step {
    title: string;
    text?: string;
    matrix?: Matrix;
    matrices?: { label: string; matrix: Matrix }[];
}

/** ผลลัพธ์ที่ Solver ทุกตัวต้องส่งกลับมา */
export interface SolveResult {
    answer: string;          // คำตอบแบบสรุป
    values: number[];        // คำตอบเป็นตัวเลข (เช่น x1..xn หรือ a0..an)
    steps: Step[];           // ขั้นตอนการทำ
    elapsedMs: number;       // เวลาที่ใช้คำนวณ
}

/** Interface: วัตถุใดก็ตามที่ "แก้ปัญหาได้" ต้องมีเมธอด solve() */
export interface ISolvable {
    solve(): SolveResult;
}

/** Interface: วัตถุที่ตรวจสอบความถูกต้องของข้อมูลได้ */
export interface IValidatable {
    validate(): void; // ถ้าไม่ถูกต้องให้ throw ValidationError
}

/** ข้อมูลสำหรับวาดกราฟ (ใช้กับ Plotly.js) */
export interface PlotSeries {
    name: string;
    x: number[];
    y: number[];
    mode: 'markers' | 'lines' | 'lines+markers';
}

/** Interface: Solver ที่สามารถแสดงผลเป็นกราฟได้ (ไม่ใช่ทุก Solver ที่ implement) */
export interface IGraphable {
    getPlotData(): PlotSeries[];
}

/** Interface: Solver ที่นำไปทำนาย/ประมาณค่า f(x) ได้ */
export interface IPredictor {
    predict(x: number): number;
}

/** Type guard: ตรวจว่า object นั้น implement IGraphable หรือไม่ */
export function isGraphable(obj: unknown): obj is IGraphable {
    return typeof (obj as IGraphable)?.getPlotData === 'function';
}
