/**
 * DeakhoTV Telegram Bot Server
 * Lightweight Telegram Bot supporting WebApp Mini App launcher, /start, /tv, and /search!
 * 
 * Usage:
 *   1. Create a bot with @BotFather on Telegram to get your BOT_TOKEN.
 *   2. Set your BOT_TOKEN and WEBAPP_URL below (or via environment variables).
 *   3. Run: node bot.js
 */

const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://deakho-tv.vercel.app'; // Replace with your hosted Vercel / Netlify URL

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

function apiRequest(method, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(`${API_BASE}/${method}`, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

let lastUpdateId = 0;

async function pollUpdates() {
  try {
    const res = await apiRequest('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 30,
    });

    if (res.ok && res.result) {
      for (const update of res.result) {
        lastUpdateId = update.update_id;
        if (update.message) {
          handleMessage(update.message);
        }
      }
    }
  } catch (e) {
    console.error('Polling error:', e.message);
  }

  setTimeout(pollUpdates, 1000);
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const firstName = msg.from.first_name || 'Friend';

  console.log(`[Message from ${firstName}]: ${text}`);

  if (text.startsWith('/start')) {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `👋 Hello ${firstName}!\n\nWelcome to *DeakhoTV* - Your Ultra HD Live TV & VOD Movie Hub!\n\nClick the button below to launch DeakhoTV directly inside Telegram.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📺 Open DeakhoTV Mini App',
              web_app: { url: WEBAPP_URL },
            },
          ],
          [
            { text: '🌐 Open in Browser', url: WEBAPP_URL },
          ],
        ],
      },
    });
  } else if (text.startsWith('/tv')) {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `📺 *DeakhoTV Channel Guide*\n\n• Bangladeshi: Sony AATH, Jamuna TV, Independent TV, Ekattor TV, Shomoy TV\n• World News: Al Jazeera, CNN, BBC, TRT World, Sky News\n• Kids: Cartoon Network, Tom & Jerry, Duronto TV\n• Movies: 100+ Global Masterpieces\n\nClick below to start watching!`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '▶️ Watch Live Channels Now',
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      },
    });
  } else {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `🤖 Hi ${firstName}, send /start to launch the DeakhoTV Mini App!`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📺 Launch DeakhoTV',
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      },
    });
  }
}

console.log('🤖 DeakhoTV Telegram Bot Server Started...');
console.log(`🌐 WebApp URL: ${WEBAPP_URL}`);
console.log('⚡ Waiting for Telegram updates...');
pollUpdates();
