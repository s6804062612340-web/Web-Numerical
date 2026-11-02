// src/ui/dom.ts
// ฟังก์ชันช่วยสร้าง DOM element ให้โค้ด UI สั้นลง

type Attrs = Record<string, string | number | boolean | EventListener | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attrs: Attrs = {},
    children: (Node | string | null | undefined)[] = [],
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === false) continue;
        if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
        else if (k === 'class') el.className = String(v);
        else if (k === 'value') (el as HTMLInputElement).value = String(v);
        else if (k === 'checked') (el as HTMLInputElement).checked = Boolean(v);
        else el.setAttribute(k, v === true ? '' : String(v));
    }
    for (const c of children) if (c !== null && c !== undefined) el.append(c);
    return el;
}

export function numberInput(value: number | undefined, cls = 'cell'): HTMLInputElement {
    return h('input', { type: 'number', step: 'any', class: cls, value: Number.isFinite(value) ? String(value) : '' });
}
