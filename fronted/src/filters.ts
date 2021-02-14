import Vue from 'vue';
import moment from 'moment';

Vue.filter('date',
  (value,
    wordFormat = true,
    fullDate = true,
    timeDate = true,
    fullTime = false,
    militaryTime = false,
    utc = true) => {
    if (!value) return '';

    const date = new Date(value);
    const separator = wordFormat ? ' ' : '/';
    let format = 'DD';
    format += wordFormat ? `${separator}MMM` : `${separator}MM`;
    if (fullDate) format += `${separator}YYYY`;

    if (timeDate) {
      format += militaryTime ? ' HH:mm' : ' hh:mm';
      format += fullTime ? ':ss' : '';
      format += militaryTime ? '' : ' a';
    }

    if (utc) {
      return moment.utc(date).format(format);
    }

    return moment(date).format(format);
  });

Vue.filter('dollar', (value) => `$${Number(value).toFixed(2)}`);
