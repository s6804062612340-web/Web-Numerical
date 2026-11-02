// src/ui/App.ts
import type { SolutionType } from '../core/enums.js';
import { NumericalError } from '../core/errors.js';
import { SolverFactory, type SolverDescriptor } from '../core/SolverFactory.js';
import { h } from './dom.js';
import { FormFactory } from './FormFactory.js';
import { HistoryRepository } from './HistoryRepository.js';
import type { InputForm } from './InputForm.js';
import { ResultView } from './ResultView.js';

/** คลาสหลักของหน้าเว็บ: จัดการเมนู ฟอร์ม ปุ่มคำนวณ ผลลัพธ์ และประวัติ */
export class App {
    private current!: SolverDescriptor;
    private form!: InputForm;
    private readonly history = new HistoryRepository();
    private readonly nav: HTMLElement;
    private readonly main: HTMLElement;

    constructor(root: HTMLElement) {
        this.nav = h('nav');
        this.main = h('main');
        root.append(this.nav, this.main);
    }

    start(): void {
        this.renderNav();
        const first = SolverFactory.list()[0];
        this.select(first.type);
    }

    private renderNav(): void {
        this.nav.innerHTML = '';
        this.nav.append(h('h1', {}, ['Numerical Methods']));
        const groups = new Map<string, SolverDescriptor[]>();
        for (const d of SolverFactory.list()) groups.set(d.group, [...(groups.get(d.group) ?? []), d]);
        for (const [group, items] of groups) {
            this.nav.append(h('div', { class: 'group' }, [group]));
            for (const d of items)
                this.nav.append(h('a', {
                    href: '#', 'data-type': d.type, class: d.type === this.current?.type ? 'active' : '',
                    onclick: (e: Event) => { e.preventDefault(); this.select(d.type); },
                }, [d.label]));
        }
    }

    private select(type: SolutionType, input?: object): void {
        this.current = SolverFactory.get(type);
        this.renderNav();
        this.main.innerHTML = '';

        const formRoot = h('div', { class: 'form' });
        const resultRoot = h('div', { class: 'result' });
        const resultView = new ResultView(resultRoot);
        this.form = FormFactory.create(this.current, formRoot, input);
        this.form.mount();

        this.main.append(
            h('h2', {}, [this.current.label]),
            h('p', { class: 'muted' }, [this.current.description]),
            formRoot,
            h('div', { class: 'row' }, [
                h('button', { class: 'primary', onclick: () => this.calculate(resultView) }, ['คำนวณ']),
                h('button', { onclick: () => { this.form.load(this.current.defaults); resultView.clear(); } }, ['ใช้ค่าตัวอย่าง']),
            ]),
            resultRoot,
            this.renderHistory(),
        );
    }

    private calculate(view: ResultView): void {
        try {
            const input = this.form.toJSON();
            // Polymorphism: ได้ ProblemSolver กลับมา ไม่ว่าจะเป็นวิธีไหนก็เรียก solve() เหมือนกัน
            const solver = SolverFactory.create(this.current.type, input);
            const result = solver.solve();
            view.show(solver, result);
            this.history.add({ solutionType: this.current.type, label: this.current.label, input, answer: result.answer.replace(/\n/g, ' ; ').slice(0, 90) });
            this.main.querySelector('.history')?.replaceWith(this.renderHistory());
        } catch (err) {
            const msg = err instanceof NumericalError ? err.message : `เกิดข้อผิดพลาด: ${(err as Error).message}`;
            view.showError(msg);
        }
    }

    private renderHistory(): HTMLElement {
        const records = this.history.all();
        const box = h('div', { class: 'history' }, [h('h3', {}, ['ประวัติการคำนวณ'])]);
        if (!records.length) {
            box.append(h('p', { class: 'muted' }, ['ยังไม่มีประวัติ']));
            return box;
        }
        box.append(h('table', { class: 'list' }, [
            h('thead', {}, [h('tr', {}, ['วันที่', 'วิธี', 'คำตอบ', ''].map((t) => h('th', {}, [t])))]),
            h('tbody', {}, records.map((r) => h('tr', {}, [
                h('td', {}, [r.date]),
                h('td', {}, [r.label]),
                h('td', { class: 'mono' }, [r.answer]),
                h('td', {}, [h('button', { onclick: () => this.select(r.solutionType, JSON.parse(r.input)) }, ['เปิด'])]),
            ]))),
        ]), h('button', { onclick: () => { this.history.clear(); box.replaceWith(this.renderHistory()); } }, ['ล้างประวัติ']));
        return box;
    }
}
