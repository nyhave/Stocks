function showHistory(history) {
  console.log('\n===== Portfolio History =====');
  const max = Math.max(...history);
  history.slice(-10).forEach((value, index) => {
    const barLength = max ? Math.floor((value / max) * 40) : 0;
    const bar = '*'.repeat(barLength);
    console.log(`Day ${String(index + 1).padStart(2, ' ')}: ${bar} ($${value.toFixed(2)})`);
  });
  console.log();
}

module.exports = { showHistory };
