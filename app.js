const movies = [
  "Avengers",
  "Captain America: The First Avenger",
  "Iron Man",
  "Iron Man 2",
  "Iron Man 3",
  "Thor",
  "Thor: The Dark World",
  "Captain America: The Winter Soldier",
  "Ant-Man",
  "Avengers: Age of Ultron"
];

const ranker = new PairwiseRanker(movies);
const choice1Btn = document.getElementById('choice1');
const choice2Btn = document.getElementById('choice2');
const progressBar = document.getElementById('progress');
const resultsDiv = document.getElementById('results');
const comparisonDiv = document.getElementById('comparison');

function showNextPair() {
  const pair = ranker.getNextPair();
  if (!pair) {
    showResults();
    return;
  }
  choice1Btn.textContent = pair[0];
  choice2Btn.textContent = pair[1];
  updateProgress();
}

function updateProgress() {
  const progress = ranker.getProgress();
  progressBar.textContent = `${progress.percent}%`;
  progressBar.style.width = `${progress.percent}%`;
}

function showResults() {
  comparisonDiv.style.display = 'none';
  resultsDiv.style.display = 'block';
  const rankings = ranker.getRankings();
  let html = '<h2>Your Ranking Results:</h2>';
  rankings.forEach((item, index) => {
    html += `<div class="rank-item">${index + 1}. ${item}</div>`;
  });
  resultsDiv.innerHTML = html;
}

choice1Btn.addEventListener('click', () => {
  ranker.recordChoice(choice1Btn.textContent);
  showNextPair();
});

choice2Btn.addEventListener('click', () => {
  ranker.recordChoice(choice2Btn.textContent);
  showNextPair();
});

showNextPair();