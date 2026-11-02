// src/ui/MultipleRegressionInputForm.ts
import type { MultipleRegressionInput } from '../problems/MultipleRegressionProblem.js';
import { h, numberInput } from './dom.js';
import { InputForm } from './InputForm.js';

/** ฟอร์ม Multiple Linear Regression: ตาราง x1..xk, y และค่าที่ต้องการทำนาย */
export class MultipleRegressionInputForm extends InputForm<MultipleRegressionInput> {
    private xCells: HTMLInputElement[][] = [];
    private yCells: HTMLInputElement[] = [];
    private targetCells: HTMLInputElement[] = [];

    private reshape(n: number, k: number): void {
        this.syncState();
        const s = this.state;
        this.state = {
            xs: Array.from({ length: n }, (_, i) => Array.from({ length: k }, (_, j) => s.xs[i]?.[j] ?? NaN)),
            y: Array.from({ length: n }, (_, i) => s.y[i] ?? NaN),
            xTarget: Array.from({ length: k }, (_, j) => s.xTarget[j] ?? NaN),
        };
        this.mount();
    }

    protected render(): void {
        const n = this.state.xs.length;
        const k = this.state.xs[0]?.length ?? 1;
        const nInput = h('input', { type: 'number', min: 2, max: 30, value: n, class: 'small' });
        const kInput = h('input', { type: 'number', min: 1, max: 6, value: k, class: 'small' });
        const apply = () => this.reshape(Math.max(2, Number(nInput.value) || 2), Math.min(6, Math.max(1, Number(kInput.value) || 1)));
        nInput.addEventListener('change', apply);
        kInput.addEventListener('change', apply);

        this.xCells = this.state.xs.map((r) => r.map((v) => numberInput(v)));
        this.yCells = this.state.y.map((v) => numberInput(v));
        this.targetCells = this.state.xTarget.map((v) => numberInput(v));

        const head = h('tr', {}, [h('th', {}, ['#']), ...Array.from({ length: k }, (_, j) => h('th', {}, [`x${j + 1}`])), h('th', { class: 'sep' }, ['y'])]);
        const rows = this.xCells.map((r, i) =>
            h('tr', {}, [h('td', { class: 'idx' }, [String(i + 1)]), ...r.map((c) => h('td', {}, [c])), h('td', { class: 'sep' }, [this.yCells[i]])]));

        this.root.append(
            h('div', { class: 'row' }, [h('label', {}, ['จำนวนข้อมูล ', nInput]), h('label', {}, ['จำนวนตัวแปร x ', kInput])]),
            h('table', { class: 'grid' }, [h('thead', {}, [head]), h('tbody', {}, rows)]),
            h('div', { class: 'row' }, [
                h('span', {}, ['ค่าที่ต้องการทำนาย: ']),
                ...this.targetCells.map((c, j) => h('label', {}, [`x${j + 1} = `, c])),
            ]),
        );
    }

    readInput(): MultipleRegressionInput {
        return {
            xs: this.xCells.map((r) => r.map((c) => InputForm.num(c))),
            y: this.yCells.map((c) => InputForm.num(c)),
            xTarget: this.targetCells.map((c) => InputForm.num(c)),
        };
    }
}
