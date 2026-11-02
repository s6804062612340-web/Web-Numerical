// src/ui/MatrixInputForm.ts
import { h, numberInput } from './dom.js';
import { InputForm } from './InputForm.js';

interface MatrixFormInput {
    matrixA: number[][];
    arrayB?: number[];
}

/** ฟอร์มกรอกเมทริกซ์ A (และเวกเตอร์ b ถ้า withB = true) */
export class MatrixInputForm extends InputForm<MatrixFormInput> {
    private readonly withB: boolean;
    private cellsA: HTMLInputElement[][] = [];
    private cellsB: HTMLInputElement[] = [];

    constructor(root: HTMLElement, defaults: MatrixFormInput, withB: boolean) {
        super(root, defaults);
        this.withB = withB;
    }

    private get size(): number {
        return this.state.matrixA.length;
    }

    private resize(n: number): void {
        this.syncState();
        const A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => this.state.matrixA[i]?.[j] ?? 0));
        const b = Array.from({ length: n }, (_, i) => this.state.arrayB?.[i] ?? 0);
        this.state = { matrixA: A, arrayB: b };
        this.mount();
    }

    protected render(): void {
        const n = this.size;
        const sizeSelect = h('select', { onchange: (e: Event) => this.resize(Number((e.target as HTMLSelectElement).value)) },
            [2, 3, 4, 5, 6, 7, 8].map((k) => h('option', { value: k, selected: k === n }, [`${k} × ${k}`])));
        sizeSelect.value = String(n);

        this.cellsA = this.state.matrixA.map((r) => r.map((v) => numberInput(v)));
        this.cellsB = Array.from({ length: n }, (_, i) => numberInput(this.state.arrayB?.[i]));

        const header = h('tr', {}, [
            ...Array.from({ length: n }, (_, j) => h('th', {}, [`x${j + 1}`])),
            this.withB ? h('th', { class: 'sep' }, ['b']) : null,
        ]);
        const rows = this.cellsA.map((r, i) =>
            h('tr', {}, [...r.map((c) => h('td', {}, [c])), this.withB ? h('td', { class: 'sep' }, [this.cellsB[i]]) : null]));

        this.root.append(
            h('div', { class: 'row' }, [h('label', {}, ['ขนาดเมทริกซ์ ']), sizeSelect]),
            h('table', { class: 'grid' }, [h('thead', {}, [header]), h('tbody', {}, rows)]),
        );
    }

    readInput(): MatrixFormInput {
        const matrixA = this.cellsA.map((r) => r.map((c) => InputForm.num(c)));
        return this.withB ? { matrixA, arrayB: this.cellsB.map((c) => InputForm.num(c)) } : { matrixA };
    }
}
