// Jest setup file for localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string): string | null {
      return store[key] || null;
    },

    setItem(key: string, value: string): void {
      store[key] = value.toString();
    },

    removeItem(key: string): void {
      delete store[key];
    },

    clear(): void {
      store = {};
    },

    get length(): number {
      return Object.keys(store).length;
    },

    key(index: number): string | null {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(global, 'confirm', {
  value: jest.fn(() => true)
});

Object.defineProperty(global, 'alert', {
  value: jest.fn()
});

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear();
});