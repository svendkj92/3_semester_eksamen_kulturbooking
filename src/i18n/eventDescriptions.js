const englishDescriptions = {
  'Oplev en stemningsfuld aften med live jazz og nye musikalske talenter.':
    'Enjoy an atmospheric evening of live jazz and discover new musical talent.',
  'En uformel danseworkshop, hvor alle kan være med.':
    'A relaxed dance workshop where everyone is welcome.',
  'Oplev moderne teater og mød nye mennesker.':
    'Experience contemporary theatre and meet new people.',
  'En workshop for dig, der elsker at udvikle kreative idéer.':
    'A workshop for anyone who loves developing creative ideas.',
};

export function getEventDescription(event, locale) {
  if (locale === 'en') {
    const text = event.descriptionEn || englishDescriptions[event.description];
    if (text) return { text, lang: 'en' };
  }
  return { text: event.description, lang: 'da' };
}
