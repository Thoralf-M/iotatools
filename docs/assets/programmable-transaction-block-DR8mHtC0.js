import { r as getSelectedNetworkConfig } from "./client-BTFoHz6u.js";
import { L as iotaBcs, Z as fromBase64 } from "./keypair-DsT3ivIR.js";
import { t as IotaGraphQLClient } from "./client-CmDrt-ez.js";
import { t as graphql } from "./2025.2-wBXoWMFy.js";
import { n as adapters } from "./auto-DlIbMOkz.js";
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/constants.js
/**
* @constant
* @name daysInYear
* @summary Days in 1 year.
*
* @description
* How many days in a year.
*
* One years equals 365.2425 days according to the formula:
*
* > Leap year occurs every 4 years, except for years that are divisible by 100 and not divisible by 400.
* > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
*/
var daysInYear = 365.2425;
-(Math.pow(10, 8) * 24 * 60 * 60 * 1e3);
/**
* @constant
* @name millisecondsInWeek
* @summary Milliseconds in 1 week.
*/
var millisecondsInWeek = 6048e5;
/**
* @constant
* @name millisecondsInDay
* @summary Milliseconds in 1 day.
*/
var millisecondsInDay = 864e5;
/**
* @constant
* @name millisecondsInMinute
* @summary Milliseconds in 1 minute
*/
var millisecondsInMinute = 6e4;
/**
* @constant
* @name millisecondsInHour
* @summary Milliseconds in 1 hour
*/
var millisecondsInHour = 36e5;
/**
* @constant
* @name millisecondsInSecond
* @summary Milliseconds in 1 second
*/
var millisecondsInSecond = 1e3;
/**
* @constant
* @name secondsInDay
* @summary Seconds in 1 day.
*/
var secondsInDay = 3600 * 24;
secondsInDay * 7;
secondsInDay * daysInYear / 12 * 3;
/**
* @constant
* @name constructFromSymbol
* @summary Symbol enabling Date extensions to inherit properties from the reference date.
*
* The symbol is used to enable the `constructFrom` function to construct a date
* using a reference date and a value. It allows to transfer extra properties
* from the reference date to the new date. It's useful for extensions like
* [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
* a constructor argument.
*/
var constructFromSymbol = Symbol.for("constructDateFrom");
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/constructFrom.js
/**
* @name constructFrom
* @category Generic Helpers
* @summary Constructs a date using the reference date and the value
*
* @description
* The function constructs a new date using the constructor from the reference
* date and the given value. It helps to build generic functions that accept
* date extensions.
*
* It defaults to `Date` if the passed reference date is a number or a string.
*
* Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
* enabling to transfer extra properties from the reference date to the new date.
* It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
* that accept a time zone as a constructor argument.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
*
* @param date - The reference date to take constructor from
* @param value - The value to create the date
*
* @returns Date initialized using the given date and value
*
* @example
* import { constructFrom } from "./constructFrom/date-fns";
*
* // A function that clones a date preserving the original type
* function cloneDate<DateType extends Date>(date: DateType): DateType {
*   return constructFrom(
*     date, // Use constructor from the given date
*     date.getTime() // Use the date value to create a new date
*   );
* }
*/
function constructFrom(date, value) {
	if (typeof date === "function") return date(value);
	if (date && typeof date === "object" && constructFromSymbol in date) return date[constructFromSymbol](value);
	if (date instanceof Date) return new date.constructor(value);
	return new Date(value);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/toDate.js
/**
* @name toDate
* @category Common Helpers
* @summary Convert the given argument to an instance of Date.
*
* @description
* Convert the given argument to an instance of Date.
*
* If the argument is an instance of Date, the function returns its clone.
*
* If the argument is a number, it is treated as a timestamp.
*
* If the argument is none of the above, the function returns Invalid Date.
*
* Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
* enabling to transfer extra properties from the reference date to the new date.
* It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
* that accept a time zone as a constructor argument.
*
* **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param argument - The value to convert
*
* @returns The parsed date in the local time zone
*
* @example
* // Clone the date:
* const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
* //=> Tue Feb 11 2014 11:30:30
*
* @example
* // Convert the timestamp to date:
* const result = toDate(1392098430000)
* //=> Tue Feb 11 2014 11:30:30
*/
function toDate(argument, context) {
	return constructFrom(context || argument, argument);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addDays.js
/**
* The {@link addDays} function options.
*/
/**
* @name addDays
* @category Day Helpers
* @summary Add the specified number of days to the given date.
*
* @description
* Add the specified number of days to the given date.
*
* **You don't need date-fns\***:
*
* Temporal has a built-in `add` method on all its classes:
*
* - [`Temporal.Instant.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/add)
* - [`Temporal.PlainDate.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/add)
* - [`Temporal.PlainDateTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/add)
* - [`Temporal.PlainTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainTime/add)
* - [`Temporal.PlainYearMonth.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainYearMonth/add)
* - [`Temporal.ZonedDateTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime/add)
*
* \* **Not really**, see: https://date-fns.org/you-dont-need-date-fns
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of days to be added.
* @param options - An object with options
*
* @returns The new date with the days added
*
* @example
* // Add 10 days to 1 September 2014:
* const result = addDays(new Date(2014, 8, 1), 10)
* //=> Thu Sep 11 2014 00:00:00
*
* @example
* // Using Temporal:
* // Add 10 days to 1 September 2014:
* Temporal.PlainDate.from("2014-09-01").add({ days: 10 }).toString();
* //=> "2014-09-11"
*/
function addDays(date, amount, options) {
	const _date = toDate(date, options?.in);
	if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
	if (!amount) return _date;
	_date.setDate(_date.getDate() + amount);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addMonths.js
/**
* The {@link addMonths} function options.
*/
/**
* @name addMonths
* @category Month Helpers
* @summary Add the specified number of months to the given date.
*
* @description
* Add the specified number of months to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of months to be added.
* @param options - The options object
*
* @returns The new date with the months added
*
* @example
* // Add 5 months to 1 September 2014:
* const result = addMonths(new Date(2014, 8, 1), 5)
* //=> Sun Feb 01 2015 00:00:00
*
* // Add one month to 30 January 2023:
* const result = addMonths(new Date(2023, 0, 30), 1)
* //=> Tue Feb 28 2023 00:00:00
*/
function addMonths(date, amount, options) {
	const _date = toDate(date, options?.in);
	if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
	if (!amount) return _date;
	const dayOfMonth = _date.getDate();
	const endOfDesiredMonth = constructFrom(options?.in || date, _date.getTime());
	endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
	if (dayOfMonth >= endOfDesiredMonth.getDate()) return endOfDesiredMonth;
	else {
		_date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
		return _date;
	}
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addMilliseconds.js
/**
* The {@link addMilliseconds} function options.
*/
/**
* @name addMilliseconds
* @category Millisecond Helpers
* @summary Add the specified number of milliseconds to the given date.
*
* @description
* Add the specified number of milliseconds to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of milliseconds to be added.
* @param options - The options object
*
* @returns The new date with the milliseconds added
*
* @example
* // Add 750 milliseconds to 10 July 2014 12:45:30.000:
* const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
* //=> Thu Jul 10 2014 12:45:30.750
*/
function addMilliseconds(date, amount, options) {
	return constructFrom(options?.in || date, +toDate(date) + amount);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addHours.js
/**
* The {@link addHours} function options.
*/
/**
* @name addHours
* @category Hour Helpers
* @summary Add the specified number of hours to the given date.
*
* @description
* Add the specified number of hours to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of hours to be added
* @param options - An object with options
*
* @returns The new date with the hours added
*
* @example
* // Add 2 hours to 10 July 2014 23:00:00:
* const result = addHours(new Date(2014, 6, 10, 23, 0), 2)
* //=> Fri Jul 11 2014 01:00:00
*/
function addHours(date, amount, options) {
	return addMilliseconds(date, amount * millisecondsInHour, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/defaultOptions.js
var defaultOptions = {};
function getDefaultOptions$1() {
	return defaultOptions;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfWeek.js
/**
* The {@link startOfWeek} function options.
*/
/**
* @name startOfWeek
* @category Week Helpers
* @summary Return the start of a week for the given date.
*
* @description
* Return the start of a week for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of a week
*
* @example
* // The start of a week for 2 September 2014 11:55:00:
* const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
* //=> Sun Aug 31 2014 00:00:00
*
* @example
* // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
* const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
* //=> Mon Sep 01 2014 00:00:00
*/
function startOfWeek(date, options) {
	const defaultOptions = getDefaultOptions$1();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const _date = toDate(date, options?.in);
	const day = _date.getDay();
	const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
	_date.setDate(_date.getDate() - diff);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfISOWeek.js
/**
* The {@link startOfISOWeek} function options.
*/
/**
* @name startOfISOWeek
* @category ISO Week Helpers
* @summary Return the start of an ISO week for the given date.
*
* @description
* Return the start of an ISO week for the given date.
* The result will be in the local timezone.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of an ISO week
*
* @example
* // The start of an ISO week for 2 September 2014 11:55:00:
* const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
* //=> Mon Sep 01 2014 00:00:00
*/
function startOfISOWeek(date, options) {
	return startOfWeek(date, {
		...options,
		weekStartsOn: 1
	});
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISOWeekYear.js
/**
* The {@link getISOWeekYear} function options.
*/
/**
* @name getISOWeekYear
* @category ISO Week-Numbering Year Helpers
* @summary Get the ISO week-numbering year of the given date.
*
* @description
* Get the ISO week-numbering year of the given date,
* which always starts 3 days before the year's first Thursday.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @param date - The given date
*
* @returns The ISO week-numbering year
*
* @example
* // Which ISO-week numbering year is 2 January 2005?
* const result = getISOWeekYear(new Date(2005, 0, 2))
* //=> 2004
*/
function getISOWeekYear(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
	fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
	fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
	const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
	const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
	fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
	fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
	const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
	if (_date.getTime() >= startOfNextYear.getTime()) return year + 1;
	else if (_date.getTime() >= startOfThisYear.getTime()) return year;
	else return year - 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
/**
* Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
* They usually appear for dates that denote time before the timezones were introduced
* (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
* and GMT+01:00:00 after that date)
*
* Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
* which would lead to incorrect calculations.
*
* This function returns the timezone offset in milliseconds that takes seconds in account.
*/
function getTimezoneOffsetInMilliseconds(date) {
	const _date = toDate(date);
	const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
	utcDate.setUTCFullYear(_date.getFullYear());
	return +date - +utcDate;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
	const normalize = constructFrom.bind(null, context || dates.find((date) => typeof date === "object"));
	return dates.map(normalize);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfDay.js
/**
* The {@link startOfDay} function options.
*/
/**
* @name startOfDay
* @category Day Helpers
* @summary Return the start of a day for the given date.
*
* @description
* Return the start of a day for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The start of a day
*
* @example
* // The start of a day for 2 September 2014 11:55:00:
* const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
* //=> Tue Sep 02 2014 00:00:00
*/
function startOfDay(date, options) {
	const _date = toDate(date, options?.in);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInCalendarDays.js
/**
* The {@link differenceInCalendarDays} function options.
*/
/**
* @name differenceInCalendarDays
* @category Day Helpers
* @summary Get the number of calendar days between the given dates.
*
* @description
* Get the number of calendar days between the given dates. This means that the times are removed
* from the dates and then the difference in days is calculated.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - The options object
*
* @returns The number of calendar days
*
* @example
* // How many calendar days are between
* // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
* const result = differenceInCalendarDays(
*   new Date(2012, 6, 2, 0, 0),
*   new Date(2011, 6, 2, 23, 0)
* )
* //=> 366
* // How many calendar days are between
* // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
* const result = differenceInCalendarDays(
*   new Date(2011, 6, 3, 0, 1),
*   new Date(2011, 6, 2, 23, 59)
* )
* //=> 1
*/
function differenceInCalendarDays(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const laterStartOfDay = startOfDay(laterDate_);
	const earlierStartOfDay = startOfDay(earlierDate_);
	const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
	const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
	return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfISOWeekYear.js
/**
* The {@link startOfISOWeekYear} function options.
*/
/**
* @name startOfISOWeekYear
* @category ISO Week-Numbering Year Helpers
* @summary Return the start of an ISO week-numbering year for the given date.
*
* @description
* Return the start of an ISO week-numbering year,
* which always starts 3 days before the year's first Thursday.
* The result will be in the local timezone.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of an ISO week-numbering year
*
* @example
* // The start of an ISO week-numbering year for 2 July 2005:
* const result = startOfISOWeekYear(new Date(2005, 6, 2))
* //=> Mon Jan 03 2005 00:00:00
*/
function startOfISOWeekYear(date, options) {
	const year = getISOWeekYear(date, options);
	const fourthOfJanuary = constructFrom(options?.in || date, 0);
	fourthOfJanuary.setFullYear(year, 0, 4);
	fourthOfJanuary.setHours(0, 0, 0, 0);
	return startOfISOWeek(fourthOfJanuary);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addMinutes.js
/**
* The {@link addMinutes} function options.
*/
/**
* @name addMinutes
* @category Minute Helpers
* @summary Add the specified number of minutes to the given date.
*
* @description
* Add the specified number of minutes to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of minutes to be added.
* @param options - An object with options
*
* @returns The new date with the minutes added
*
* @example
* // Add 30 minutes to 10 July 2014 12:00:00:
* const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
* //=> Thu Jul 10 2014 12:30:00
*/
function addMinutes(date, amount, options) {
	const _date = toDate(date, options?.in);
	_date.setTime(_date.getTime() + amount * millisecondsInMinute);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addQuarters.js
/**
* The {@link addQuarters} function options.
*/
/**
* @name addQuarters
* @category Quarter Helpers
* @summary Add the specified number of year quarters to the given date.
*
* @description
* Add the specified number of year quarters to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of quarters to be added.
* @param options - An object with options
*
* @returns The new date with the quarters added
*
* @example
* // Add 1 quarter to 1 September 2014:
* const result = addQuarters(new Date(2014, 8, 1), 1)
* //=; Mon Dec 01 2014 00:00:00
*/
function addQuarters(date, amount, options) {
	return addMonths(date, amount * 3, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addSeconds.js
/**
* The {@link addSeconds} function options.
*/
/**
* @name addSeconds
* @category Second Helpers
* @summary Add the specified number of seconds to the given date.
*
* @description
* Add the specified number of seconds to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of seconds to be added.
* @param options - An object with options
*
* @returns The new date with the seconds added
*
* @example
* // Add 30 seconds to 10 July 2014 12:45:00:
* const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
* //=> Thu Jul 10 2014 12:45:30
*/
function addSeconds(date, amount, options) {
	return addMilliseconds(date, amount * 1e3, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addWeeks.js
/**
* The {@link addWeeks} function options.
*/
/**
* @name addWeeks
* @category Week Helpers
* @summary Add the specified number of weeks to the given date.
*
* @description
* Add the specified number of weeks to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of weeks to be added.
* @param options - An object with options
*
* @returns The new date with the weeks added
*
* @example
* // Add 4 weeks to 1 September 2014:
* const result = addWeeks(new Date(2014, 8, 1), 4)
* //=> Mon Sep 29 2014 00:00:00
*/
function addWeeks(date, amount, options) {
	return addDays(date, amount * 7, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addYears.js
/**
* The {@link addYears} function options.
*/
/**
* @name addYears
* @category Year Helpers
* @summary Add the specified number of years to the given date.
*
* @description
* Add the specified number of years to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type.
*
* @param date - The date to be changed
* @param amount - The amount of years to be added.
* @param options - The options
*
* @returns The new date with the years added
*
* @example
* // Add 5 years to 1 September 2014:
* const result = addYears(new Date(2014, 8, 1), 5)
* //=> Sun Sep 01 2019 00:00:00
*/
function addYears(date, amount, options) {
	return addMonths(date, amount * 12, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/compareAsc.js
/**
* @name compareAsc
* @category Common Helpers
* @summary Compare the two dates and return -1, 0 or 1.
*
* @description
* Compare the two dates and return 1 if the first date is after the second,
* -1 if the first date is before the second or 0 if dates are equal.
*
* @param dateLeft - The first date to compare
* @param dateRight - The second date to compare
*
* @returns The result of the comparison
*
* @example
* // Compare 11 February 1987 and 10 July 1989:
* const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
* //=> -1
*
* @example
* // Sort the array of dates:
* const result = [
*   new Date(1995, 6, 2),
*   new Date(1987, 1, 11),
*   new Date(1989, 6, 10)
* ].sort(compareAsc)
* //=> [
* //   Wed Feb 11 1987 00:00:00,
* //   Mon Jul 10 1989 00:00:00,
* //   Sun Jul 02 1995 00:00:00
* // ]
*/
function compareAsc(dateLeft, dateRight) {
	const diff = +toDate(dateLeft) - +toDate(dateRight);
	if (diff < 0) return -1;
	else if (diff > 0) return 1;
	return diff;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isDate.js
/**
* @name isDate
* @category Common Helpers
* @summary Is the given value a date?
*
* @description
* Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
*
* @param value - The value to check
*
* @returns True if the given value is a date
*
* @example
* // For a valid date:
* const result = isDate(new Date())
* //=> true
*
* @example
* // For an invalid date:
* const result = isDate(new Date(NaN))
* //=> true
*
* @example
* // For some value:
* const result = isDate('2014-02-31')
* //=> false
*
* @example
* // For an object:
* const result = isDate({})
* //=> false
*/
function isDate(value) {
	return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isValid.js
/**
* @name isValid
* @category Common Helpers
* @summary Is the given date valid?
*
* @description
* Returns false if argument is Invalid Date and true otherwise.
* Argument is converted to Date using `toDate`. See [toDate](https://date-fns.org/docs/toDate)
* Invalid Date is a Date, whose time value is NaN.
*
* Time value of Date: http://es5.github.io/#x15.9.1.1
*
* @param date - The date to check
*
* @returns The date is valid
*
* @example
* // For the valid date:
* const result = isValid(new Date(2014, 1, 31))
* //=> true
*
* @example
* // For the value, convertible into a date:
* const result = isValid(1393804800000)
* //=> true
*
* @example
* // For the invalid date:
* const result = isValid(new Date(''))
* //=> false
*/
function isValid(date) {
	return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInCalendarMonths.js
/**
* The {@link differenceInCalendarMonths} function options.
*/
/**
* @name differenceInCalendarMonths
* @category Month Helpers
* @summary Get the number of calendar months between the given dates.
*
* @description
* Get the number of calendar months between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options
*
* @returns The number of calendar months
*
* @example
* // How many calendar months are between 31 January 2014 and 1 September 2014?
* const result = differenceInCalendarMonths(
*   new Date(2014, 8, 1),
*   new Date(2014, 0, 31)
* )
* //=> 8
*/
function differenceInCalendarMonths(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
	const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
	return yearsDiff * 12 + monthsDiff;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInCalendarYears.js
/**
* The {@link differenceInCalendarYears} function options.
*/
/**
* @name differenceInCalendarYears
* @category Year Helpers
* @summary Get the number of calendar years between the given dates.
*
* @description
* Get the number of calendar years between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options

* @returns The number of calendar years
*
* @example
* // How many calendar years are between 31 December 2013 and 11 February 2015?
* const result = differenceInCalendarYears(
*   new Date(2015, 1, 11),
*   new Date(2013, 11, 31)
* );
* //=> 2
*/
function differenceInCalendarYears(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	return laterDate_.getFullYear() - earlierDate_.getFullYear();
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInDays.js
/**
* The {@link differenceInDays} function options.
*/
/**
* @name differenceInDays
* @category Day Helpers
* @summary Get the number of full days between the given dates.
*
* @description
* Get the number of full day periods between two dates. Fractional days are
* truncated towards zero.
*
* One "full day" is the distance between a local time in one day to the same
* local time on the next or previous day. A full day can sometimes be less than
* or more than 24 hours if a daylight savings change happens between two dates.
*
* To ignore DST and only measure exact 24-hour periods, use this instead:
* `Math.trunc(differenceInHours(dateLeft, dateRight)/24)|0`.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options
*
* @returns The number of full days according to the local timezone
*
* @example
* // How many full days are between
* // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
* const result = differenceInDays(
*   new Date(2012, 6, 2, 0, 0),
*   new Date(2011, 6, 2, 23, 0)
* )
* //=> 365
*
* @example
* // How many full days are between
* // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
* const result = differenceInDays(
*   new Date(2011, 6, 3, 0, 1),
*   new Date(2011, 6, 2, 23, 59)
* )
* //=> 0
*
* @example
* // How many full days are between
* // 1 March 2020 0:00 and 1 June 2020 0:00 ?
* // Note: because local time is used, the
* // result will always be 92 days, even in
* // time zones where DST starts and the
* // period has only 92*24-1 hours.
* const result = differenceInDays(
*   new Date(2020, 5, 1),
*   new Date(2020, 2, 1)
* )
* //=> 92
*/
function differenceInDays(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const sign = compareLocalAsc(laterDate_, earlierDate_);
	const difference = Math.abs(differenceInCalendarDays(laterDate_, earlierDate_));
	laterDate_.setDate(laterDate_.getDate() - sign * difference);
	const result = sign * (difference - Number(compareLocalAsc(laterDate_, earlierDate_) === -sign));
	return result === 0 ? 0 : result;
}
function compareLocalAsc(laterDate, earlierDate) {
	const diff = laterDate.getFullYear() - earlierDate.getFullYear() || laterDate.getMonth() - earlierDate.getMonth() || laterDate.getDate() - earlierDate.getDate() || laterDate.getHours() - earlierDate.getHours() || laterDate.getMinutes() - earlierDate.getMinutes() || laterDate.getSeconds() - earlierDate.getSeconds() || laterDate.getMilliseconds() - earlierDate.getMilliseconds();
	if (diff < 0) return -1;
	if (diff > 0) return 1;
	return diff;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/getRoundingMethod.js
function getRoundingMethod(method) {
	return (number) => {
		const result = (method ? Math[method] : Math.trunc)(number);
		return result === 0 ? 0 : result;
	};
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInHours.js
/**
* The {@link differenceInHours} function options.
*/
/**
* @name differenceInHours
* @category Hour Helpers
* @summary Get the number of hours between the given dates.
*
* @description
* Get the number of hours between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options.
*
* @returns The number of hours
*
* @example
* // How many hours are between 2 July 2014 06:50:00 and 2 July 2014 19:00:00?
* const result = differenceInHours(
*   new Date(2014, 6, 2, 19, 0),
*   new Date(2014, 6, 2, 6, 50)
* )
* //=> 12
*/
function differenceInHours(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const diff = (+laterDate_ - +earlierDate_) / millisecondsInHour;
	return getRoundingMethod(options?.roundingMethod)(diff);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInMilliseconds.js
/**
* @name differenceInMilliseconds
* @category Millisecond Helpers
* @summary Get the number of milliseconds between the given dates.
*
* @description
* Get the number of milliseconds between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
*
* @returns The number of milliseconds
*
* @example
* // How many milliseconds are between
* // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
* const result = differenceInMilliseconds(
*   new Date(2014, 6, 2, 12, 30, 21, 700),
*   new Date(2014, 6, 2, 12, 30, 20, 600)
* )
* //=> 1100
*/
function differenceInMilliseconds(laterDate, earlierDate) {
	return +toDate(laterDate) - +toDate(earlierDate);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInMinutes.js
/**
* The {@link differenceInMinutes} function options.
*/
/**
* @name differenceInMinutes
* @category Minute Helpers
* @summary Get the number of minutes between the given dates.
*
* @description
* Get the signed number of full (rounded towards 0) minutes between the given dates.
*
* @param dateLeft - The later date
* @param dateRight - The earlier date
* @param options - An object with options.
*
* @returns The number of minutes
*
* @example
* // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
* const result = differenceInMinutes(
*   new Date(2014, 6, 2, 12, 20, 0),
*   new Date(2014, 6, 2, 12, 7, 59)
* )
* //=> 12
*
* @example
* // How many minutes are between 10:01:59 and 10:00:00
* const result = differenceInMinutes(
*   new Date(2000, 0, 1, 10, 0, 0),
*   new Date(2000, 0, 1, 10, 1, 59)
* )
* //=> -1
*/
function differenceInMinutes(dateLeft, dateRight, options) {
	const diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
	return getRoundingMethod(options?.roundingMethod)(diff);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfDay.js
/**
* The {@link endOfDay} function options.
*/
/**
* @name endOfDay
* @category Day Helpers
* @summary Return the end of a day for the given date.
*
* @description
* Return the end of a day for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of a day
*
* @example
* // The end of a day for 2 September 2014 11:55:00:
* const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
* //=> Tue Sep 02 2014 23:59:59.999
*/
function endOfDay(date, options) {
	const _date = toDate(date, options?.in);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfMonth.js
/**
* The {@link endOfMonth} function options.
*/
/**
* @name endOfMonth
* @category Month Helpers
* @summary Return the end of a month for the given date.
*
* @description
* Return the end of a month for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of a month
*
* @example
* // The end of a month for 2 September 2014 11:55:00:
* const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
* //=> Tue Sep 30 2014 23:59:59.999
*/
function endOfMonth(date, options) {
	const _date = toDate(date, options?.in);
	const month = _date.getMonth();
	_date.setFullYear(_date.getFullYear(), month + 1, 0);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isLastDayOfMonth.js
/**
* @name isLastDayOfMonth
* @category Month Helpers
* @summary Is the given date the last day of a month?
*
* @description
* Is the given date the last day of a month?
*
* @param date - The date to check
* @param options - An object with options
*
* @returns The date is the last day of a month
*
* @example
* // Is 28 February 2014 the last day of a month?
* const result = isLastDayOfMonth(new Date(2014, 1, 28))
* //=> true
*/
function isLastDayOfMonth(date, options) {
	const _date = toDate(date, options?.in);
	return +endOfDay(_date, options) === +endOfMonth(_date, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInMonths.js
/**
* The {@link differenceInMonths} function options.
*/
/**
* @name differenceInMonths
* @category Month Helpers
* @summary Get the number of full months between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options
*
* @returns The number of full months
*
* @example
* // How many full months are between 31 January 2014 and 1 September 2014?
* const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
* //=> 7
*/
function differenceInMonths(laterDate, earlierDate, options) {
	const [laterDate_, workingLaterDate, earlierDate_] = normalizeDates(options?.in, laterDate, laterDate, earlierDate);
	const sign = compareAsc(workingLaterDate, earlierDate_);
	const difference = Math.abs(differenceInCalendarMonths(workingLaterDate, earlierDate_));
	if (difference < 1) return 0;
	if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27) workingLaterDate.setDate(30);
	workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);
	let isLastMonthNotFull = compareAsc(workingLaterDate, earlierDate_) === -sign;
	if (isLastDayOfMonth(laterDate_) && difference === 1 && compareAsc(laterDate_, earlierDate_) === 1) isLastMonthNotFull = false;
	const result = sign * (difference - +isLastMonthNotFull);
	return result === 0 ? 0 : result;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInQuarters.js
/**
* The {@link differenceInQuarters} function options.
*/
/**
* @name differenceInQuarters
* @category Quarter Helpers
* @summary Get the number of quarters between the given dates.
*
* @description
* Get the number of quarters between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options.
*
* @returns The number of full quarters
*
* @example
* // How many full quarters are between 31 December 2013 and 2 July 2014?
* const result = differenceInQuarters(new Date(2014, 6, 2), new Date(2013, 11, 31))
* //=> 2
*/
function differenceInQuarters(laterDate, earlierDate, options) {
	const diff = differenceInMonths(laterDate, earlierDate, options) / 3;
	return getRoundingMethod(options?.roundingMethod)(diff);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInSeconds.js
/**
* The {@link differenceInSeconds} function options.
*/
/**
* @name differenceInSeconds
* @category Second Helpers
* @summary Get the number of seconds between the given dates.
*
* @description
* Get the number of seconds between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options.
*
* @returns The number of seconds
*
* @example
* // How many seconds are between
* // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
* const result = differenceInSeconds(
*   new Date(2014, 6, 2, 12, 30, 20, 0),
*   new Date(2014, 6, 2, 12, 30, 7, 999)
* )
* //=> 12
*/
function differenceInSeconds(laterDate, earlierDate, options) {
	const diff = differenceInMilliseconds(laterDate, earlierDate) / 1e3;
	return getRoundingMethod(options?.roundingMethod)(diff);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInWeeks.js
/**
* The {@link differenceInWeeks} function options.
*/
/**
* @name differenceInWeeks
* @category Week Helpers
* @summary Get the number of full weeks between the given dates.
*
* @description
* Get the number of full weeks between two dates. Fractional weeks are
* truncated towards zero by default.
*
* One "full week" is the distance between a local time in one day to the same
* local time 7 days earlier or later. A full week can sometimes be less than
* or more than 7*24 hours if a daylight savings change happens between two dates.
*
* To ignore DST and only measure exact 7*24-hour periods, use this instead:
* `Math.trunc(differenceInHours(dateLeft, dateRight)/(7*24))|0`.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options
*
* @returns The number of full weeks
*
* @example
* // How many full weeks are between 5 July 2014 and 20 July 2014?
* const result = differenceInWeeks(new Date(2014, 6, 20), new Date(2014, 6, 5))
* //=> 2
*
* @example
* // How many full weeks are between
* // 1 March 2020 0:00 and 6 June 2020 0:00 ?
* // Note: because local time is used, the
* // result will always be 8 weeks (54 days),
* // even if DST starts and the period has
* // only 54*24-1 hours.
* const result = differenceInWeeks(
*   new Date(2020, 5, 1),
*   new Date(2020, 2, 6)
* )
* //=> 8
*/
function differenceInWeeks(laterDate, earlierDate, options) {
	const diff = differenceInDays(laterDate, earlierDate, options) / 7;
	return getRoundingMethod(options?.roundingMethod)(diff);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInYears.js
/**
* The {@link differenceInYears} function options.
*/
/**
* @name differenceInYears
* @category Year Helpers
* @summary Get the number of full years between the given dates.
*
* @description
* Get the number of full years between the given dates.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - An object with options
*
* @returns The number of full years
*
* @example
* // How many full years are between 31 December 2013 and 11 February 2015?
* const result = differenceInYears(new Date(2015, 1, 11), new Date(2013, 11, 31))
* //=> 1
*/
function differenceInYears(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const sign = compareAsc(laterDate_, earlierDate_);
	const diff = Math.abs(differenceInCalendarYears(laterDate_, earlierDate_));
	laterDate_.setFullYear(1584);
	earlierDate_.setFullYear(1584);
	const result = sign * (diff - +(compareAsc(laterDate_, earlierDate_) === -sign));
	return result === 0 ? 0 : result;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfQuarter.js
/**
* The {@link startOfQuarter} function options.
*/
/**
* @name startOfQuarter
* @category Quarter Helpers
* @summary Return the start of a year quarter for the given date.
*
* @description
* Return the start of a year quarter for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The start of a quarter
*
* @example
* // The start of a quarter for 2 September 2014 11:55:00:
* const result = startOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
* //=> Tue Jul 01 2014 00:00:00
*/
function startOfQuarter(date, options) {
	const _date = toDate(date, options?.in);
	const currentMonth = _date.getMonth();
	const month = currentMonth - currentMonth % 3;
	_date.setMonth(month, 1);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfMonth.js
/**
* The {@link startOfMonth} function options.
*/
/**
* @name startOfMonth
* @category Month Helpers
* @summary Return the start of a month for the given date.
*
* @description
* Return the start of a month for the given date. The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments.
* Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed,
* or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of a month
*
* @example
* // The start of a month for 2 September 2014 11:55:00:
* const result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
* //=> Mon Sep 01 2014 00:00:00
*/
function startOfMonth(date, options) {
	const _date = toDate(date, options?.in);
	_date.setDate(1);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfYear.js
/**
* The {@link endOfYear} function options.
*/
/**
* @name endOfYear
* @category Year Helpers
* @summary Return the end of a year for the given date.
*
* @description
* Return the end of a year for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The end of a year
*
* @example
* // The end of a year for 2 September 2014 11:55:00:
* const result = endOfYear(new Date(2014, 8, 2, 11, 55, 0))
* //=> Wed Dec 31 2014 23:59:59.999
*/
function endOfYear(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	_date.setFullYear(year + 1, 0, 0);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfYear.js
/**
* The {@link startOfYear} function options.
*/
/**
* @name startOfYear
* @category Year Helpers
* @summary Return the start of a year for the given date.
*
* @description
* Return the start of a year for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The start of a year
*
* @example
* // The start of a year for 2 September 2014 11:55:00:
* const result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
* //=> Wed Jan 01 2014 00:00:00
*/
function startOfYear(date, options) {
	const date_ = toDate(date, options?.in);
	date_.setFullYear(date_.getFullYear(), 0, 1);
	date_.setHours(0, 0, 0, 0);
	return date_;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfHour.js
/**
* The {@link endOfHour} function options.
*/
/**
* @name endOfHour
* @category Hour Helpers
* @summary Return the end of an hour for the given date.
*
* @description
* Return the end of an hour for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of an hour
*
* @example
* // The end of an hour for 2 September 2014 11:55:00:
* const result = endOfHour(new Date(2014, 8, 2, 11, 55))
* //=> Tue Sep 02 2014 11:59:59.999
*/
function endOfHour(date, options) {
	const _date = toDate(date, options?.in);
	_date.setMinutes(59, 59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfWeek.js
/**
* The {@link endOfWeek} function options.
*/
/**
* @name endOfWeek
* @category Week Helpers
* @summary Return the end of a week for the given date.
*
* @description
* Return the end of a week for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of a week
*
* @example
* // The end of a week for 2 September 2014 11:55:00:
* const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
* //=> Sat Sep 06 2014 23:59:59.999
*
* @example
* // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
* const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
* //=> Sun Sep 07 2014 23:59:59.999
*/
function endOfWeek(date, options) {
	const defaultOptions = getDefaultOptions$1();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const _date = toDate(date, options?.in);
	const day = _date.getDay();
	const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
	_date.setDate(_date.getDate() + diff);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfMinute.js
/**
* The {@link endOfMinute} function options.
*/
/**
* @name endOfMinute
* @category Minute Helpers
* @summary Return the end of a minute for the given date.
*
* @description
* Return the end of a minute for the given date.
* The result will be in the local timezone or the provided context.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of a minute
*
* @example
* // The end of a minute for 1 December 2014 22:15:45.400:
* const result = endOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
* //=> Mon Dec 01 2014 22:15:59.999
*/
function endOfMinute(date, options) {
	const _date = toDate(date, options?.in);
	_date.setSeconds(59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfQuarter.js
/**
* The {@link endOfQuarter} function options.
*/
/**
* @name endOfQuarter
* @category Quarter Helpers
* @summary Return the end of a year quarter for the given date.
*
* @description
* Return the end of a year quarter for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of a quarter
*
* @example
* // The end of a quarter for 2 September 2014 11:55:00:
* const result = endOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
* //=> Tue Sep 30 2014 23:59:59.999
*/
function endOfQuarter(date, options) {
	const _date = toDate(date, options?.in);
	const currentMonth = _date.getMonth();
	const month = currentMonth - currentMonth % 3 + 3;
	_date.setMonth(month, 0);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/endOfSecond.js
/**
* The {@link endOfSecond} function options.
*/
/**
* @name endOfSecond
* @category Second Helpers
* @summary Return the end of a second for the given date.
*
* @description
* Return the end of a second for the given date.
* The result will be in the local timezone if no `in` option is specified.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The end of a second
*
* @example
* // The end of a second for 1 December 2014 22:15:45.400:
* const result = endOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
* //=> Mon Dec 01 2014 22:15:45.999
*/
function endOfSecond(date, options) {
	const _date = toDate(date, options?.in);
	_date.setMilliseconds(999);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var formatDistanceLocale = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
};
var formatDistance = (token, count, options) => {
	let result;
	const tokenValue = formatDistanceLocale[token];
	if (typeof tokenValue === "string") result = tokenValue;
	else if (count === 1) result = tokenValue.one;
	else result = tokenValue.other.replace("{{count}}", count.toString());
	if (options?.addSuffix) if (options.comparison && options.comparison > 0) return "in " + result;
	else return result + " ago";
	return result;
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
	return (options = {}) => {
		const width = options.width ? String(options.width) : args.defaultWidth;
		return args.formats[width] || args.formats[args.defaultWidth];
	};
}
var formatLong = {
	date: buildFormatLongFn({
		formats: {
			full: "EEEE, MMMM do, y",
			long: "MMMM do, y",
			medium: "MMM d, y",
			short: "MM/dd/yyyy"
		},
		defaultWidth: "full"
	}),
	time: buildFormatLongFn({
		formats: {
			full: "h:mm:ss a zzzz",
			long: "h:mm:ss a z",
			medium: "h:mm:ss a",
			short: "h:mm a"
		},
		defaultWidth: "full"
	}),
	dateTime: buildFormatLongFn({
		formats: {
			full: "{{date}} 'at' {{time}}",
			long: "{{date}} 'at' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US/_lib/formatRelative.js
var formatRelativeLocale = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
};
var formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildLocalizeFn.js
/**
* The localize function argument callback which allows to convert raw value to
* the actual type.
*
* @param value - The value to convert
*
* @returns The converted value
*/
/**
* The map of localized values for each width.
*/
/**
* The index type of the locale unit value. It types conversion of units of
* values that don't start at 0 (i.e. quarters).
*/
/**
* Converts the unit value to the tuple of values.
*/
/**
* The tuple of localized era values. The first element represents BC,
* the second element represents AD.
*/
/**
* The tuple of localized quarter values. The first element represents Q1.
*/
/**
* The tuple of localized day values. The first element represents Sunday.
*/
/**
* The tuple of localized month values. The first element represents January.
*/
function buildLocalizeFn(args) {
	return (value, options) => {
		const context = options?.context ? String(options.context) : "standalone";
		let valuesArray;
		if (context === "formatting" && args.formattingValues) {
			const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
			const width = options?.width ? String(options.width) : defaultWidth;
			valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
		} else {
			const defaultWidth = args.defaultWidth;
			const width = options?.width ? String(options.width) : args.defaultWidth;
			valuesArray = args.values[width] || args.values[defaultWidth];
		}
		const index = args.argumentCallback ? args.argumentCallback(value) : value;
		return valuesArray[index];
	};
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US/_lib/localize.js
var eraValues = {
	narrow: ["B", "A"],
	abbreviated: ["BC", "AD"],
	wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
	narrow: [
		"1",
		"2",
		"3",
		"4"
	],
	abbreviated: [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	wide: [
		"1st quarter",
		"2nd quarter",
		"3rd quarter",
		"4th quarter"
	]
};
var monthValues = {
	narrow: [
		"J",
		"F",
		"M",
		"A",
		"M",
		"J",
		"J",
		"A",
		"S",
		"O",
		"N",
		"D"
	],
	abbreviated: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	],
	wide: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	]
};
var dayValues = {
	narrow: [
		"S",
		"M",
		"T",
		"W",
		"T",
		"F",
		"S"
	],
	short: [
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa"
	],
	abbreviated: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	wide: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	]
};
var dayPeriodValues = {
	narrow: {
		am: "a",
		pm: "p",
		midnight: "mi",
		noon: "n",
		morning: "morning",
		afternoon: "afternoon",
		evening: "evening",
		night: "night"
	},
	abbreviated: {
		am: "AM",
		pm: "PM",
		midnight: "midnight",
		noon: "noon",
		morning: "morning",
		afternoon: "afternoon",
		evening: "evening",
		night: "night"
	},
	wide: {
		am: "a.m.",
		pm: "p.m.",
		midnight: "midnight",
		noon: "noon",
		morning: "morning",
		afternoon: "afternoon",
		evening: "evening",
		night: "night"
	}
};
var formattingDayPeriodValues = {
	narrow: {
		am: "a",
		pm: "p",
		midnight: "mi",
		noon: "n",
		morning: "in the morning",
		afternoon: "in the afternoon",
		evening: "in the evening",
		night: "at night"
	},
	abbreviated: {
		am: "AM",
		pm: "PM",
		midnight: "midnight",
		noon: "noon",
		morning: "in the morning",
		afternoon: "in the afternoon",
		evening: "in the evening",
		night: "at night"
	},
	wide: {
		am: "a.m.",
		pm: "p.m.",
		midnight: "midnight",
		noon: "noon",
		morning: "in the morning",
		afternoon: "in the afternoon",
		evening: "in the evening",
		night: "at night"
	}
};
var ordinalNumber = (dirtyNumber, _options) => {
	const number = Number(dirtyNumber);
	const rem100 = number % 100;
	if (rem100 > 20 || rem100 < 10) switch (rem100 % 10) {
		case 1: return number + "st";
		case 2: return number + "nd";
		case 3: return number + "rd";
	}
	return number + "th";
};
var localize = {
	ordinalNumber,
	era: buildLocalizeFn({
		values: eraValues,
		defaultWidth: "wide"
	}),
	quarter: buildLocalizeFn({
		values: quarterValues,
		defaultWidth: "wide",
		argumentCallback: (quarter) => quarter - 1
	}),
	month: buildLocalizeFn({
		values: monthValues,
		defaultWidth: "wide"
	}),
	day: buildLocalizeFn({
		values: dayValues,
		defaultWidth: "wide"
	}),
	dayPeriod: buildLocalizeFn({
		values: dayPeriodValues,
		defaultWidth: "wide",
		formattingValues: formattingDayPeriodValues,
		defaultFormattingWidth: "wide"
	})
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
	return (string, options = {}) => {
		const width = options.width;
		const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
		const matchResult = string.match(matchPattern);
		if (!matchResult) return null;
		const matchedString = matchResult[0];
		const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
		const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : findKey(parsePatterns, (pattern) => pattern.test(matchedString));
		let value;
		value = args.valueCallback ? args.valueCallback(key) : key;
		value = options.valueCallback ? options.valueCallback(value) : value;
		const rest = string.slice(matchedString.length);
		return {
			value,
			rest
		};
	};
}
function findKey(object, predicate) {
	for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) return key;
}
function findIndex(array, predicate) {
	for (let key = 0; key < array.length; key++) if (predicate(array[key])) return key;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
	return (string, options = {}) => {
		const matchResult = string.match(args.matchPattern);
		if (!matchResult) return null;
		const matchedString = matchResult[0];
		const parseResult = string.match(args.parsePattern);
		if (!parseResult) return null;
		let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
		value = options.valueCallback ? options.valueCallback(value) : value;
		const rest = string.slice(matchedString.length);
		return {
			value,
			rest
		};
	};
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US.js
/**
* @category Locales
* @summary English locale (United States).
* @language English
* @iso-639-2 eng
* @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
* @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
*/
var enUS = {
	code: "en-US",
	formatDistance,
	formatLong,
	formatRelative,
	localize,
	match: {
		ordinalNumber: buildMatchPatternFn({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: (value) => parseInt(value, 10)
		}),
		era: buildMatchFn({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^b/i, /^(a|c)/i] },
			defaultParseWidth: "any"
		}),
		quarter: buildMatchFn({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/1/i,
				/2/i,
				/3/i,
				/4/i
			] },
			defaultParseWidth: "any",
			valueCallback: (index) => index + 1
		}),
		month: buildMatchFn({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^j/i,
					/^f/i,
					/^m/i,
					/^a/i,
					/^m/i,
					/^j/i,
					/^j/i,
					/^a/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				],
				any: [
					/^ja/i,
					/^f/i,
					/^mar/i,
					/^ap/i,
					/^may/i,
					/^jun/i,
					/^jul/i,
					/^au/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: buildMatchFn({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^s/i,
					/^m/i,
					/^t/i,
					/^w/i,
					/^t/i,
					/^f/i,
					/^s/i
				],
				any: [
					/^su/i,
					/^m/i,
					/^tu/i,
					/^w/i,
					/^th/i,
					/^f/i,
					/^sa/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: buildMatchFn({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^a/i,
				pm: /^p/i,
				midnight: /^mi/i,
				noon: /^no/i,
				morning: /morning/i,
				afternoon: /afternoon/i,
				evening: /evening/i,
				night: /night/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getDayOfYear.js
/**
* The {@link getDayOfYear} function options.
*/
/**
* @name getDayOfYear
* @category Day Helpers
* @summary Get the day of the year of the given date.
*
* @description
* Get the day of the year of the given date.
*
* @param date - The given date
* @param options - The options
*
* @returns The day of year
*
* @example
* // Which day of the year is 2 July 2014?
* const result = getDayOfYear(new Date(2014, 6, 2))
* //=> 183
*/
function getDayOfYear(date, options) {
	const _date = toDate(date, options?.in);
	return differenceInCalendarDays(_date, startOfYear(_date)) + 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISOWeek.js
/**
* The {@link getISOWeek} function options.
*/
/**
* @name getISOWeek
* @category ISO Week Helpers
* @summary Get the ISO week of the given date.
*
* @description
* Get the ISO week of the given date.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @param date - The given date
* @param options - The options
*
* @returns The ISO week
*
* @example
* // Which week of the ISO-week numbering year is 2 January 2005?
* const result = getISOWeek(new Date(2005, 0, 2))
* //=> 53
*/
function getISOWeek(date, options) {
	const _date = toDate(date, options?.in);
	const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
	return Math.round(diff / millisecondsInWeek) + 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getWeekYear.js
/**
* The {@link getWeekYear} function options.
*/
/**
* @name getWeekYear
* @category Week-Numbering Year Helpers
* @summary Get the local week-numbering year of the given date.
*
* @description
* Get the local week-numbering year of the given date.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @param date - The given date
* @param options - An object with options.
*
* @returns The local week-numbering year
*
* @example
* // Which week numbering year is 26 December 2004 with the default settings?
* const result = getWeekYear(new Date(2004, 11, 26))
* //=> 2005
*
* @example
* // Which week numbering year is 26 December 2004 if week starts on Saturday?
* const result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
* //=> 2004
*
* @example
* // Which week numbering year is 26 December 2004 if the first week contains 4 January?
* const result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
* //=> 2004
*/
function getWeekYear(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	const defaultOptions = getDefaultOptions$1();
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
	firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
	firstWeekOfNextYear.setHours(0, 0, 0, 0);
	const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
	const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
	firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
	firstWeekOfThisYear.setHours(0, 0, 0, 0);
	const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
	if (+_date >= +startOfNextYear) return year + 1;
	else if (+_date >= +startOfThisYear) return year;
	else return year - 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfWeekYear.js
/**
* The {@link startOfWeekYear} function options.
*/
/**
* @name startOfWeekYear
* @category Week-Numbering Year Helpers
* @summary Return the start of a local week-numbering year for the given date.
*
* @description
* Return the start of a local week-numbering year.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of a week-numbering year
*
* @example
* // The start of an a week-numbering year for 2 July 2005 with default settings:
* const result = startOfWeekYear(new Date(2005, 6, 2))
* //=> Sun Dec 26 2004 00:00:00
*
* @example
* // The start of a week-numbering year for 2 July 2005
* // if Monday is the first day of week
* // and 4 January is always in the first week of the year:
* const result = startOfWeekYear(new Date(2005, 6, 2), {
*   weekStartsOn: 1,
*   firstWeekContainsDate: 4
* })
* //=> Mon Jan 03 2005 00:00:00
*/
function startOfWeekYear(date, options) {
	const defaultOptions = getDefaultOptions$1();
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const year = getWeekYear(date, options);
	const firstWeek = constructFrom(options?.in || date, 0);
	firstWeek.setFullYear(year, 0, firstWeekContainsDate);
	firstWeek.setHours(0, 0, 0, 0);
	return startOfWeek(firstWeek, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getWeek.js
/**
* The {@link getWeek} function options.
*/
/**
* @name getWeek
* @category Week Helpers
* @summary Get the local week index of the given date.
*
* @description
* Get the local week index of the given date.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @param date - The given date
* @param options - An object with options
*
* @returns The week
*
* @example
* // Which week of the local week numbering year is 2 January 2005 with default options?
* const result = getWeek(new Date(2005, 0, 2))
* //=> 2
*
* @example
* // Which week of the local week numbering year is 2 January 2005,
* // if Monday is the first day of the week,
* // and the first week of the year always contains 4 January?
* const result = getWeek(new Date(2005, 0, 2), {
*   weekStartsOn: 1,
*   firstWeekContainsDate: 4
* })
* //=> 53
*/
function getWeek(date, options) {
	const _date = toDate(date, options?.in);
	const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
	return Math.round(diff / millisecondsInWeek) + 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/addLeadingZeros.js
function addLeadingZeros(number, targetLength) {
	return (number < 0 ? "-" : "") + Math.abs(number).toString().padStart(targetLength, "0");
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/lightFormatters.js
var lightFormatters = {
	y(date, token) {
		const signedYear = date.getFullYear();
		const year = signedYear > 0 ? signedYear : 1 - signedYear;
		return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
	},
	M(date, token) {
		const month = date.getMonth();
		return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
	},
	d(date, token) {
		return addLeadingZeros(date.getDate(), token.length);
	},
	a(date, token) {
		const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
		switch (token) {
			case "a":
			case "aa": return dayPeriodEnumValue.toUpperCase();
			case "aaa": return dayPeriodEnumValue;
			case "aaaaa": return dayPeriodEnumValue[0];
			default: return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
		}
	},
	h(date, token) {
		return addLeadingZeros(date.getHours() % 12 || 12, token.length);
	},
	H(date, token) {
		return addLeadingZeros(date.getHours(), token.length);
	},
	m(date, token) {
		return addLeadingZeros(date.getMinutes(), token.length);
	},
	s(date, token) {
		return addLeadingZeros(date.getSeconds(), token.length);
	},
	S(date, token) {
		const numberOfDigits = token.length;
		const milliseconds = date.getMilliseconds();
		return addLeadingZeros(Math.trunc(milliseconds * Math.pow(10, numberOfDigits - 3)), token.length);
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/formatters.js
var dayPeriodEnum = {
	am: "am",
	pm: "pm",
	midnight: "midnight",
	noon: "noon",
	morning: "morning",
	afternoon: "afternoon",
	evening: "evening",
	night: "night"
};
var formatters = {
	G: function(date, token, localize) {
		const era = date.getFullYear() > 0 ? 1 : 0;
		switch (token) {
			case "G":
			case "GG":
			case "GGG": return localize.era(era, { width: "abbreviated" });
			case "GGGGG": return localize.era(era, { width: "narrow" });
			default: return localize.era(era, { width: "wide" });
		}
	},
	y: function(date, token, localize) {
		if (token === "yo") {
			const signedYear = date.getFullYear();
			const year = signedYear > 0 ? signedYear : 1 - signedYear;
			return localize.ordinalNumber(year, { unit: "year" });
		}
		return lightFormatters.y(date, token);
	},
	Y: function(date, token, localize, options) {
		const signedWeekYear = getWeekYear(date, options);
		const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
		if (token === "YY") return addLeadingZeros(weekYear % 100, 2);
		if (token === "Yo") return localize.ordinalNumber(weekYear, { unit: "year" });
		return addLeadingZeros(weekYear, token.length);
	},
	R: function(date, token) {
		return addLeadingZeros(getISOWeekYear(date), token.length);
	},
	u: function(date, token) {
		return addLeadingZeros(date.getFullYear(), token.length);
	},
	Q: function(date, token, localize) {
		const quarter = Math.ceil((date.getMonth() + 1) / 3);
		switch (token) {
			case "Q": return String(quarter);
			case "QQ": return addLeadingZeros(quarter, 2);
			case "Qo": return localize.ordinalNumber(quarter, { unit: "quarter" });
			case "QQQ": return localize.quarter(quarter, {
				width: "abbreviated",
				context: "formatting"
			});
			case "QQQQQ": return localize.quarter(quarter, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.quarter(quarter, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	q: function(date, token, localize) {
		const quarter = Math.ceil((date.getMonth() + 1) / 3);
		switch (token) {
			case "q": return String(quarter);
			case "qq": return addLeadingZeros(quarter, 2);
			case "qo": return localize.ordinalNumber(quarter, { unit: "quarter" });
			case "qqq": return localize.quarter(quarter, {
				width: "abbreviated",
				context: "standalone"
			});
			case "qqqqq": return localize.quarter(quarter, {
				width: "narrow",
				context: "standalone"
			});
			default: return localize.quarter(quarter, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	M: function(date, token, localize) {
		const month = date.getMonth();
		switch (token) {
			case "M":
			case "MM": return lightFormatters.M(date, token);
			case "Mo": return localize.ordinalNumber(month + 1, { unit: "month" });
			case "MMM": return localize.month(month, {
				width: "abbreviated",
				context: "formatting"
			});
			case "MMMMM": return localize.month(month, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.month(month, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	L: function(date, token, localize) {
		const month = date.getMonth();
		switch (token) {
			case "L": return String(month + 1);
			case "LL": return addLeadingZeros(month + 1, 2);
			case "Lo": return localize.ordinalNumber(month + 1, { unit: "month" });
			case "LLL": return localize.month(month, {
				width: "abbreviated",
				context: "standalone"
			});
			case "LLLLL": return localize.month(month, {
				width: "narrow",
				context: "standalone"
			});
			default: return localize.month(month, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	w: function(date, token, localize, options) {
		const week = getWeek(date, options);
		if (token === "wo") return localize.ordinalNumber(week, { unit: "week" });
		return addLeadingZeros(week, token.length);
	},
	I: function(date, token, localize) {
		const isoWeek = getISOWeek(date);
		if (token === "Io") return localize.ordinalNumber(isoWeek, { unit: "week" });
		return addLeadingZeros(isoWeek, token.length);
	},
	d: function(date, token, localize) {
		if (token === "do") return localize.ordinalNumber(date.getDate(), { unit: "date" });
		return lightFormatters.d(date, token);
	},
	D: function(date, token, localize) {
		const dayOfYear = getDayOfYear(date);
		if (token === "Do") return localize.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
		return addLeadingZeros(dayOfYear, token.length);
	},
	E: function(date, token, localize) {
		const dayOfWeek = date.getDay();
		switch (token) {
			case "E":
			case "EE":
			case "EEE": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "formatting"
			});
			case "EEEEE": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return localize.day(dayOfWeek, {
				width: "short",
				context: "formatting"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	e: function(date, token, localize, options) {
		const dayOfWeek = date.getDay();
		const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
		switch (token) {
			case "e": return String(localDayOfWeek);
			case "ee": return addLeadingZeros(localDayOfWeek, 2);
			case "eo": return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
			case "eee": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "formatting"
			});
			case "eeeee": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return localize.day(dayOfWeek, {
				width: "short",
				context: "formatting"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	c: function(date, token, localize, options) {
		const dayOfWeek = date.getDay();
		const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
		switch (token) {
			case "c": return String(localDayOfWeek);
			case "cc": return addLeadingZeros(localDayOfWeek, token.length);
			case "co": return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
			case "ccc": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "standalone"
			});
			case "ccccc": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return localize.day(dayOfWeek, {
				width: "short",
				context: "standalone"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	i: function(date, token, localize) {
		const dayOfWeek = date.getDay();
		const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
		switch (token) {
			case "i": return String(isoDayOfWeek);
			case "ii": return addLeadingZeros(isoDayOfWeek, token.length);
			case "io": return localize.ordinalNumber(isoDayOfWeek, { unit: "day" });
			case "iii": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "formatting"
			});
			case "iiiii": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "formatting"
			});
			case "iiiiii": return localize.day(dayOfWeek, {
				width: "short",
				context: "formatting"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	a: function(date, token, localize) {
		const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
		switch (token) {
			case "a":
			case "aa": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			});
			case "aaa": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "aaaaa": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.dayPeriod(dayPeriodEnumValue, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	b: function(date, token, localize) {
		const hours = date.getHours();
		let dayPeriodEnumValue;
		if (hours === 12) dayPeriodEnumValue = dayPeriodEnum.noon;
		else if (hours === 0) dayPeriodEnumValue = dayPeriodEnum.midnight;
		else dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
		switch (token) {
			case "b":
			case "bb": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			});
			case "bbb": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "bbbbb": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.dayPeriod(dayPeriodEnumValue, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	B: function(date, token, localize) {
		const hours = date.getHours();
		let dayPeriodEnumValue;
		if (hours >= 17) dayPeriodEnumValue = dayPeriodEnum.evening;
		else if (hours >= 12) dayPeriodEnumValue = dayPeriodEnum.afternoon;
		else if (hours >= 4) dayPeriodEnumValue = dayPeriodEnum.morning;
		else dayPeriodEnumValue = dayPeriodEnum.night;
		switch (token) {
			case "B":
			case "BB":
			case "BBB": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			});
			case "BBBBB": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.dayPeriod(dayPeriodEnumValue, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	h: function(date, token, localize) {
		if (token === "ho") {
			let hours = date.getHours() % 12;
			if (hours === 0) hours = 12;
			return localize.ordinalNumber(hours, { unit: "hour" });
		}
		return lightFormatters.h(date, token);
	},
	H: function(date, token, localize) {
		if (token === "Ho") return localize.ordinalNumber(date.getHours(), { unit: "hour" });
		return lightFormatters.H(date, token);
	},
	K: function(date, token, localize) {
		const hours = date.getHours() % 12;
		if (token === "Ko") return localize.ordinalNumber(hours, { unit: "hour" });
		return addLeadingZeros(hours, token.length);
	},
	k: function(date, token, localize) {
		let hours = date.getHours();
		if (hours === 0) hours = 24;
		if (token === "ko") return localize.ordinalNumber(hours, { unit: "hour" });
		return addLeadingZeros(hours, token.length);
	},
	m: function(date, token, localize) {
		if (token === "mo") return localize.ordinalNumber(date.getMinutes(), { unit: "minute" });
		return lightFormatters.m(date, token);
	},
	s: function(date, token, localize) {
		if (token === "so") return localize.ordinalNumber(date.getSeconds(), { unit: "second" });
		return lightFormatters.s(date, token);
	},
	S: function(date, token) {
		return lightFormatters.S(date, token);
	},
	X: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		if (timezoneOffset === 0) return "Z";
		switch (token) {
			case "X": return formatTimezoneWithOptionalMinutes(timezoneOffset);
			case "XXXX":
			case "XX": return formatTimezone(timezoneOffset);
			default: return formatTimezone(timezoneOffset, ":");
		}
	},
	x: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		switch (token) {
			case "x": return formatTimezoneWithOptionalMinutes(timezoneOffset);
			case "xxxx":
			case "xx": return formatTimezone(timezoneOffset);
			default: return formatTimezone(timezoneOffset, ":");
		}
	},
	O: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		switch (token) {
			case "O":
			case "OO":
			case "OOO": return "GMT" + formatTimezoneShort(timezoneOffset, ":");
			default: return "GMT" + formatTimezone(timezoneOffset, ":");
		}
	},
	z: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		switch (token) {
			case "z":
			case "zz":
			case "zzz": return "GMT" + formatTimezoneShort(timezoneOffset, ":");
			default: return "GMT" + formatTimezone(timezoneOffset, ":");
		}
	},
	t: function(date, token, _localize) {
		return addLeadingZeros(Math.trunc(+date / 1e3), token.length);
	},
	T: function(date, token, _localize) {
		return addLeadingZeros(+date, token.length);
	}
};
function formatTimezoneShort(offset, delimiter = "") {
	const sign = offset > 0 ? "-" : "+";
	const absOffset = Math.abs(offset);
	const hours = Math.trunc(absOffset / 60);
	const minutes = absOffset % 60;
	if (minutes === 0) return sign + String(hours);
	return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
	if (offset % 60 === 0) return (offset > 0 ? "-" : "+") + addLeadingZeros(Math.abs(offset) / 60, 2);
	return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
	const sign = offset > 0 ? "-" : "+";
	const absOffset = Math.abs(offset);
	const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
	const minutes = addLeadingZeros(absOffset % 60, 2);
	return sign + hours + delimiter + minutes;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/longFormatters.js
var dateLongFormatter = (pattern, formatLong) => {
	switch (pattern) {
		case "P": return formatLong.date({ width: "short" });
		case "PP": return formatLong.date({ width: "medium" });
		case "PPP": return formatLong.date({ width: "long" });
		default: return formatLong.date({ width: "full" });
	}
};
var timeLongFormatter = (pattern, formatLong) => {
	switch (pattern) {
		case "p": return formatLong.time({ width: "short" });
		case "pp": return formatLong.time({ width: "medium" });
		case "ppp": return formatLong.time({ width: "long" });
		default: return formatLong.time({ width: "full" });
	}
};
var dateTimeLongFormatter = (pattern, formatLong) => {
	const matchResult = pattern.match(/(P+)(p+)?/) || [];
	const datePattern = matchResult[1];
	const timePattern = matchResult[2];
	if (!timePattern) return dateLongFormatter(pattern, formatLong);
	let dateTimeFormat;
	switch (datePattern) {
		case "P":
			dateTimeFormat = formatLong.dateTime({ width: "short" });
			break;
		case "PP":
			dateTimeFormat = formatLong.dateTime({ width: "medium" });
			break;
		case "PPP":
			dateTimeFormat = formatLong.dateTime({ width: "long" });
			break;
		default:
			dateTimeFormat = formatLong.dateTime({ width: "full" });
			break;
	}
	return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong)).replace("{{time}}", timeLongFormatter(timePattern, formatLong));
};
var longFormatters = {
	p: timeLongFormatter,
	P: dateTimeLongFormatter
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/protectedTokens.js
var dayOfYearTokenRE = /^D+$/;
var weekYearTokenRE = /^Y+$/;
var throwTokens = [
	"D",
	"DD",
	"YY",
	"YYYY"
];
function isProtectedDayOfYearToken(token) {
	return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
	return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format, input) {
	const _message = message(token, format, input);
	console.warn(_message);
	if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format, input) {
	const subject = token[0] === "Y" ? "years" : "days of the month";
	return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/format.js
var formattingTokensRegExp$1 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp$1 = /^'([^]*?)'?$/;
var doubleQuoteRegExp$1 = /''/g;
var unescapedLatinCharacterRegExp$1 = /[a-zA-Z]/;
/**
* The {@link format} function options.
*/
/**
* @name format
* @alias formatDate
* @category Common Helpers
* @summary Format the date.
*
* @description
* Return the formatted date string in the given format. The result may vary by locale.
*
* > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
* > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* The characters wrapped between two single quotes characters (') are escaped.
* Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
* (see the last example)
*
* Format of the string is based on Unicode Technical Standard #35:
* https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* with a few additions (see note 7 below the table).
*
* Accepted patterns:
* | Unit                            | Pattern | Result examples                   | Notes |
* |---------------------------------|---------|-----------------------------------|-------|
* | Era                             | G..GGG  | AD, BC                            |       |
* |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
* |                                 | GGGGG   | A, B                              |       |
* | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
* |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
* |                                 | yy      | 44, 01, 00, 17                    | 5     |
* |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
* |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
* |                                 | yyyyy   | ...                               | 3,5   |
* | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
* |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
* |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
* |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
* |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
* |                                 | YYYYY   | ...                               | 3,5   |
* | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
* |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
* |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
* |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
* |                                 | RRRRR   | ...                               | 3,5,7 |
* | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
* |                                 | uu      | -43, 01, 1900, 2017               | 5     |
* |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
* |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
* |                                 | uuuuu   | ...                               | 3,5   |
* | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
* |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
* |                                 | QQ      | 01, 02, 03, 04                    |       |
* |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
* |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
* |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
* | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
* |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
* |                                 | qq      | 01, 02, 03, 04                    |       |
* |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
* |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
* |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
* | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
* |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
* |                                 | MM      | 01, 02, ..., 12                   |       |
* |                                 | MMM     | Jan, Feb, ..., Dec                |       |
* |                                 | MMMM    | January, February, ..., December  | 2     |
* |                                 | MMMMM   | J, F, ..., D                      |       |
* | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
* |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
* |                                 | LL      | 01, 02, ..., 12                   |       |
* |                                 | LLL     | Jan, Feb, ..., Dec                |       |
* |                                 | LLLL    | January, February, ..., December  | 2     |
* |                                 | LLLLL   | J, F, ..., D                      |       |
* | Local week of year              | w       | 1, 2, ..., 53                     |       |
* |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
* |                                 | ww      | 01, 02, ..., 53                   |       |
* | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
* |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
* |                                 | II      | 01, 02, ..., 53                   | 7     |
* | Day of month                    | d       | 1, 2, ..., 31                     |       |
* |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
* |                                 | dd      | 01, 02, ..., 31                   |       |
* | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
* |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
* |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
* |                                 | DDD     | 001, 002, ..., 365, 366           |       |
* |                                 | DDDD    | ...                               | 3     |
* | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
* |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
* |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
* |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
* |                                 | ii      | 01, 02, ..., 07                   | 7     |
* |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
* |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
* |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
* |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
* | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
* |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
* |                                 | ee      | 02, 03, ..., 01                   |       |
* |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
* |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 | eeeee   | M, T, W, T, F, S, S               |       |
* |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
* |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
* |                                 | cc      | 02, 03, ..., 01                   |       |
* |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
* |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 | ccccc   | M, T, W, T, F, S, S               |       |
* |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | AM, PM                          | a..aa   | AM, PM                            |       |
* |                                 | aaa     | am, pm                            |       |
* |                                 | aaaa    | a.m., p.m.                        | 2     |
* |                                 | aaaaa   | a, p                              |       |
* | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
* |                                 | bbb     | am, pm, noon, midnight            |       |
* |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
* |                                 | bbbbb   | a, p, n, mi                       |       |
* | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
* |                                 | BBBB    | at night, in the morning, ...     | 2     |
* |                                 | BBBBB   | at night, in the morning, ...     |       |
* | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
* |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
* |                                 | hh      | 01, 02, ..., 11, 12               |       |
* | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
* |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
* |                                 | HH      | 00, 01, 02, ..., 23               |       |
* | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
* |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
* |                                 | KK      | 01, 02, ..., 11, 00               |       |
* | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
* |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
* |                                 | kk      | 24, 01, 02, ..., 23               |       |
* | Minute                          | m       | 0, 1, ..., 59                     |       |
* |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
* |                                 | mm      | 00, 01, ..., 59                   |       |
* | Second                          | s       | 0, 1, ..., 59                     |       |
* |                                 | so      | 0th, 1st, ..., 59th               | 7     |
* |                                 | ss      | 00, 01, ..., 59                   |       |
* | Fraction of second              | S       | 0, 1, ..., 9                      |       |
* |                                 | SS      | 00, 01, ..., 99                   |       |
* |                                 | SSS     | 000, 001, ..., 999                |       |
* |                                 | SSSS    | ...                               | 3     |
* | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
* |                                 | XX      | -0800, +0530, Z                   |       |
* |                                 | XXX     | -08:00, +05:30, Z                 |       |
* |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
* |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
* | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
* |                                 | xx      | -0800, +0530, +0000               |       |
* |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
* |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
* |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
* | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
* |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
* | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
* |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
* | Seconds timestamp               | t       | 512969520                         | 7     |
* |                                 | tt      | ...                               | 3,7   |
* | Milliseconds timestamp          | T       | 512969520900                      | 7     |
* |                                 | TT      | ...                               | 3,7   |
* | Long localized date             | P       | 04/29/1453                        | 7     |
* |                                 | PP      | Apr 29, 1453                      | 7     |
* |                                 | PPP     | April 29th, 1453                  | 7     |
* |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
* | Long localized time             | p       | 12:00 AM                          | 7     |
* |                                 | pp      | 12:00:00 AM                       | 7     |
* |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
* |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
* | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
* |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
* |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
* |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
* Notes:
* 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
*    are the same as "stand-alone" units, but are different in some languages.
*    "Formatting" units are declined according to the rules of the language
*    in the context of a date. "Stand-alone" units are always nominative singular:
*
*    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
*
*    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
*
* 2. Any sequence of the identical letters is a pattern, unless it is escaped by
*    the single quote characters (see below).
*    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
*    the output will be the same as default pattern for this unit, usually
*    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
*    are marked with "2" in the last column of the table.
*
*    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
*
*    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
*
*    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
*
*    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
*
*    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
*
* 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
*    The output will be padded with zeros to match the length of the pattern.
*
*    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
*
* 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
*    These tokens represent the shortest form of the quarter.
*
* 5. The main difference between `y` and `u` patterns are B.C. years:
*
*    | Year | `y` | `u` |
*    |------|-----|-----|
*    | AC 1 |   1 |   1 |
*    | BC 1 |   1 |   0 |
*    | BC 2 |   2 |  -1 |
*
*    Also `yy` always returns the last two digits of a year,
*    while `uu` pads single digit years to 2 characters and returns other years unchanged:
*
*    | Year | `yy` | `uu` |
*    |------|------|------|
*    | 1    |   01 |   01 |
*    | 14   |   14 |   14 |
*    | 376  |   76 |  376 |
*    | 1453 |   53 | 1453 |
*
*    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
*    except local week-numbering years are dependent on `options.weekStartsOn`
*    and `options.firstWeekContainsDate` (compare [getISOWeekYear](https://date-fns.org/docs/getISOWeekYear)
*    and [getWeekYear](https://date-fns.org/docs/getWeekYear)).
*
* 6. Specific non-location timezones are currently unavailable in `date-fns`,
*    so right now these tokens fall back to GMT timezones.
*
* 7. These patterns are not in the Unicode Technical Standard #35:
*    - `i`: ISO day of week
*    - `I`: ISO week of year
*    - `R`: ISO week-numbering year
*    - `t`: seconds timestamp
*    - `T`: milliseconds timestamp
*    - `o`: ordinal number modifier
*    - `P`: long localized date
*    - `p`: long localized time
*
* 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
*    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
*    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* @param date - The original date
* @param format - The string of tokens
* @param options - An object with options
*
* @returns The formatted date string
*
* @throws `date` must not be Invalid Date
* @throws `options.locale` must contain `localize` property
* @throws `options.locale` must contain `formatLong` property
* @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws format string contains an unescaped latin alphabet character
*
* @example
* // Represent 11 February 2014 in middle-endian format:
* const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
* //=> '02/11/2014'
*
* @example
* // Represent 2 July 2014 in Esperanto:
* import { eoLocale } from 'date-fns/locale/eo'
* const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
*   locale: eoLocale
* })
* //=> '2-a de julio 2014'
*
* @example
* // Escape string by single quote characters:
* const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
* //=> "3 o'clock"
*/
function format(date, formatStr, options) {
	const defaultOptions = getDefaultOptions$1();
	const locale = options?.locale ?? defaultOptions.locale ?? enUS;
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const originalDate = toDate(date, options?.in);
	if (!isValid(originalDate)) throw new RangeError("Invalid time value");
	let parts = formatStr.match(longFormattingTokensRegExp$1).map((substring) => {
		const firstCharacter = substring[0];
		if (firstCharacter === "p" || firstCharacter === "P") {
			const longFormatter = longFormatters[firstCharacter];
			return longFormatter(substring, locale.formatLong);
		}
		return substring;
	}).join("").match(formattingTokensRegExp$1).map((substring) => {
		if (substring === "''") return {
			isToken: false,
			value: "'"
		};
		const firstCharacter = substring[0];
		if (firstCharacter === "'") return {
			isToken: false,
			value: cleanEscapedString$1(substring)
		};
		if (formatters[firstCharacter]) return {
			isToken: true,
			value: substring
		};
		if (firstCharacter.match(unescapedLatinCharacterRegExp$1)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
		return {
			isToken: false,
			value: substring
		};
	});
	if (locale.localize.preprocessor) parts = locale.localize.preprocessor(originalDate, parts);
	const formatterOptions = {
		firstWeekContainsDate,
		weekStartsOn,
		locale
	};
	return parts.map((part) => {
		if (!part.isToken) return part.value;
		const token = part.value;
		if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) warnOrThrowProtectedError(token, formatStr, String(date));
		const formatter = formatters[token[0]];
		return formatter(originalDate, token, locale.localize, formatterOptions);
	}).join("");
}
function cleanEscapedString$1(input) {
	const matched = input.match(escapedStringRegExp$1);
	if (!matched) return input;
	return matched[1].replace(doubleQuoteRegExp$1, "'");
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getDefaultOptions.js
/**
* @name getDefaultOptions
* @category Common Helpers
* @summary Get default options.
* @pure false
*
* @description
* Returns an object that contains defaults for
* `options.locale`, `options.weekStartsOn` and `options.firstWeekContainsDate`
* arguments for all functions.
*
* You can change these with [setDefaultOptions](https://date-fns.org/docs/setDefaultOptions).
*
* @returns The default options
*
* @example
* const result = getDefaultOptions()
* //=> {}
*
* @example
* setDefaultOptions({ weekStarsOn: 1, firstWeekContainsDate: 4 })
* const result = getDefaultOptions()
* //=> { weekStarsOn: 1, firstWeekContainsDate: 4 }
*/
function getDefaultOptions() {
	return Object.assign({}, getDefaultOptions$1());
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISODay.js
/**
* The {@link getISODay} function options.
*/
/**
* @name getISODay
* @category Weekday Helpers
* @summary Get the day of the ISO week of the given date.
*
* @description
* Get the day of the ISO week of the given date,
* which is 7 for Sunday, 1 for Monday etc.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @param date - The given date
* @param options - An object with options
*
* @returns The day of ISO week
*
* @example
* // Which day of the ISO week is 26 February 2012?
* const result = getISODay(new Date(2012, 1, 26))
* //=> 7
*/
function getISODay(date, options) {
	const day = toDate(date, options?.in).getDay();
	return day === 0 ? 7 : day;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/transpose.js
/**
* @name transpose
* @category Generic Helpers
* @summary Transpose the date to the given constructor.
*
* @description
* The function transposes the date to the given constructor. It helps you
* to transpose the date in the system time zone to say `UTCDate` or any other
* date extension.
*
* @typeParam InputDate - The input `Date` type derived from the passed argument.
* @typeParam ResultDate - The result `Date` type derived from the passed constructor.
*
* @param date - The date to use values from
* @param constructor - The date constructor to use
*
* @returns Date transposed to the given constructor
*
* @example
* // Create July 10, 2022 00:00 in locale time zone
* const date = new Date(2022, 6, 10)
* //=> 'Sun Jul 10 2022 00:00:00 GMT+0800 (Singapore Standard Time)'
*
* @example
* // Transpose the date to July 10, 2022 00:00 in UTC
* transpose(date, UTCDate)
* //=> 'Sun Jul 10 2022 00:00:00 GMT+0000 (Coordinated Universal Time)'
*/
function transpose(date, constructor) {
	const date_ = isConstructor(constructor) ? new constructor(0) : constructFrom(constructor, 0);
	date_.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	date_.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
	return date_;
}
function isConstructor(constructor) {
	return typeof constructor === "function" && constructor.prototype?.constructor === constructor;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/Setter.js
var TIMEZONE_UNIT_PRIORITY = 10;
var Setter = class {
	subPriority = 0;
	validate(_utcDate, _options) {
		return true;
	}
};
var ValueSetter = class extends Setter {
	constructor(value, validateValue, setValue, priority, subPriority) {
		super();
		this.value = value;
		this.validateValue = validateValue;
		this.setValue = setValue;
		this.priority = priority;
		if (subPriority) this.subPriority = subPriority;
	}
	validate(date, options) {
		return this.validateValue(date, this.value, options);
	}
	set(date, flags, options) {
		return this.setValue(date, flags, this.value, options);
	}
};
var DateTimezoneSetter = class extends Setter {
	priority = TIMEZONE_UNIT_PRIORITY;
	subPriority = -1;
	constructor(context, reference) {
		super();
		this.context = context || ((date) => constructFrom(reference, date));
	}
	set(date, flags) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, transpose(date, this.context));
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/Parser.js
var Parser = class {
	run(dateString, token, match, options) {
		const result = this.parse(dateString, token, match, options);
		if (!result) return null;
		return {
			setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
			rest: result.rest
		};
	}
	validate(_utcDate, _value, _options) {
		return true;
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/EraParser.js
var EraParser = class extends Parser {
	priority = 140;
	parse(dateString, token, match) {
		switch (token) {
			case "G":
			case "GG":
			case "GGG": return match.era(dateString, { width: "abbreviated" }) || match.era(dateString, { width: "narrow" });
			case "GGGGG": return match.era(dateString, { width: "narrow" });
			default: return match.era(dateString, { width: "wide" }) || match.era(dateString, { width: "abbreviated" }) || match.era(dateString, { width: "narrow" });
		}
	}
	set(date, flags, value) {
		flags.era = value;
		date.setFullYear(value, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"R",
		"u",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/constants.js
var numericPatterns = {
	month: /^(1[0-2]|0?\d)/,
	date: /^(3[0-1]|[0-2]?\d)/,
	dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
	week: /^(5[0-3]|[0-4]?\d)/,
	hour23h: /^(2[0-3]|[0-1]?\d)/,
	hour24h: /^(2[0-4]|[0-1]?\d)/,
	hour11h: /^(1[0-1]|0?\d)/,
	hour12h: /^(1[0-2]|0?\d)/,
	minute: /^[0-5]?\d/,
	second: /^[0-5]?\d/,
	singleDigit: /^\d/,
	twoDigits: /^\d{1,2}/,
	threeDigits: /^\d{1,3}/,
	fourDigits: /^\d{1,4}/,
	anyDigitsSigned: /^-?\d+/,
	singleDigitSigned: /^-?\d/,
	twoDigitsSigned: /^-?\d{1,2}/,
	threeDigitsSigned: /^-?\d{1,3}/,
	fourDigitsSigned: /^-?\d{1,4}/
};
var timezonePatterns = {
	basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
	basic: /^([+-])(\d{2})(\d{2})|Z/,
	basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
	extended: /^([+-])(\d{2}):(\d{2})|Z/,
	extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/utils.js
function mapValue(parseFnResult, mapFn) {
	if (!parseFnResult) return parseFnResult;
	return {
		value: mapFn(parseFnResult.value),
		rest: parseFnResult.rest
	};
}
function parseNumericPattern(pattern, dateString) {
	const matchResult = dateString.match(pattern);
	if (!matchResult) return null;
	return {
		value: parseInt(matchResult[0], 10),
		rest: dateString.slice(matchResult[0].length)
	};
}
function parseTimezonePattern(pattern, dateString) {
	const matchResult = dateString.match(pattern);
	if (!matchResult) return null;
	if (matchResult[0] === "Z") return {
		value: 0,
		rest: dateString.slice(1)
	};
	const sign = matchResult[1] === "+" ? 1 : -1;
	const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
	const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
	const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
	return {
		value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
		rest: dateString.slice(matchResult[0].length)
	};
}
function parseAnyDigitsSigned(dateString) {
	return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
	switch (n) {
		case 1: return parseNumericPattern(numericPatterns.singleDigit, dateString);
		case 2: return parseNumericPattern(numericPatterns.twoDigits, dateString);
		case 3: return parseNumericPattern(numericPatterns.threeDigits, dateString);
		case 4: return parseNumericPattern(numericPatterns.fourDigits, dateString);
		default: return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
	}
}
function parseNDigitsSigned(n, dateString) {
	switch (n) {
		case 1: return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
		case 2: return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
		case 3: return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
		case 4: return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
		default: return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
	}
}
function dayPeriodEnumToHours(dayPeriod) {
	switch (dayPeriod) {
		case "morning": return 4;
		case "evening": return 17;
		case "pm":
		case "noon":
		case "afternoon": return 12;
		default: return 0;
	}
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
	const isCommonEra = currentYear > 0;
	const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
	let result;
	if (absCurrentYear <= 50) result = twoDigitYear || 100;
	else {
		const rangeEnd = absCurrentYear + 50;
		const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
		const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
		result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
	}
	return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex$1(year) {
	return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/YearParser.js
var YearParser = class extends Parser {
	priority = 130;
	incompatibleTokens = [
		"Y",
		"R",
		"u",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	parse(dateString, token, match) {
		const valueCallback = (year) => ({
			year,
			isTwoDigitYear: token === "yy"
		});
		switch (token) {
			case "y": return mapValue(parseNDigits(4, dateString), valueCallback);
			case "yo": return mapValue(match.ordinalNumber(dateString, { unit: "year" }), valueCallback);
			default: return mapValue(parseNDigits(token.length, dateString), valueCallback);
		}
	}
	validate(_date, value) {
		return value.isTwoDigitYear || value.year > 0;
	}
	set(date, flags, value) {
		const currentYear = date.getFullYear();
		if (value.isTwoDigitYear) {
			const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
			date.setFullYear(normalizedTwoDigitYear, 0, 1);
			date.setHours(0, 0, 0, 0);
			return date;
		}
		const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
		date.setFullYear(year, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/LocalWeekYearParser.js
var LocalWeekYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token, match) {
		const valueCallback = (year) => ({
			year,
			isTwoDigitYear: token === "YY"
		});
		switch (token) {
			case "Y": return mapValue(parseNDigits(4, dateString), valueCallback);
			case "Yo": return mapValue(match.ordinalNumber(dateString, { unit: "year" }), valueCallback);
			default: return mapValue(parseNDigits(token.length, dateString), valueCallback);
		}
	}
	validate(_date, value) {
		return value.isTwoDigitYear || value.year > 0;
	}
	set(date, flags, value, options) {
		const currentYear = getWeekYear(date, options);
		if (value.isTwoDigitYear) {
			const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
			date.setFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
			date.setHours(0, 0, 0, 0);
			return startOfWeek(date, options);
		}
		const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
		date.setFullYear(year, 0, options.firstWeekContainsDate);
		date.setHours(0, 0, 0, 0);
		return startOfWeek(date, options);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/ISOWeekYearParser.js
var ISOWeekYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token) {
		if (token === "R") return parseNDigitsSigned(4, dateString);
		return parseNDigitsSigned(token.length, dateString);
	}
	set(date, _flags, value) {
		const firstWeekOfYear = constructFrom(date, 0);
		firstWeekOfYear.setFullYear(value, 0, 4);
		firstWeekOfYear.setHours(0, 0, 0, 0);
		return startOfISOWeek(firstWeekOfYear);
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/ExtendedYearParser.js
var ExtendedYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token) {
		if (token === "u") return parseNDigitsSigned(4, dateString);
		return parseNDigitsSigned(token.length, dateString);
	}
	set(date, _flags, value) {
		date.setFullYear(value, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"R",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/QuarterParser.js
var QuarterParser = class extends Parser {
	priority = 120;
	parse(dateString, token, match) {
		switch (token) {
			case "Q":
			case "QQ": return parseNDigits(token.length, dateString);
			case "Qo": return match.ordinalNumber(dateString, { unit: "quarter" });
			case "QQQ": return match.quarter(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "QQQQQ": return match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.quarter(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 4;
	}
	set(date, _flags, value) {
		date.setMonth((value - 1) * 3, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/StandAloneQuarterParser.js
var StandAloneQuarterParser = class extends Parser {
	priority = 120;
	parse(dateString, token, match) {
		switch (token) {
			case "q":
			case "qq": return parseNDigits(token.length, dateString);
			case "qo": return match.ordinalNumber(dateString, { unit: "quarter" });
			case "qqq": return match.quarter(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "qqqqq": return match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
			default: return match.quarter(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 4;
	}
	set(date, _flags, value) {
		date.setMonth((value - 1) * 3, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/MonthParser.js
var MonthParser = class extends Parser {
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"L",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	priority = 110;
	parse(dateString, token, match) {
		const valueCallback = (value) => value - 1;
		switch (token) {
			case "M": return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);
			case "MM": return mapValue(parseNDigits(2, dateString), valueCallback);
			case "Mo": return mapValue(match.ordinalNumber(dateString, { unit: "month" }), valueCallback);
			case "MMM": return match.month(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "MMMMM": return match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.month(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.month(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		date.setMonth(value, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/StandAloneMonthParser.js
var StandAloneMonthParser = class extends Parser {
	priority = 110;
	parse(dateString, token, match) {
		const valueCallback = (value) => value - 1;
		switch (token) {
			case "L": return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);
			case "LL": return mapValue(parseNDigits(2, dateString), valueCallback);
			case "Lo": return mapValue(match.ordinalNumber(dateString, { unit: "month" }), valueCallback);
			case "LLL": return match.month(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "LLLLL": return match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
			default: return match.month(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.month(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		date.setMonth(value, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/setWeek.js
/**
* The {@link setWeek} function options.
*/
/**
* @name setWeek
* @category Week Helpers
* @summary Set the local week to the given date.
*
* @description
* Set the local week to the given date, saving the weekday number.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param week - The week of the new date
* @param options - An object with options
*
* @returns The new date with the local week set
*
* @example
* // Set the 1st week to 2 January 2005 with default options:
* const result = setWeek(new Date(2005, 0, 2), 1)
* //=> Sun Dec 26 2004 00:00:00
*
* @example
* // Set the 1st week to 2 January 2005,
* // if Monday is the first day of the week,
* // and the first week of the year always contains 4 January:
* const result = setWeek(new Date(2005, 0, 2), 1, {
*   weekStartsOn: 1,
*   firstWeekContainsDate: 4
* })
* //=> Sun Jan 4 2004 00:00:00
*/
function setWeek(date, week, options) {
	const date_ = toDate(date, options?.in);
	const diff = getWeek(date_, options) - week;
	date_.setDate(date_.getDate() - diff * 7);
	return toDate(date_, options?.in);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/LocalWeekParser.js
var LocalWeekParser = class extends Parser {
	priority = 100;
	parse(dateString, token, match) {
		switch (token) {
			case "w": return parseNumericPattern(numericPatterns.week, dateString);
			case "wo": return match.ordinalNumber(dateString, { unit: "week" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 53;
	}
	set(date, _flags, value, options) {
		return startOfWeek(setWeek(date, value, options), options);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/setISOWeek.js
/**
* The {@link setISOWeek} function options.
*/
/**
* @name setISOWeek
* @category ISO Week Helpers
* @summary Set the ISO week to the given date.
*
* @description
* Set the ISO week to the given date, saving the weekday number.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The `Date` type of the context function.
*
* @param date - The date to be changed
* @param week - The ISO week of the new date
* @param options - An object with options
*
* @returns The new date with the ISO week set
*
* @example
* // Set the 53rd ISO week to 7 August 2004:
* const result = setISOWeek(new Date(2004, 7, 7), 53)
* //=> Sat Jan 01 2005 00:00:00
*/
function setISOWeek(date, week, options) {
	const _date = toDate(date, options?.in);
	const diff = getISOWeek(_date, options) - week;
	_date.setDate(_date.getDate() - diff * 7);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/ISOWeekParser.js
var ISOWeekParser = class extends Parser {
	priority = 100;
	parse(dateString, token, match) {
		switch (token) {
			case "I": return parseNumericPattern(numericPatterns.week, dateString);
			case "Io": return match.ordinalNumber(dateString, { unit: "week" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 53;
	}
	set(date, _flags, value) {
		return startOfISOWeek(setISOWeek(date, value));
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/DateParser.js
var DAYS_IN_MONTH = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var DAYS_IN_MONTH_LEAP_YEAR = [
	31,
	29,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var DateParser = class extends Parser {
	priority = 90;
	subPriority = 1;
	parse(dateString, token, match) {
		switch (token) {
			case "d": return parseNumericPattern(numericPatterns.date, dateString);
			case "do": return match.ordinalNumber(dateString, { unit: "date" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(date, value) {
		const isLeapYear = isLeapYearIndex$1(date.getFullYear());
		const month = date.getMonth();
		if (isLeapYear) return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
		else return value >= 1 && value <= DAYS_IN_MONTH[month];
	}
	set(date, _flags, value) {
		date.setDate(value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/DayOfYearParser.js
var DayOfYearParser = class extends Parser {
	priority = 90;
	subpriority = 1;
	parse(dateString, token, match) {
		switch (token) {
			case "D":
			case "DD": return parseNumericPattern(numericPatterns.dayOfYear, dateString);
			case "Do": return match.ordinalNumber(dateString, { unit: "date" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(date, value) {
		if (isLeapYearIndex$1(date.getFullYear())) return value >= 1 && value <= 366;
		else return value >= 1 && value <= 365;
	}
	set(date, _flags, value) {
		date.setMonth(0, value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"E",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/setDay.js
/**
* The {@link setDay} function options.
*/
/**
* @name setDay
* @category Weekday Helpers
* @summary Set the day of the week to the given date.
*
* @description
* Set the day of the week to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param day - The day of the week of the new date
* @param options - An object with options.
*
* @returns The new date with the day of the week set
*
* @example
* // Set week day to Sunday, with the default weekStartsOn of Sunday:
* const result = setDay(new Date(2014, 8, 1), 0)
* //=> Sun Aug 31 2014 00:00:00
*
* @example
* // Set week day to Sunday, with a weekStartsOn of Monday:
* const result = setDay(new Date(2014, 8, 1), 0, { weekStartsOn: 1 })
* //=> Sun Sep 07 2014 00:00:00
*/
function setDay(date, day, options) {
	const defaultOptions = getDefaultOptions$1();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const date_ = toDate(date, options?.in);
	const currentDay = date_.getDay();
	const dayIndex = (day % 7 + 7) % 7;
	const delta = 7 - weekStartsOn;
	return addDays(date_, day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7, options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/DayParser.js
var DayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match) {
		switch (token) {
			case "E":
			case "EE":
			case "EEE": return match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEE": return match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/LocalDayParser.js
var LocalDayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match, options) {
		const valueCallback = (value) => {
			const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
			return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
		};
		switch (token) {
			case "e":
			case "ee": return mapValue(parseNDigits(token.length, dateString), valueCallback);
			case "eo": return mapValue(match.ordinalNumber(dateString, { unit: "day" }), valueCallback);
			case "eee": return match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeee": return match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/StandAloneLocalDayParser.js
var StandAloneLocalDayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match, options) {
		const valueCallback = (value) => {
			const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
			return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
		};
		switch (token) {
			case "c":
			case "cc": return mapValue(parseNDigits(token.length, dateString), valueCallback);
			case "co": return mapValue(match.ordinalNumber(dateString, { unit: "day" }), valueCallback);
			case "ccc": return match.day(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "ccccc": return match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			default: return match.day(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"e",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/setISODay.js
/**
* The {@link setISODay} function options.
*/
/**
* @name setISODay
* @category Weekday Helpers
* @summary Set the day of the ISO week to the given date.
*
* @description
* Set the day of the ISO week to the given date.
* ISO week starts with Monday.
* 7 is the index of Sunday, 1 is the index of Monday, etc.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param day - The day of the ISO week of the new date
* @param options - An object with options
*
* @returns The new date with the day of the ISO week set
*
* @example
* // Set Sunday to 1 September 2014:
* const result = setISODay(new Date(2014, 8, 1), 7)
* //=> Sun Sep 07 2014 00:00:00
*/
function setISODay(date, day, options) {
	const date_ = toDate(date, options?.in);
	return addDays(date_, day - getISODay(date_, options), options);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/ISODayParser.js
var ISODayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match) {
		const valueCallback = (value) => {
			if (value === 0) return 7;
			return value;
		};
		switch (token) {
			case "i":
			case "ii": return parseNDigits(token.length, dateString);
			case "io": return match.ordinalNumber(dateString, { unit: "day" });
			case "iii": return mapValue(match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiiii": return mapValue(match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiiiii": return mapValue(match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			default: return mapValue(match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 7;
	}
	set(date, _flags, value) {
		date = setISODay(date, value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"E",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/AMPMParser.js
var AMPMParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "a":
			case "aa":
			case "aaa": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "aaaaa": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"b",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/AMPMMidnightParser.js
var AMPMMidnightParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "b":
			case "bb":
			case "bbb": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "bbbbb": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/DayPeriodParser.js
var DayPeriodParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "B":
			case "BB":
			case "BBB": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "BBBBB": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/Hour1to12Parser.js
var Hour1to12Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "h": return parseNumericPattern(numericPatterns.hour12h, dateString);
			case "ho": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 12;
	}
	set(date, _flags, value) {
		const isPM = date.getHours() >= 12;
		if (isPM && value < 12) date.setHours(value + 12, 0, 0, 0);
		else if (!isPM && value === 12) date.setHours(0, 0, 0, 0);
		else date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"H",
		"K",
		"k",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/Hour0to23Parser.js
var Hour0to23Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "H": return parseNumericPattern(numericPatterns.hour23h, dateString);
			case "Ho": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 23;
	}
	set(date, _flags, value) {
		date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"K",
		"k",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/Hour0To11Parser.js
var Hour0To11Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "K": return parseNumericPattern(numericPatterns.hour11h, dateString);
			case "Ko": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		if (date.getHours() >= 12 && value < 12) date.setHours(value + 12, 0, 0, 0);
		else date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"h",
		"H",
		"k",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/Hour1To24Parser.js
var Hour1To24Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "k": return parseNumericPattern(numericPatterns.hour24h, dateString);
			case "ko": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 24;
	}
	set(date, _flags, value) {
		const hours = value <= 24 ? value % 24 : value;
		date.setHours(hours, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"H",
		"K",
		"t",
		"T"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/MinuteParser.js
var MinuteParser = class extends Parser {
	priority = 60;
	parse(dateString, token, match) {
		switch (token) {
			case "m": return parseNumericPattern(numericPatterns.minute, dateString);
			case "mo": return match.ordinalNumber(dateString, { unit: "minute" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 59;
	}
	set(date, _flags, value) {
		date.setMinutes(value, 0, 0);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/SecondParser.js
var SecondParser = class extends Parser {
	priority = 50;
	parse(dateString, token, match) {
		switch (token) {
			case "s": return parseNumericPattern(numericPatterns.second, dateString);
			case "so": return match.ordinalNumber(dateString, { unit: "second" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 59;
	}
	set(date, _flags, value) {
		date.setSeconds(value, 0);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/FractionOfSecondParser.js
var FractionOfSecondParser = class extends Parser {
	priority = 30;
	parse(dateString, token) {
		const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
		return mapValue(parseNDigits(token.length, dateString), valueCallback);
	}
	set(date, _flags, value) {
		date.setMilliseconds(value);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/ISOTimezoneWithZParser.js
var ISOTimezoneWithZParser = class extends Parser {
	priority = 10;
	parse(dateString, token) {
		switch (token) {
			case "X": return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
			case "XX": return parseTimezonePattern(timezonePatterns.basic, dateString);
			case "XXXX": return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
			case "XXXXX": return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
			default: return parseTimezonePattern(timezonePatterns.extended, dateString);
		}
	}
	set(date, flags, value) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
	}
	incompatibleTokens = [
		"t",
		"T",
		"x"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/ISOTimezoneParser.js
var ISOTimezoneParser = class extends Parser {
	priority = 10;
	parse(dateString, token) {
		switch (token) {
			case "x": return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
			case "xx": return parseTimezonePattern(timezonePatterns.basic, dateString);
			case "xxxx": return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
			case "xxxxx": return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
			default: return parseTimezonePattern(timezonePatterns.extended, dateString);
		}
	}
	set(date, flags, value) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
	}
	incompatibleTokens = [
		"t",
		"T",
		"X"
	];
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/TimestampSecondsParser.js
var TimestampSecondsParser = class extends Parser {
	priority = 40;
	parse(dateString) {
		return parseAnyDigitsSigned(dateString);
	}
	set(date, _flags, value) {
		return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
	}
	incompatibleTokens = "*";
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers/TimestampMillisecondsParser.js
var TimestampMillisecondsParser = class extends Parser {
	priority = 20;
	parse(dateString) {
		return parseAnyDigitsSigned(dateString);
	}
	set(date, _flags, value) {
		return [constructFrom(date, value), { timestampIsSet: true }];
	}
	incompatibleTokens = "*";
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse/_lib/parsers.js
var parsers = {
	G: new EraParser(),
	y: new YearParser(),
	Y: new LocalWeekYearParser(),
	R: new ISOWeekYearParser(),
	u: new ExtendedYearParser(),
	Q: new QuarterParser(),
	q: new StandAloneQuarterParser(),
	M: new MonthParser(),
	L: new StandAloneMonthParser(),
	w: new LocalWeekParser(),
	I: new ISOWeekParser(),
	d: new DateParser(),
	D: new DayOfYearParser(),
	E: new DayParser(),
	e: new LocalDayParser(),
	c: new StandAloneLocalDayParser(),
	i: new ISODayParser(),
	a: new AMPMParser(),
	b: new AMPMMidnightParser(),
	B: new DayPeriodParser(),
	h: new Hour1to12Parser(),
	H: new Hour0to23Parser(),
	K: new Hour0To11Parser(),
	k: new Hour1To24Parser(),
	m: new MinuteParser(),
	s: new SecondParser(),
	S: new FractionOfSecondParser(),
	X: new ISOTimezoneWithZParser(),
	x: new ISOTimezoneParser(),
	t: new TimestampSecondsParser(),
	T: new TimestampMillisecondsParser()
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parse.js
/**
* The {@link parse} function options.
*/
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
/**
* @name parse
* @category Common Helpers
* @summary Parse the date.
*
* @description
* Return the date parsed from string using the given format string.
*
* > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
* > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* The characters in the format string wrapped between two single quotes characters (') are escaped.
* Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
*
* Format of the format string is based on Unicode Technical Standard #35:
* https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* with a few additions (see note 5 below the table).
*
* Not all tokens are compatible. Combinations that don't make sense or could lead to bugs are prohibited
* and will throw `RangeError`. For example usage of 24-hour format token with AM/PM token will throw an exception:
*
* ```javascript
* parse('23 AM', 'HH a', new Date())
* //=> RangeError: The format string mustn't contain `HH` and `a` at the same time
* ```
*
* See the compatibility table: https://docs.google.com/spreadsheets/d/e/2PACX-1vQOPU3xUhplll6dyoMmVUXHKl_8CRDs6_ueLmex3SoqwhuolkuN3O05l4rqx5h1dKX8eb46Ul-CCSrq/pubhtml?gid=0&single=true
*
* Accepted format string patterns:
* | Unit                            |Prior| Pattern | Result examples                   | Notes |
* |---------------------------------|-----|---------|-----------------------------------|-------|
* | Era                             | 140 | G..GGG  | AD, BC                            |       |
* |                                 |     | GGGG    | Anno Domini, Before Christ        | 2     |
* |                                 |     | GGGGG   | A, B                              |       |
* | Calendar year                   | 130 | y       | 44, 1, 1900, 2017, 9999           | 4     |
* |                                 |     | yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
* |                                 |     | yy      | 44, 01, 00, 17                    | 4     |
* |                                 |     | yyy     | 044, 001, 123, 999                | 4     |
* |                                 |     | yyyy    | 0044, 0001, 1900, 2017            | 4     |
* |                                 |     | yyyyy   | ...                               | 2,4   |
* | Local week-numbering year       | 130 | Y       | 44, 1, 1900, 2017, 9000           | 4     |
* |                                 |     | Yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
* |                                 |     | YY      | 44, 01, 00, 17                    | 4,6   |
* |                                 |     | YYY     | 044, 001, 123, 999                | 4     |
* |                                 |     | YYYY    | 0044, 0001, 1900, 2017            | 4,6   |
* |                                 |     | YYYYY   | ...                               | 2,4   |
* | ISO week-numbering year         | 130 | R       | -43, 1, 1900, 2017, 9999, -9999   | 4,5   |
* |                                 |     | RR      | -43, 01, 00, 17                   | 4,5   |
* |                                 |     | RRR     | -043, 001, 123, 999, -999         | 4,5   |
* |                                 |     | RRRR    | -0043, 0001, 2017, 9999, -9999    | 4,5   |
* |                                 |     | RRRRR   | ...                               | 2,4,5 |
* | Extended year                   | 130 | u       | -43, 1, 1900, 2017, 9999, -999    | 4     |
* |                                 |     | uu      | -43, 01, 99, -99                  | 4     |
* |                                 |     | uuu     | -043, 001, 123, 999, -999         | 4     |
* |                                 |     | uuuu    | -0043, 0001, 2017, 9999, -9999    | 4     |
* |                                 |     | uuuuu   | ...                               | 2,4   |
* | Quarter (formatting)            | 120 | Q       | 1, 2, 3, 4                        |       |
* |                                 |     | Qo      | 1st, 2nd, 3rd, 4th                | 5     |
* |                                 |     | QQ      | 01, 02, 03, 04                    |       |
* |                                 |     | QQQ     | Q1, Q2, Q3, Q4                    |       |
* |                                 |     | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
* |                                 |     | QQQQQ   | 1, 2, 3, 4                        | 4     |
* | Quarter (stand-alone)           | 120 | q       | 1, 2, 3, 4                        |       |
* |                                 |     | qo      | 1st, 2nd, 3rd, 4th                | 5     |
* |                                 |     | qq      | 01, 02, 03, 04                    |       |
* |                                 |     | qqq     | Q1, Q2, Q3, Q4                    |       |
* |                                 |     | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
* |                                 |     | qqqqq   | 1, 2, 3, 4                        | 3     |
* | Month (formatting)              | 110 | M       | 1, 2, ..., 12                     |       |
* |                                 |     | Mo      | 1st, 2nd, ..., 12th               | 5     |
* |                                 |     | MM      | 01, 02, ..., 12                   |       |
* |                                 |     | MMM     | Jan, Feb, ..., Dec                |       |
* |                                 |     | MMMM    | January, February, ..., December  | 2     |
* |                                 |     | MMMMM   | J, F, ..., D                      |       |
* | Month (stand-alone)             | 110 | L       | 1, 2, ..., 12                     |       |
* |                                 |     | Lo      | 1st, 2nd, ..., 12th               | 5     |
* |                                 |     | LL      | 01, 02, ..., 12                   |       |
* |                                 |     | LLL     | Jan, Feb, ..., Dec                |       |
* |                                 |     | LLLL    | January, February, ..., December  | 2     |
* |                                 |     | LLLLL   | J, F, ..., D                      |       |
* | Local week of year              | 100 | w       | 1, 2, ..., 53                     |       |
* |                                 |     | wo      | 1st, 2nd, ..., 53th               | 5     |
* |                                 |     | ww      | 01, 02, ..., 53                   |       |
* | ISO week of year                | 100 | I       | 1, 2, ..., 53                     | 5     |
* |                                 |     | Io      | 1st, 2nd, ..., 53th               | 5     |
* |                                 |     | II      | 01, 02, ..., 53                   | 5     |
* | Day of month                    |  90 | d       | 1, 2, ..., 31                     |       |
* |                                 |     | do      | 1st, 2nd, ..., 31st               | 5     |
* |                                 |     | dd      | 01, 02, ..., 31                   |       |
* | Day of year                     |  90 | D       | 1, 2, ..., 365, 366               | 7     |
* |                                 |     | Do      | 1st, 2nd, ..., 365th, 366th       | 5     |
* |                                 |     | DD      | 01, 02, ..., 365, 366             | 7     |
* |                                 |     | DDD     | 001, 002, ..., 365, 366           |       |
* |                                 |     | DDDD    | ...                               | 2     |
* | Day of week (formatting)        |  90 | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
* |                                 |     | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 |     | EEEEE   | M, T, W, T, F, S, S               |       |
* |                                 |     | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | ISO day of week (formatting)    |  90 | i       | 1, 2, 3, ..., 7                   | 5     |
* |                                 |     | io      | 1st, 2nd, ..., 7th                | 5     |
* |                                 |     | ii      | 01, 02, ..., 07                   | 5     |
* |                                 |     | iii     | Mon, Tue, Wed, ..., Sun           | 5     |
* |                                 |     | iiii    | Monday, Tuesday, ..., Sunday      | 2,5   |
* |                                 |     | iiiii   | M, T, W, T, F, S, S               | 5     |
* |                                 |     | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 5     |
* | Local day of week (formatting)  |  90 | e       | 2, 3, 4, ..., 1                   |       |
* |                                 |     | eo      | 2nd, 3rd, ..., 1st                | 5     |
* |                                 |     | ee      | 02, 03, ..., 01                   |       |
* |                                 |     | eee     | Mon, Tue, Wed, ..., Sun           |       |
* |                                 |     | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 |     | eeeee   | M, T, W, T, F, S, S               |       |
* |                                 |     | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | Local day of week (stand-alone) |  90 | c       | 2, 3, 4, ..., 1                   |       |
* |                                 |     | co      | 2nd, 3rd, ..., 1st                | 5     |
* |                                 |     | cc      | 02, 03, ..., 01                   |       |
* |                                 |     | ccc     | Mon, Tue, Wed, ..., Sun           |       |
* |                                 |     | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 |     | ccccc   | M, T, W, T, F, S, S               |       |
* |                                 |     | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | AM, PM                          |  80 | a..aaa  | AM, PM                            |       |
* |                                 |     | aaaa    | a.m., p.m.                        | 2     |
* |                                 |     | aaaaa   | a, p                              |       |
* | AM, PM, noon, midnight          |  80 | b..bbb  | AM, PM, noon, midnight            |       |
* |                                 |     | bbbb    | a.m., p.m., noon, midnight        | 2     |
* |                                 |     | bbbbb   | a, p, n, mi                       |       |
* | Flexible day period             |  80 | B..BBB  | at night, in the morning, ...     |       |
* |                                 |     | BBBB    | at night, in the morning, ...     | 2     |
* |                                 |     | BBBBB   | at night, in the morning, ...     |       |
* | Hour [1-12]                     |  70 | h       | 1, 2, ..., 11, 12                 |       |
* |                                 |     | ho      | 1st, 2nd, ..., 11th, 12th         | 5     |
* |                                 |     | hh      | 01, 02, ..., 11, 12               |       |
* | Hour [0-23]                     |  70 | H       | 0, 1, 2, ..., 23                  |       |
* |                                 |     | Ho      | 0th, 1st, 2nd, ..., 23rd          | 5     |
* |                                 |     | HH      | 00, 01, 02, ..., 23               |       |
* | Hour [0-11]                     |  70 | K       | 1, 2, ..., 11, 0                  |       |
* |                                 |     | Ko      | 1st, 2nd, ..., 11th, 0th          | 5     |
* |                                 |     | KK      | 01, 02, ..., 11, 00               |       |
* | Hour [1-24]                     |  70 | k       | 24, 1, 2, ..., 23                 |       |
* |                                 |     | ko      | 24th, 1st, 2nd, ..., 23rd         | 5     |
* |                                 |     | kk      | 24, 01, 02, ..., 23               |       |
* | Minute                          |  60 | m       | 0, 1, ..., 59                     |       |
* |                                 |     | mo      | 0th, 1st, ..., 59th               | 5     |
* |                                 |     | mm      | 00, 01, ..., 59                   |       |
* | Second                          |  50 | s       | 0, 1, ..., 59                     |       |
* |                                 |     | so      | 0th, 1st, ..., 59th               | 5     |
* |                                 |     | ss      | 00, 01, ..., 59                   |       |
* | Seconds timestamp               |  40 | t       | 512969520                         |       |
* |                                 |     | tt      | ...                               | 2     |
* | Fraction of second              |  30 | S       | 0, 1, ..., 9                      |       |
* |                                 |     | SS      | 00, 01, ..., 99                   |       |
* |                                 |     | SSS     | 000, 001, ..., 999                |       |
* |                                 |     | SSSS    | ...                               | 2     |
* | Milliseconds timestamp          |  20 | T       | 512969520900                      |       |
* |                                 |     | TT      | ...                               | 2     |
* | Timezone (ISO-8601 w/ Z)        |  10 | X       | -08, +0530, Z                     |       |
* |                                 |     | XX      | -0800, +0530, Z                   |       |
* |                                 |     | XXX     | -08:00, +05:30, Z                 |       |
* |                                 |     | XXXX    | -0800, +0530, Z, +123456          | 2     |
* |                                 |     | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
* | Timezone (ISO-8601 w/o Z)       |  10 | x       | -08, +0530, +00                   |       |
* |                                 |     | xx      | -0800, +0530, +0000               |       |
* |                                 |     | xxx     | -08:00, +05:30, +00:00            | 2     |
* |                                 |     | xxxx    | -0800, +0530, +0000, +123456      |       |
* |                                 |     | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
* | Long localized date             |  NA | P       | 05/29/1453                        | 5,8   |
* |                                 |     | PP      | May 29, 1453                      |       |
* |                                 |     | PPP     | May 29th, 1453                    |       |
* |                                 |     | PPPP    | Sunday, May 29th, 1453            | 2,5,8 |
* | Long localized time             |  NA | p       | 12:00 AM                          | 5,8   |
* |                                 |     | pp      | 12:00:00 AM                       |       |
* | Combination of date and time    |  NA | Pp      | 05/29/1453, 12:00 AM              |       |
* |                                 |     | PPpp    | May 29, 1453, 12:00:00 AM         |       |
* |                                 |     | PPPpp   | May 29th, 1453 at ...             |       |
* |                                 |     | PPPPpp  | Sunday, May 29th, 1453 at ...     | 2,5,8 |
* Notes:
* 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
*    are the same as "stand-alone" units, but are different in some languages.
*    "Formatting" units are declined according to the rules of the language
*    in the context of a date. "Stand-alone" units are always nominative singular.
*    In `format` function, they will produce different result:
*
*    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
*
*    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
*
*    `parse` will try to match both formatting and stand-alone units interchangeably.
*
* 2. Any sequence of the identical letters is a pattern, unless it is escaped by
*    the single quote characters (see below).
*    If the sequence is longer than listed in table:
*    - for numerical units (`yyyyyyyy`) `parse` will try to match a number
*      as wide as the sequence
*    - for text units (`MMMMMMMM`) `parse` will try to match the widest variation of the unit.
*      These variations are marked with "2" in the last column of the table.
*
* 3. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
*    These tokens represent the shortest form of the quarter.
*
* 4. The main difference between `y` and `u` patterns are B.C. years:
*
*    | Year | `y` | `u` |
*    |------|-----|-----|
*    | AC 1 |   1 |   1 |
*    | BC 1 |   1 |   0 |
*    | BC 2 |   2 |  -1 |
*
*    Also `yy` will try to guess the century of two digit year by proximity with `referenceDate`:
*
*    `parse('50', 'yy', new Date(2018, 0, 1)) //=> Sat Jan 01 2050 00:00:00`
*
*    `parse('75', 'yy', new Date(2018, 0, 1)) //=> Wed Jan 01 1975 00:00:00`
*
*    while `uu` will just assign the year as is:
*
*    `parse('50', 'uu', new Date(2018, 0, 1)) //=> Sat Jan 01 0050 00:00:00`
*
*    `parse('75', 'uu', new Date(2018, 0, 1)) //=> Tue Jan 01 0075 00:00:00`
*
*    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
*    except local week-numbering years are dependent on `options.weekStartsOn`
*    and `options.firstWeekContainsDate` (compare [setISOWeekYear](https://date-fns.org/docs/setISOWeekYear)
*    and [setWeekYear](https://date-fns.org/docs/setWeekYear)).
*
* 5. These patterns are not in the Unicode Technical Standard #35:
*    - `i`: ISO day of week
*    - `I`: ISO week of year
*    - `R`: ISO week-numbering year
*    - `o`: ordinal number modifier
*    - `P`: long localized date
*    - `p`: long localized time
*
* 6. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
*    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* 7. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
*    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* 8. `P+` tokens do not have a defined priority since they are merely aliases to other tokens based
*    on the given locale.
*
*    using `en-US` locale: `P` => `MM/dd/yyyy`
*    using `en-US` locale: `p` => `hh:mm a`
*    using `pt-BR` locale: `P` => `dd/MM/yyyy`
*    using `pt-BR` locale: `p` => `HH:mm`
*
* Values will be assigned to the date in the descending order of its unit's priority.
* Units of an equal priority overwrite each other in the order of appearance.
*
* If no values of higher priority are parsed (e.g. when parsing string 'January 1st' without a year),
* the values will be taken from 3rd argument `referenceDate` which works as a context of parsing.
*
* `referenceDate` must be passed for correct work of the function.
* If you're not sure which `referenceDate` to supply, create a new instance of Date:
* `parse('02/11/2014', 'MM/dd/yyyy', new Date())`
* In this case parsing will be done in the context of the current date.
* If `referenceDate` is `Invalid Date` or a value not convertible to valid `Date`,
* then `Invalid Date` will be returned.
*
* The result may vary by locale.
*
* If `formatString` matches with `dateString` but does not provides tokens, `referenceDate` will be returned.
*
* If parsing failed, `Invalid Date` will be returned.
* Invalid Date is a Date, whose time value is NaN.
* Time value of Date: http://es5.github.io/#x15.9.1.1
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param dateStr - The string to parse
* @param formatStr - The string of tokens
* @param referenceDate - defines values missing from the parsed dateString
* @param options - An object with options.
*   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* @returns The parsed date
*
* @throws `options.locale` must contain `match` property
* @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws format string contains an unescaped latin alphabet character
*
* @example
* // Parse 11 February 2014 from middle-endian format:
* var result = parse('02/11/2014', 'MM/dd/yyyy', new Date())
* //=> Tue Feb 11 2014 00:00:00
*
* @example
* // Parse 28th of February in Esperanto locale in the context of 2010 year:
* import eo from 'date-fns/locale/eo'
* var result = parse('28-a de februaro', "do 'de' MMMM", new Date(2010, 0, 1), {
*   locale: eo
* })
* //=> Sun Feb 28 2010 00:00:00
*/
function parse(dateStr, formatStr, referenceDate, options) {
	const invalidDate = () => constructFrom(options?.in || referenceDate, NaN);
	const defaultOptions = getDefaultOptions();
	const locale = options?.locale ?? defaultOptions.locale ?? enUS;
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	if (!formatStr) return dateStr ? invalidDate() : toDate(referenceDate, options?.in);
	const subFnOptions = {
		firstWeekContainsDate,
		weekStartsOn,
		locale
	};
	const setters = [new DateTimezoneSetter(options?.in, referenceDate)];
	const tokens = formatStr.match(longFormattingTokensRegExp).map((substring) => {
		const firstCharacter = substring[0];
		if (firstCharacter in longFormatters) {
			const longFormatter = longFormatters[firstCharacter];
			return longFormatter(substring, locale.formatLong);
		}
		return substring;
	}).join("").match(formattingTokensRegExp);
	const usedTokens = [];
	for (let token of tokens) {
		if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) warnOrThrowProtectedError(token, formatStr, dateStr);
		if (!options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) warnOrThrowProtectedError(token, formatStr, dateStr);
		const firstCharacter = token[0];
		const parser = parsers[firstCharacter];
		if (parser) {
			const { incompatibleTokens } = parser;
			if (Array.isArray(incompatibleTokens)) {
				const incompatibleToken = usedTokens.find((usedToken) => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter);
				if (incompatibleToken) throw new RangeError(`The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`);
			} else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) throw new RangeError(`The format string mustn't contain \`${token}\` and any other token at the same time`);
			usedTokens.push({
				token: firstCharacter,
				fullToken: token
			});
			const parseResult = parser.run(dateStr, token, locale.match, subFnOptions);
			if (!parseResult) return invalidDate();
			setters.push(parseResult.setter);
			dateStr = parseResult.rest;
		} else {
			if (firstCharacter.match(unescapedLatinCharacterRegExp)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
			if (token === "''") token = "'";
			else if (firstCharacter === "'") token = cleanEscapedString(token);
			if (dateStr.indexOf(token) === 0) dateStr = dateStr.slice(token.length);
			else return invalidDate();
		}
	}
	if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) return invalidDate();
	const uniquePrioritySetters = setters.map((setter) => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map((priority) => setters.filter((setter) => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)).map((setterArray) => setterArray[0]);
	let date = toDate(referenceDate, options?.in);
	if (isNaN(+date)) return invalidDate();
	const flags = {};
	for (const setter of uniquePrioritySetters) {
		if (!setter.validate(date, subFnOptions)) return invalidDate();
		const result = setter.set(date, flags, subFnOptions);
		if (Array.isArray(result)) {
			date = result[0];
			Object.assign(flags, result[1]);
		} else date = result;
	}
	return date;
}
function cleanEscapedString(input) {
	return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfHour.js
/**
* The {@link startOfHour} function options.
*/
/**
* @name startOfHour
* @category Hour Helpers
* @summary Return the start of an hour for the given date.
*
* @description
* Return the start of an hour for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of an hour
*
* @example
* // The start of an hour for 2 September 2014 11:55:00:
* const result = startOfHour(new Date(2014, 8, 2, 11, 55))
* //=> Tue Sep 02 2014 11:00:00
*/
function startOfHour(date, options) {
	const _date = toDate(date, options?.in);
	_date.setMinutes(0, 0, 0);
	return _date;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfMinute.js
/**
* The {@link startOfMinute} function options.
*/
/**
* @name startOfMinute
* @category Minute Helpers
* @summary Return the start of a minute for the given date.
*
* @description
* Return the start of a minute for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of a minute
*
* @example
* // The start of a minute for 1 December 2014 22:15:45.400:
* const result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
* //=> Mon Dec 01 2014 22:15:00
*/
function startOfMinute(date, options) {
	const date_ = toDate(date, options?.in);
	date_.setSeconds(0, 0);
	return date_;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfSecond.js
/**
* The {@link startOfSecond} function options.
*/
/**
* @name startOfSecond
* @category Second Helpers
* @summary Return the start of a second for the given date.
*
* @description
* Return the start of a second for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The start of a second
*
* @example
* // The start of a second for 1 December 2014 22:15:45.400:
* const result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
* //=> Mon Dec 01 2014 22:15:45.000
*/
function startOfSecond(date, options) {
	const date_ = toDate(date, options?.in);
	date_.setMilliseconds(0);
	return date_;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parseISO.js
/**
* The {@link parseISO} function options.
*/
/**
* @name parseISO
* @category Common Helpers
* @summary Parse ISO string
*
* @description
* Parse the given string in ISO 8601 format and return an instance of Date.
*
* Function accepts complete ISO 8601 formats as well as partial implementations.
* ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
*
* If the argument isn't a string, the function cannot parse the string or
* the values are invalid, it returns Invalid Date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param argument - The value to convert
* @param options - An object with options
*
* @returns The parsed date in the local time zone
*
* @example
* // Convert string '2014-02-11T11:30:30' to date:
* const result = parseISO('2014-02-11T11:30:30')
* //=> Tue Feb 11 2014 11:30:30
*
* @example
* // Convert string '+02014101' to date,
* // if the additional number of digits in the extended year format is 1:
* const result = parseISO('+02014101', { additionalDigits: 1 })
* //=> Fri Apr 11 2014 00:00:00
*/
function parseISO(argument, options) {
	const invalidDate = () => constructFrom(options?.in, NaN);
	const additionalDigits = options?.additionalDigits ?? 2;
	const dateStrings = splitDateString(argument);
	let date;
	if (dateStrings.date) {
		const parseYearResult = parseYear(dateStrings.date, additionalDigits);
		date = parseDate(parseYearResult.restDateString, parseYearResult.year);
	}
	if (!date || isNaN(+date)) return invalidDate();
	const timestamp = +date;
	let time = 0;
	let offset;
	if (dateStrings.time) {
		time = parseTime(dateStrings.time);
		if (isNaN(time)) return invalidDate();
	}
	if (dateStrings.timezone) {
		offset = parseTimezone(dateStrings.timezone);
		if (isNaN(offset)) return invalidDate();
	} else {
		const tmpDate = new Date(timestamp + time);
		const result = toDate(0, options?.in);
		result.setFullYear(tmpDate.getUTCFullYear(), tmpDate.getUTCMonth(), tmpDate.getUTCDate());
		result.setHours(tmpDate.getUTCHours(), tmpDate.getUTCMinutes(), tmpDate.getUTCSeconds(), tmpDate.getUTCMilliseconds());
		return result;
	}
	return toDate(timestamp + time + offset, options?.in);
}
var patterns = {
	dateTimeDelimiter: /[T ]/,
	timeZoneDelimiter: /[Z ]/i,
	timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
	const dateStrings = {};
	const array = dateString.split(patterns.dateTimeDelimiter);
	let timeString;
	if (array.length > 2) return dateStrings;
	if (/:/.test(array[0])) timeString = array[0];
	else {
		dateStrings.date = array[0];
		timeString = array[1];
		if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
			dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
			timeString = dateString.substr(dateStrings.date.length, dateString.length);
		}
	}
	if (timeString) {
		const token = patterns.timezone.exec(timeString);
		if (token) {
			dateStrings.time = timeString.replace(token[1], "");
			dateStrings.timezone = token[1];
		} else dateStrings.time = timeString;
	}
	return dateStrings;
}
function parseYear(dateString, additionalDigits) {
	const regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
	const captures = dateString.match(regex);
	if (!captures) return {
		year: NaN,
		restDateString: ""
	};
	const year = captures[1] ? parseInt(captures[1]) : null;
	const century = captures[2] ? parseInt(captures[2]) : null;
	return {
		year: century === null ? year : century * 100,
		restDateString: dateString.slice((captures[1] || captures[2]).length)
	};
}
function parseDate(dateString, year) {
	if (year === null) return /* @__PURE__ */ new Date(NaN);
	const captures = dateString.match(dateRegex);
	if (!captures) return /* @__PURE__ */ new Date(NaN);
	const isWeekDate = !!captures[4];
	const dayOfYear = parseDateUnit(captures[1]);
	const month = parseDateUnit(captures[2]) - 1;
	const day = parseDateUnit(captures[3]);
	const week = parseDateUnit(captures[4]);
	const dayOfWeek = parseDateUnit(captures[5]) - 1;
	if (isWeekDate) {
		if (!validateWeekDate(year, week, dayOfWeek)) return /* @__PURE__ */ new Date(NaN);
		return dayOfISOWeekYear(year, week, dayOfWeek);
	} else {
		const date = /* @__PURE__ */ new Date(0);
		if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) return /* @__PURE__ */ new Date(NaN);
		date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
		return date;
	}
}
function parseDateUnit(value) {
	return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
	const captures = timeString.match(timeRegex);
	if (!captures) return NaN;
	const hours = parseTimeUnit(captures[1]);
	const minutes = parseTimeUnit(captures[2]);
	const seconds = parseTimeUnit(captures[3]);
	if (!validateTime(hours, minutes, seconds)) return NaN;
	return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
	return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
	if (timezoneString === "Z") return 0;
	const captures = timezoneString.match(timezoneRegex);
	if (!captures) return 0;
	const sign = captures[1] === "+" ? -1 : 1;
	const hours = parseInt(captures[2]);
	const minutes = captures[3] && parseInt(captures[3]) || 0;
	if (!validateTimezone(hours, minutes)) return NaN;
	return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
	const date = /* @__PURE__ */ new Date(0);
	date.setUTCFullYear(isoWeekYear, 0, 4);
	const fourthOfJanuaryDay = date.getUTCDay() || 7;
	const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
	date.setUTCDate(date.getUTCDate() + diff);
	return date;
}
var daysInMonths = [
	31,
	null,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
function isLeapYearIndex(year) {
	return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
	return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
	return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
	return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
	if (hours === 24) return minutes === 0 && seconds === 0;
	return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
	return minutes >= 0 && minutes <= 59;
}
//#endregion
//#region node_modules/.pnpm/chartjs-adapter-date-fns@3.0.0_chart.js@4.5.1_date-fns@4.4.0/node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.esm.js
/*!
* chartjs-adapter-date-fns v3.0.0
* https://www.chartjs.org
* (c) 2022 chartjs-adapter-date-fns Contributors
* Released under the MIT license
*/
var FORMATS = {
	datetime: "MMM d, yyyy, h:mm:ss aaaa",
	millisecond: "h:mm:ss.SSS aaaa",
	second: "h:mm:ss aaaa",
	minute: "h:mm aaaa",
	hour: "ha",
	day: "MMM d",
	week: "PP",
	month: "MMM yyyy",
	quarter: "qqq - yyyy",
	year: "yyyy"
};
adapters._date.override({
	_id: "date-fns",
	formats: function() {
		return FORMATS;
	},
	parse: function(value, fmt) {
		if (value === null || typeof value === "undefined") return null;
		const type = typeof value;
		if (type === "number" || value instanceof Date) value = toDate(value);
		else if (type === "string") if (typeof fmt === "string") value = parse(value, fmt, /* @__PURE__ */ new Date(), this.options);
		else value = parseISO(value, this.options);
		return isValid(value) ? value.getTime() : null;
	},
	format: function(time, fmt) {
		return format(time, fmt, this.options);
	},
	add: function(time, amount, unit) {
		switch (unit) {
			case "millisecond": return addMilliseconds(time, amount);
			case "second": return addSeconds(time, amount);
			case "minute": return addMinutes(time, amount);
			case "hour": return addHours(time, amount);
			case "day": return addDays(time, amount);
			case "week": return addWeeks(time, amount);
			case "month": return addMonths(time, amount);
			case "quarter": return addQuarters(time, amount);
			case "year": return addYears(time, amount);
			default: return time;
		}
	},
	diff: function(max, min, unit) {
		switch (unit) {
			case "millisecond": return differenceInMilliseconds(max, min);
			case "second": return differenceInSeconds(max, min);
			case "minute": return differenceInMinutes(max, min);
			case "hour": return differenceInHours(max, min);
			case "day": return differenceInDays(max, min);
			case "week": return differenceInWeeks(max, min);
			case "month": return differenceInMonths(max, min);
			case "quarter": return differenceInQuarters(max, min);
			case "year": return differenceInYears(max, min);
			default: return 0;
		}
	},
	startOf: function(time, unit, weekday) {
		switch (unit) {
			case "second": return startOfSecond(time);
			case "minute": return startOfMinute(time);
			case "hour": return startOfHour(time);
			case "day": return startOfDay(time);
			case "week": return startOfWeek(time);
			case "isoWeek": return startOfWeek(time, { weekStartsOn: +weekday });
			case "month": return startOfMonth(time);
			case "quarter": return startOfQuarter(time);
			case "year": return startOfYear(time);
			default: return time;
		}
	},
	endOf: function(time, unit) {
		switch (unit) {
			case "second": return endOfSecond(time);
			case "minute": return endOfMinute(time);
			case "hour": return endOfHour(time);
			case "day": return endOfDay(time);
			case "week": return endOfWeek(time);
			case "month": return endOfMonth(time);
			case "quarter": return endOfQuarter(time);
			case "year": return endOfYear(time);
			default: return time;
		}
	}
});
//#endregion
//#region src/lib/pages/programmable-transaction-block/data-processor.ts
var TransactionDataProcessor = class {
	transactionData;
	constructor() {
		this.transactionData = this.createEmptyTransactionData();
	}
	createEmptyTransactionData() {
		return {
			totalPTBs: 0,
			failedPTBs: 0,
			uniqueSenders: /* @__PURE__ */ new Set(),
			calledPackages: /* @__PURE__ */ new Set(),
			calledFunctions: /* @__PURE__ */ new Set(),
			publishedPackages: /* @__PURE__ */ new Map(),
			senderCounts: /* @__PURE__ */ new Map(),
			packageCounts: /* @__PURE__ */ new Map(),
			rawData: [],
			checkpointData: /* @__PURE__ */ new Map(),
			transactionsByCheckpoint: /* @__PURE__ */ new Map(),
			commandTypeStats: /* @__PURE__ */ new Map()
		};
	}
	resetData() {
		this.transactionData = this.createEmptyTransactionData();
	}
	processTransactionBatch(transactions) {
		for (const tx of transactions) this.processTransactionBlock(tx);
	}
	processTransactionBlock(tx) {
		this.transactionData.totalPTBs++;
		if (tx.effects?.status !== "SUCCESS") this.transactionData.failedPTBs++;
		let decodedData = null;
		if (tx.effects?.transactionBlock?.bcs) try {
			decodedData = iotaBcs.SenderSignedData.parse(fromBase64(tx.effects.transactionBlock.bcs))[0];
		} catch (e2) {
			console.warn("Failed to decode BCS data for transaction:", tx.digest, e2);
		}
		if (decodedData) tx.decodedBCS = decodedData;
		const checkpointSeq = tx.effects?.checkpoint?.sequenceNumber;
		const checkpointTimestamp = tx.effects?.checkpoint?.timestamp;
		if (checkpointSeq !== void 0 && checkpointSeq !== null && checkpointTimestamp) {
			if (!this.transactionData.checkpointData.has(checkpointSeq)) this.transactionData.checkpointData.set(checkpointSeq, {
				sequenceNumber: checkpointSeq,
				timestamp: checkpointTimestamp,
				transactionCount: 0
			});
			this.transactionData.checkpointData.get(checkpointSeq).transactionCount++;
			if (!this.transactionData.transactionsByCheckpoint.has(checkpointSeq)) this.transactionData.transactionsByCheckpoint.set(checkpointSeq, []);
			this.transactionData.transactionsByCheckpoint.get(checkpointSeq).push(tx);
		}
		let senderAddress = null;
		if (tx.sender?.address) senderAddress = tx.sender.address;
		else if (decodedData?.intentMessage?.value?.V1?.sender) senderAddress = decodedData.intentMessage.value.V1.sender;
		if (senderAddress) {
			this.transactionData.uniqueSenders.add(senderAddress);
			const currentCount = this.transactionData.senderCounts.get(senderAddress) || 0;
			this.transactionData.senderCounts.set(senderAddress, currentCount + 1);
		}
		this.extractPTBCommands(decodedData, tx.digest);
		this.extractPublishedPackages(tx, senderAddress);
		this.transactionData.rawData.push(tx);
	}
	extractPTBCommands(decodedData, txDigest) {
		let ptbCommands = [];
		if (decodedData?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands) ptbCommands = decodedData.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
		for (const command of ptbCommands) {
			const commandType = Object.keys(command)[0];
			if (commandType) {
				let stats = this.transactionData.commandTypeStats.get(commandType);
				if (!stats) {
					stats = {
						count: 0,
						digests: []
					};
					this.transactionData.commandTypeStats.set(commandType, stats);
				}
				stats.count++;
				if (txDigest && !stats.digests.includes(txDigest) && stats.digests.length < 20) stats.digests.push(txDigest);
			}
			if (command.MoveCall) {
				const moveCall = command.MoveCall;
				const packageId = moveCall.package;
				const module = moveCall.module;
				const functionName = moveCall.function;
				if (packageId) {
					this.transactionData.calledPackages.add(packageId);
					const currentPackageCount = this.transactionData.packageCounts.get(packageId) || 0;
					this.transactionData.packageCounts.set(packageId, currentPackageCount + 1);
					const fullFunctionName = `${packageId}::${module}::${functionName}`;
					this.transactionData.calledFunctions.add(fullFunctionName);
				}
			}
		}
	}
	extractPublishedPackages(tx, senderAddress) {
		let ptbCommands = [];
		const decodedData = tx.decodedBCS;
		if (decodedData?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands) ptbCommands = decodedData.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
		if (!ptbCommands.some((cmd) => cmd.Publish) || !senderAddress) return;
		const objectChanges = tx.effects?.objectChanges?.nodes || [];
		const txId = tx.digest || "";
		for (const change of objectChanges) {
			if (change.outputState?.asMoveObject?.contents?.json?.package) {
				if (!change.outputState?.asMoveObject?.contents?.json?.package.startsWith("0x")) continue;
				const packageData = change.outputState.asMoveObject.contents.json;
				const publishedPackage = {
					packageId: packageData.package,
					sender: senderAddress,
					version: packageData.version || "1",
					txId
				};
				this.transactionData.publishedPackages.set(packageData.package, publishedPackage);
			}
			if (change.outputState?.asMovePackage?.modules?.nodes) {
				const packageId = change.address || change.idCreated;
				if (packageId && packageId.startsWith("0x")) {
					const moduleNames = change.outputState.asMovePackage.modules.nodes.map((module) => module.name).filter((name) => name);
					const existingPackage = this.transactionData.publishedPackages.get(packageId);
					if (existingPackage) existingPackage.modules = moduleNames;
					else {
						const publishedPackage = {
							packageId,
							sender: senderAddress,
							version: "1",
							txId,
							modules: moduleNames
						};
						this.transactionData.publishedPackages.set(packageId, publishedPackage);
					}
				}
			}
		}
	}
	createDisplayData(checkpointRange) {
		const functionMap = /* @__PURE__ */ new Map();
		for (const tx of this.transactionData.rawData) {
			let ptbCommands = [];
			if (tx.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands) ptbCommands = tx.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
			for (const command of ptbCommands) if (command.MoveCall) {
				const moveCall = command.MoveCall;
				const packageId = moveCall.package;
				const module = moveCall.module;
				const functionName = moveCall.function;
				if (packageId && module && functionName) {
					const fullFunctionName = `${packageId}::${module}::${functionName}`;
					if (!functionMap.has(fullFunctionName)) functionMap.set(fullFunctionName, {
						package: packageId,
						module,
						function: functionName,
						fullName: fullFunctionName,
						callCount: 0,
						transactionIds: []
					});
					const funcData = functionMap.get(fullFunctionName);
					funcData.callCount++;
					if (!funcData.transactionIds.includes(tx.digest) || funcData.transactionIds.length > 20) funcData.transactionIds.push(tx.digest);
				}
			}
		}
		const commandTypeStats = Array.from(this.transactionData.commandTypeStats.entries()).map(([type, stat]) => ({
			type,
			count: stat.count,
			digests: stat.digests.slice(0, 20)
		})).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
		return {
			totalPTBs: this.transactionData.totalPTBs,
			failedPTBs: this.transactionData.failedPTBs,
			uniqueSendersCount: this.transactionData.uniqueSenders.size,
			calledPackagesCount: this.transactionData.calledPackages.size,
			calledFunctionsCount: this.transactionData.calledFunctions.size,
			publishedPackagesCount: this.transactionData.publishedPackages.size,
			uniqueSendersList: Array.from(this.transactionData.senderCounts.entries()).map(([address, txCount]) => ({
				address,
				txCount
			})).sort((a, b) => b.txCount - a.txCount || a.address.localeCompare(b.address)),
			calledPackagesList: Array.from(this.transactionData.packageCounts.entries()).map(([packageAddress, callCount]) => ({
				package: packageAddress,
				callCount
			})).sort((a, b) => b.callCount - a.callCount || a.package.localeCompare(b.package)),
			publishedPackagesList: Array.from(this.transactionData.publishedPackages.values()).sort((a, b) => a.packageId.localeCompare(b.packageId)),
			calledFunctionsList: Array.from(functionMap.values()).sort((a, b) => b.callCount - a.callCount || a.fullName.localeCompare(b.fullName)),
			checkpointRange,
			checkpointData: Array.from(this.transactionData.checkpointData.values()).sort((a, b) => a.sequenceNumber - b.sequenceNumber),
			transactionsByCheckpoint: this.transactionData.transactionsByCheckpoint,
			commandTypeStats
		};
	}
	getCheckpointTransactions(checkpointNum) {
		const sequenceNumber = parseInt(checkpointNum.toString());
		return (this.transactionData.transactionsByCheckpoint.get(sequenceNumber) || []).map((tx) => ({
			digest: tx.digest,
			sender: tx.sender?.address || tx.decodedBCS?.intentMessage?.value?.V1?.sender || "Unknown",
			gasUsed: tx.effects?.gasEffects?.gasUsed || null,
			timestamp: tx.effects?.checkpoint?.timestamp || null,
			effects: tx.effects || null,
			decodedBCS: tx.decodedBCS || null
		}));
	}
	calculateProgress(checkpointRange) {
		let minCheckpointSeen = null;
		let maxCheckpointSeen = null;
		for (const checkpointSeq of this.transactionData.checkpointData.keys()) {
			if (minCheckpointSeen === null || checkpointSeq < minCheckpointSeen) minCheckpointSeen = checkpointSeq;
			if (maxCheckpointSeen === null || checkpointSeq > maxCheckpointSeen) maxCheckpointSeen = checkpointSeq;
		}
		let progressBasedOnRange = 0;
		if (maxCheckpointSeen !== null) progressBasedOnRange = Math.max(0, maxCheckpointSeen - checkpointRange.first + 1);
		const checkpointRangeSize = checkpointRange.last - checkpointRange.first + 1;
		return {
			processedCheckpoints: progressBasedOnRange,
			totalCheckpoints: checkpointRangeSize,
			minCheckpointSeen,
			maxCheckpointSeen
		};
	}
	reset() {
		this.resetData();
	}
	gettotalPTBs() {
		return this.transactionData.totalPTBs;
	}
};
//#endregion
//#region src/lib/pages/programmable-transaction-block/graphql-fetcher.ts
var MAX_PAGE_SIZE = 10;
var GraphQLDataFetcher = class {
	constructor() {}
	async queryGraphQl(query, variables = {}) {
		const options = {
			query: graphql(query),
			variables
		};
		return new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql }).query(options);
	}
	async getCurrentEpoch() {
		try {
			const result = await this.queryGraphQl(`query {
                epoch {
                    epochId
                }
            }`);
			if (result.errors) {
				console.error("Error fetching current epoch:", result.errors);
				return null;
			}
			const currentEpochId = result.data?.epoch?.epochId;
			return currentEpochId ? currentEpochId.toString() : null;
		} catch (err) {
			console.error("Error fetching current epoch:", err);
			return null;
		}
	}
	async getCheckpointRangeForEpoch(epochNum) {
		const result = await this.queryGraphQl(`query ($epochId: UInt53!) {
            epoch(id: $epochId) {
                checkpoints(first: 1) {
                    nodes {
                        sequenceNumber
                    }
                }
                lastCheckpoints: checkpoints(last: 1) {
                    nodes {
                        sequenceNumber
                    }
                }
            }
        }`, { epochId: epochNum });
		if (result.errors) throw new Error(`GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`);
		const firstCheckpoint = result.data?.epoch?.checkpoints?.nodes?.[0]?.sequenceNumber;
		const lastCheckpoint = result.data?.epoch?.lastCheckpoints?.nodes?.[0]?.sequenceNumber;
		if (!firstCheckpoint || !lastCheckpoint) throw new Error(`Could not find checkpoint range for epoch ${epochNum}`);
		return {
			first: firstCheckpoint,
			last: lastCheckpoint
		};
	}
	async fetchTransactionBatch(checkpointRange, batchSize = MAX_PAGE_SIZE, cursor, inputObject, functionFilter) {
		const cursorSection = cursor ? `, after: "${cursor}"` : "";
		const filterParts = [
			`afterCheckpoint: ${checkpointRange.first}`,
			`beforeCheckpoint: ${checkpointRange.last}`,
			`kind: PROGRAMMABLE_TX`
		];
		if (inputObject && inputObject.trim()) filterParts.push(`inputObject: "${inputObject.trim()}"`);
		if (functionFilter && functionFilter.trim()) filterParts.push(`function: "${functionFilter.trim()}"`);
		const filterString = filterParts.join(", ");
		const txQuery = `query {
                transactionBlocks(
                    ${inputObject && inputObject.trim() || functionFilter && functionFilter.trim() ? "scanLimit: 100000000," : ""}
                    filter: {
                        ${filterString}
                    }
                    first: ${batchSize}${cursorSection}
                ) {
                    nodes {
                        digest
                        sender {
                            address
                        }
                        effects {
                            checkpoint {
                                sequenceNumber
                                timestamp
                            }
                            status
                            balanceChanges{
                                nodes{
                                    owner{
                                        address
                                    }
                                    coinType{
                                        repr
                                    }
                                    amount
                                }
                            }
                            gasEffects{
                              gasSummary{
                                storageCost
                                storageRebate
                                computationCost
                              }
                            }
                            objectChanges {
                                nodes {
                                    idDeleted
                                    idCreated
                                    address
                                    inputState {
                                      asMoveObject {
                                        contents {
                                          json
                                        }
                                      }
                                    }
                                    outputState {
                                        asMoveObject {
                                            contents {
                                                json
                                            }
                                        }
                                        asMovePackage {
                                            modules {
                                                nodes {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            events {
                              nodes {
                                data
                                sendingModule {
                                  package {
                                    address
                                  }
                                }
                              }
                            }
                            transactionBlock {
                                bcs
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }`;
		const result = await this.queryGraphQl(txQuery);
		if (result.errors) throw new Error(`GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`);
		return {
			transactions: result.data?.transactionBlocks?.nodes || [],
			hasNextPage: result.data?.transactionBlocks?.pageInfo?.hasNextPage || false,
			endCursor: result.data?.transactionBlocks?.pageInfo?.endCursor
		};
	}
	async *fetchAllTransactionBlocks(checkpointRange, maxTransactions, inputObject, functionFilter) {
		let hasNextPage = true;
		let cursor = null;
		let totalFetched = 0;
		while (hasNextPage && (!maxTransactions || totalFetched < maxTransactions)) {
			const remainingToFetch = maxTransactions ? maxTransactions - totalFetched : MAX_PAGE_SIZE;
			const batchSize = Math.min(MAX_PAGE_SIZE, remainingToFetch);
			const batchResult = await this.fetchTransactionBatch(checkpointRange, batchSize, cursor, inputObject, functionFilter);
			const transactionsToProcess = maxTransactions ? batchResult.transactions.slice(0, remainingToFetch) : batchResult.transactions;
			totalFetched += transactionsToProcess.length;
			hasNextPage = batchResult.hasNextPage;
			cursor = batchResult.endCursor;
			yield {
				transactions: transactionsToProcess,
				isComplete: !hasNextPage || maxTransactions !== void 0 && totalFetched >= maxTransactions,
				totalFetched,
				hasMore: hasNextPage && (!maxTransactions || totalFetched < maxTransactions)
			};
			if (maxTransactions && totalFetched >= maxTransactions) break;
		}
	}
};
//#endregion
//#region src/lib/pages/programmable-transaction-block/epoch-ptb-analyzer.ts
var EpochPTBAnalyzer = class {
	fetcher;
	processor;
	stopRequested = false;
	constructor() {
		this.fetcher = new GraphQLDataFetcher();
		this.processor = new TransactionDataProcessor();
	}
	requestStop() {
		this.stopRequested = true;
	}
	resetStopFlag() {
		this.stopRequested = false;
	}
	async getCurrentEpoch() {
		return this.fetcher.getCurrentEpoch();
	}
	async getCheckpointRangeForEpoch(epochNum) {
		return this.fetcher.getCheckpointRangeForEpoch(epochNum);
	}
	getCheckpointTransactions(checkpointNum, _displayData) {
		return this.processor.getCheckpointTransactions(checkpointNum);
	}
	async resolveCheckpointRange(epoch, startCheckpoint, endCheckpoint) {
		const epochStr = epoch?.toString();
		const startCheckpointStr = startCheckpoint?.toString();
		const endCheckpointStr = endCheckpoint?.toString();
		if (epochStr && epochStr.trim() !== "") {
			const epochNum = parseInt(epochStr.trim());
			if (isNaN(epochNum) || epochNum < 0) throw new Error("Please enter a valid positive number for epoch");
			return await this.fetcher.getCheckpointRangeForEpoch(epochNum);
		} else if (startCheckpointStr && endCheckpointStr) {
			const startNum = parseInt(startCheckpointStr.trim());
			const endNum = parseInt(endCheckpointStr.trim());
			if (isNaN(startNum) || isNaN(endNum) || startNum < 0 || endNum < 0) throw new Error("Please enter valid positive numbers for checkpoint range");
			if (startNum > endNum) throw new Error("Start checkpoint must be less than or equal to end checkpoint");
			return {
				first: startNum,
				last: endNum
			};
		} else throw new Error("Please enter either an epoch number or a checkpoint range");
	}
	async *fetchTransactionBlocksWithProgress(checkpointRange, maxTransactions, inputObject, functionFilter) {
		this.processor.reset();
		for await (const fetchResult of this.fetcher.fetchAllTransactionBlocks(checkpointRange, maxTransactions, inputObject, functionFilter)) {
			if (this.stopRequested) {
				console.log("Stopping fetchTransactionBlocksWithProgress due to user request");
				break;
			}
			this.processor.processTransactionBatch(fetchResult.transactions);
			const progress = this.processor.calculateProgress(checkpointRange);
			const displayData = this.processor.createDisplayData(checkpointRange);
			if (fetchResult.isComplete) console.log(`✓ Complete: Covered ${progress.processedCheckpoints} checkpoints in range, ${fetchResult.totalFetched} total transactions`);
			else {
				const progressPercentage = Math.round(progress.processedCheckpoints / progress.totalCheckpoints * 100);
				console.log(`Progress: ${progress.processedCheckpoints}/${progress.totalCheckpoints} checkpoints in range (${progressPercentage}%), ${fetchResult.totalFetched} transactions`);
			}
			yield {
				data: displayData,
				isComplete: fetchResult.isComplete,
				processedTransactions: fetchResult.totalFetched,
				processedCheckpoints: progress.processedCheckpoints,
				totalCheckpoints: progress.totalCheckpoints
			};
		}
	}
	async fetchAllTransactionBlocks(epoch, startCheckpoint, endCheckpoint, onProgress, inputObject, functionFilter) {
		this.resetStopFlag();
		const checkpointRange = await this.resolveCheckpointRange(epoch, startCheckpoint, endCheckpoint);
		let finalData = null;
		for await (const progress of this.fetchTransactionBlocksWithProgress(checkpointRange, void 0, inputObject, functionFilter)) {
			if (this.stopRequested) {
				console.log("Stopping transaction fetch due to user request");
				break;
			}
			finalData = progress.data;
			if (onProgress) onProgress(progress.data, progress.isComplete, progress.processedTransactions, progress.processedCheckpoints, progress.totalCheckpoints);
		}
		return finalData;
	}
	async fetchLimitedTransactionBlocks(transactionLimit, epoch, startCheckpoint, endCheckpoint, onProgress, inputObject, functionFilter) {
		this.resetStopFlag();
		const checkpointRange = await this.resolveCheckpointRange(epoch, startCheckpoint, endCheckpoint);
		let finalData = null;
		for await (const progress of this.fetchTransactionBlocksWithProgress(checkpointRange, transactionLimit, inputObject, functionFilter)) {
			if (this.stopRequested) {
				console.log("Stopping limited transaction fetch due to user request");
				break;
			}
			finalData = progress.data;
			if (onProgress) onProgress(progress.data, progress.isComplete, progress.processedTransactions, progress.processedCheckpoints, progress.totalCheckpoints);
		}
		return finalData;
	}
};
//#endregion
export { EpochPTBAnalyzer as t };
