import * as Constants from './src/constants.js';
import fetch from "node-fetch";
import Botgram from 'botgram';

const API_TOKEN = process.env.BOT_TOKEN || '';

if (!API_TOKEN) {
  console.error('Seems like you forgot to pass Telegram Bot Token. I can not proceed...');
  process.exit(1);
}

const bot = new Botgram(API_TOKEN);

console.log('Service started ' + Constants.VERSION );

let language='it';

const getInfo = async (quote_language) => {
  let response = await fetch(Constants.URLINFOAPI + quote_language)
  language = quote_language;

  if (response.status === 200) {
       const json = await response.json();
       return json;
  } else {
       throw new Error('Error : ' + err.description);	  
  }
}

const getInfoByLanguage = async (quote_language) => {
	let retFunc = '{}';
	language = quote_language;
	await getInfo(quote_language)
		   .then( (ret) => {
			if ( quote_language === 'it') {
                           retFunc = 'Totale aforismi caricati : ' + ret.quotes + ' di ' + ret.authors + ' autori.\n';
			} else {
			  if ( quote_language === 'en') {
                             retFunc = 'Total quotes loaded : ' + ret.quotes + ' of ' + ret.authors + ' authors.\n';
			  } else {
                             retFunc = 'Total aforismos almacenado : ' + ret.quotes + ' de ' + ret.authors + ' autores.\n';
			  }
			}
		   })
		   .catch( (error) => {
			retFunc = error;   
		   });
		   return retFunc;
}

const getQuote = async (quote_language) => {
  language = quote_language;
  let response = await fetch(Constants.URLQUOTEAPI + quote_language)

  if (response.status === 200) {
       const json = await response.json();
       return json;
  } else {
       throw new Error('Error : ' + err.description);	  
  }
}

const getQuotesByLanguage = async (quote_language) => {
	let retFunc = '{}';
	language = quote_language;
	await getQuote(quote_language)
		   .then( (ret) => {
                        retFunc = '"' + ret.quote + '"\n\n' + ret.author + '\n';
		   })
		   .catch( (error) => {
			retFunc = error;   
		   });
	return retFunc;	   
}	

// Free Message
const onMessage = async (msg, reply) => {

	let res='{}';
	const text=msg.text.toUpperCase();

	if ( text.toUpperCase() === 'AFORISMA' ) {
		res = await getQuotesByLanguage('it');
	} else if ( text.toUpperCase() === 'AFORISMO' ) {
		res = await getQuotesByLanguage('es');
	} else if ( text.toUpperCase() === 'QUOTE' ) {
		res = await getQuotesByLanguage('en');
	} else {
		if ( res === '{}' ) {
		   res = Constants.NOT_UNDERSTAND_TEXT[language][Math.floor(Math.random() * Constants.NOT_UNDERSTAND_TEXT[language].length)];
		}
	}

	reply.text(res);
}

bot.text(onMessage);

bot.command("start", (msg, reply) =>
  reply.text(Constants.HELP_TEXT[language]));

bot.command("ayuda", (msg, reply) => {
  language = 'es';
  reply.text(Constants.HELP_TEXT['es']);
});

bot.command("aiuto", (msg, reply) => {
  language = 'it';
  reply.text(Constants.HELP_TEXT['it']);
});

bot.command("help", (msg, reply) => {
  language = 'en';
  reply.text(Constants.HELP_TEXT['en']);
});

bot.command("aforismi", async (msg, reply) => {
	let res = await getInfoByLanguage('it');
	reply.text(res);
});

bot.command("aforismos", async (msg, reply) => {
	let res = await getInfoByLanguage('es');
	reply.text(res);
});

bot.command("quotes", async (msg, reply) => {
	let res = await getInfoByLanguage('en');
	reply.text(res);
});

bot.command("version","versión","versione", (msg, reply) => 
  reply.text(Constants.VERSION));

bot.command((msg, reply) => {
   let res = Constants.NOT_UNDERSTAND_TEXT[language][Math.floor(Math.random() * Constants.NOT_UNDERSTAND_TEXT[language].length)];
   reply.text(res);
});