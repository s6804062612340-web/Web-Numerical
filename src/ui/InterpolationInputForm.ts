// src/ui/InterpolationInputForm.ts
import { InterpolationMode } from '../core/enums.js';
import type { InterpolationInput } from '../problems/InterpolationProblem.js';
import { h, numberInput } from './dom.js';
import { InputForm } from './InputForm.js';
import { PointsInputForm } from './PointsInputForm.js';

/** ฟอร์ม Interpolation: เพิ่มคอลัมน์ checkbox เลือกจุด และเลือกโหมด Linear/Quadratic/Polynomial */
export class InterpolationInputForm extends PointsInputForm<InterpolationInput> {
    private checks: HTMLInputElement[] = [];
    private modeSelect!: HTMLSelectElement;
    private targetInput!: HTMLInputElement;

    /** เลือกจุดเริ่มต้นตามโหมด: Linear = หัว-ท้าย, Quadratic = หัว-กลาง-ท้าย, Polynomial = ทั้งหมด */
    static defaultSelection(mode: InterpolationMode, n: number): number[] {
        if (mode === InterpolationMode.LINEAR) return [0, n - 1];
        if (mode === InterpolationMode.QUADRATIC) return [0, Math.floor((n - 1) / 2), n - 1];
        return Array.from({ length: n }, (_, i) => i);
    }

    protected override onResize(n: number): void {
        this.state.selected = InterpolationInputForm.defaultSelection(this.state.mode, n);
    }

    protected override extraHeader(): string {
        return 'ใช้';
    }

    protected override renderRowExtra(i: number): HTMLElement {
        const c = h('input', { type: 'checkbox', checked: this.state.selected.includes(i) });
        this.checks[i] = c;
        return c;
    }

    protected override render(): void {
        this.checks = [];
        super.render(); // เรียก render() ของคลาสแม่ แล้วเพิ่มพฤติกรรม
    }

    protected renderOptions(): HTMLElement {
        this.modeSelect = h('select', {}, [
            h('option', { value: InterpolationMode.LINEAR }, ['Linear (2 จุด)']),
            h('option', { value: InterpolationMode.QUADRATIC }, ['Quadratic (3 จุด)']),
            h('option', { value: InterpolationMode.POLYNOMIAL }, ['Polynomial (n จุด)']),
        ]);
        this.modeSelect.value = this.state.mode;
        this.modeSelect.addEventListener('change', () => {
            this.syncState();
            this.state.mode = this.modeSelect.value as InterpolationMode;
            this.state.selected = InterpolationInputForm.defaultSelection(this.state.mode, this.state.points.length);
            this.mount();
        });
        this.targetInput = numberInput(this.state.xTarget, 'small');
        return h('div', { class: 'row' }, [
            h('label', {}, ['รูปแบบ ', this.modeSelect]),
            h('label', {}, ['ค่า x ที่ต้องการ = ', this.targetInput]),
        ]);
    }

    readInput(): InterpolationInput {
        return {
            points: this.readPoints(),
            xTarget: InputForm.num(this.targetInput),
            mode: (this.modeSelect?.value as InterpolationMode) ?? this.state.mode,
            selected: this.checks.map((c, i) => (c.checked ? i : -1)).filter((i) => i >= 0),
        };
    }
}
