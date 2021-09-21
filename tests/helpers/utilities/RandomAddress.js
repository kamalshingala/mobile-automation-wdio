const streetNumber = ['2', '24', '12', '11', '8', '6'];

const streetName = [
  'George Street',
  'William Street',
  'Church Street',
  'High Street',
  'King Street',
  'Short Street',
  'Elizabeth Street',
  'John Street',
];
const suburb = [
  'Sydney',
  'Brisbane',
  'Melbourne',
  'Perth',
  'Adelaide',
  'Gold Coast',
  'New Castle',
  'Canberra',
];

const state = [
  'Perth,WA,6036',
  'Adelaide,SA,5162',
  'Sydney,NSW,2000',
  'Brisbane,QLD,4505',
  'Hobart,TAS,7050',
  'Melbourne,VIC,3273',
  'Darwin,NT,0872',
  'Canberra,ACT,2914',
];

const templateAPI = [streetNumber, ',', streetName, ',', state];

const template = [streetNumber, ' ', streetName, ' ', suburb, ' '];

class RandomAddress {
  getRandomElement(array) {
    if (array instanceof Array)
      return array[Math.floor(Math.random() * array.length)];
    return array;
  }

  getRandomAddress() {
    return template.map(this.getRandomElement).join('');
  }

  getRandomAddressAPI() {
    return templateAPI.map(this.getRandomElement).join('');
  }
}

export default new RandomAddress();
