'use strict';
const
    express = require('express'),
    bodyParser = require('body-parser'),
    functions = require('firebase-functions'),
    DialogflowApp = require('actions-on-google').DialogflowApp,
    moment = require('moment'),
    firebase = require("./firebase/credentials");
    const DEFAULT_REPLY_RESPONSE = "Selecciona una opción:";
    moment.locale("es")
    const DEFAULT_REPLY_CHIPS = ["Programar Entrevista‍", "Vacantes", "Turnos Laborales","¿Qué es Activa?","Ubicación📍","Horarios Entrevista"];
    const DETAULT_QUICK_RESPONSE_OBJECT = {"platform": "FACEBOOK","quickReplies": { "title": DEFAULT_REPLY_RESPONSE, "quickReplies": DEFAULT_REPLY_CHIPS }};
    let now = moment().format('dddd, D MMMM YYYY');
exports.functions = functions.https.onRequest((request, response) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    if (request.body.queryResult) {
        processV2Request(request, response);
    } else {
        console.log('Invalid Request');
        return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
    }
});
// Function to handle v2 webhook requests from Dialogflow ==================================================================
function processV2Request(request, response) {
    let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
    const parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
    const inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
    const requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined;
    const session = (request.body.session) ? request.body.session : undefined;
    const outputContexts = request.body.queryResult.outputContexts;
    let facebook_userId = request.body.originalDetectIntentRequest.payload.data.sender.id;
    let queryText = (request.body.queryResult.queryText) ? request.body.queryResult.queryText : 'Default';

    const options = {
        method: 'GET',
        url:`https://graph.facebook.com/v5.0/${facebook_userId}/`,
        qs:{
            access_token: 'EAAQ2A0ZAz3j0BAIKsaJ49ZBZAsMUz4DdWizrHppPzqMVZBPgypdEkdRLeTZAWW2xK18LqWmT7GntA7qd6oYtSqvUZCGIWExBmfnuKe2uJpk0OnfIZBXQOEkvBbhyEbrTOnRifQKsXHfbJT0KQZAZBbacSrRZBUukdlDOa4Ml9lbDbmAi06jZBi9zhrb'
        },
    };
    const actionHandlers = {
        'default': () => {
            sendResponse("Default Response");
        },
        'input.unknown': () => {
            console.log("Fallback Intent");
            let responseToUser = {
                "fulfillmentMessages": [DETAULT_QUICK_RESPONSE_OBJECT]
            };
            sendResponse(responseToUser);
        },
        'input.welcome': () => {
            console.log("Welcome Intent");
            const request = require("request");
            return new Promise (resolve => {
                    request(options, (error, response, body) => {
                        if (error) {
                            console.log(error);
                            resolve();
                        }
                        console.log("Facebook USER");
                        const info = JSON.parse(body);
                        console.log(info);
                        let responseToUser = {
                            "fulfillmentMessages": [
                                {
                                    "platform": "FACEBOOK",
                                    "text": {
                                        "text": [
                                            `¡Hola ${info.first_name}! Soy el robot de Activa 👱‍‍ y estoy aquí para ayudarte a encontrar empleo.`
                                        ]
                                    },
                                },
                                {
                                    "platform": "FACEBOOK",
                                    "quickReplies": {
                                        "title": "Mira las siguientes opciones que tengo para ti. ¿Qué vamos a hacer?",
                                        "quickReplies": DEFAULT_REPLY_CHIPS
                                    }
                                }
                            ]
                        };
                        sendResponse(responseToUser);
                    });
                });
            },
        'activa.general': () => {
            console.log("General Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Somos un Gran Generador de empleos y oportunidades enfocados en la 'Centricidad en el Empleado'."
                            ]
                        },
                    },
                    {
                        "platform": "FACEBOOK",
                        "quickReplies": {
                            "title": "¡Podemos ayudarte a encontrar empleo! Sólo haz click en 'Programar Entrevista' para empezar.",
                            "quickReplies": DEFAULT_REPLY_CHIPS
                        }
                    },
                ]
            };
            sendResponse(responseToUser);
        },
        'activa.interview_schedule': () => {
            console.log("Horarios Entrevista Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Nuestros Horarios de entrevista son:\n" +
                                "Lunes a Viernes de 9:00 AM a 6:00 PM \n" +
                                "Sábados de 9:00 AM a 3:00 PM"
                            ]
                        },
                    },
                    DETAULT_QUICK_RESPONSE_OBJECT
                ]
            };
            sendResponse(responseToUser);
        },
        'activa.location': () => {
            console.log("Location Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Estamos ubicados en  Calle Modesto Arreola #519 en el  Centro de Monterrey Nuevo León."
                            ]
                        },
                    },
                    {
                        "platform": "FACEBOOK",
                        "payload": {
                            "facebook": {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "generic",
                                        "elements": [
                                            {
                                                "title": "Ubicación Activa Talento",
                                                "image_url": "https://firebasestorage.googleapis.com/v0/b/bot-disg.appspot.com/o/dialogflow%2Fimg_ubicacion.png?alt=media&token=62f82173-a82e-46ec-bf72-4de0d61ec28a",
                                                "subtitle": "Estas son nuestras oficinas. Haz click en 'ir' para dirigirte a Google Maps.",
                                                "default_action": {
                                                    "type": "web_url",
                                                    "url": "https://goo.gl/maps/vZHoZ38RwFL2",
                                                    "messenger_extensions": false,
                                                    "webview_height_ratio": "FULL"
                                                },
                                                "buttons": [
                                                    {
                                                        "type": "web_url",
                                                        "url": "https://goo.gl/maps/vZHoZ38RwFL2",
                                                        "title": "Ir a Google Maps"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    DETAULT_QUICK_RESPONSE_OBJECT
                ]
            };
            sendResponse(responseToUser);
        },
        'activa.salary': () => {
            console.log("Salario Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Para hablar sobre comisiones y sueldos, primero debes 'Programar una cita' con nosotros. Una vez hecha se te hará una propuesta."
                            ]
                        },
                    },
                    DETAULT_QUICK_RESPONSE_OBJECT
                ]
            };
            sendResponse(responseToUser);
        },
        'activa.work_shifts': () => {
            console.log("Turnos Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Estamos a tu servicio servicio por las mañanas y por las tardes.\n" +
                                "Matutino : Lunes a Sábado de 9:00 am - 3:00pm.\n" +
                                "Vespertino:  Lunes a Viernes de 3:00pm a 10:00pm."
                            ]
                        },
                    },
                    {
                        "platform": "FACEBOOK",
                        "quickReplies": {
                            "title": "¡Podemos ayudarte a encontrar empleo! Sólo haz click en 'Programar Entrevista' para empezar.",
                            "quickReplies": DEFAULT_REPLY_CHIPS
                        }
                    },
                ]
            };
            sendResponse(responseToUser);
        },
        'activa.vacancies': () => {
            console.log("Vacantes Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Contamos con las siguientes vacantes. Desliza para navegar."
                            ]
                        },
                    },
                    {
                        "platform": "FACEBOOK",
                        "payload": {
                            "facebook": {
                                "attachment": {
                                    "payload": {
                                        "elements": [
                                            {
                                                "image_url": "https://firebasestorage.googleapis.com/v0/b/bot-disg.appspot.com/o/dialogflow%2Fimg_ventas.png?alt=media&token=df9ca1fc-d9f8-48c4-9b50-b7a1fdbafd60",
                                                "item_url": "http://dialect.com.mx/unete-al-equipo/",
                                                "subtitle": "Colocacion de tarjetas de credito realizando llamadas de telemarketing acorde a los estandares de venta y calidad establecidos por la operación /institucion para la colocacion de productos crediticios , respetando normatividad correspondiente.",
                                                "title": "Telemarketing/Ventas"
                                            },
                                            {
                                                "image_url": "https://firebasestorage.googleapis.com/v0/b/bot-disg.appspot.com/o/dialogflow%2Fimg_cobranza.png?alt=media&token=25948963-faaf-441b-bef7-7f5444a0fe5f",
                                                "item_url": "http://dialect.com.mx/unete-al-equipo/",
                                                "subtitle": "Llevar acabo la gestion de la cartera de clientes con adeudos atra vez de un recordatorio de pago o de la obtencion de una promesa de pago de los clientes.",
                                                "title": "Cobranza"
                                            },
                                            {
                                                "image_url": "https://firebasestorage.googleapis.com/v0/b/bot-disg.appspot.com/o/dialogflow%2Fimg_atencion_clientes.png?alt=media&token=06682825-8aa3-437b-9aac-5a8cc2de6c71",
                                                "item_url": "http://dialect.com.mx/unete-al-equipo/",
                                                "subtitle": "Servicio para comercializar productos y atender consumidores en los casos donde necesiten reclamar, sugerir o escuchar ...",
                                                "title": "Atencion a clientes"
                                            }
                                        ],
                                        "template_type": "generic"
                                    },
                                    "type": "template"
                                }
                            }
                        }
                    },
                    DETAULT_QUICK_RESPONSE_OBJECT
                ]
            };
            sendResponse(responseToUser);
        },
        'activa.interview_generate': () => {
            console.log("Activa.interview_generate");
            const request = require("request");
            return new Promise (resolve => {
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("Facebook USER");
                    const user_info = JSON.parse(body);
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        `Hola ${user_info.first_name}!.`
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        `Para empezar el registro comenzaré por hacerte una serie de preguntas para conocer tu perfil y poder comunicarnos contigo. `
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": `¿Estás de acuerdo?`,
                                    "quickReplies": ["Si, estoy de acuerdo", "Ubicación📍", "Horarios Entrevista🕐️"]
                                }
                            },
                        ]
                    };
                    uploadFirst(user_info);
                    sendResponse(responseToUser);
                });
            });
        },
        'activainterview_generate.email_phone': () => {
            console.log("activainterview_generate [eMail/Phone]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        `Ok ${user_info.first_name}!. ¿Podrías indicarnos si tienes experiencia laboral en telemarketing?`
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": `Selecciona una opción:`,
                                    "quickReplies": ["No tengo experiencia", "Si, más de 3 meses", "Si, más de 6 meses", "Si, más de 1 año"]
                                }
                            }
                        ]
                    };
                    uploadSecond(user_info, parameters.phone_number, parameters.email);
                    sendResponse(responseToUser);
                });
            })
        },
        'activainterview_generate.experience': () => {
            console.log("Activa.interview_generate [Experience]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": `Tomando en cuenta tu trabajo ¿Cuál es el apartado donde tienes experiencia?`,
                                    "quickReplies": ["Cobranza", "Ventas", "Atención a clientes", "Portabilidad"]
                                }
                            }
                        ]
                    };
                    console.log(parameters.experience_time)
                    uploadThird(user_info, parameters.experience_time);
                    sendResponse(responseToUser); // Send simple response to user
                });
            })
        },
        'activainterview_generate.age': () => {
            console.log("Activa.interview_generate [Age]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": `Selecciona tu rango de edad y después escribe tu género.`,
                                    "quickReplies": ["18-23", "24-29", "30 o más"]
                                }
                            }
                        ]
                    };
                    uploadFourth(user_info, parameters.area);
                    sendResponse(responseToUser); // Send simple response to user
                    resolve(body);
                });
            })
        },
        'activainterview_generate.gender': () => {
            console.log("Activa.activainterview_generate [GENDER]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        `Perfecto ${user_info.first_name}!. ¡Ya falta poco para terminar!`
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": `Selecciona tu rol actual: trabajador, estudiante o desempleado`,
                                    "quickReplies": ["Desempleado", "Estudiante", "Trabajador"]
                                }
                            }
                        ]
                    };
                    uploadFifth(user_info, parameters.age_range, parameters.gender);
                    sendResponse(responseToUser); // Send simple response to user
                });
            })
        },
        'activainterview_generate.status': () => {
            console.log("Activa.activainterview_generate [GENDER]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": `¿Te gustaría trabajar Medio turno o Turno completo?`,
                                    "quickReplies": ["Medio Turno", "Turno Completo"]
                                }
                            }
                        ]
                    };
                    uploadSixth(user_info, parameters.status);
                    sendResponse(responseToUser); // Send simple response to user
                });
            })
        },
        'activainterview_generate.turno': () => {
            console.log("Activa.activainterview_generate [Turno]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        "Nuestros Horarios de entrevista son:\n" +
                                        "Lunes a Viernes de 9:00 AM a 6:00 PM \n" +
                                        "Sábados de 9:00 AM a 3:00 PM"
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        "Tomando en cuenta lo anterior, ingresa la fecha y la hora en que nos podrías visitar."
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        "Por ejemplo puedes escribir: \"5 de enero a las 3:00 pm\""
                                    ]
                                },
                            }

                        ]
                    };
                    uploadSeventh(user_info, parameters.turno);
                    sendResponse(responseToUser); // Send simple response to user
                    resolve(body);
                    return;
                });
            })
        },
        'activainterview_generate.end': () => {
            console.log("Activa.activainterview_generate [END]");
            return new Promise (resolve => {
                const request = require("request");
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    console.log("=== BODY Response... ===");
                    const user_info = JSON.parse(body)
                    let moment_date =  moment(parameters.date_time.date_time).format("dddd, D MMMM YYYY");
                    let responseToUser = {
                        "fulfillmentMessages": [
                            {
                                "platform": "FACEBOOK",
                                "text": {
                                    "text": [
                                        `Perfecto ${user_info.first_name}.¡Hemos terminado el proceso de manera exitosa! Te esperamos el día ${moment_date}.`
                                    ]
                                },
                            },
                            {
                                "platform": "FACEBOOK",
                                "quickReplies": {
                                    "title": "¿Podemos ayudarte en algo más?",
                                    "quickReplies": DEFAULT_REPLY_CHIPS
                                }
                            },
                        ]
                    };
                    uploadEighth(user_info, parameters.date_time.date_time);
                    sendResponse(responseToUser); // Send simple response to user
                });
            })
        },
        'activainterview_generate.cancel': () => {
            console.log("Followup Cancel Intent");
            let responseToUser = {
                "fulfillmentMessages": [
                    {
                        "platform": "FACEBOOK",
                        "text": {
                            "text": [
                                "Hemos cancelado el proceso de entrevista. Puedes reiniciar el proceso en todo momento diciendo: Programar Entrevista."
                            ]
                        },
                    },
                    {
                        "platform": "FACEBOOK",
                        "quickReplies": {
                            "title": "¿Puedo ayudarte en algo más?",
                            "quickReplies": DEFAULT_REPLY_CHIPS
                        }
                    },
                ]
            };
            sendResponse(responseToUser);
        },
    };

    // If undefined or unknown action use the default handler
    if (!actionHandlers[action]) {
        action = 'default';
    }
    actionHandlers[action]();
    function sendResponse(responseToUser) {
        if (typeof responseToUser === 'string') {
            let responseJson = {
                fulfillmentText: responseToUser
            };
            response.json(responseJson);
        } else {
            let responseJson = {};
            responseJson.fulfillmentText = responseToUser.fulfillmentText;
            if (responseToUser.fulfillmentMessages) {
                responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
            }
            if (responseToUser.outputContexts) {
                responseJson.outputContexts = responseToUser.outputContexts;
            }
            console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
            response.json(responseJson);
        }
    }
}


//=============================================================================
//=== Bot General Functions ===================================================
//=============================================================================

function uploadFirst(user_info) { //This is for basic facebook information
    const last_interaction = moment().format('dddd, D MMMM YYYY')
    const personalInfo = {
        id: user_info.id,
        name: user_info.first_name + " " + user_info.last_name,
        profile_pic: user_info.profile_pic,
        last_interaction: last_interaction
    };
    return firebase.database().ref("usuarios_fb/" + user_info.id).set(personalInfo);
}
function uploadUser(user) {
    return new Promise (resolve=> {
        firebase.database().ref("usuarios_fb/" + user.id).once('value', (snapshot) => {
            if (snapshot.hasChild("id")) {
                console.log("USER ALREADY EXIST")
                resolve();
                return;
            }
            console.log("USER DOES NOT EXIST")
            firebase.database().ref("usuarios_fb/" + user.id).set(user);
            resolve(resolve)
            return;
        });
    });
}
function uploadSecond(user_info, phone_number, email) { //This is for basic facebook information
    const last_interaction = moment().format('dddd, D MMMM YYYY')
    const personalInfo = {
        id: user_info.id,
        name: user_info.first_name + " " + user_info.last_name,
        profile_pic: user_info.profile_pic,
        phone_number:phone_number,
        email:email,
        last_interaction: last_interaction
    };
    return firebase.database().ref("usuarios_fb/" + user_info.id).update(personalInfo);
}
function uploadThird(user_info, experience_time) { //This is for basic facebook information
   return firebase.database().ref("usuarios_fb/" + user_info.id).update({"experience_time": `${experience_time}`});
}
function uploadFourth(user_info, area) { //This is for basic facebook information
    return firebase.database().ref("usuarios_fb/" + user_info.id).update({"experience_area": `${area}`});
}
function uploadFifth(user_info,age_range, gender) { //This is for basic facebook information
    return firebase.database().ref("usuarios_fb/" + user_info.id).update({"age_range": `${age_range}`,"gender": `${gender}`});
}
function uploadSixth(user_info,status) { //This is for basic facebook information
    return firebase.database().ref("usuarios_fb/" + user_info.id).update({"status": `${status}`});
}
function uploadSeventh(user_info,turn) { //This is for basic facebook information
    return firebase.database().ref("usuarios_fb/" + user_info.id).update({"turn": `${turn}`});
}
function uploadEighth(user_info,date) { //This is for basic facebook information
    return firebase.database().ref("usuarios_fb/" + user_info.id).update({"date_of_interview": `${date}`});
}

function uploadExperienceInfo(id, experiencia) {
    var personalInfo = {
        experiencia: experiencia,
    };
    return firebase.database().ref("usuarios_fb/" + id).update(personalInfo);
}
function uploadInterviewDay(id, fecha_entrevista) {
    var personalInfo = {
        fecha_entrevista: fecha_entrevista,
    };
    return firebase.database().ref("usuarios_fb/" + id).update(personalInfo);
}
function writeUserData(name, phone, mail, exp, area, attending_day,registered_day, age) {
    console.log("UserData: {\n" + "area: " +  area + "\n" + "attending_day:" + attending_day + "\n" + "exp: " + exp  + "\n"  + "mail: " +  mail  + "\n" +  "name: " + name  + "\n" +  "phone: " + phone +  "\n" + "registered_day:" + registered_day  +  "\n"  + "age: " + age +  "\n" + "})")
    firebase.database().ref('usuarios_fb/').push({
        area:  area, //String
        attending_day: attending_day, //String
        exp: exp, //Boolean
        mail: mail, //String
        name: name, //String
        phone: phone, //String
        registered_day: registered_day, //String
        age: age
    });
}
function sendFacebookResponse(MAIN_TEXT, CHIPS_TEXT, REPLIES){
    let responseToUser = {
        "fulfillmentMessages": [
            {
                "platform": "FACEBOOK",
                "text": {
                    "text": [MAIN_TEXT]
                },
            },
            {
                "platform": "FACEBOOK",
                "quickReplies": {
                    "title": CHIPS_TEXT,
                    "quickReplies": REPLIES
                }
            }
        ]
    };
    sendResponse(responseToUser);
}


