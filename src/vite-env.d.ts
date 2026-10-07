/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_USE_SHIFT_MOCK?: string;
  readonly VITE_USE_APPEAL_MOCK?: string;
  readonly VITE_USE_APPEAL_MOCK_VARIANT?: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
