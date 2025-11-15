# RPS Auth SDK

[![npm version](https://img.shields.io/npm/v/rps-auth-sdk.svg)](https://www.npmjs.com/package/rps-auth-sdk)
[![npm downloads](https://img.shields.io/npm/dm/rps-auth-sdk.svg)](https://www.npmjs.com/package/rps-auth-sdk)

A lightweight, local-first authentication SDK based on Random Prefix Security (RPS) — a verification mechanism that asks for partial prefixes of mnemonic-like tokens, preventing full credential exposure and dramatically reducing phishing & key leakage risks.

No backend required. No sensitive data stored remotely.
Ultra-light, ultra-secure, and designed for browsers & WebView apps.

🚀 Features
✅ Local-first Security

All generation, hashing, and verification runs inside the client.
No server, no API calls, no credential uploads.

✅ Mnemonic-style RPS System

Each “RPS passphrase” consists of words shaped like:

hat5l7 pigijw ban2c7 ...


Each word =
prefix (3 letters) + random noise (3 chars)
→ prevents real-word dictionary attacks.

✅ Partial Challenge Verification

Instead of asking for the full 12 words, RPS randomly challenges only e.g. 3 positions:

Please enter the prefixes for words: 2, 5, 9.


Users only submit the first 3 letters of each word.

✅ Zero Backtrace Exposure

Even if attacker grabs a user challenge,
they never receive the full key — only prefixes of random positions.

✅ Tiny SDK (3 KB minified)

Ultra-small, dependency-free, perfect for:

Web apps

WebView apps

Browser extensions

SPA frameworks

Electron apps

📦 Installation
Via <script> tag
<script src="dist/rps_core.min.js"></script>


After載入，SDK 自動掛在：

window.RpsCore

📘 Basic Usage
1. Generate a 12-word RPS mnemonic
const mnemonic = RpsCore.generateRandomMnemonic();
console.log(mnemonic);


Example output:

hat5l7 pigijw tigbpu jun28i dogw4v ...

2. Generate challenge indices
const indices = RpsCore.getRandomIndices(3, 12);
// e.g. [2, 5, 9]

3. Verify user input
const success = RpsCore.verifyRps({
  mnemonic,
  indices,
  inputs: ["hat", "jun", "ban"],  // user-entered prefixes
  prefixLength: 3
});

4. Hash mnemonic (optional storage)
const hash = await RpsCore.sha256WithSalt(mnemonic);


Use this to securely store the mnemonic hash (instead of plaintext).

📺 Demo

A live demo is included under:

demo/index.html


It demonstrates:

Random mnemonic generation

Challenge index generation

Dynamic input fields

Client-side verification

🧩 API Reference
RpsCore.generateRandomMnemonic(options?)
Option	Default	Description
wordList	internal preset	source words used to generate prefixes
wordCount	12	number of RPS words
prefixLength	3	letters taken from dictionary word
noiseLength	3	random noise added after prefix
RpsCore.getRandomIndices(count, max)

Returns count unique integers from 0 ~ max-1.

RpsCore.verifyRps({ mnemonic, indices, inputs, prefixLength })

Returns true / false
Used to verify user-entered prefixes.

RpsCore.sha256WithSalt(text, salt?)

Returns hex SHA-256 hash of text + salt.
Default salt: "quori-default"

🛡️ Security Model

RPS Auth 使用「部分前綴驗證」而非完整金鑰驗證，
因此即使攻擊者：

竊取表單輸入

竊取傳輸封包

看到挑戰 index

他也無法獲得完整助記詞，只能看到例如：

hat, jun, ban


不可能倒推出完整 RPS（含雜訊），極大提升安全性。

📂 Project Structure
rps-auth-sdk/
│
├── src/
│   └── rps_core.js
│
├── dist/
│   └── rps_core.min.js        ← production SDK
│
├── demo/
│   └── index.html             ← working demo
│
├── LICENSE
└── README.md

📄 License

MIT License

© 2025 — LENT

