export const BOT_NAME ='Aforismandobot';
export const VERSION ='5.2.0';

export const URLQUOTEAPI='https://quotes-api-three.vercel.app/api/randomquote?language='; 
export const URLQUOTEIMGAPI='https://quotes-api-three.vercel.app/api/randomimage?language='; 
export const URLINFOAPI='https://quotes-api-three.vercel.app/api/info?language=';

export const MSGALREADYSUBIT = '✅ Sei iscritto! Riceverai il messaggio giornaliero.';
export const MSGALREADYSUBES = '✅ ¡Estás suscrito! Recibirás el mensaje diario.'
export const MSGALREADYSUBEN = '✅ You are subscribed! You will receive the daily message.'

export const MSGSUBIT = '📬 Sei già iscritto.';
export const MSGSUBES = '📬 Ya estás suscrito.';
export const MSGSUBEN = '📬 You are already subscribed.';

export const MSGNOSUBIT = '📭 Non sei iscritto. Usa mandaaforisma per iscriverti.';
export const MSGNOSUBES = '📭 No estás suscrito. Usa sendquote para suscribirte.';
export const MSGNOSUBEN = '📭 You are not subscribed. Use sendquote to subscribe.';

export const MSGUNSUBIT = '❌ La tua iscrizione è stata annullata.';
export const MSGUNSUBES = '❌ Se te ha dado de baja.';
export const MSGUNSUBEN = '❌ You have been unsubscribed.';

export const HELP_TEXT = { 'it' : "Cosa puoi fare con questo bot?\n\nCiao attraverso @Aforismandobot potrai richiedere un aforisma casuale\n come testo scrivendo direttamente 'aforisma' o come immagine scrivendo 'aforismaim'.\n\nInoltre attraverso i seguenti comandi potrai :\n\n" +
                                 "   /versione  : Richiedere la versione del bot\n" +
				  "   /aforismi : Vedere quanti aforismi sono caricati\n" +
				  "   /aiuto    : Mostra quello che stai leggendo\n" +
				  "   /inviaaforisma     : Invia un aforisma in italiano ogni giorno alle 9:00 GMT\n" +
				  "   /controllainvio     : Controlla se sei iscritto all'invio giornaliero di un aforisma in italiano\n" +
				  "   /cancellainvio     : Annulla l'iscrizione all'invio giornaliero di un aforisma in italiano\n" +
				  "   aforisma     : Mostra un aforisma random in versione testo\n" +
				  "   aforismaim   : Mostra un immagine con un aforisma random\n",
                           'en' : "What can you do with this bot?\n\nHello through @Aforismandobot you can request a random aphorism\nas text writing directly 'quote' or an image writing 'quoteim'.\n\nAlso using the following commands you can:\n\n" +
                                  "   /version  : Request the version of the bot\n" +
				  "   /quotes   : See how many aphorisms are loaded\n" +
				  "   /help     : Show what you are reading\n" +
				  "   /sendquote     : Send an English text quote every day at 9:00 am GMT\n" +
				  "   /ckecksend     : Check if you are subscribed to quote daily send\n" +
				  "   /delsend     : Remove subscribcion to quote daily send\n" +
				  "   quote        : Show a random aphorism in text version\n" +
				  "   quoteim      : Show an image with a random aphorism\n",
                           'es' : "¿Qué puedes hacer con este bot?\n\nHola a través de @Aforismandobot puedes solicitar un aforismo aleatorio\ncomo texto escribiendo directamente 'aforismo' o una imagen escribiendo 'aforismoim'.\n\nTambién usando los siguientes comandos puedes:\n\n" +
                                  "   /versión   : Solicita la versión del bot\n" +
				  "   /aforismos : Chequear cuantos aforismos estan almacenados\n" +
				  "   /ayuda     : Muestra lo que estás leyendo\n" +
				  "   /enviaaforismo     : Envía un aforismo en español todos los días a las 9:00 am GMT\n" +
				  "   /chequeaenvio     : Comprueba si estás suscrito al envío diario de un aforismo\n" +
				  "   /borraenvio     : Eliminar suscripción para el envio diario de un aforismo\n" +
				  "   aforismo     : Muestra un aforismo aleatorio en versión texto\n" +
				  "   aforismoim   : Muestra una imagen con un aforismo aleatorio\n",
			 };

export const NOT_UNDERSTAND_TEXT = { 'it' : ['Nun te capisco, che voi de preciso?',
                                             'Cosa intendi dire?',
                                             'In che senso?',
                                             'Scusa puoi esprimerti meglio?',
                                             'In altre parole cosa vuoi esattamente?',
                                             'Non ho ben capito.',
                                             'Parli italiano?',
                                             'Esprimi meglio la tua richiesta',
                                             'Stai bene?'
                                            ],
                                     'en' : ["I don't understand.",
                                             'What?',
                                             'In other words?',
                                             'Do you speak english?',
                                             'Are you ok?'
                                            ],
                                     'es' : ["No entiendo?",
                                             'Que quieres decir?',
                                             'Que?',
                                             'Hablas español?',
                                             'Que mierda queres?'
                                            ]
                                   };
