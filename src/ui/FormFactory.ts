// src/ui/FormFactory.ts
import { SolutionType } from '../core/enums.js';
import type { SolverDescriptor } from '../core/SolverFactory.js';
import type { InterpolationInput } from '../problems/InterpolationProblem.js';
import type { MultipleRegressionInput } from '../problems/MultipleRegressionProblem.js';
import type { RegressionInput } from '../problems/RegressionProblem.js';
import { InputForm } from './InputForm.js';
import { InterpolationInputForm } from './InterpolationInputForm.js';
import { MatrixInputForm } from './MatrixInputForm.js';
import { MultipleRegressionInputForm } from './MultipleRegressionInputForm.js';
import { RegressionInputForm } from './RegressionInputForm.js';

/** Factory สร้างฟอร์มที่เหมาะกับวิธีแก้ปัญหา คืนค่าเป็นชนิดคลาสแม่ InputForm */
export class FormFactory {
    static create(d: SolverDescriptor, root: HTMLElement, input?: object): InputForm {
        const data = (input ?? d.defaults) as any;
        switch (d.form) {
            case 'linear':
                return new MatrixInputForm(root, data, true);
            case 'matrix':
                return new MatrixInputForm(root, data, false);
            case 'regression':
                return new RegressionInputForm(root, data as RegressionInput, d.type === SolutionType.LINEAR_REGRESSION);
            case 'interpolation':
                return new InterpolationInputForm(root, data as InterpolationInput);
            case 'multiple':
                return new MultipleRegressionInputForm(root, data as MultipleRegressionInput);
        }
    }
}
