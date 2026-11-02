// src/main.ts — จุดเริ่มต้นของโปรแกรม
import { registerAllSolvers } from './registry.js';
import { App } from './ui/App.js';

registerAllSolvers();
new App(document.getElementById('app')!).start();
