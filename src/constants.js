export const BOT_NAME ='Aforismandobot';
export const VERSION ='4.0.0 Beta';

export const URLQUOTEAPI='https://quotes-api-three.vercel.app/api/randomquote?language='; 
export const URLINFOAPI='https://quotes-api-three.vercel.app/api/info?language=';

export const HELP_TEXT = { 'it' : "Cosa puoi fare con questo bot?\n\nCiao attraverso @Aforismandobot potrai richiedere un aforisma casuale\nscrivendo direttamente 'aforisma'.\n\nInoltre attraverso i seguenti comandi potrai :\n\n" +
                                 "   /versione  : Richiedere la versione del bot\n" +
				  "   /aforismi : Vedere quanti aforismi sono caricati\n" +
				  "   /aiuto    : Mostra quello che stai leggendo\n",
                           'en' : "What can you do with this bot?\n\nHello through @Aforismandobot you can request a random aphorism\nwriting directly 'quote'.\n\nAlso using the following commands you can:\n\n" +
                                  "   /version  : Request the version of the bot\n" +
				  "   /quotes   : See how many aphorisms are loaded\n" +
				  "   /help     : Show what you are reading\n",
                           'es' : "¿Qué puedes hacer con este bot?\n\nHola a través de @Aforismandobot puedes solicitar un aforismo aleatorio\nescribiendo directamente 'aforismo'.\n\nTambién usando los siguientes comandos puedes:\n\n" +
                                  "   /versión   : Solicita la versión del bot\n" +
				  "   /aforismos : Chequear cuantos aforismos estan almacenados\n" +
				  "   /ayuda     : Muestra lo que estás leyendo\n",
			 };

export const NOT_UNDERSTAND_TEXT = { 'it' : ['Nun te capisco, che voi de preciso?',
                                             'Cosa intendi dire?',
                                             'In che senso?',
                                             'Scusa puoi esprimerti meglio?',
                                             'In altre parole cosa vuoi esattamente?',
                                             'Non ho ben capito.',
                                             'Parli italiano?',
                                             'Esprimi meglio la tua richiesta',
                                            ],
                                     'en' : ["I don't understand.",
                                             'What?',
                                             'In other words?',
                                             'Do you speak english?',
                                            ],
                                     'es' : ["No entiendo?",
                                             'Que quieres decir?',
                                             'Que?',
                                             'Hablas español?',
                                            ]
                                   };