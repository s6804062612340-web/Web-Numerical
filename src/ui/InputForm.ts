// src/ui/InputForm.ts

/**
 * <<abstract>> InputForm
 * ฟอร์มกรอกข้อมูลทุกแบบมีพฤติกรรมร่วมกัน: mount(), toJSON(), load()
 * แต่ "หน้าตา" และ "วิธีอ่านค่า" ต่างกัน → render() และ readInput() เป็น abstract
 * App เรียกใช้ผ่านชนิด InputForm เท่านั้น ไม่สนใจว่าเป็นฟอร์มแบบไหน (Polymorphism)
 */
export abstract class InputForm<TInput extends object = object> {
    protected readonly root: HTMLElement;
    protected state: TInput;

    constructor(root: HTMLElement, defaults: TInput) {
        this.root = root;
        this.state = structuredClone(defaults);
    }

    /** วาดฟอร์มใหม่ทั้งหมดจาก state ปัจจุบัน */
    mount(): void {
        this.root.innerHTML = '';
        this.render();
    }

    /** โหลดข้อมูลเก่า (เช่นจากประวัติ) กลับเข้าฟอร์ม */
    load(input: TInput): void {
        this.state = structuredClone(input);
        this.mount();
    }

    /** แปลงข้อมูลในฟอร์มเป็น JSON string เพื่อส่งให้คลาส Problem */
    toJSON(): string {
        return JSON.stringify(this.readInput());
    }

    protected abstract render(): void;
    abstract readInput(): TInput;

    /** อ่านค่าตัวเลขจาก input ช่องว่าง = NaN (ให้ Problem.validate() เป็นคนแจ้ง error) */
    protected static num(input: HTMLInputElement): number {
        const v = input.value.trim();
        return v === '' ? NaN : Number(v);
    }

    /** เก็บค่าที่ผู้ใช้พิมพ์ไว้ใน state ก่อนวาดฟอร์มใหม่ (เช่นเปลี่ยนขนาด) */
    protected syncState(): void {
        this.state = this.readInput();
    }
}
