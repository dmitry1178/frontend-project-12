import profanityFilter from 'leo-profanity';
import { franc } from 'franc-min';

// const message = 'хуй';
// const detectedLanguage = franc(message, { minLength: 3 });
// console.log(detectedLanguage);

const filterMessage = (message) => {
  const detectedLanguage = franc(message, { minLength: 3 });
  if (detectedLanguage === 'rus') {
    profanityFilter.loadDictionary('ru');
  }
  if (detectedLanguage === 'eng') {
    profanityFilter.loadDictionary('en');
  }
  return profanityFilter.clean(message);
};

console.log(filterMessage('хуй'));
console.log(filterMessage('fuck'));
