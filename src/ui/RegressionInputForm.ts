// src/ui/RegressionInputForm.ts
import type { RegressionInput } from '../problems/RegressionProblem.js';
import { h, numberInput } from './dom.js';
import { InputForm } from './InputForm.js';
import { PointsInputForm } from './PointsInputForm.js';

/** ฟอร์ม Linear / Polynomial Regression */
export class RegressionInputForm extends PointsInputForm<RegressionInput> {
    private readonly fixedOrder: boolean;
    private orderInput!: HTMLInputElement;
    private targetInput!: HTMLInputElement;

    constructor(root: HTMLElement, defaults: RegressionInput, fixedOrder: boolean) {
        super(root, defaults);
        this.fixedOrder = fixedOrder;
    }

    protected renderOptions(): HTMLElement {
        this.orderInput = h('input', { type: 'number', min: 1, max: 10, value: this.state.order, class: 'small' });
        this.targetInput = numberInput(this.state.xTarget, 'small');
        return h('div', { class: 'row' }, [
            this.fixedOrder ? null : h('label', {}, ['ดีกรี m = ', this.orderInput]),
            h('label', {}, ['ค่า x ที่ต้องการทำนาย = ', this.targetInput]),
        ]);
    }

    readInput(): RegressionInput {
        return {
            points: this.readPoints(),
            order: this.fixedOrder ? 1 : InputForm.num(this.orderInput),
            xTarget: InputForm.num(this.targetInput),
        };
    }
}
