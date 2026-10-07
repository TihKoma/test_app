/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

export type TState<STATE_STRUCTURE> = {
  data: STATE_STRUCTURE;
  version: number;
};

export type IStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

export type ILocalStorageServiceArgs<FULL_STATE extends Record<string, unknown>> = {
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
  /** Storage, в котором будут храниться данные */
  storage?: IStorage;
};

type TInitParams = {
  withEmitUpdate?: boolean;
};

/**
 * Сервис для сохранения и получения данных из localStorage
 */
export class LocalStorageService<FULL_STATE extends Record<string, any>> {
  public readonly id: string;

  private state: TState<FULL_STATE>;
  private readonly alwaysReadFromLocalStorage: boolean;
  private readonly initialState: FULL_STATE;
  private readonly storage: IStorage;

  constructor({
    appName,
    id,
    initialState,
    version,
    alwaysReadFromLocalStorage = false,
    storage = globalThis.localStorage,
  }: ILocalStorageServiceArgs<FULL_STATE>) {
    this.id = `${appName}_${id}`;
    this.state = { version, data: initialState };
    this.initialState = initialState;
    this.storage = storage;

    this.init();
    this.alwaysReadFromLocalStorage = alwaysReadFromLocalStorage;
  }

  public get data() {
    if (this.alwaysReadFromLocalStorage) {
      this.init({ withEmitUpdate: false });
    }

    return this.state.data;
  }

  public get version() {
    return this.state.version;
  }

  /**
   * Сохраняет данные в localStorage.
   *  Данные можно сохранять из любого места (обработка actions в reducer, в thunk).
   *
   * @param data - полный срез данных
   *
   */
  public save = (data: Partial<FULL_STATE> | ((current: FULL_STATE) => undefined)) => {
    const currentDataString = JSON.stringify(this.data);
    const updatedData = JSON.parse(currentDataString) as FULL_STATE;

    if (typeof data === 'function') {
      data(updatedData);
    } else {
      Object.assign(updatedData, data);
    }

    const updatedDataString = JSON.stringify(updatedData);

    if (currentDataString !== updatedDataString) {
      this.state.data = updatedData;
      this.storage.setItem(this.id, JSON.stringify(this.state));
      this.emitUpdate();
    }
  };

  private readonly updateListeners = new Set<(data: FULL_STATE) => void>();

  /**
   * react-xук, позволяющий следить за текущим состоянием
   * вызывает ререндер компонента на каждый вызов метода LocalStorageService.prototype.save
   */
  public useWatch() {
    const [data, setData] = useState<FULL_STATE>(() => {
      return this.state.data;
    });

    useEffect(() => {
      const onChangeHandler = (data: FULL_STATE) => {
        setData(data);
      };

      this.updateListeners.add(onChangeHandler);

      return () => {
        this.updateListeners.delete(onChangeHandler);
      };
    }, []);

    return data;
  }

  /** Инициализация сервиса - получение данных из localStorage и сохранение их в this.state */
  private readonly init = ({ withEmitUpdate = true }: TInitParams = {}) => {
    const localStorageData = this.storage.getItem(this.id) ?? '{}';
    const parsedData = this.parseData(localStorageData) as TState<FULL_STATE>;

    if (this.isValidData(parsedData)) {
      this.state = parsedData;
    }

    if (withEmitUpdate) {
      this.emitUpdate();
    }
  };

  private readonly emitUpdate = () => {
    this.updateListeners.forEach((emit) => {
      emit(this.data);
    });
  };

  private readonly parseData = (jsonString: string) => {
    try {
      const data: unknown = JSON.parse(jsonString);

      return data;
    } catch {
      return this.initialState;
    }
  };

  private readonly isValidData = (data: any) => {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.data === 'object' &&
      data.data !== null &&
      data.version === this.version
    );
  };
}
