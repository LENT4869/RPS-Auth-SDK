// rps_core.js
(function (global) {
  // 你的既有詞庫，可以之後改成外部傳入
  const defaultWordList = [
    "apple", "banana", "cat", "dog", "elephant", "fish", "grape", "hat", "ice", "jungle",
    "kite", "lion", "monkey", "nest", "orange", "pig", "queen", "rabbit", "sun", "tiger",
    "umbrella", "van", "whale", "xray", "yellow", "zebra"
  ];

  function generateRandomNoise(length = 3) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  function generateRandomMnemonic(options = {}) {
    const {
      wordList = defaultWordList,
      wordCount = 12,
      prefixLength = 3,
      noiseLength = 3,
    } = options;

    // 防呆：詞庫不能是空的
    if (!Array.isArray(wordList) || wordList.length === 0) {
      throw new Error('RpsCore.generateRandomMnemonic: wordList must contain at least 1 entry.');
    }

    const mnemonic = [];
    for (let i = 0; i < wordCount; i++) {
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      const prefix = word.slice(0, prefixLength);
      const noise = generateRandomNoise(noiseLength);
      mnemonic.push(prefix + noise);
    }
    return mnemonic.join(' ');
  }

  function getRandomIndices(count, max) {
    if (count > max) {
      throw new Error('RpsCore.getRandomIndices: count cannot be greater than max.');
    }
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max));
    }
    return [...indices].sort((a, b) => a - b);
  }

  async function sha256WithSalt(text, salt = 'quori-default') {
    const encoder = new TextEncoder();
    const data = encoder.encode(text + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * 驗證 RPS：
   * @param {Object} params
   * @param {string} params.mnemonic  12 組詞的字串（用空白分隔）
   * @param {number[]} params.indices 要驗證的索引陣列（例：[1,4,9]）
   * @param {string[]} params.inputs  對應輸入（例：["app", "mon", "sun"]）
   * @param {number} params.prefixLength  比對前幾碼（預設 3）
   * @returns {boolean} true = 通過驗證
   */
  function verifyRps({ mnemonic, indices, inputs, prefixLength = 3 }) {
    if (!mnemonic || !Array.isArray(indices) || !Array.isArray(inputs)) {
      return false;
    }

    const words = mnemonic.split(' ');
    if (words.length === 0) return false;
    if (indices.length !== inputs.length) return false;

    return indices.every((wordIndex, idx) => {
      const expected = (words[wordIndex] || "").slice(0, prefixLength).toLowerCase();
      const userInput = (inputs[idx] || "").trim().toLowerCase().slice(0, prefixLength);
      return userInput === expected;
    });
  }

  // 暴露給外部使用
  global.RpsCore = {
    defaultWordList,
    generateRandomNoise,
    generateRandomMnemonic,
    getRandomIndices,
    sha256WithSalt,
    verifyRps,
  };
})(typeof window !== 'undefined' ? window : globalThis);

