const fs = require('fs');

const CheckSynonyms = (dictionaries, queries) => {
  let result = "";

  queries.forEach((query) => {
    if (query[0] === query[1]) {
      result +="synonyms";
    } else {
      const relatedDictionary = dictionaries.find((dictionary) => 
        !!dictionary.includes(query[0]) && !!dictionary.includes(query[1])
      );
      if (!relatedDictionary) {
        result +="different";
      }
      else {
        result +="synonyms";
      }
    }
    result += '\n';
  });

  return result;
}

const ParseData = (data) => {
  const lines = data.split(/\r?\n/);
  
  const testCount = parseInt(lines[0]);

  let position = 1;
  let result = "";

  for (let i = 0; i < testCount; i++) {
    const dictionaryCount = parseInt(lines[position]);
    position++;
    const dictionaries = [];

    for (let j = 0; j < dictionaryCount; j++, position++) {
      const newDictionary = lines[position].split(' ').map((item) => item.toLowerCase());
      const firstDictionary = dictionaries.find((dictionary) => dictionary.includes(newDictionary[0]));
      const secondDictionary = dictionaries.find((dictionary) => dictionary.includes(newDictionary[1]));

      if (!firstDictionary && !secondDictionary) {
        dictionaries.push(newDictionary);
      }
      else if (!firstDictionary) {
        secondDictionary.push(newDictionary[0]);
      }
      else if (!secondDictionary) {
        firstDictionary.push(newDictionary[1]);
      }
      else if (firstDictionary !== secondDictionary) {
        const secondPosition = dictionaries.indexOf(secondDictionary);
        firstDictionary.push(...secondDictionary);
        dictionaries.splice(secondPosition, 1);
      }
    }

    const queryCount = parseInt(lines[position]);
    position++;
    const queries = [];

    for (let j = 0; j < queryCount; j++, position++) {
      queries.push(lines[position].split(' ').map((item) => item.toLowerCase()));
    }
    result += CheckSynonyms(dictionaries, queries);
  }

  return result;
}

try {
  const data = fs.readFileSync('test.in', 'UTF-8');
  const result = ParseData(data);
  fs.writeFileSync('test.out', result, 'UTF-8');
} catch (err) {
    console.error(err);
}