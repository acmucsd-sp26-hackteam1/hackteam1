const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()

function dayThisMonth(day) {
  return new Date(year, month, day)
}

function dayNextMonth(day) {
  return new Date(year, month + 1, day)
}

const CLASS_DAYS = [1, 3, 6, 8, 10, 13, 15, 17, 20, 22, 24, 27]
const WORK_DAYS = [2, 9, 16, 23]

const classEvents = CLASS_DAYS.map((day) => ({
  id: `class-${day}`,
  title: "Class I don't wanna go to",
  category: 'class',
  date: dayThisMonth(day),
  start: '6:00 PM',
  end: '7:30 PM',
  location: 'Center Hall 101',
  note: 'Evening review session before the weekend.',
}))

const workEvents = WORK_DAYS.map((day) => ({
  id: `work-${day}`,
  title: 'Working in the gameroom',
  category: 'work',
  date: dayThisMonth(day),
  start: '4:00 PM',
  end: '8:00 PM',
  location: 'Price Center Game Room',
  note: 'Cover the afternoon shift and keep the desk open.',
}))

const otherEvents = [
  {
    id: 'study-group',
    title: 'Study Group',
    category: 'event',
    date: dayThisMonth(12),
    start: '6:00 PM',
    end: '8:00 PM',
    location: 'Geisel Library',
    note: 'CSE 101 review',
  },
  {
    id: 'club-meeting',
    title: 'Club Meeting',
    category: 'event',
    date: dayThisMonth(14),
    start: '7:30 PM',
    end: '9:00 PM',
    location: 'Price Center',
    note: 'ACM Projects mixer',
  },
  {
    id: 'midterm',
    title: 'Midterm',
    category: 'event',
    date: dayThisMonth(18),
    start: '10:00 AM',
    end: '11:30 AM',
    location: 'Center Hall',
    note: 'Bring laptop and charger',
  },
  {
    id: 'acm-event',
    title: 'ACM Event',
    category: 'work',
    date: dayThisMonth(24),
    start: '11:00 AM',
    end: '1:00 PM',
    location: 'East Ballroom',
    note: 'Help set up tables before the talks start.',
  },
  {
    id: 'hackathon',
    title: 'Random two-day hackathon',
    category: 'event',
    date: dayThisMonth(27),
    start: '9:00 AM',
    end: '9:00 PM',
    location: 'CSE Building',
    note: 'Bring snacks',
  },
]

export const SAMPLE_EVENTS = [...classEvents, ...workEvents, ...otherEvents]

export const SAMPLE_TASKS = [
  { id: 'calc-hw', title: 'Calc HW', time: '2:00 PM', date: dayThisMonth(16) },
  { id: 'bio-paper', title: 'Bio Lab Paper', time: '7:30 PM', date: dayThisMonth(28) },
  { id: 'gift', title: 'Get gift for twin', time: '12:00 PM', date: dayNextMonth(8) },
]

export const SAMPLE_GROUP = {
  name: 'Truffula Tree',
  code: 'SJ5K12N',
}

export const SAMPLE_MESSAGES = [
  {
    id: 1,
    author: 'Sean',
    color: 'green',
    text: 'Hey everyone, just a reminder that the meeting starts in 30 minutes.',
  },
  {
    id: 2,
    author: 'Leira',
    color: 'blue',
    text: 'I also sent the link to the updated form.',
  },
]

export const SAMPLE_NOTES = [
  {
    id: 1,
    title: 'Meeting Agenda',
    when: 'Today, 2:00 PM',
    text: 'Go over what we have done in ACM Hack',
  },
  {
    id: 2,
    title: 'Design Assets',
    when: 'Tomorrow',
    text: 'Finish calendar add-ons',
  },
]
