// Enums
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

// Helper functions

export function getMonthName(m) {
    let word = Object.keys(Months)[m];
    return word.charAt(0) + word.slice(1).toLowerCase();
}

export function getDayName(d) {
    let word = Object.keys(Weekday)[d];
    return word.charAt(0) + word.slice(1).toLowerCase();
}

export const CATEGORY_LABELS = Object.freeze({
    class: 'Class',
    work: 'Work',
    event: 'Event',
})

export function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
    const result = startOfDay(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function isSameDay(first, second) {
    return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
}

export function startOfWeek(date) {
    const daysSinceMonday = (date.getDay() + 6) % 7;
    return addDays(date, -daysSinceMonday);
}

export function getWeekDays(date) {
    const monday = startOfWeek(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(addDays(monday, i));
    }
    return days;
}

export function getMonthGridDays(year, month) {
    const gridStart = startOfWeek(new Date(year, month, 1));
    const days = [];
    for (let i = 0; i < 42; i++) {
        days.push(addDays(gridStart, i));
    }
    return days;
}

export function formatWeekTitle(date) {
    const days = getWeekDays(date);
    const monday = days[0];
    const sunday = days[6];
    const mondayMonth = monday.toLocaleDateString('en-US', { month: 'short' });
    const sundayMonth = sunday.toLocaleDateString('en-US', { month: 'short' });

    if (mondayMonth === sundayMonth) {
        return `${mondayMonth} ${monday.getDate()}-${sunday.getDate()}, ${sunday.getFullYear()}`;
    }
    return `${mondayMonth} ${monday.getDate()} - ${sundayMonth} ${sunday.getDate()}, ${sunday.getFullYear()}`;
}

export function formatDayTitle(date) {
    return `${getDayName(date.getDay())}, ${getMonthName(date.getMonth())} ${date.getDate()}`;
}

export function formatAgendaDate(date) {
    return `${getMonthName(date.getMonth())} ${date.getDate()} | ${getDayName(date.getDay())}`;
}

function getMinutesSinceMidnight(time) {
    const [clock, period] = time.split(' ');
    const [hours, minutes] = clock.split(':').map(Number);
    const hoursIn24HourTime = (hours % 12) + (period === 'PM' ? 12 : 0);
    return hoursIn24HourTime * 60 + minutes;
}

export function getEventsOnDay(events, day) {
    return events
        .filter((event) => isSameDay(event.date, day))
        .sort((first, second) => getMinutesSinceMidnight(first.start) - getMinutesSinceMidnight(second.start));
}

export function getCategoriesOnDay(events) {
    const categories = [];
    for (const event of events) {
        if (!categories.includes(event.category)) {
            categories.push(event.category);
        }
    }
    return categories;
}

export function formatEventCount(count) {
    let word = 'event';
    if (count !== 1) {
        word += 's';
    }
    return count + ' ' + word;
}