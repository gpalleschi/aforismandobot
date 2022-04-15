import * as Constants from './src/constants.js';
import * as data from './db/aforismi.js';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN)
console.log('Service started ' + Constants.VERSION)

let language='it';

// Start Boot
bot.start((context) => {
	context.reply(Constants.HELP_TEXT['it']);
})

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
		const aforisma = data.aforismi[Math.floor(Math.random() * data.aforismi.length)];
		res = '"' + aforisma.quote + '"\n\n' + aforisma.author + '\n';
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