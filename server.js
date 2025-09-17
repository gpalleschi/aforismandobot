import {Telegraf} from 'telegraf';
import cron from 'node-cron';
import fs from 'fs';
import {message} from 'telegraf/filters';
import * as Constants from './src/constants.js';
import fetch from 'node-fetch';
import sharp from 'sharp';

const API_TOKEN = process.env.BOT_TOKEN || '';
const fileChatIds = 'chat_ids.json';

// File dove salvi gli utenti
const userFile = 'users.json';
let users = [];

// Carica utenti se esistono
if (fs.existsSync(userFile)) {
  users = JSON.parse(fs.readFileSync(userFile));
}

if (!API_TOKEN) {
    console.error(
        'Seems like you forgot to pass Telegram Bot Token. I can not proceed...'
    );
    process.exit(1);
}

const bot = new Telegraf(API_TOKEN);

console.log('Service started ' + Constants.VERSION);

let language = 'it';

const getInfo = async (quote_language) => {
    let response = await fetch(Constants.URLINFOAPI + quote_language);
    language = quote_language;

    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error('Error in ' + Constants.URLINFOAPI + quote_language);
    }
}

const getInfoByLanguage = async (quote_language) => {
    language = quote_language;
    try {
        const ret = await getInfo(quote_language);
        if (quote_language === 'it') {
            return `Totale aforismi caricati : ${ret.quotes} di ${ret.authors} autori.\n`;
        } else if (quote_language === 'en') {
            return `Total quotes loaded : ${ret.quotes} of ${ret.authors} authors.\n`;
        } else {
            return `Total aforismos almacenado : ${ret.quotes} de ${ret.authors} autores.\n`;
        }
    } catch (error) {
        return error.message;
    }
}

const getQuoteImg = async (quote_language) => {
    language = quote_language;
    const response = await fetch(
        Constants.URLQUOTEIMGAPI + quote_language
    );
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Error fetching image quote');
    }
}

const getQuote = async (quote_language) => {
    language = quote_language;
    const response = await fetch(Constants.URLQUOTEAPI + quote_language);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Error fetching quote');
    }
}

const getQuotesByLanguage = async (quote_language) => {
    language = quote_language;
    try {
        const ret = await getQuote(quote_language);
        return `“${ret.quote}”\n\n${ret.author}\n`;
    } catch (error) {
        return error.message;
    }
}

const getQuotesImgByLanguage = async (quote_language) => {
    language = quote_language;
    try {
        const ret = await getQuoteImg(quote_language);
        return {"msg": "No Error", "url": ret.url, "quote": ret.quote, "author": ret.author, "width" : ret.width, "height" : ret.height};
    } catch (error) {
        return {"msg": "Error in getQuotesImgByLanguage"};
    }
}

// 📜 Comandi
bot.start((ctx) => {
    ctx.reply(Constants.HELP_TEXT[language])
});
bot.command('aiuto', (ctx) => {
    language = 'it';
    ctx.reply(Constants.HELP_TEXT['it']);
});
bot.command('ayuda', (ctx) => {
    language = 'es';
    ctx.reply(Constants.HELP_TEXT['es']);
});
bot.command('help', (ctx) => {
    language = 'en';
    ctx.reply(Constants.HELP_TEXT['en']);
});
bot.command('aforismi', async (ctx) => {
    let res = await getInfoByLanguage('it');
    ctx.reply(res);
});
bot.command('aforismos', async (ctx) => {
    let res = await getInfoByLanguage('es');
    ctx.reply(res);
});
bot.command('quotes', async (ctx) => {
    let res = await getInfoByLanguage('en');
    ctx.reply(res);
});
bot.command('version', (ctx) => ctx.reply(Constants.VERSION));
bot.command('versione', (ctx) => ctx.reply(Constants.VERSION));


// === GESTIONE FILE ===

async function getChatIds() {
  if (!fs.existsSync(fileChatIds)) return [];
  const data = await fs.readFileSync(fileChatIds);
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : []; // ✅ Verifica che sia un array
}

async function saveChatIds(chatIds) {
   await fs.writeFile(fileChatIds, JSON.stringify(chatIds, null, 2), (err) => {
     if (err) console.error('Errore salvataggio:', err);
   });
}

// === COMANDI ===

async function sendQuote(ctx, lang) {
  const chatId = ctx.chat.id;
  let chatIds = await getChatIds();
  const exists = chatIds.some(entry => (entry.chatId === chatId && entry.lang === lang));
  if (!exists) {
    chatIds.push({ chatId, lang });
    // chatIds.push({"chatId": chatId, "lang": lang});
    await saveChatIds(chatIds);
    var msgToDisplay = "";
    if ( lang === 'it' ) {
        msgToDisplay = Constants.MSGALREADYSUBIT;
    } else if ( lang === 'es' ) {
        msgToDisplay = Constants.MSGALREADYSUBES;
    } else {
        msgToDisplay = Constants.MSGALREADYSUBEN;
    }
    ctx.reply(msgToDisplay);
    // console.log(`Iscritto: ${chatId}`);
  } else {
    ctx.reply('ℹ️ You are already subscribed.');
  }   
}

async function checkQuote(ctx, lang) {
  var msgToDisplay = "";
  const chatId = ctx.chat.id;
  const chatIds = await getChatIds();
//   console.log(typeof chatId, chatId); // dovrebbe stampare "number 398282569"
//   console.log(typeof lang, lang);     // dovrebbe stampare "string 'en'"
//   console.log(`Check for ${chatId} and language ${lang}:`)
  const entry = chatIds.find(entry => (Number(entry.chatId) === Number(chatId) && String(entry.lang) === String(lang)));
//   console.log(chatIds);
//   console.log(chatIds.find(entry => entry.chatId == chatId && entry.lang == lang)); // prova con == per test
  if ( entry ) {
    if ( lang === 'it' ) {
        msgToDisplay = Constants.MSGSUBIT;
    } else if ( lang === 'es' ) {
        msgToDisplay = Constants.MSGSUBES;
    } else {
        msgToDisplay = Constants.MSGSUBEN;
    }
    ctx.reply(msgToDisplay);
  } else {
    if ( lang === 'it' ) {
        msgToDisplay = Constants.MSGNOSUBIT;
    } else if ( lang === 'es' ) {
        msgToDisplay = Constants.MSGNOSUBES;
    } else {
        msgToDisplay = Constants.MSGNOSUBEN;
    }
    ctx.reply(msgToDisplay);
  }
}

async function delQuote(ctx, lang) {
  var msgToDisplay = "";
  const chatId = ctx.chat.id;
  let chatIds = await getChatIds();
  const newChatIds = chatIds.filter(entry => !(entry.chatId === chatId && entry.lang === lang));
  if (newChatIds.length !== chatIds.length) {
    await saveChatIds(newChatIds);
    if ( lang === 'it' ) {
        msgToDisplay = Constants.MSGUNSUBIT;
    } else if ( lang === 'es' ) {
        msgToDisplay = Constants.MSGUNSUBES;
    } else {
        msgToDisplay = Constants.MSGUNSUBEN;
    }
    ctx.reply(msgToDisplay);
  } else {
    if ( lang === 'it' ) {
        msgToDisplay = Constants.MSGNOSUBIT;
    } else if ( lang === 'es' ) {
        msgToDisplay = Constants.MSGNOSUBES;
    } else {
        msgToDisplay = Constants.MSGNOSUBEN;
    }
    ctx.reply(msgToDisplay);
  }
}

// /sendquote → iscrive l'utente
bot.command('sendquote', (ctx) => {
  sendQuote(ctx,'en');
});

bot.command('inviaaforisma', (ctx) => {
  sendQuote(ctx,'it');
});

bot.command('enviaaforismo', (ctx) => {
  sendQuote(ctx,'es');
});

// /checksend → controlla se iscritto
bot.command('checksend', (ctx) => {
  checkQuote(ctx,'en');
});

bot.command('controllainvio', (ctx) => {
  checkQuote(ctx,'it');
});

bot.command('chequeaenvio', (ctx) => {
  checkQuote(ctx,'es');
});

// /delsend → cancella l'iscrizione
bot.command('delsend', async (ctx) => {
  delQuote(ctx,'en');
});

bot.command('cancellainvio', async (ctx) => {
  delQuote(ctx,'it');
});

bot.command('borraenvio', async (ctx) => {
  delQuote(ctx,'es');
});

bot.command('stats', async (ctx) => {
    var totIt = 0;
    var totEn = 0;
    var totEs = 0;
    let chatIds = await getChatIds();
    let sendUsers = [];

    for (const {chatId, lang} of chatIds) {
        if (!sendUsers.includes(chatId)) {
            sendUsers.push(chatId);
        }

        if (lang === 'it') {
            totIt += 1;
        } else if (lang === 'es') {
            totEs += 1;
        } else {
            totEn += 1;
        }
    }
    ctx.reply(`Total Users subscribed to daily quote send : ${sendUsers.length}\n- Italian: ${totIt}\n- Spanish: ${totEs}\n- English: ${totEn}`);
    ctx.reply(`Total Users : ${users.length}`);
});

// === Daily Message ===
// Every day at 09:00 am GMT 
cron.schedule('0 9 * * *', async () => {
// Every minute
//cron.schedule('* * * * *', async () => {
  const chatIds = await getChatIds();
  for (const { chatId, lang } of chatIds) {
    try {
    // send text commentato inviera solo immagini 
    //   const res = await getQuotesByLanguage(lang);
    //   await bot.telegram.sendMessage(chatId, res);

      // send img
      const resImg = await getQuotesImgByLanguage(lang);
      const quoteImg = await createImageQuote(resImg);
      await bot.telegram.sendPhoto(chatId, { source: quoteImg });

      //await getQuoteImg(quote_language);
    } catch (error) {
      console.error(`Send Error for ${chatId} and language ${lang}:`, error.response?.description || error.message || error);
    }
  }
});

const createMultilineSVG = (quote, author, width, height) => {
    const maxLineLength = 40; // max caratteri per riga
    const words = quote.split(' ');
    const lines = [];
    let line = '';

    for (const word of words) {
        if ((line + word).length <= maxLineLength) {
            line += word + ' ';
        } else {
            lines.push(line.trim());
            line = word + ' ';
        }
    }
    if (line) {
        lines.push(line.trim());
    }

    if (lines.length > 0) {
        lines[0] = `“${lines[0]}`; // apre
        lines[lines.length - 1] += `”`; // chiude
    }

    let tspans = lines
        .map(
            (l, i) => `<tspan x="50%" dy="${i === 0
                ? '0'
                : '1.2em'}">${l}</tspan>`
        )
        .join('');

    const fontSize = 32*width/800;
    const heightPorc = 40*height/450;

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)"/>
      <text x="50%" y="${heightPorc}%" font-size="${fontSize}" font-style="italic"
            font-weight="bold" fill="white" text-anchor="middle">
        ${tspans}
        <tspan x="50%" dy="1.8em">${author}</tspan>
      </text>
    </svg>`;

    return svg;
}

const createImageQuote = async (res) => {
    const imageBuffer = await fetch(res.url).then(r => r.buffer());

    const svg = createMultilineSVG(res.quote, res.author, res.width, res.height);

    const logoBuffer = await sharp('./img/qrlogo.png')
        .resize(80, 118) // ad esempio: ridimensioniamo il logo a 80x118px
        .png()
        .toBuffer();

    const compositeImage = await sharp(imageBuffer)
        .resize(
            res.width,
            res.height,
            {fit: 'cover'}
        )
        .composite([
            {
                input: Buffer.from(svg),
                blend: 'over'
            }, {
                input: logoBuffer,
                top: res.height - 118 - 20, // url.height altezza totale - altezza logo - margine (10px)
                left: 20, // 10px da sinistra
                blend: 'over'
            }
        ])
        .png()
        .toBuffer();
    
        return compositeImage;
}

// 📩 Quando arriva un messaggio di testo libero
bot.on('text', async (ctx) => {

    const userId = ctx.from.id;

    // Se l'utente non è già registrato
    if (!users.includes(userId)) {
        users.push(userId);
        fs.writeFileSync(userFile, JSON.stringify(users));
        await bot.telegram.sendMessage (ctx.chat.id, `Welcome in Aforsimando ${ctx.from.first_name} !!!`);
    }

    let isImg = false;
    let res = '{}';
    const text = ctx
        .message
        .text
        .toUpperCase();

    if (text === '/AFORISMA') {
        res = await getQuotesByLanguage('it');
    } else if (text === '/AFORISMAIM' || text === '/AFORISMOIM' || text == '/QUOTEIM') {
        if (text === '/AFORISMAIM') {
            res = await getQuotesImgByLanguage('it');
        } else if (text === '/AFORISMOIM') {
            res = await getQuotesImgByLanguage('es');
        } else {
            res = await getQuotesImgByLanguage('en');
        }
        if (res.msg === 'No Error') {
            isImg = true;

            const quoteImg = await createImageQuote(res);

            // Usa direttamente il buffer con Telegraf
            // await ctx.replyWithPhoto({source: compositeImage});
            await ctx.replyWithPhoto({source: quoteImg});

        } else {
            res = res.msg;
        }
    } else if (text === '/AFORISMO') {
        res = await getQuotesByLanguage('es');
    } else if (text === '/QUOTE') {
        res = await getQuotesByLanguage('en');
    } else {
        if (res === '{}') {
            res = Constants.NOT_UNDERSTAND_TEXT[language][Math.floor(Math.random() * Constants.NOT_UNDERSTAND_TEXT[language].length)];
        }
    }

    if (!isImg) {
        await ctx.reply(res);
    }
});

// 🆘 Messaggi sconosciuti
bot.on('message', (ctx) => {
    ctx.reply(
        Constants.NOT_UNDERSTAND_TEXT[language][Math.floor(Math.random() * Constants.NOT_UNDERSTAND_TEXT[language].length)]
    );
});

// Avvia il bot
bot.launch();
