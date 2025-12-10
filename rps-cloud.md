RPS Cloud API

RPS Cloud is a hosted verification service for apps that use an RPS-style mnemonic lock.

Instead of storing verification logic and hashes inside your own app or front-end, you can offload it to this HTTPS API:

Generate a 12-word random code

Store only a salted hash

Verify user input via /verify

Track credits and usage

Keep your app lightweight & secure

Designed for RPS-style security systems (like Quori), but usable in any standalone project.

----------------------------------------------------------------------------------------------

🌐 Base URL

https://rps-cloud.rps-cloud.workers.dev

Auth header (required for all private endpoints):

x-api-key: YOUR_API_KEY

----------------------------------------------------------------------------------------------

🛒 How to Get an API Key

There are two ways to obtain an API key.

1. Free Testing Key
POST /register


Provides a free key with 100 credits.
Recommended for testing & development, not production.

2. Paid Key (Recommended for Production)

Purchase credits from Gumroad:

👉 https://dumbell6.gumroad.com/l/laagrc

📩 After purchasing, please email:

Your Gumroad receipt / Order ID

The email address where you want the API key delivered

Send to:

dum2184110@gmail.com


Your API key will be manually delivered for accuracy and security.
(This is intentional for the initial SaaS version.)

🔁 Repeated Purchases

Every purchase on Gumroad always generates a new API key.

There is no merging or recharging of previous keys

Each purchase is treated as a separate, independent API key

If you buy again in the future, you will simply receive another new API key.

This ensures clean usage tracking and predictable billing

----------------------------------------------------------------------------------------------

🧮 Credits System

Endpoint	Cost
/generate	free
/verify	1 credit
/usage	free

When credits reach 0, /verify returns:

402 Payment Required
{ "error": "Insufficient credits" }

----------------------------------------------------------------------------------------------

📡 API Endpoints
1. GET /generate

Generates a new 12-word mnemonic and stores a salted hash in the server.

Example
curl -X GET https://rps-cloud.rps-cloud.workers.dev/generate \
  -H "x-api-key: YOUR_API_KEY"

Response
{
  "mnemonic": ["abc123", "k9d4f2", "...12 words"],
  "hash": "f5d1b5b6..."
}

2. POST /verify

Verifies the mnemonic.
Consumes 1 credit.

Example
curl -X POST https://rps-cloud.rps-cloud.workers.dev/verify \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "words": ["abc123", "...12 words"] }'

Response
{
  "valid": true,
  "remaining_credits": 1999
}

3. GET /usage

Check usage stats and remaining credits.

curl -X GET https://rps-cloud.rps-cloud.workers.dev/usage \
  -H "x-api-key: YOUR_API_KEY"

----------------------------------------------------------------------------------------------

🔐 Authentication

Every protected endpoint requires:

x-api-key: YOUR_API_KEY


Errors:

Status	Meaning
401	Missing or invalid API key
402	Not enough credits for verify
404	Unknown endpoint

----------------------------------------------------------------------------------------------

⚠️ Error Codes
Status	Description
400	malformed JSON, wrong data shape
401	invalid / missing API key
402	insufficient credits
404	endpoint not found
500	internal server error

----------------------------------------------------------------------------------------------

🧱 Implementation Details

RPS Cloud is built on Cloudflare Workers + KV Storage.

Stored per API key:

salt

hash

credits

plan

email

email_sent

created_at

⚠️ The original 12-word mnemonic is never stored — only the salted hash.

----------------------------------------------------------------------------------------------

🆘 Support / Purchase Verification

If you:

Purchased but didn’t receive your key

Want to upgrade credits

Want to top-up an existing key

Need integration help

Please email:

📩 dum2184110@gmail.com

Include:

Gumroad order ID

Delivery email

(Optional) existing API key

----------------------------------------------------------------------------------------------

🚀 Production Use Cases

RPS Cloud is perfect for:

Secure browser systems 

Developer tools requiring proof-of-knowledge

Unlock flows where mnemonics must NOT be stored locally

Cloud-based verification for high-security workflows