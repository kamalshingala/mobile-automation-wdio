const faker = require('faker/locale/en_AU');

class RandomUtils {
  firstName() {
    return faker.name.firstName();
  }

  middleName() {
    return faker.name.lastName();
  }

  lastName() {
    return faker.name.lastName();
  }

  // Using RandomAddress Utils to resolve address issues
  // address() {
  //   const options = { min: 1, max: 99 };
  //   const randomNumber = faker.random.number(options);
  //   const streetName = faker.address.streetName();
  //   const address = `${randomNumber} ${streetName}`;
  //   return address;
  // }

  email() {
    return faker.internet.email();
  }

  mobileNumber() {
    const firstNums = '04';
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const randomMobile = firstNums + randomNum;
    console.log(`randomMobile: ${randomMobile}`);
    return randomMobile;
  }

  month() {
    return faker.date.month();
  }

  date() {
    const options = { min: 1, max: 28 };
    const randomDate = faker.random.number(options);
    return randomDate;
  }

  year() {
    const options = { min: 2000, max: 2006 };
    const randomYear = faker.random.number(options);
    return randomYear;
  }

  // Licence - Number may be 6-9 characters,alphanumeric
  licenceNumber() {
    return faker.random.alphaNumeric(6, 9);
  }

  // Passport - Must be 8 or 9 characters, alphanumeric
  passportNumber() {
    return faker.random.alphaNumeric(8, 9);
  }
}

export default new RandomUtils();
