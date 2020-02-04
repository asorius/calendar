const dayNames = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];

// Set this maximum booking rate , it's set to 5 by default
const maxRate = 5;

//////Helper functions

const emptyCurrentCalendar = () => {
  const previousCalendar = document.querySelectorAll('.week-day');
  previousCalendar.forEach(el => {
    el.innerHTML = '';
  });
};
const bookingRate = (min = 0, max = 5) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const fillBookRates = (maxRate = 5) => {
  const weekDays = document.querySelectorAll('.week-day > div');
  weekDays.forEach(div => {
    const fillHeight = div.getAttribute('data-bookedrate');
    const fillDiv = document.createElement('span');
    fillDiv.style.cssText = ` height:${(100 / maxRate) * fillHeight}%;`;

    div.appendChild(fillDiv);
  });
};
//// Main printing function
const printAllCurrentMonthDays = (
  currentMonth = new Date().getMonth(),
  currentYear = new Date().getFullYear()
) => {
  //Get total day count of currently displayed year
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();
  //Days in previous month
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const weekdayIndexofFirstday = new Date(
    `${currentYear}-${currentMonth + 1}-1`
  ).getDay();

  //Weekday name of first currently displayed month, to calculate how many days of previous month to display, new date returns sunday as 0
  const weekdayNameofFirstday = dayNames[weekdayIndexofFirstday];
  //To be able to loop correctly, reset sunday to index 7 and so loop can be started from 0
  const weekdayNamesNormalized = [
    '',
    'mon',
    'tue',
    'wed',
    'thur',
    'fri',
    'sat',
    'sun'
  ];
  //// #1. Fil empty start of calendar with previous month ending days
  for (
    let i = 0;
    i < weekdayNamesNormalized.indexOf(weekdayNameofFirstday) - 1;
    i++
  ) {
    const div = document.createElement('div');
    const dayNumber =
      daysInPrevMonth -
      weekdayNamesNormalized.indexOf(weekdayNameofFirstday) +
      2 +
      i;
    div.className = 'other-month';
    div.innerHTML = `<p class='day-number'>${dayNumber}</p>`;
    //Set full date into attribute for event action
    div.setAttribute(
      'data-elementdate',
      `${currentYear}-${currentMonth}-${dayNumber}`
    );
    div.setAttribute('data-bookedrate', `${bookingRate()}`);
    document
      .querySelector('.week-days-list')
      .querySelector(`[data-weekday=${weekdayNamesNormalized[i + 1]}]`)
      .appendChild(div);
  }
  //// #2. Fill currenlty set to display month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const dayNameNumber = new Date(
      `${currentYear}-${currentMonth + 1}-${i}`
    ).getDay();

    const dayOfWeekName = dayNames[dayNameNumber];
    const div = document.createElement('div');
    //Set full date into attribute for event action
    div.setAttribute(
      'data-elementdate',
      `${currentYear}-${currentMonth + 1}-${i}`
    );
    div.setAttribute('data-bookedrate', `${bookingRate()}`);
    //Current day additional styling
    if (
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      div.className = 'current-day';
    }
    div.innerHTML = `<p class='day-number'>${i}</p>`;
    const column = document
      .querySelector('.week-days-list')
      .querySelector(`[data-weekday=${dayOfWeekName}]`);

    column.appendChild(div);
  }

  const weekdayindexofLastday = new Date(
    `${currentYear}-${currentMonth + 1}-${daysInCurrentMonth}`
  ).getDay();
  const weekdaynameofLastday = dayNames[weekdayindexofLastday];
  //// #3. Fill last empty div spots with the start days of next month
  for (
    let i = 0;
    i <
    weekdayNamesNormalized.length -
      weekdayNamesNormalized.indexOf(weekdaynameofLastday) -
      1;
    i++
  ) {
    const div = document.createElement('div');
    const dayNumber = i + 1;
    div.innerHTML = `<div class='day-number'>${dayNumber}</div>`;
    div.className = 'other-month';
    //Set full date into attribute for event action
    div.setAttribute(
      'data-elementdate',
      `${currentYear}-${currentMonth + 2}-${dayNumber}`
    );
    div.setAttribute('data-bookedrate', `${bookingRate()}`);
    document
      .querySelector('.week-days-list')
      .querySelector(
        `[data-weekday=${
          weekdayNamesNormalized[
            weekdayNamesNormalized.indexOf(weekdaynameofLastday) + i + 1
          ]
        }]`
      )
      .appendChild(div);
  }
  /////#4 Fill bookrates
  fillBookRates(maxRate);
};
//Initial print on page load
printAllCurrentMonthDays();

///// Day and events actions
const eventsParent = document.querySelector('.event-container');
const calendar = document.querySelector('.week-days-list');
const eventsInfo = document.querySelector('.events-default-info');
const eventYearAndMonth = document.querySelector('.event-year-month');
const eventDay = document.querySelector('.event-day');
const eventWeekday = document.querySelector('.event-weekday');
const eventInfo = document.querySelector('.event-info');
const eventAction = document.querySelector('.event-action');
calendar.addEventListener('click', e => {
  const date = e.target.getAttribute('data-elementdate');

  if (date !== null) {
    const dayDiv = e.target;
    // Loop through all days, if there's already a selected day, remove selected class and add to this
    document
      .querySelectorAll('.selected-day')
      .forEach(el => el.classList.remove('selected-day'));
    dayDiv.className = 'selected-day';
    const dateInArray = date.split('-');
    const year = dateInArray[0];
    const month = dateInArray[1];
    const day = dateInArray[2];
    const weekday = e.target.parentElement
      .getAttribute('data-weekday')
      .toUpperCase();
    eventsParent.classList.remove('no-events');
    eventsInfo.classList.add('no-events');
    eventYearAndMonth.innerHTML = `${year} , ${months[month - 1]}`;

    eventDay.innerHTML = day;
    eventWeekday.innerHTML = weekday;
  }
});

///////////////////////////// Month and year logic

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

/////// Year actions

//Sets display year value to one selected by user,uses current date by default
const setDisplayYear = (year = new Date().getFullYear()) => {
  document.querySelector('.display-year').innerHTML = year;
  return year;
};

//Selected year to display, STRING
let displayYear = setDisplayYear();
//Selected display month, NUMBER
//If theres no specificaly selected month by user, sets to current,else, sets to that months name from data attribute
let displayMonth =
  document.querySelector('.current-display-month') === null
    ? months[new Date().getMonth()]
    : document
        .querySelector('.current-display-month')
        .getAttribute('data-month');

const yearActions = document
  .querySelector('.year-select')
  .addEventListener('click', e => {
    if (e.target.className === 'next') {
      //Increases display year
      displayYear++;
    } else if (e.target.className === 'prev') {
      //Decreases display year
      displayYear--;
    }
    //In order to rewrite value of current div to new year value
    setDisplayYear(displayYear);
    //To print new month, remove all day divs first
    emptyCurrentCalendar();
    //Reprint calendar, i.e : ('feb','2019')=>new calendar
    printAllCurrentMonthDays(months.indexOf(displayMonth), displayYear);
  });

///////// Month actions

const displaySelectedMonth = e => {
  const monthName = e.target.getAttribute('data-month');
  const monthEl = e.target;
  //Remove previously selected display month selection class
  document
    .querySelectorAll('.month-select div')
    .forEach(div => div.classList.remove('current-display-month'));
  monthEl.classList.add('current-display-month');
  emptyCurrentCalendar();
  //Reprint calendar, i.e : ('feb','2019')=>new calendar
  printAllCurrentMonthDays(months.indexOf(monthName), displayYear);
};

//Print all months and add custom data attribute with month name
months.forEach(month => {
  const parent = document.querySelector('.month-select');
  const div = document.createElement('div');
  div.setAttribute('data-month', `${month}`);
  div.className = 'month-select-item';
  //if displayable month and year matches current date, add additional classes
  if (month === displayMonth && displayYear === new Date().getFullYear()) {
    div.classList.add('current-month');
    div.classList.add('current-display-month');
  }

  div.innerText = month;
  div.addEventListener('click', displaySelectedMonth);
  parent.appendChild(div);
});
