import { makeCategory } from '../parse';

export const jobs = makeCategory(
  {
    id: 'jobs',
    title: 'Jobs & Ambitions',
    emoji: '🧑‍🚀',
    tagline: 'Careers, skills and dreaming about your future.',
    colours: ['#9333ea', '#6366f1'],
    ks3: 'KS3 English — writing a personal statement and discussing future plans.',
    prompts: [
      'Describe the job you would love to do when you are older.',
      'Explain which skills are most important in any job.',
      'Talk about a job that helps other people.',
    ],
  },
  `
career | kuh-REER | noun | The work you do over many years.
profession | pruh-FESH-uhn | noun | A job that needs special training and qualifications.
salary | SAL-uh-ree | noun | The money you earn from a job, usually each year.
employer | im-PLOY-uh | noun | A person or company that pays others to work.
employee | im-PLOY-ee | noun | A person who is paid to work for someone.
colleague | KOL-eeg | noun | A person you work with.
interview | IN-tuh-vyoo | noun | A meeting where someone asks you questions about a job.
application | ap-luh-KAY-shuhn | noun | A written request for a job or place on a course.
qualification | kwol-uh-fuh-KAY-shuhn | noun | A certificate showing you have passed a course.
experience | ik-SPEER-ee-uhnss | noun | Knowledge you gain from doing something.
skill | skil | noun | Something you are able to do well.
responsibility | ri-spon-suh-BIL-uh-tee | noun | A duty that you are expected to look after.
shift | shift | noun | A fixed period of working hours.
overtime | OH-vuh-tym | noun | Extra hours you work beyond your normal shift.
promotion | pruh-MOH-shuhn | noun | A move to a more important job.
apprentice | uh-PREN-tiss | noun | Someone who learns a job by working with a skilled person.
engineer | en-juh-NEER | noun | A person who designs or builds machines and structures.
architect | AR-kuh-tekt | noun | A person who designs buildings.
scientist | SY-uhn-tist | noun | A person who studies the natural world using experiments.
surgeon | SUR-juhn | noun | A doctor who performs operations.
dentist | DEN-tist | noun | A person who looks after teeth.
lawyer | LAW-yuh | noun | A person trained to advise about the law.
journalist | JUR-nuh-list | noun | A person who reports the news.
author | AW-thuh | noun | A person who writes books.
translator | tranz-LAY-tuh | noun | A person who changes words from one language to another.
accountant | uh-KOWN-tuhnt | noun | A person who manages money and financial records.
electrician | ee-lek-TRISH-uhn | noun | A person who fits and repairs electrical systems.
plumber | PLUM-uh | noun | A person who fits and repairs water pipes.
mechanic | muh-KAN-ik | noun | A person who repairs vehicles and machines.
firefighter | FY-uh-fy-tuh | noun | A person trained to put out fires and rescue people.
paramedic | par-uh-MED-ik | noun | A medical worker who helps people in emergencies.
police officer | puh-LEESS of-iss-uh | noun | A person whose job is to keep people safe and stop crime.
soldier | SOHL-juh | noun | A member of an army.
pilot | PY-luht | noun | A person who flies an aircraft.
chef | shef | noun | A trained cook, especially the head of a kitchen.
hairdresser | HAIR-dress-uh | noun | A person who cuts and styles hair.
gardener | GAR-duh-nuh | noun | A person who looks after gardens and plants.
librarian | ly-BRAIR-ee-uhn | noun | A person who looks after a library.
receptionist | ri-SEP-shuhn-ist | noun | A person who greets visitors and answers the phone.
entrepreneur | on-truh-pruh-NUR | noun | A person who starts their own business.
trainee | TRAY-nee | noun | A person who is learning a job while working.
freelance | FREE-lahnss | adjective | Working for yourself rather than one employer.
ambition | am-BISH-uhn | noun | Something you really want to achieve.
determined | di-TUR-muhnd | adjective | Very focused on reaching a goal, even when it is hard.
creative | kree-AY-tiv | adjective | Good at making new ideas and things.
organised | AW-guh-nyzd | adjective | Good at planning and keeping things in order.
hard-working | hard-WUR-king | adjective | Putting a lot of effort into your work.
flexible | FLEK-suh-buhl | adjective | Able to change plans and adapt easily.
leadership | LEE-duh-ship | noun | The ability to guide and inspire a group.
retire | ri-TY-uh | verb | To stop working because you have reached a certain age.
`,
);
