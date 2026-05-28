/**
 * User-specific local storage wrappers for the simulator state
 */

export const getUserStorageKey = (userId) => {
  if (!userId) return "amt-dist-simulator-state";
  return `amt-dist-simulator-state-${userId}`;
};

/**
 * Saves user state to localStorage.
 * @param {string} userId 
 * @param {object} data 
 */
export const saveUserState = (userId, data) => {
  if (!userId) return;
  try {
    const key = getUserStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving user state to localStorage:", error);
  }
};

/**
 * Loads user state from localStorage.
 * @param {string} userId 
 * @returns {object|null}
 */
export const loadUserState = (userId) => {
  if (!userId) return null;
  try {
    const key = getUserStorageKey(userId);
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error loading user state from localStorage:", error);
    return null;
  }
};

/**
 * Clears user state from localStorage.
 * @param {string} userId 
 */
export const clearUserState = (userId) => {
  if (!userId) return;
  try {
    const key = getUserStorageKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing user state from localStorage:", error);
  }
};
