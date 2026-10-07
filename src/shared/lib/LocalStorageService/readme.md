### LocalStorageService

Сервис для удобной работы с LocalStorage, поддерживает версионирование.

Пример использования:

```tsx
import { LocalStorageService } from 'shared/LocalStorageService';

interface IUserConfigState {
  theme: 'light' | 'dark';
  accentColor: string;
}

const userConfig = new LocalStorageService<IUserConfigState>({
  appName: import.meta.env.APP_NAME,
  id: 'user-config',
  version: 1,
  initialState: { theme: 'light', accentColor: 'red' },
});

userConfig.save((current) => {
  current.theme = 'light';
});
userConfig.data;

const Component = () => {
  const userConfig = userConfig.useWatch();
  const onToggleTheme = () =>
    userConfig.save((current) => {
      current.theme = current.theme === 'light' ? 'dark' : 'light';
    });

  return <button onClick={onToggleTheme}>Toggle theme ({userConfig.theme})</button>;
};
```

Аргументы конструктора:

```ts
interface ILocalStorageServiceArgs<FULL_STATE extends Record<string, unknown>> {
  /** ключ, под которым хранятся данные в localStorage (Пр.: 'myData') */
  id: string;
  /** Имя приложения (берется из поля name в package.json) */
  appName: string;
  /** Начальное состояние данных. */
  initialState: FULL_STATE;
  /** Версия хранилища, при смене версии все данные предыдущих версий будут утеряны */
  version: number;
  /** Всегда ли смотреть на актуальные данные из localStorage */
  alwaysReadFromLocalStorage?: boolean;
}
```

Свойства и методы экземпляра:

1. LocalStorageService.prototype.data - геттер для получения текущего состояния
2. LocalStorageService.prototype.save - сохраняет данные в localStorage, отфильтровывая их с помощью saveMap, в качестве аргумента принимает полный срез данных или метод, принимающий в качестве аргумента текущее состояние и возвращающий новое
3. LocalStorageService.prototype.useWatch - react-xук, позволяющий следить за текущим состоянием. Вызывает ререндер компонента на каждый вызов метода LocalStorageService.prototype.save
