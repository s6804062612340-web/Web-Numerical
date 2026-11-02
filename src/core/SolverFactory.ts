// src/core/SolverFactory.ts
import type { SolutionType } from './enums.js';
import type { Problem } from './Problem.js';
import type { ProblemSolver } from './ProblemSolver.js';

/** ชนิดของฟอร์มกรอกข้อมูลที่หน้าเว็บต้องสร้าง */
export type FormKind = 'linear' | 'matrix' | 'regression' | 'interpolation' | 'multiple';

/** ข้อมูลอธิบายวิธีแก้ปัญหา 1 วิธี (ใช้ทั้งสร้างเมนู สร้างฟอร์ม และสร้างวัตถุ) */
export interface SolverDescriptor<P extends Problem = Problem> {
    type: SolutionType;
    label: string;
    group: string;
    form: FormKind;
    description: string;
    problemClass: new (input: string) => P;
    solverClass: new (problem: P) => ProblemSolver<P>;
    defaults: Record<string, unknown>;
}

/**
 * Factory Pattern + Registry
 * ผู้เรียกไม่จำเป็นต้องรู้ว่าจะ new คลาสไหน แค่ส่ง SolutionType และ input มา
 * ผลลัพธ์ที่ได้เป็น ProblemSolver (คลาสแม่) → เรียก solve() ได้เหมือนกันทุกวิธี (Polymorphism)
 */
export class SolverFactory {
    // static + private: มีที่เก็บเดียวทั้งโปรแกรม และแก้ไขได้ผ่าน register() เท่านั้น
    private static readonly registry = new Map<SolutionType, SolverDescriptor<any>>();

    static register<P extends Problem>(descriptor: SolverDescriptor<P>): void {
        SolverFactory.registry.set(descriptor.type, descriptor);
    }

    static get(type: SolutionType): SolverDescriptor {
        const d = SolverFactory.registry.get(type);
        if (!d) throw new Error(`ไม่พบวิธี ${type}`);
        return d;
    }

    static list(): SolverDescriptor[] {
        return [...SolverFactory.registry.values()];
    }

    /** สร้าง Problem และ ProblemSolver ที่ถูกต้องจาก SolutionType */
    static create(type: SolutionType, input: string): ProblemSolver {
        const d = SolverFactory.get(type);
        const problem = new d.problemClass(input);
        return new d.solverClass(problem);
    }
}
