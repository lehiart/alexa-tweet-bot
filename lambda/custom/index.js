/* eslint-disable  func-names */
/* eslint-disable  no-console */
const alexa = require('ask-sdk-core');
const TwitterHelper = require('./twitter-helper');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Bienvenido a Tweet Bot!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('', speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TweetIntent';
  },
  async handle(handlerInput) {
    const { accessToken } = handlerInput.requestEnvelope.context.System.user;

    if (!accessToken) {
    // The request did not include a token, so tell the user to link
    // accounts and return a LinkAccount card
      const speechText = 'Lo siento, Debes tener una cuenta de Twitter y enlazarla en la app de alexa para poder usar esta skill';
      return handlerInput.responseBuilder
        .speak(speechText)
        .withLinkAccountCard()
        .getResponse();
    }

    // Use the token to access the user's profile. This should also verify that the
    // token represents a valid Twitter user.
    const Twitter = new TwitterHelper(accessToken);
    const message = handlerInput.requestEnvelope.request.intent.slots.message.value;

    Twitter.postTweet(message);

    const speechText = `Listo, He tuiteado ${message}`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hola Mundo', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Prueba diciendo tuitea!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Ayuda', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Adios!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`La sesion termino por: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Lo siento, no puedo entenderte por favor repitelo.')
      .reprompt('Lo siento, no puedo entenderte por favor repitelo')
      .getResponse();
  },
};

const skillBuilder = alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
