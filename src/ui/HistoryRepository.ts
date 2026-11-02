// src/ui/HistoryRepository.ts
import type { SolutionType } from '../core/enums.js';

export interface HistoryRecord {
    id: string;
    solutionType: SolutionType;
    label: string;
    input: string;   // JSON ของปัญหา (ใช้โหลดกลับเข้าฟอร์ม)
    answer: string;
    date: string;
}

/**
 * Repository สำหรับเก็บประวัติการคำนวณ (แทนฐานข้อมูลในต้นแบบ ใช้ localStorage ของเบราว์เซอร์)
 * Encapsulation: ผู้ใช้คลาสไม่รู้ว่าเก็บข้อมูลไว้ที่ไหน รู้แค่ add() / all() / clear()
 */
export class HistoryRepository {
    private static readonly KEY = 'numer-oop-history';
    private static readonly LIMIT = 30;
    private records: HistoryRecord[];

    constructor() {
        this.records = this.load();
    }

    private load(): HistoryRecord[] {
        try {
            return JSON.parse(localStorage.getItem(HistoryRepository.KEY) ?? '[]');
        } catch {
            return [];
        }
    }

    private persist(): void {
        try {
            localStorage.setItem(HistoryRepository.KEY, JSON.stringify(this.records));
        } catch {
            /* เบราว์เซอร์บางแบบไม่อนุญาต localStorage — เก็บในหน่วยความจำอย่างเดียว */
        }
    }

    add(record: Omit<HistoryRecord, 'id' | 'date'>): void {
        const full: HistoryRecord = { ...record, id: Math.random().toString(36).slice(2, 8), date: new Date().toLocaleString('th-TH') };
        this.records = [full, ...this.records].slice(0, HistoryRepository.LIMIT);
        this.persist();
    }

    all(): HistoryRecord[] {
        return [...this.records];
    }

    find(id: string): HistoryRecord | undefined {
        return this.records.find((r) => r.id === id);
    }

    clear(): void {
        this.records = [];
        this.persist();
    }
}
