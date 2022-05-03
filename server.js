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

// Start Boot
bot.start((context) => {
	context.reply(Constants.HELP_TEXT['it']);
})

const getInfo = async () => {
  let response = await fetch(Constants.URLINFOAPI + language)

  if (response.status === 200) {
       const json = await response.json();
       return json;
  } else {
       throw new Error('Error : ' + err.description);	  
  }
}

const getQuote = async () => {
  let response = await fetch(Constants.URLQUOTEAPI + language)

  if (response.status === 200) {
       const json = await response.json();
       return json;
  } else {
       throw new Error('Error : ' + err.description);	  
  }
}

// Free Message
bot.on('text', async context=>{
	let res='{}';
	let found = false;
	const text=context.update.message.text.toUpperCase();

	if ( text.toUpperCase() === '/VERSION' ) {
		res = ' version : ' + Constants.VERSION;
	} else if ( text.toUpperCase() === '/HELP' ) {  
		res = Constants.HELP_TEXT['it'];
	} else if ( text.toUpperCase() === '/AFORISMI' ) {  
		await getInfo()
		   .then( (ret) => {
                        res = 'Totale aforismi caricati : ' + ret.quotes + ' di ' + ret.authors + ' autori.\n';
		   })
		   .catch( (error) => {
			res = error;   
		   });

		res = 'Totale aforismi caricati : ' + data.aforismi.length + '\n';
	} else if ( text.toUpperCase().includes('AFORISMA') ) {
		await getQuote()
		   .then( (ret) => {
                        res = '"' + ret.quote + '"\n\n' + ret.author + '\n';
		   })
		   .catch( (error) => {
			res = error;   
		   });
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

// 
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))