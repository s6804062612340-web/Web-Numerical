// src/core/errors.ts
// Inheritance จากคลาส Error ของ JavaScript เพื่อแยกประเภทข้อผิดพลาด

export class NumericalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NumericalError';
    }
}

/** ข้อมูลที่ผู้ใช้กรอกไม่ถูกต้อง */
export class ValidationError extends NumericalError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

/** เมทริกซ์ไม่สามารถหาคำตอบได้ (เช่น det = 0) */
export class SingularMatrixError extends NumericalError {
    constructor(message = 'เมทริกซ์เป็น Singular (det = 0) ไม่สามารถหาคำตอบได้') {
        super(message);
        this.name = 'SingularMatrixError';
    }
}
