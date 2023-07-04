import profanityFilter from 'leo-profanity';
// eslint-disable-next-line import/no-extraneous-dependencies
import { franc } from 'franc-min';

const filteredMessage = (message) => {
  const detectedLanguage = franc(message);
  if (detectedLanguage === 'rus') {
    profanityFilter.loadDictionary('ru');
  } else {
    profanityFilter.loadDictionary('en');
  }

  return profanityFilter.clean(message);
};

console.log(filteredMessage('хуйня какая то'));
console.log(filteredMessage('fuck you'));
