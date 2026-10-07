/* eslint-disable @stylistic/multiline-comment-style,@typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare namespace React {
  type StatelessComponent<P> = React.FunctionComponent<P>;
}

// Типизация переменных окружений, доступных через import.meta.env.{ENV_NAME}
interface ImportMetaEnv {
  REACT_APP_VERSION: string;
  REACT_APP_NAME: string;
}
