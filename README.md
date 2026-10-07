# test-app

Frontend на стеке momentum (`queue-online-admin`): Vite 7, React 19, TypeScript, Ant Design 6.

## Требования

- Node.js 24+ (через [nvm](https://github.com/nvm-sh/nvm))
- npm 10+

## Запуск

```bash
nvm use
npm ci
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000).

Dev-proxy `/api` и `/socket.io` → `http://localhost:3005`.

## Качество

```bash
npm run lint
```
