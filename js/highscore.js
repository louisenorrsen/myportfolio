const MAX_HIGH_SCORES = 5;

function getStorageKey(gameName) {
  return `highScores_${gameName}`;
}

export function getHighScores(gameName) {
  const storedScores = localStorage.getItem(getStorageKey(gameName));

  if (!storedScores) {
    return [];
  }

  try {
    return JSON.parse(storedScores);
  } catch (error) {
    console.error(`Error parsing high scores for ${gameName}:`, error);
    return [];
  }
}

export function saveHighScores(gameName, score, lowerIsBetter = false) {
  const highScores = getHighScores(gameName);
  let date = new Date();
  let year = new Intl.DateTimeFormat('sv', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('sv', { month: '2-digit' }).format(date);
  let day = new Intl.DateTimeFormat('sv', { day: '2-digit' }).format(date);
  let hours = new Intl.DateTimeFormat('sv', { hour: '2-digit' }).format(date);
  let minutes = new Intl.DateTimeFormat('sv', { minute: '2-digit' }).format(date);
  
  highScores.push({
    score: score,
    date: `${year}-${month}-${day} ${hours}:${minutes}`
  });

  if (lowerIsBetter) {
    highScores.sort((a, b) => a.score - b.score);
  } else {
    highScores.sort((a, b) => b.score - a.score);
  }

  const topFive = highScores.slice(0, MAX_HIGH_SCORES);
  localStorage.setItem(getStorageKey(gameName), JSON.stringify(topFive));

  return topFive;
}
