// src/core/Problem.ts
import { ProblemType } from './enums.js';
import type { IValidatable } from './interfaces.js';

/**
 * <<abstract>> Problem
 * เก็บข้อมูลของ "ปัญหา" ที่ผู้ใช้ป้อนเข้ามา
 * - input เก็บเป็น JSON string (เหมือนต้นแบบ) เพื่อนำไปบันทึกประวัติได้ง่าย
 * - คลาสลูกต้อง implement validate() และ describe() ตามรูปแบบปัญหาของตัวเอง
 */
export abstract class Problem implements IValidatable {
    private static counter = 0;

    protected readonly problemId: string;
    protected readonly input: string;
    protected readonly problemType: ProblemType;

    constructor(input: string, problemType: ProblemType) {
        this.input = input;
        this.problemType = problemType;
        this.problemId = `P${Date.now().toString(36)}${(Problem.counter++).toString(36)}`;
    }

    // ---------- Getter methods (Encapsulation) ----------
    getProblemId(): string {
        return this.problemId;
    }

    getInput(): string {
        return this.input;
    }

    getProblemType(): ProblemType {
        return this.problemType;
    }

    // ---------- Abstract methods ----------
    /** ตรวจสอบข้อมูล ถ้าผิดให้ throw ValidationError */
    abstract validate(): void;

    /** คำอธิบายปัญหาแบบสั้น ๆ สำหรับแสดงในประวัติ */
    abstract describe(): string;
}
