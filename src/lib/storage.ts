// Simple localStorage persistence layer
export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`bedford-${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`bedford-${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}
