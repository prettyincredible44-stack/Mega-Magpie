const ADJECTIVES = [
  'Lucky', 'Swift', 'Golden', 'Bright', 'Clever', 'Bold', 'Merry',
  'Nimble', 'Keen', 'Brave', 'Wise', 'Dapper', 'Plucky', 'Spry',
];

const NOUNS = [
  'Magpie', 'Card', 'Ace', 'King', 'Jack', 'Fox', 'Owl', 'Cat',
  'Star', 'Champ', 'Rookie', 'Pro', 'Master', 'Legend',
];

export function generatePlayerName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}
