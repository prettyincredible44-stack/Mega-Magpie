const ADJECTIVES = [
  'Lucky', 'Swift', 'Golden', 'Clever', 'Brave', 'Merry', 'Dapper', 'Cosmic',
  'Silver', 'Royal', 'Mighty', 'Cheeky', 'Noble', 'Witty', 'Sparkly', 'Jolly',
  'Sly', 'Bold', 'Zesty', 'Plucky',
];

const ANIMALS = [
  'Magpie', 'Fox', 'Otter', 'Falcon', 'Panda', 'Tiger', 'Owl', 'Hedgehog',
  'Raccoon', 'Squirrel', 'Robin', 'Badger', 'Koala', 'Lynx', 'Heron', 'Marmot',
  'Walrus', 'Puffin', 'Marten', 'Kingfisher',
];

export function generatePlayerName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 90 + 10);
  return `${adj}${animal}${num}`;
}
