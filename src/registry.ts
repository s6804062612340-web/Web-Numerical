// src/registry.ts
// ลงทะเบียนวิธีแก้ปัญหาทั้งหมดเข้า SolverFactory
// ถ้าต้องการเพิ่มวิธีใหม่ แค่สร้างคลาสที่ extends ProblemSolver แล้ว register ที่ไฟล์นี้ (Open/Closed Principle)
import { InterpolationMode, SolutionType } from './core/enums.js';
import { SolverFactory } from './core/SolverFactory.js';
import { InterpolationProblem } from './problems/InterpolationProblem.js';
import { LinearSystemProblem } from './problems/LinearSystemProblem.js';
import { MatrixProblem } from './problems/MatrixProblem.js';
import { MultipleRegressionProblem } from './problems/MultipleRegressionProblem.js';
import { RegressionProblem } from './problems/RegressionProblem.js';
import { LagrangeInterpolationSolver } from './solvers/interpolation/LagrangeInterpolationSolver.js';
import { NewtonDividedDifferenceSolver } from './solvers/interpolation/NewtonDividedDifferenceSolver.js';
import { CholeskySolver } from './solvers/linear/CholeskySolver.js';
import { GaussEliminationSolver } from './solvers/linear/GaussEliminationSolver.js';
import { GaussJordanSolver } from './solvers/linear/GaussJordanSolver.js';
import { LUDecompositionSolver } from './solvers/linear/LUDecompositionSolver.js';
import { MatrixInversionSolver } from './solvers/MatrixInversionSolver.js';
import { LinearRegressionSolver } from './solvers/regression/LinearRegressionSolver.js';
import { MultipleLinearRegressionSolver } from './solvers/regression/MultipleLinearRegressionSolver.js';
import { PolynomialRegressionSolver } from './solvers/regression/PolynomialRegressionSolver.js';

const LINEAR_DEFAULT = { matrixA: [[-2, 3, 1], [3, 4, -5], [1, -2, 1]], arrayB: [9, 0, -5] };
const SPD_DEFAULT = { matrixA: [[25, 15, -5], [15, 18, 0], [-5, 0, 11]], arrayB: [35, 33, 6] };
const REG_POINTS = [10, 15, 20, 30, 40, 50, 60, 70, 80].map((x, i) => ({ x, y: [5, 9, 15, 18, 22, 30, 35, 38, 43][i] }));
const INT_POINTS = [0, 20000, 40000, 60000, 80000].map((x, i) => ({ x, y: [9.81, 9.7487, 9.6879, 9.6282, 9.5682][i] }));

export function registerAllSolvers(): void {
    // ---------- Linear Algebra Equation ----------
    SolverFactory.register({
        type: SolutionType.GAUSS_ELIMINATION, label: 'Gauss Elimination', group: 'Linear Algebra Equation',
        form: 'linear', problemClass: LinearSystemProblem, solverClass: GaussEliminationSolver,
        description: 'กำจัดตัวแปรให้ได้เมทริกซ์สามเหลี่ยมบน แล้วแทนค่าย้อนกลับ (Back substitution)',
        defaults: LINEAR_DEFAULT,
    });
    SolverFactory.register({
        type: SolutionType.GAUSS_JORDAN, label: 'Gauss-Jordan', group: 'Linear Algebra Equation',
        form: 'linear', problemClass: LinearSystemProblem, solverClass: GaussJordanSolver,
        description: 'ทำ [A | b] ให้เป็น [I | x] (Reduced Row Echelon Form)',
        defaults: LINEAR_DEFAULT,
    });
    SolverFactory.register({
        type: SolutionType.LU_DECOMPOSITION, label: 'LU Decomposition', group: 'Linear Algebra Equation',
        form: 'linear', problemClass: LinearSystemProblem, solverClass: LUDecompositionSolver,
        description: 'แยก A = LU แล้วแก้ Ly = b และ Ux = y',
        defaults: LINEAR_DEFAULT,
    });
    SolverFactory.register({
        type: SolutionType.CHOLESKY_DECOMPOSITION, label: 'Cholesky Decomposition', group: 'Linear Algebra Equation',
        form: 'linear', problemClass: LinearSystemProblem, solverClass: CholeskySolver,
        description: 'แยก A = L·Lᵀ (A ต้องสมมาตรและเป็น Positive definite)',
        defaults: SPD_DEFAULT,
    });
    SolverFactory.register({
        type: SolutionType.MATRIX_INVERSION, label: 'Matrix Inversion', group: 'Linear Algebra Equation',
        form: 'matrix', problemClass: MatrixProblem, solverClass: MatrixInversionSolver,
        description: 'หา A⁻¹ ด้วยการทำ Gauss-Jordan กับ [A | I]',
        defaults: { matrixA: [[4, -1, 0], [-1, 4, -1], [0, -1, 4]] },
    });

    // ---------- Interpolation ----------
    SolverFactory.register({
        type: SolutionType.NEWTON_DIVIDED_DIFFERENCE, label: "Newton's Divided-Difference", group: 'Interpolation',
        form: 'interpolation', problemClass: InterpolationProblem, solverClass: NewtonDividedDifferenceSolver,
        description: 'Linear (2 จุด) / Quadratic (3 จุด) / Polynomial (n จุด) ด้วยสูตรผลต่างแบ่งของนิวตัน',
        defaults: { points: INT_POINTS, xTarget: 42235, mode: InterpolationMode.QUADRATIC, selected: [0, 2, 4] },
    });
    SolverFactory.register({
        type: SolutionType.LAGRANGE_INTERPOLATION, label: 'Lagrange Interpolation', group: 'Interpolation',
        form: 'interpolation', problemClass: InterpolationProblem, solverClass: LagrangeInterpolationSolver,
        description: 'Linear (2 จุด) / Quadratic (3 จุด) / Polynomial (n จุด) ด้วยสูตรของลากรางจ์',
        defaults: { points: INT_POINTS, xTarget: 42235, mode: InterpolationMode.QUADRATIC, selected: [0, 2, 4] },
    });

    // ---------- Regression ----------
    SolverFactory.register({
        type: SolutionType.LINEAR_REGRESSION, label: 'Linear Regression', group: 'Least-Squares Regression',
        form: 'regression', problemClass: RegressionProblem, solverClass: LinearRegressionSolver,
        description: 'หาเส้นตรง f(x) = a0 + a1x ที่ผลรวมกำลังสองของความคลาดเคลื่อนน้อยที่สุด',
        defaults: { points: REG_POINTS, order: 1, xTarget: 65 },
    });
    SolverFactory.register({
        type: SolutionType.POLYNOMIAL_REGRESSION, label: 'Polynomial Regression', group: 'Least-Squares Regression',
        form: 'regression', problemClass: RegressionProblem, solverClass: PolynomialRegressionSolver,
        description: 'หาพหุนามดีกรี m: f(x) = a0 + a1x + ... + amxᵐ',
        defaults: { points: REG_POINTS, order: 2, xTarget: 65 },
    });
    SolverFactory.register({
        type: SolutionType.MULTIPLE_LINEAR_REGRESSION, label: 'Multiple Linear Regression', group: 'Least-Squares Regression',
        form: 'multiple', problemClass: MultipleRegressionProblem, solverClass: MultipleLinearRegressionSolver,
        description: 'หลายตัวแปรต้น: f = a0 + a1x1 + a2x2 + ... + akxk',
        defaults: {
            xs: [[1, 0, 1], [0, 1, 3], [2, 4, 1], [3, 2, 2], [4, 1, 5], [2, 3, 3], [1, 6, 4]],
            y: [4, -5, -6, 0, -1, -7, -20],
            xTarget: [1, 2, 3],
        },
    });
}
