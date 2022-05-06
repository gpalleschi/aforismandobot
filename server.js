import * as Constants from './src/constants.js';
import { Telegraf } from 'telegraf';
import fetch from "node-fetch";

const API_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://aforismando.herokuapp.com';

const bot = new Telegraf(API_TOKEN)
// Heroku Configuration
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)

console.log('Service started ' + Constants.VERSION + ' On port : ' + PORT + ' URL : ' + URL);

let language='it';

const getLanguage = (context) => {
      let setLanguage = 'en';
      if ( context.update.message.from.language_code === 'it' || 
	   context.update.message.from.language_code === 'en' || 
	   context.update.message.from.language_code === 'es' ) {
           setLanguage = context.update.message.from.language_code;
      }
      return setLanguage;
}

// Start Boot
bot.start((context) => {
	let language = getLanguage(context);
	context.reply(Constants.HELP_TEXT[language]);
})

const getInfo = async (quote_language) => {
  let response = await fetch(Constants.URLINFOAPI + quote_language)

  if (response.status === 200) {
       const json = await response.json();
       return json;
  } else {
       throw new Error('Error : ' + err.description);	  
  }
}

const getInfoByLanguage = async (quote_language) => {
	let retFunc = '{}';
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
bot.on('text', async context=>{
	let res='{}';
	const text=context.update.message.text.toUpperCase();

	language = getLanguage(context);

	if ( text.toUpperCase() === '/VERSION' ) {
		res = ' version : ' + Constants.VERSION;
	} else if ( text.toUpperCase() === '/VERSIONE' ) {
		res = ' versione : ' + Constants.VERSION;
	} else if ( text.toUpperCase() === '/VERSIÓN' ) {
		res = ' versión : ' + Constants.VERSION;
	} else if ( text.toUpperCase() === '/AYUDA' ) {  
		res = Constants.HELP_TEXT['es'];
	} else if ( text.toUpperCase() === '/HELP' ) {  
		res = Constants.HELP_TEXT['en'];
	} else if ( text.toUpperCase() === '/AIUTO' ) {  
		res = Constants.HELP_TEXT['it'];
	} else if ( text.toUpperCase() === '/AFORISMI' ) {  
		res = await getInfoByLanguage('it');
	} else if ( text.toUpperCase() === '/AFORISMOS' ) {  
		res = await getInfoByLanguage('es');
	} else if ( text.toUpperCase() === '/QUOTES' ) {  
		res = await getInfoByLanguage('en');
	} else if ( text.toUpperCase() === 'AFORISMA' ) {
		res = await getQuotesByLanguage('it');
	} else if ( text.toUpperCase() === 'AFORISMO' ) {
		res = await getQuotesByLanguage('es');
	} else if ( text.toUpperCase() === 'QUOTE' ) {
		res = await getQuotesByLanguage('en');
	} else {
		if ( res === '{}' ) {
		   res = Constants.NOT_UNDERSTAND_TEXT[language][Math.floor(Math.random() * Constants.NOT_UNDERSTAND_TEXT['it'].length)];
		}
	}

  	context.reply(res)
})

// 
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))