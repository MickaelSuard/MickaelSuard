const { promises: fs } = require('fs');
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (!readmeRow[identifierIndex]) return;
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `<#${identifier}>`,
      replaceText
    );
  }

  const identifierToUpdate = {
    day_before_new_years: getDBNWSentence(),
    today_date: getTodayDate(),
    day_of_the_week : getDayOfWeek(),
    fun_fact: getFunFactOfTheDay(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join('\n');
}

function getTodayDate() {
  return today.toDateString();
}

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(String(nextYear));

  const timeUntilNewYear = nextYearDate.getTime() - today.getTime();
  const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

  return `**${dayUntilNewYear} days before ${nextYear} ⏱**`;
}

function getDayOfWeek() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex];
}

function getFunFactOfTheDay() {
  const dayOfWeek = getDayOfWeek();
  const funFacts = {
    Sunday: "Did you know? Sunday is named after the sun.",
    Monday: "Fun fact: Monday is considered the most productive day of the week.",
    Tuesday: "Fun fact: Tuesday is often considered the most disliked day of the week.",
    Wednesday: "Fun fact: Wednesday is sometimes referred to as 'hump day'.",
    Thursday: "Fun fact: Thursday is named after Thor, the Norse god of thunder.",
    Friday: "Fun fact: Friday is associated with relaxation and the end of the workweek in many cultures.",
    Saturday: "Fun fact: Saturday is named after the Roman god Saturn and is often considered a day for leisure.",
  };

  return funFacts[dayOfWeek] || "No fun fact available for today!";
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text);

function main() {
  const newREADME = generateNewREADME();
  console.log(newREADME);
  updateREADMEFile(newREADME);
}
main();
