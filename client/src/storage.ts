type ReadableStorage = Pick<Storage, "getItem"> &
  Partial<Pick<Storage, "setItem">>;

function legacyKey(key: string) {
  // Compatibility with settings and sessions saved before the rename.
  return key.replace(/^qubix:/, "quizhost:");
}

export function readStoredValue(storage: ReadableStorage, key: string) {
  const current = storage.getItem(key);
  if (current !== null) return current;
  const previous = storage.getItem(legacyKey(key));
  if (previous !== null) {
    try {
      storage.setItem?.(key, previous);
    } catch {
      // A readable preference still applies when browser writes are blocked.
    }
  }
  return previous;
}

export function removeStoredValue(
  storage: Pick<Storage, "removeItem">,
  key: string,
) {
  storage.removeItem(key);
  storage.removeItem(legacyKey(key));
}
