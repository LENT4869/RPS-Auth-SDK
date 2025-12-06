// app.js
// 這裡使用你 rps_core.js 提供的全域變數 window.RpsCore

window.RpsDemo = {
  // 是否已設定詞組
  hasMnemonic() {
    return !!localStorage.getItem("rps_words");
  },

  // 儲存詞組
  saveMnemonic(words) {
    localStorage.setItem("rps_words", JSON.stringify(words));
  },

  // 讀取詞組
  loadMnemonic() {
    return JSON.parse(localStorage.getItem("rps_words") || "[]");
  },

  // 產生 12 組助記詞
  generateMnemonic() {
    // 你的 rps_core.js 回傳字串，因此要 split
    const text = RpsCore.generateRandomMnemonic({
      wordCount: 12
    });
    return text.split(" ");
  },

  // 取得 3 個隨機 index
  getRandomIndices() {
    return RpsCore.getRandomIndices(3, 12);
  },

  // 驗證輸入
  verifyUserInput(words, indices, inputs) {
    // 你的 verifyRps 接收 mnemonic（字串）
    const mnemonic = words.join(" ");

    return RpsCore.verifyRps({
      mnemonic,
      indices,
      inputs,
      prefixLength: 3
    });
  }
};
