function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function normalize(str) {
  return str.replace(/^to\s+/, '').trim()
}

function getThreshold(len) {
  if (len <= 3) return 0
  if (len <= 7) return 1
  return 2
}

function isCloseEnough(guess, answer) {
  const g = normalize(guess).toLowerCase()
  const a = normalize(answer).toLowerCase()
  const threshold = getThreshold(a.length)
  return levenshtein(g, a) <= threshold
}

module.exports = { isCloseEnough }
