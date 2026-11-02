// src/ui/PointsInputForm.ts
import type { Point } from '../problems/PointsProblem.js';
import { h, numberInput } from './dom.js';
import { InputForm } from './InputForm.js';

/**
 * <<abstract>> PointsInputForm
 * ฟอร์มตารางจุด (x, y) ที่ใช้ร่วมกันระหว่าง Regression และ Interpolation
 * คลาสลูกเติมส่วนที่ต่างกันผ่าน hook methods: renderRowExtra() และ renderOptions()
 */
export abstract class PointsInputForm<T extends { points: Point[] }> extends InputForm<T> {
    protected xCells: HTMLInputElement[] = [];
    protected yCells: HTMLInputElement[] = [];

    protected resize(n: number): void {
        this.syncState();
        const pts = Array.from({ length: n }, (_, i) => this.state.points[i] ?? { x: NaN, y: NaN });
        this.state = { ...this.state, points: pts };
        this.onResize(n);
        this.mount();
    }

    /** hook: คลาสลูก override เพื่อจัดการ state ของตัวเองเมื่อจำนวนจุดเปลี่ยน */
    protected onResize(_n: number): void {}

    /** hook: คอลัมน์เพิ่มเติมของแต่ละแถว (ค่าเริ่มต้นไม่มี) */
    protected renderRowExtra(_i: number): HTMLElement | null {
        return null;
    }

    protected extraHeader(): string | null {
        return null;
    }

    /** ส่วนตั้งค่าใต้ตาราง (เช่น ดีกรี, ค่า x ที่ต้องการ) */
    protected abstract renderOptions(): HTMLElement;

    protected render(): void {
        const n = this.state.points.length;
        const count = h('input', { type: 'number', min: 2, max: 30, value: n, class: 'small' });
        count.addEventListener('change', () => this.resize(Math.min(30, Math.max(2, Number(count.value) || 2))));

        this.xCells = this.state.points.map((p) => numberInput(p.x));
        this.yCells = this.state.points.map((p) => numberInput(p.y));
        const extra = this.extraHeader();

        const rows = this.state.points.map((_, i) =>
            h('tr', {}, [
                h('td', { class: 'idx' }, [String(i + 1)]),
                extra ? h('td', {}, [this.renderRowExtra(i)]) : null,
                h('td', {}, [this.xCells[i]]),
                h('td', {}, [this.yCells[i]]),
            ]));

        this.root.append(
            h('div', { class: 'row' }, [h('label', {}, ['จำนวนจุด ']), count]),
            h('table', { class: 'grid' }, [
                h('thead', {}, [h('tr', {}, [h('th', {}, ['#']), extra ? h('th', {}, [extra]) : null, h('th', {}, ['x']), h('th', {}, ['f(x)'])])]),
                h('tbody', {}, rows),
            ]),
            this.renderOptions(),
        );
    }

    protected readPoints(): Point[] {
        return this.xCells.map((c, i) => ({ x: InputForm.num(c), y: InputForm.num(this.yCells[i]) }));
    }
}
