import {Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import * as Constants from './src/constants.js';
import fetch from 'node-fetch';
import sharp from 'sharp';

const API_TOKEN = process.env.BOT_TOKEN || '';

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
        return `"${ret.quote}"\n\n${ret.author}\n`;
    } catch (error) {
        return error.message;
    }
}

const getQuotesImgByLanguage = async (quote_language) => {
    language = quote_language;
    try {
        const ret = await getQuoteImg(quote_language);
        return {"msg": "No Error", "url": ret.url, "quote": ret.quote, "author": ret.author};
    } catch (error) {
        return {"msg": "Error in getQuotesImgByLanguage"};
    }
}

// 📜 Comandi
bot.start((ctx) => ctx.reply(Constants.HELP_TEXT[language]));
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

const createMultilineSVG = (quote, author) => {
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

    let tspans = lines.map((l, i) => 
        `<tspan x="50%" dy="${i === 0 ? '0' : '1.2em'}">${l}</tspan>`
    ).join('');

    const svg = `
    <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)"/>
      <text x="50%" y="40%" font-size="32" font-style="italic"
            font-weight="bold" fill="white" text-anchor="middle">
        ${tspans}
        <tspan x="50%" dy="1.8em">${author}</tspan>
      </text>
    </svg>`;

    return svg;
}


// 📩 Quando arriva un messaggio di testo libero
bot.on('text', async (ctx) => {
    let isImg = false;
    let res = '{}';
    const text = ctx
        .message
        .text
        .toUpperCase();

    if (text === 'AFORISMA') {
        res = await getQuotesByLanguage('it');
    } else if (text === 'AFORISMAIM' || text === 'AFORISMOIM' || text == 'QUOTEIM') {
        if ( text === 'AFORISMAIM' ) {
           res = await getQuotesImgByLanguage('it');
        } else if ( text === 'AFORISMOIM' ) {
           res = await getQuotesImgByLanguage('es');
        } else {
           res = await getQuotesImgByLanguage('en');
        }
        if (res.msg === 'No Error') {
            isImg = true;
            const imageBuffer = await fetch(res.url).then(r => r.buffer());

            const svg = createMultilineSVG(res.quote, res.author);
            const compositeImage = await sharp(imageBuffer)
                .resize(
                    800,
                    450,
                    {fit: 'cover'}
                )
                .composite([
                    {
                        input: Buffer.from(svg),
                        blend: 'over'
                    }
                ])
                .png()
                .toBuffer();

            // Usa direttamente il buffer con Telegraf
            await ctx.replyWithPhoto({source: compositeImage});

        } else {
            res = res.msg;
        }
    } else if (text === 'AFORISMO') {
        res = await getQuotesByLanguage('es');
    } else if (text === 'QUOTE') {
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

