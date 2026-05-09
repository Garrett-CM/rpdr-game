// Data management utilities for the app

const TEAMS_STORAGE_KEY = 'dragRaceTeams';

/**
 * Save teams to localStorage
 */
export const saveTeams = (teams) => {
  try {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
    return true;
  } catch (error) {
    console.error('Error saving teams:', error);
    return false;
  }
};

/**
 * Load teams from localStorage
 */
export const loadTeams = () => {
  try {
    const stored = localStorage.getItem(TEAMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading teams:', error);
    return [];
  }
};

/**
 * Clear all teams from localStorage
 */
export const clearTeams = () => {
  try {
    localStorage.removeItem(TEAMS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing teams:', error);
    return false;
  }
};

/**
 * Export teams as JSON file
 */
export const exportTeamsAsJSON = (teams) => {
  const dataStr = JSON.stringify(teams, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `drag-race-teams-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Import teams from JSON file
 */
export const importTeamsFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const teams = JSON.parse(e.target.result);
        if (Array.isArray(teams)) {
          resolve(teams);
        } else {
          reject(new Error('Invalid teams format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};