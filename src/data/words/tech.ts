import { makeCategory } from '../parse';

export const tech = makeCategory(
  {
    id: 'tech',
    title: 'Technology & Media',
    emoji: '🤖',
    tagline: 'Devices, the internet and the media we use every day.',
    colours: ['#4f46e5', '#22d3ee'],
    ks3: 'KS3 English — understanding digital texts and writing balanced arguments about online life.',
    prompts: [
      'Explain how technology helps you with your schoolwork.',
      'Should children have a time limit on screen time? Give reasons.',
      'Describe one way to stay safe online.',
    ],
  },
  `
technology | tek-NOL-uh-jee | noun | The machines and tools people invent to help them.
device | di-VYSS | noun | A machine or gadget made for a particular job.
computer | kuhm-PYOO-tuh | noun | A machine that stores information and runs programs.
laptop | LAP-top | noun | A small portable computer you can fold shut.
tablet | TAB-luht | noun | A flat portable computer with a touch screen.
smartphone | SMART-fohn | noun | A mobile phone that can connect to the internet.
keyboard | KEE-bawd | noun | The set of keys you type on.
screen | skreen | noun | The flat surface where images and words are shown.
software | SOFT-wair | noun | The programs that run on a computer.
app | ap | noun | A small program designed for a phone or tablet.
internet | IN-tuh-net | noun | A worldwide network that connects computers.
website | WEB-syt | noun | A set of pages on the internet about a topic.
browser | BROW-zuh | noun | A program used to look at websites.
password | PASS-wurd | noun | A secret word or code that lets you log in.
download | DOWN-lohd | verb | To copy a file from the internet onto your device.
upload | UP-lohd | verb | To send a file from your device to the internet.
streaming | STREE-ming | noun | Playing video or audio directly from the internet.
social media | SOH-shuhl MEE-dee-uh | noun | Websites and apps where people share posts and messages.
podcast | POD-kahst | noun | A series of spoken recordings you can listen to online.
influencer | IN-floo-uhn-suh | noun | A person who persuades others through their online posts.
algorithm | AL-guh-rith-uhm | noun | A set of steps a computer follows to solve a problem.
artificial intelligence | ar-tuh-FISH-uhl in-TEL-uh-juhnss | noun | Computer systems that can learn and make decisions.
robot | ROH-bot | noun | A machine that can carry out tasks automatically.
digital | DIJ-uh-tuhl | adjective | Using computer technology.
virtual | VUR-choo-uhl | adjective | Made by computer software rather than existing physically.
online | on-LYN | adverb | Connected to or using the internet.
offline | of-LYN | adverb | Not connected to the internet.
wireless | WY-uh-luhss | adjective | Working without cables.
battery | BAT-uh-ree | noun | An object that stores and supplies power.
charger | CHAR-juh | noun | A device used to put power back into a battery.
headphones | HED-fohnz | noun | A pair of small speakers worn over your ears.
console | KON-sohl | noun | A machine used to play video games.
controller | kuhn-TROH-luh | noun | A device you hold to control a game.
graphics | GRAF-iks | noun | The pictures and images produced by a computer.
animation | an-uh-MAY-shuhn | noun | A film made from many still pictures shown quickly.
documentary | dok-yuh-MEN-tuh-ree | noun | A factual film about real people or events.
advertisement | ad-VUR-tiss-muhnt | noun | A notice that tries to persuade you to buy something.
headline | HED-lyn | noun | The large title at the top of a news story.
broadcast | BRAW-kahst | verb | To send out a programme on TV, radio or the internet.
security | si-KYOO-ruh-tee | noun | Keeping data and accounts safe from harm.
cyberbullying | SY-buh-bul-ee-ing | noun | Bullying that happens online.
screen time | SKREEN tym | noun | The amount of time spent looking at a screen.
notification | noh-tuh-fuh-KAY-shuhn | noun | A message that pops up to tell you something.
subscription | suhb-SKRIP-shuhn | noun | A regular payment to keep using a service.
search engine | SURCH en-jin | noun | A website that helps you find things on the internet.
data | DAY-tuh | noun | Facts and information, often stored by computers.
save | sayv | verb | To keep a file so you can use it again.
delete | di-LEET | verb | To remove a file or message permanently.
edit | ED-it | verb | To change a piece of work to improve it.
connect | kuh-NEKT | verb | To join devices or people together.
`,
);
