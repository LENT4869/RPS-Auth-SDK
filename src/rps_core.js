// rps_core.js
(function (global) {
  'use strict';

  // 預設詞庫
  const defaultWordList = [
    "apple", "banana", "cat", "dog", "elephant", "fish", "grape", "hat", "ice", "jungle",
    "kite", "lion", "monkey", "nest", "orange", "pig", "queen", "rabbit", "sun", "tiger",
    "umbrella", "van", "whale", "xray", "yellow", "zebra"
  ];

  // 共用預設設定
  const defaultConfig = {
    wordList: defaultWordList,
    wordCount: 12,
    prefixLength: 3,
    noiseLength: 3,
    salt: 'quori-default',
  };

  function generateRandomNoise(length = 3) {
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error('RpsCore.generateRandomNoise: length must be a positive integer.');
    }
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  /**
   * 產生 RPS 助記詞
   * @param {Object} options
   * @param {string[]} [options.wordList=defaultWordList] 詞庫
   * @param {number} [options.wordCount=12] 助記詞個數
   * @param {number} [options.prefixLength=3] 前綴長度（真實英文字取幾碼）
   * @param {number} [options.noiseLength=3] 雜訊長度
   */
  function generateRandomMnemonic(options = {}) {
    const {
      wordList = defaultConfig.wordList,
      wordCount = defaultConfig.wordCount,
      prefixLength = defaultConfig.prefixLength,
      noiseLength = defaultConfig.noiseLength,
    } = options;

    if (!Array.isArray(wordList) || wordList.length === 0) {
      throw new Error('RpsCore.generateRandomMnemonic: wordList must contain at least 1 entry.');
    }
    if (!Number.isInteger(wordCount) || wordCount <= 0) {
      throw new Error('RpsCore.generateRandomMnemonic: wordCount must be a positive integer.');
    }
    if (!Number.isInteger(prefixLength) || prefixLength <= 0) {
      throw new Error('RpsCore.generateRandomMnemonic: prefixLength must be a positive integer.');
    }
    if (!Number.isInteger(noiseLength) || noiseLength < 0) {
      throw new Error('RpsCore.generateRandomMnemonic: noiseLength must be a non-negative integer.');
    }

    const mnemonic = [];
    for (let i = 0; i < wordCount; i++) {
      const word = wordList[Math.floor(Math.random() * wordList.length)] || '';
      const prefix = word.slice(0, prefixLength);
      const noise = generateRandomNoise(noiseLength);
      mnemonic.push(prefix + noise);
    }
    return mnemonic.join(' ');
  }

  /**
   * 取得不重複的隨機索引
   * @param {number} count 要抽幾個
   * @param {number} max   總長度（例如 12）
   */
  function getRandomIndices(count, max) {
    if (!Number.isInteger(count) || !Number.isInteger(max) || count <= 0 || max <= 0) {
      throw new Error('RpsCore.getRandomIndices: count and max must be positive integers.');
    }
    if (count > max) {
      throw new Error('RpsCore.getRandomIndices: count cannot be greater than max.');
    }
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max));
    }
    return [...indices].sort((a, b) => a - b);
  }

  /**
   * SHA-256 + salt
   * @param {string} text
   * @param {string} [salt='quori-default']
   * @returns {Promise<string>} hex 字串
   */
  async function sha256WithSalt(text, salt = defaultConfig.salt) {
    if (typeof text !== 'string') {
      throw new Error('RpsCore.sha256WithSalt: text must be a string.');
    }
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
   * @param {string} params.mnemonic  助記詞字串（空白分隔）
   * @param {number[]} params.indices 要驗證的索引陣列（例：[1,4,9]）
   * @param {string[]} params.inputs  對應輸入（例：["app", "mon", "sun"]）
   * @param {number} [params.prefixLength=3] 比對前幾碼
   * @returns {boolean} true = 通過驗證
   */
  function verifyRps({ mnemonic, indices, inputs, prefixLength = defaultConfig.prefixLength }) {
    if (!mnemonic || typeof mnemonic !== 'string') {
      return false;
    }
    if (!Array.isArray(indices) || !Array.isArray(inputs)) {
      return false;
    }
    if (!Number.isInteger(prefixLength) || prefixLength <= 0) {
      return false;
    }

    const words = mnemonic.split(' ').filter(Boolean);
    if (words.length === 0) return false;
    if (indices.length !== inputs.length) return false;

    return indices.every((wordIndex, idx) => {
      const expected = (words[wordIndex] || '')
        .slice(0, prefixLength)
        .toLowerCase();
      const userInput = (inputs[idx] || '')
        .trim()
        .toLowerCase()
        .slice(0, prefixLength);
      return userInput === expected;
    });
  }

  const RpsCore = {
    defaultWordList,
    defaultConfig,
    generateRandomNoise,
    generateRandomMnemonic,
    getRandomIndices,
    sha256WithSalt,
    verifyRps,
  };

  // Node / bundler
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RpsCore;
  }
  // Browser global
  if (global) {
    global.RpsCore = RpsCore;
  }

})(typeof window !== 'undefined' ? window : globalThis);
