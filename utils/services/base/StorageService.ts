class StorageService {
  /**
   * Save data to localStorage
   * @param key - The key to store the data under
   * @param value - The value to store (any type, will be converted to JSON)
   */
  static set<T>(key: string, value: T): void {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  }

  /**
   * Retrieve data from localStorage
   * @param key - The key to retrieve the data from
   * @returns The parsed value or null if not found
   */
  static get<T>(key: string): string | null {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   * @param key - The key to remove
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  }
}

export default StorageService;
