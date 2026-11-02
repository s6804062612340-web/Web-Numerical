// src/ui/ResultView.ts
import { isGraphable, type SolveResult, type Step } from '../core/interfaces.js';
import { Matrix } from '../core/Matrix.js';
import type { ProblemSolver } from '../core/ProblemSolver.js';
import { h } from './dom.js';

declare const Plotly: any; // โหลดจาก CDN ใน index.html

/** แสดงผลลัพธ์ ขั้นตอน และกราฟ */
export class ResultView {
    constructor(private readonly root: HTMLElement) {}

    clear(): void {
        this.root.innerHTML = '';
    }

    showError(message: string): void {
        this.root.innerHTML = '';
        this.root.append(h('div', { class: 'error' }, [message]));
    }

    show(solver: ProblemSolver, result: SolveResult): void {
        this.root.innerHTML = '';
        this.root.append(
            h('h3', {}, ['คำตอบ']),
            h('pre', { class: 'answer' }, [result.answer]),
            h('p', { class: 'muted' }, [`วิธี: ${solver.getMethodName()} · ใช้เวลา ${result.elapsedMs.toFixed(3)} ms`]),
        );

        // ใช้ type guard ตรวจว่า solver ตัวนี้ implement IGraphable หรือไม่
        if (isGraphable(solver) && typeof Plotly !== 'undefined') {
            const div = h('div', { class: 'graph' });
            this.root.append(h('h3', {}, ['กราฟ']), div);
            const traces = solver.getPlotData().map((s) => ({ ...s, type: 'scatter', marker: { size: s.mode === 'markers' ? 8 : 4 } }));
            Plotly.newPlot(div, traces, { margin: { t: 20, r: 20, b: 40, l: 50 }, legend: { orientation: 'h' } }, { responsive: true });
        }

        this.root.append(h('h3', {}, ['วิธีทำ']));
        result.steps.forEach((s, i) => this.root.append(this.renderStep(s, i + 1)));
    }

    private renderStep(step: Step, no: number): HTMLElement {
        const box = h('div', { class: 'step' }, [h('div', { class: 'step-title' }, [`${no}. ${step.title}`])]);
        if (step.text) box.append(h('pre', {}, [step.text]));
        if (step.matrix) box.append(ResultView.matrixTable(step.matrix));
        if (step.matrices) {
            box.append(h('div', { class: 'mats' }, step.matrices.map((m) =>
                h('div', {}, [h('div', { class: 'muted' }, [m.label]), ResultView.matrixTable(m.matrix)]))));
        }
        return box;
    }

    static matrixTable(m: Matrix): HTMLElement {
        return h('table', { class: 'matrix' }, [
            h('tbody', {}, m.toArray().map((r) => h('tr', {}, r.map((v) => h('td', {}, [Matrix.format(v)]))))),
        ]);
    }
}
