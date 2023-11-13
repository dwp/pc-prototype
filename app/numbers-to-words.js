const words = {
  en: {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',

    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
    18: 'eighteen',
    19: 'nineteen',

    20: 'twenty',
    30: 'thirty',
    40: 'forty',
    50: 'fifty',
    60: 'sixty',
    70: 'seventy',
    80: 'eighty',
    90: 'ninety',

    particleLimit: 100,
    particleString: ' and',

    hundred: 'hundred',
    thousand: 'thousand',
    million: 'million',
    tensJoiner: '-',
  },
  cy: {
    0: 'dim',
    1: 'un',
    2: 'dau',
    3: 'tri',
    4: 'pedwar',
    5: 'pump',
    6: 'chwech',
    7: 'saith',
    8: 'wyth',
    9: 'naw',

    10: 'deg',
    11: 'un deg un',
    12: 'un deg dau',
    13: 'un deg tri',
    14: 'un deg pedwar',
    15: 'un deg pump',
    16: 'un deg chwech',
    17: 'un deg saith',
    18: 'un deg wyth',
    19: 'un deg naw',

    20: 'dau ddeg',
    30: 'tri deg',
    40: 'pedwar deg',
    50: 'pump deg',
    60: 'chwech deg',
    70: 'saith deg',
    80: 'wyth deg',
    90: 'naw deg',

    particleLimit: 1_000_000_000,
    particleString: ' a',

    hundred: 'cant',
    thousand: 'mil',
    million: 'miliwn',
    tensJoiner: ' ',
  },
};

function numbersToWords(number, lang = 'en') {
  const locale = words[lang];
  const result = locale[number];

  if (result) {
    return result;
  }

  if (number < 100) {
    const remainder = number % 10;
    const tens = number - remainder;
    const tensJoiner = locale.tensJoiner || '';
    return `${locale[tens]}${tensJoiner}${locale[remainder]}`;
  }

  let magnitude;
  let bigNumber;

  if (number < 1_000) {
    magnitude = 100;
    bigNumber = locale.hundred;
  } else if (number < 1_000_000) {
    magnitude = 1_000;
    bigNumber = locale.thousand;
  } else if (number < 1_000_000_000) {
    magnitude = 1_000_000;
    bigNumber = locale.million;
  } else {
    throw RangeError('too big');
  }

  const remainder = number % magnitude;
  const thousands = (number - remainder) / magnitude;
  const thousandsWord = locale[magnitude] || `${numbersToWords(thousands, lang)} ${bigNumber}`;

  if (remainder === 0) {
    return thousandsWord;
  }

  const remainderWord = numbersToWords(remainder, lang);

  if (remainder < locale.particleLimit) {
    const and = locale.particleString || '';

    return `${thousandsWord}${and} ${remainderWord}`;
  }

  return `${thousandsWord} ${remainderWord}`;
}

const sanitiseMoney = (string) => {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected string got ${typeof string}: ${string}`);
  }

  const onlyNumber = string.replace(/[£,]/g, '');

  if (onlyNumber.includes('.')) {
    return onlyNumber;
  }

  return `${onlyNumber}.00`;
};

const formatters = {
  en: {
    poundsAndPence: (pounds, pence) => `${pounds} pounds and ${pence} pence`,
    pounds: (pounds) => `${pounds} pounds`,
    poundAndPence: (pounds, pence) => `${pounds} pound and ${pence} pence`,
    pound: (pounds) => `${pounds} pound`,
  },
  cy: {
    poundsAndPence: (pounds, pence) => `${pounds} o bunnoedd a ${pence} ceiniog`,
    pounds: (pounds) => `${pounds} o bunnoedd`,
    poundAndPence: (pounds, pence) => `${pounds} punt a ${pence} ceiniog`,
    pound: (pounds) => `${pounds} punt`,
  },
};

const upperCaseFirstChar = (str) => str[0].toUpperCase() + str.substr(1);

const moneyToWords = (money, lang = 'en') => {
  const [pounds, pence] = sanitiseMoney(money).split('.').map((str) => parseInt(str, 10));
  const poundsWords = numbersToWords(pounds, lang);
  const penceWords = numbersToWords(pence, lang);
  const capitalisedPounds = upperCaseFirstChar(poundsWords);

  if (pence === 0) {
    if (pounds === 0) {
      return formatters[lang].poundsAndPence(capitalisedPounds, penceWords);
    }
    const formatter = pounds === 1 ? formatters[lang].pound : formatters[lang].pounds;
    return formatter(capitalisedPounds);
  }

  const formatter = pounds === 1 ? formatters[lang].poundAndPence : formatters[lang].poundsAndPence;
  return formatter(capitalisedPounds, penceWords);
};

module.exports = { numbersToWords, moneyToWords };
