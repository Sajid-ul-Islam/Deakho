/**
 * DeakhoTV Telegram Bot Server (v3.0 Ultra)
 * Features:
 *  - Auto-register Telegram Commands (/start, /tv, /movies, /search, /help)
 *  - Persistent Bottom Chat Menu Button ("📺 Open Deakho")
 *  - Interactive Telegram Mini App Launcher
 *  - 1-Click Direct Channel & Movie Watch Buttons
 *  - Deep Linking Support (?startapp=channel_id)
 */

const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || '8731416393:AAHJIqhekPT7f0quhr2t-0GLO5wbt4gueYg';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://deakho.vercel.app';

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

// Auto-register Telegram Bot Commands & Persistent Menu Button
async function registerBotCommandsAndMenu() {
  try {
    // 1. Set commands list for bot autocomplete
    await apiRequest('setMyCommands', {
      commands: [
        { command: 'start', description: '🚀 Open Deakho Mini App' },
        { command: 'tv', description: '📺 Live TV Categories' },
        { command: 'movies', description: '🎬 Movies & VOD Catalog' },
        { command: 'search', description: '🔍 Search Channels & Movies' },
        { command: 'help', description: 'ℹ️ User Guide' },
      ],
    });

    // 2. Set persistent bottom Chat Menu Button (Open Mini App button in chat input)
    await apiRequest('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '📺 Open Deakho',
        web_app: { url: WEBAPP_URL },
      },
    });

    console.log('✅ Bot Commands & Persistent WebApp Menu Button Registered Successfully!');
  } catch (e) {
    console.error('Failed to register bot commands:', e.message);
  }
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
        } else if (update.callback_query) {
          handleCallback(update.callback_query);
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
  const text = (msg.text || '').trim();
  const firstName = msg.from.first_name || 'Friend';

  console.log(`[Message from ${firstName}]: ${text}`);

  // /start command
  if (text.startsWith('/start')) {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `👋 <b>Welcome to Deakho Bot</b>, ${firstName}!\n\n📺 <b>Watch 30+ Live TV Channels & 100+ Movies</b> directly inside Telegram!\n\n<b>Features Available:</b>\n• 🇧🇩 Bangladeshi Live TV\n• 📰 World News (Al Jazeera, CNN, BBC, TRT World)\n• ⚽ Sports HD (T-Sports, CrazeTV)\n• 🎈 Kids & Cartoons (Cartoon Network, Tom & Jerry)\n• 🎬 100+ Movies & Instant Scraper\n• 📺📺 Dual & Quad Screen Split View Mode\n\nClick the button below to launch:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Open Deakho Mini App',
              web_app: { url: WEBAPP_URL },
            },
          ],
          [
            { text: '📺 Category Menu', callback_data: 'menu_categories' },
            { text: '🎬 Browse Movies', callback_data: 'menu_movies' },
          ],
          [
            { text: '🔍 How to Search', callback_data: 'menu_search_info' },
            { text: '🌐 Open in Browser', url: WEBAPP_URL },
          ],
        ],
      },
    });
  }
  // /categories or /tv
  else if (text.startsWith('/categories') || text.startsWith('/tv')) {
    await sendCategoriesMenu(chatId);
  }
  // /movies
  else if (text.startsWith('/movies')) {
    await sendMoviesMenu(chatId);
  }
  // /search <query>
  else if (text.startsWith('/search')) {
    const query = text.replace('/search', '').trim();
    if (!query) {
      await apiRequest('sendMessage', {
        chat_id: chatId,
        text: `🔍 <b>How to Search:</b>\n\nSend <code>/search &lt;name&gt;</code> to find channels or movies.\n\n<b>Example:</b> <code>/search Al Jazeera</code> or <code>/search Godfather</code>`,
        parse_mode: 'HTML',
      });
    } else {
      await apiRequest('sendMessage', {
        chat_id: chatId,
        text: `🔎 <b>Search Results for "${query}"</b>\n\nClick below to stream directly inside Telegram:`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `▶️ Stream "${query}" in Deakho`,
                web_app: { url: `${WEBAPP_URL}?startapp=${encodeURIComponent(query)}` },
              },
            ],
          ],
        },
      });
    }
  }
  // /help command
  else if (text.startsWith('/help')) {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `ℹ️ <b>Deakho Bot Commands Guide</b>\n\n/start - Main menu & App Launcher\n/tv - Browse Live TV Categories\n/movies - Browse On-Demand Movie Catalog\n/search &lt;query&gt; - Search channels & movies\n/help - Show this guide`,
      parse_mode: 'HTML',
    });
  }
  // Fallback response
  else {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `🤖 Hi ${firstName}! Use the button below or send /start to launch Deakho:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📺 Open Deakho App',
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      },
    });
  }
}

async function handleCallback(cb) {
  const chatId = cb.message.chat.id;
  const data = cb.data;

  await apiRequest('answerCallbackQuery', { callback_query_id: cb.id });

  if (data === 'menu_categories') {
    await sendCategoriesMenu(chatId);
  } else if (data === 'menu_movies') {
    await sendMoviesMenu(chatId);
  } else if (data === 'menu_search_info') {
    await apiRequest('sendMessage', {
      chat_id: chatId,
      text: `🔍 <b>Search Feature:</b>\n\nSend <code>/search &lt;name&gt;</code> to search any channel or movie instantly!`,
      parse_mode: 'HTML',
    });
  }
}

async function sendCategoriesMenu(chatId) {
  await apiRequest('sendMessage', {
    chat_id: chatId,
    text: `📺 <b>Select a Channel Category to Stream:</b>`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇧🇩 Bangladeshi TV', web_app: { url: `${WEBAPP_URL}?group=Bangladeshi` } },
          { text: '📰 World News', web_app: { url: `${WEBAPP_URL}?group=News` } },
        ],
        [
          { text: '⚽ Sports HD', web_app: { url: `${WEBAPP_URL}?group=Sports` } },
          { text: '🎈 Kids & Cartoons', web_app: { url: `${WEBAPP_URL}?group=Kids` } },
        ],
        [
          { text: '🎬 Movies & VOD', web_app: { url: `${WEBAPP_URL}?mode=movies` } },
          { text: '🔞 18+ Adult (Alert Active)', web_app: { url: `${WEBAPP_URL}?group=18%2B%20Adult` } },
        ],
      ],
    },
  });
}

async function sendMoviesMenu(chatId) {
  await apiRequest('sendMessage', {
    chat_id: chatId,
    text: `🎬 <b>Top On-Demand Movies Collection</b>\n\n• The Godfather (1972) - ⭐ 9.2\n• The Shawshank Redemption - ⭐ 9.3\n• Pather Panchali - ⭐ 8.5\n• Interstellar (2014) - ⭐ 8.7\n• Inception (2010) - ⭐ 8.8\n• Spirited Away (2001) - ⭐ 8.6\n• Monpura (2009) - ⭐ 8.4\n• Hawa (2022) - ⭐ 8.0\n\nClick below to stream in Cinema Mode:`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🍿 Open Movie Cinema Hub',
            web_app: { url: `${WEBAPP_URL}?mode=movies` },
          },
        ],
      ],
    },
  });
}

async function main() {
  console.log('🤖 Deakho Telegram Bot Server Starting...');
  console.log(`🌐 WebApp URL: ${WEBAPP_URL}`);

  // Register commands & menu button with Telegram API
  await registerBotCommandsAndMenu();

  console.log('⚡ Bot Polling Active!');
  pollUpdates();
}

main();
