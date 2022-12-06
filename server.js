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

const getLanguage = () => {
      let setLanguage = language;
      if ( context.update.message.from.language_code === 'it' || 
	   context.update.message.from.language_code === 'en' || 
	   context.update.message.from.language_code === 'es' ) {
           setLanguage = context.update.message.from.language_code;
      }
      return setLanguage;
}

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
const onMessage = async (msg, reply) => {

	let res='{}';
	const text=msg.text.toUpperCase();

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

	reply.text(res);
}

bot.text(onMessage);
