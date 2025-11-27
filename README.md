
[![npm version](https://img.shields.io/npm/v/rps-auth-sdk.svg)](https://www.npmjs.com/package/rps-auth-sdk)
[![npm downloads](https://img.shields.io/npm/dm/rps-auth-sdk.svg)](https://www.npmjs.com/package/rps-auth-sdk)
[![npm total downloads](https://img.shields.io/npm/dt/rps-auth-sdk.svg)](https://www.npmjs.com/package/rps-auth-sdk)

# RPS Auth SDK

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

RPS Auth uses partial prefix verification instead of full key verification.
This means that even if an attacker:

captures form inputs

intercepts network traffic

sees the challenged indices

they still cannot obtain the full mnemonic.

For example, even if they see:

hat, jun, ban


these are only 3-letter prefixes, not the full RPS words (which include random noise).

Because the system always challenges only partial prefixes from random positions, it is practically impossible to reconstruct the full RPS phrase (including noise), greatly increasing overall security.

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

## 🌈 Official RPS UI Pack

If you don’t want to design the UI from scratch, there are official, glass-styled UI components built on top of `rps-auth-sdk`:

- 🌐 **Web UI** – a standalone `<rps-verify>` style widget (HTML + JS)  
- ⚛ **React UI** – `<RpsVerifyReact />` component with `onSuccess` / `onFail`  
- 🌿 **Vue UI** – `<RpsVerifyVue />` SFC emitting `success` / `fail`  

All of them:

- Use the same Random Prefix Security (RPS) flow  
- Run fully on the client  
- Are styled with a modern glassmorphism card  

👉 Web UI: https://dumbell6.gumroad.com/l/waiqtv 

👉 React UI: https://dumbell6.gumroad.com/l/veftc  

👉 Vue UI: https://dumbell6.gumroad.com/l/tlsfq  

👉 **Full UI Bundle** (Web + React + Vue): https://dumbell6.gumroad.com/l/jyaxf

📄 License

MIT License

© 2025 — LENT





