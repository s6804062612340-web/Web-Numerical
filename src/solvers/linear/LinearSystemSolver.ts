// src/solvers/linear/LinearSystemSolver.ts
import { SolutionType } from '../../core/enums.js';
import { SingularMatrixError } from '../../core/errors.js';
import { Matrix } from '../../core/Matrix.js';
import { ProblemSolver } from '../../core/ProblemSolver.js';
import type { LinearSystemProblem } from '../../problems/LinearSystemProblem.js';

/**
 * <<abstract>> LinearSystemSolver
 * คลาสแม่ของทุกวิธีที่แก้ Ax = b
 * รวม method ที่ใช้ร่วมกัน (Forward / Back substitution) ไว้ที่เดียว → ลดโค้ดซ้ำ
 */
export abstract class LinearSystemSolver extends ProblemSolver<LinearSystemProblem> {
    protected static readonly EPS = 1e-12;

    constructor(problem: LinearSystemProblem, solutionType: SolutionType) {
        super(problem, solutionType);
    }

    /** แก้ Ux = y เมื่อ U เป็นเมทริกซ์สามเหลี่ยมบน */
    protected backSubstitution(U: Matrix, y: number[]): number[] {
        const n = y.length;
        const x = new Array<number>(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = y[i];
            for (let j = i + 1; j < n; j++) sum -= U.get(i, j) * x[j];
            if (Math.abs(U.get(i, i)) < LinearSystemSolver.EPS) throw new SingularMatrixError();
            x[i] = sum / U.get(i, i);
        }
        return x;
    }

    /** แก้ Ly = b เมื่อ L เป็นเมทริกซ์สามเหลี่ยมล่าง */
    protected forwardSubstitution(L: Matrix, b: number[]): number[] {
        const n = b.length;
        const y = new Array<number>(n).fill(0);
        for (let i = 0; i < n; i++) {
            let sum = b[i];
            for (let j = 0; j < i; j++) sum -= L.get(i, j) * y[j];
            if (Math.abs(L.get(i, i)) < LinearSystemSolver.EPS) throw new SingularMatrixError();
            y[i] = sum / L.get(i, i);
        }
        return y;
    }

    /** หา pivot ที่มีค่าสัมบูรณ์มากที่สุดในคอลัมน์ col (Partial Pivoting) */
    protected partialPivot(m: Matrix, col: number, fromRow: number): void {
        let best = fromRow;
        for (let r = fromRow + 1; r < m.rows; r++) if (Math.abs(m.get(r, col)) > Math.abs(m.get(best, col))) best = r;
        if (Math.abs(m.get(best, col)) < LinearSystemSolver.EPS) throw new SingularMatrixError();
        if (best !== fromRow) {
            m.swapRows(best, fromRow);
            this.addStep(`สลับแถว R${fromRow + 1} ↔ R${best + 1} (Partial Pivoting)`, undefined, m);
        }
    }

    protected formatSolution(x: number[], name = 'x'): string {
        return x.map((v, i) => `${name}${i + 1} = ${Matrix.format(v)}`).join(',  ');
    }
}
