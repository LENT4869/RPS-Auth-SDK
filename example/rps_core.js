// rps_core.js
(function (global) {
  'use strict';

  // Default word list
  const defaultWordList = [
    "apple", "banana", "cat", "dog", "elephant", "fish", "grape", "hat", "ice", "jungle",
    "kite", "lion", "monkey", "nest", "orange", "pig", "queen", "rabbit", "sun", "tiger",
    "umbrella", "van", "whale", "xray", "yellow", "zebra"
  ];

  // Shared default configuration
  const defaultConfig = {
    wordList: defaultWordList,
    wordCount: 12,
    prefixLength: 3,
    noiseLength: 3,
    salt: 'quori-default',
  };

  /**
   * Generate random noise characters (used after the prefix)
   */
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
   * Generate an RPS mnemonic
   * @param {Object} options
   * @param {string[]} [options.wordList=defaultWordList] - Source dictionary
   * @param {number} [options.wordCount=12] - Total number of words
   * @param {number} [options.prefixLength=3] - Prefix length taken from dictionary words
   * @param {number} [options.noiseLength=3] - Random noise length appended after prefix
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
   * Get unique random indices
   * @param {number} count - How many indices to pick
   * @param {number} max - Maximum word count (e.g. 12)
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
   * SHA-256 hashing with optional salt
   * @param {string} text
   * @param {string} [salt='quori-default']
   * @returns {Promise<string>} Hex string hash
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
   * Verify RPS prefixes
   * @param {Object} params
   * @param {string} params.mnemonic - Space-separated RPS words
   * @param {number[]} params.indices - Challenge indices
   * @param {string[]} params.inputs - User-entered prefixes
   * @param {number} [params.prefixLength=3] - Number of characters to verify
   * @returns {boolean} true if verification passes
   */
  function verifyRps({ mnemonic, indices, inputs, prefixLength = defaultConfig.prefixLength }) {

    if (!mnemonic || typeof mnemonic !== 'string') {
      throw new Error("verifyRps: mnemonic must be an array or space-separated string.");
    }
    if (!Array.isArray(indices) || !Array.isArray(inputs)) {
      return false;
    }
    if (!Number.isInteger(prefixLength) || prefixLength <= 0) {
      return false;
    }

    const words = mnemonic.split(' ').filter(Boolean);
    if (words.length === 0) return false;

    // Error if prefixLength is longer than any mnemonic word
    for (const word of words) {
      if (prefixLength > word.length) {
        throw new Error("verifyRps: prefixLength is larger than word length.");
      }
    }

    // Indices length must match inputs length
    if (indices.length !== inputs.length) {
      throw new Error("verifyRps: indices length does not match inputs length.");
    }

    // Prefix comparison
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

  // Node / bundlers
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RpsCore;
  }
  // Browser global
  if (global) {
    global.RpsCore = RpsCore;
  }

})(typeof window !== 'undefined' ? window : globalThis);
