// src/vite-env.d.ts
// 역할: Vite 환경 및 SCSS 모듈 타입 선언

/// <reference types="vite/client" />

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
