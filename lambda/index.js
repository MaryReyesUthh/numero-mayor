/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

//data
const data = require('./documents/data');

//screens
const vista_principal = require('./documents/principal');
const segunda_vista = require('./documents/segunda_vista');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak('¡Bienvenido a el numero mas grande, dame tres numeros')
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'launchToken',
        document: vista_principal,
        datasources: data,
      })
      .getResponse();
  }
};

const CompararNumerosIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CompararNumerosIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;

    const primerNumero = parseInt(slots["primerNumero"].value);
    const segundoNumero = parseInt(slots["segundoNumero"].value);
    const tercerNumero = parseInt(slots["tercerNumero"].value);

    let mayor = primerNumero;

    if (segundoNumero > mayor) {
      mayor = segundoNumero;
    }

    if (tercerNumero > mayor) {
      mayor = tercerNumero;
    }

    const speechOutput = `El número mayor entre ${primerNumero}, ${segundoNumero} y ${tercerNumero} es ${mayor}.`;
    
    let segunda_data = {
        "launchData": {
            "Properties": {
                "titulo": "Numero mayor",
                "subtitulo":  `El número mayor entre ${primerNumero}, ${segundoNumero} y ${tercerNumero} es:`,
                "mayor": `${mayor}`,
                "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScsQrGJNCmlmG0VVrfnYWvRhx13mDOT_uErQ&usqp=CAU",
                "imagen_fondo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OyqB86W9xWM8_2E_4O8fvYaazstNqpFNGg&usqp=CAU",
                "pie": "dime el numero mayor entre 1 2 y 3"
            }
        }
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'launchToken', 
        document: segunda_vista,
        datasources: segunda_data,
      })
      .getResponse();
  }
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Puedes decirme una temperatura en grados Celsius o Fahrenheit, y te la convertiré. ¿Cómo puedo ayudarte?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = '¡Hasta luego!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Lo siento, no entendí esa solicitud. Por favor, intenta de nuevo.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CompararNumerosIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();