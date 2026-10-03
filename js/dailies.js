function getStorageKey(gameName, level) {
  return `dailies_${gameName}_${level}`;
}

function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getStoredResult(gameName, level) {
    const storedProgress = localStorage.getItem(getStorageKey(gameName, level));

    if (!storedProgress) {
        return null;
    }

    try {
        return JSON.parse(storedProgress);
    } catch {
        return null;
    }
}

export function getDailyProgress(gameName, level) {
    const result = getStoredResult(gameName, level);

    if (!result || result.date !== getTodayDate()) {
        return 0;
    }

    return result.progress;
}

export function hasPlayedToday(gameName, level) {
    return getDailyProgress(gameName, level) > 0;
}

export function saveDailyProgress(gameName, level, progress) {
    const today = getTodayDate();
    const storedResult = getStoredResult(gameName, level);

    let bestProgress = progress;

    if (storedResult && storedResult.date === today) {
        bestProgress = Math.max(
            storedResult.progress,
            progress
        );
    }

    const result = {
        date: today,
        progress: bestProgress
    };

    localStorage.setItem(
        getStorageKey(gameName, level),
        JSON.stringify(result)
    );

    return bestProgress;
}