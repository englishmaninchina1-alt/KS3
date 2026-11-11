import { makeCategory } from '../parse';

export const school = makeCategory(
  {
    id: 'school',
    title: 'School Life',
    emoji: '🎒',
    tagline: 'Lessons, classrooms and everything in a busy school day.',
    colours: ['#2563eb', '#06b6d4'],
    ks3: 'KS3 English — explaining routines, following instructions and writing to inform.',
    prompts: [
      'Describe your favourite lesson and why you enjoy it.',
      'Explain what you do to prepare for a test.',
      'Give a new student three tips for their first day.',
    ],
  },
  `
secondary school | SEK-uhn-duh-ree skool | noun | A school for students aged eleven to sixteen or eighteen.
timetable | TYM-tay-buhl | noun | A plan that shows when each lesson happens.
lesson | LESS-uhn | noun | A period of time when you are taught something.
subject | SUB-jikt | noun | An area of learning, such as maths or English.
registration | rej-uh-STRAY-shuhn | noun | The time when teachers check who is in school.
assembly | uh-SEM-blee | noun | A meeting of the whole school in one hall.
homework | HOHM-wurk | noun | Work your teacher gives you to do at home.
equipment | i-KWIP-muhnt | noun | The tools and things you need for an activity.
stationery | STAY-shuhn-ree | noun | Paper, pens and other writing supplies.
library | LY-bruh-ree | noun | A room or building full of books to read or borrow.
corridor | KOR-uh-dor | noun | A long passage between rooms in a building.
canteen | kan-TEEN | noun | A room in school where you eat meals.
locker | LOK-uh | noun | A small cupboard where you keep your things.
uniform | YOO-nuh-form | noun | The special clothes that students wear at school.
pencil case | PEN-suhl kayss | noun | A small bag for pens, pencils and rulers.
ruler | ROO-luh | noun | A flat tool for drawing straight lines and measuring.
calculator | KAL-kyuh-lay-tuh | noun | A machine that helps you do sums with numbers.
dictionary | DIK-shuhn-ree | noun | A book that explains what words mean.
textbook | TEKST-book | noun | A book used for studying a subject.
exercise book | EK-suh-syz book | noun | A notebook you write your schoolwork in.
revision | ri-VIZH-uhn | noun | Studying again the things you have already learned.
assessment | uh-SESS-muhnt | noun | A test or task that checks what you have learned.
examination | ig-zam-uh-NAY-shuhn | noun | A formal test, often at the end of a course.
grade | grayd | noun | A mark or letter that shows how well you did.
feedback | FEED-bak | noun | Comments that help you improve your work.
target | TAR-git | noun | A goal that you are aiming to reach.
achievement | uh-CHEEV-muhnt | noun | Something you have done well after trying hard.
behaviour | bi-HAYV-yuh | noun | The way you act and treat other people.
detention | di-TEN-shuhn | noun | A punishment where you stay at school after lessons.
reward | ri-WAWD | noun | Something nice that you get for doing well.
attendance | uh-TEN-duhns | noun | Being present at school.
punctual | PUNK-choo-uhl | adjective | Arriving on time and not late.
attention | uh-TEN-shuhn | noun | Looking and listening carefully.
concentrate | KON-suhn-trayt | verb | To focus your mind on one thing.
discuss | di-SKUSS | verb | To talk about something with other people.
explain | ik-SPLAYN | verb | To make something clear so that others understand.
question | KWES-chuhn | noun | Something you ask when you want to know more.
answer | AHN-suh | noun | A reply to a question.
instruction | in-STRUK-shuhn | noun | Information that tells you what to do.
partner | PART-nuh | noun | The person you work with in a pair.
group work | GROOP wurk | noun | Working together with several classmates.
presentation | prez-uhn-TAY-shuhn | noun | A talk where you show and explain something.
research | ri-SURCH | noun | Finding out facts about a topic.
project | PROJ-ekt | noun | A piece of work that takes several lessons or weeks.
essay | ESS-ay | noun | A piece of writing about a topic.
paragraph | PAR-uh-graf | noun | A group of sentences about one idea.
handwriting | HAND-ry-ting | noun | The way you write with a pen or pencil.
term | turm | noun | One of the three parts of the school year.
holiday | HOL-uh-day | noun | A time when school is closed and you can rest.
graduation | graj-oo-AY-shuhn | noun | A ceremony that marks finishing a level of school.
`,
);
