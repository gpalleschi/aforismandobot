export const BOT_NAME ='Aforismandobot';
export const VERSION ='1.3.0 Beta';

export const URLQUOTEAPI='https://quotes-api-three.vercel.app/api/randomquote?language='; 
export const URLINFOAPI='https://quotes-api-three.vercel.app/api/randomquote?language=';

export const HELP_TEXT = { 'it' : "Cosa puoi fare con questo bot?\n\nCiao attraverso @Aforismandobot potrai richiedere un aforisma casuale\nscrivendo direttamente 'aforisma'.\n\nInoltre attraverso i seguenti comandi potrai :\n\n" +
                                  "   /version  : Richiedere la versione del bot\n" +
				  "   /aforismi : Vedere quanti aforismi sono caricati\n" +
				  "   /help     : Mostra quello che stai leggendo\n",
			 };

// Structure answer
export const UNDERSTAND = [ { "words" : ["PERCH"],
                              "answer" : ["Non mi va di rispondere.","Meglio che non parlo.","No Comment."] },
                            { "words" : ["FAI","FACENDO"],
                              "answer" : ["Niente.","Aspetto che mi chiedi qualcosa.","Si va avanti.","Bene e tu?"] },
                            { "words" : ["STAI"],
                              "answer" : ["Abbastanza Bene.","Si campa.","Si va avanti.","Bene e tu ?","Sono Triste."] },
                            { "words" : ["CIAO","SALVE"],
                              "answer" : ["Ciao.","Salve.","Hello!!!","Chi si rivede.","Hola!!!"] },
                            { "words" : ["TEMPO","SOLE "],
                              "answer" : ["Guarda su internet.","Chiedi a Alexa.","Ma che ne sò io."]},
];

export const NOT_UNDERSTAND_TEXT = { 'it' : ['Nun te capisco, che voi de preciso?',
                                             'Cosa intendi dire?',
                                             'In che senso?',
                                             'Scusa puoi esprimerti meglio?',
                                             'In altre parole cosa vuoi esattamente?',
                                             'Non ho ben capito.',
                                             'Do you speak italian?',
                                             'Esprimi meglio la tua richiesta',
                                            ]};