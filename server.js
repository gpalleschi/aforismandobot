import * as Constants from './src/constants.js';
import * as data from './db/aforismi.js';
import { Telegraf } from 'telegraf';
import fetch from "node-fetch";

const API_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://aforismando.herokuapp.com';
const URLQUOTEAPI = 'https://quotes-api-three.vercel.app/api/randomquote?language=';

const bot = new Telegraf(API_TOKEN)
// Heroku Configuration
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)

console.log('Service started ' + Constants.VERSION + ' On port : ' + PORT + ' URL : ' + URL);

let language='it';

// Start Boot
bot.start((context) => {
	context.reply(Constants.HELP_TEXT['it']);
})

const getQuote = async () => {
  let response = await fetch(URLQUOTEAPI + language)

  if (response.status === 200) {
    return await '"' + response.quote + '"\n\n' + response.author + '\n';
  } else {
    return 'Error in retrive quote : ' + err.description;	  
  }
}

// Free Message
bot.on('text', context=>{
	let res='';
	let found = false;
	const text=context.update.message.text.toUpperCase();

	if ( text.toUpperCase() === '/VERSION' ) {
		res = ' version : ' + Constants.VERSION;
	} else if ( text.toUpperCase() === '/HELP' ) {  
		res = Constants.HELP_TEXT['it'];
	} else if ( text.toUpperCase() === '/AFORISMI' ) {  
		res = 'Totale aforismi caricati : ' + data.aforismi.length + '\n';
	} else if ( text.toUpperCase().includes('AFORISMA') ) {
		// const aforisma = data.aforismi[Math.floor(Math.random() * data.aforismi.length)];
		// res = '"' + aforisma.quote + '"\n\n' + aforisma.author + '\n';
		res = getQuote();
	} else {
	        found = false;
		for(let j=0;j<Constants.UNDERSTAND.length;j++) {
		   for(let i=0;i<Constants.UNDERSTAND[j].words.length;i++) {
		      if ( text.toUpperCase().includes(Constants.UNDERSTAND[j].words[i]) ) {
			      res = Constants.UNDERSTAND[j].answer[Math.floor(Math.random() * Constants.UNDERSTAND[j].answer.length)];
	                      found = true;
			      break;
		      }
		   }	
		   if ( found ) break;
		}

		if ( res === '' ) {
		   res = Constants.NOT_UNDERSTAND_TEXT['it'][Math.floor(Math.random() * Constants.NOT_UNDERSTAND_TEXT['it'].length)];
		}
	}

  	context.reply(res)
})

// // In Line mode 
// bot.on('inline_query', (ctx) => {
//   // TODO : Codify inline messages	
//   const result = []
//   // Explicit usage
//   ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)
//   // Using context shortcut
//   ctx.answerInlineQuery(result)
// })

// 
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))