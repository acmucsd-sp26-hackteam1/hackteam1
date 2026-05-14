export const TimeFrames = Object.freeze({
    YEAR: 0,
    MONTH: 1,
    WEEK: 2,
    DAY: 3,
})

export const Weekday = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
})

export const Months = Object.freeze({
    JANUARY: 0,
    FEBRUARY: 1,
    MARCH: 2,
    APRIL: 3,
    MAY: 4,
    JUNE: 5,
    JULY: 6,
    AUGUST: 7,
    SEPTEMBER: 8,
    OCTOBER: 9,
    NOVEMBER: 10,
    DECEMBER: 11,
})

export function getMonthName(m) { 
    let word = Object.keys(Months)[m];
    return word.charAt(0) + word.slice(1).toLowerCase();
}