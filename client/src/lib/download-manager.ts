
// A mock download manager to simulate filesystem operations in the browser

export const DownloadManager = {
  isAdventureDownloaded: (id: string): boolean => {
    return !!localStorage.getItem(`adventure_${id}_downloaded`);
  },

  getLocalVersion: (id: string): number => {
    const ver = localStorage.getItem(`adventure_${id}_version`);
    return ver ? parseInt(ver, 10) : 0;
  },

  saveLocalVersion: (id: string, version: number) => {
    localStorage.setItem(`adventure_${id}_version`, version.toString());
    localStorage.setItem(`adventure_${id}_downloaded`, "true");
  },

  // Simulate removing the "files"
  deleteAdventure: (id: string) => {
    localStorage.removeItem(`adventure_${id}_downloaded`);
    localStorage.removeItem(`adventure_${id}_version`);
  },

  // Mock download process
  // In a real app this would use RNFS/fetch to download files
  downloadAdventure: async (
    url: string, 
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        
        onProgress(progress);
        
        if (progress === 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Fast download simulation
    });
  }
};
