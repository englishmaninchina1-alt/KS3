import { makeCategory } from '../parse';

export const me = makeCategory(
  {
    id: 'me',
    title: 'All About Me',
    emoji: '🪞',
    tagline: 'Family, feelings and the words that describe who you are.',
    colours: ['#7c3aed', '#ec4899'],
    ks3: 'KS3 English — describing people, choosing precise adjectives and writing about identity.',
    prompts: [
      'Describe yourself in three words and explain why you chose them.',
      'Talk about one person in your family who makes you laugh.',
      'Explain what makes a good friend.',
    ],
  },
  `
family | FAM-uh-lee | noun | People who are related to you, like parents, brothers and sisters.
parents | PAIR-uhnts | noun | Your mother and father.
brother | BRUTH-uh | noun | A boy or man who has the same parents as you.
sister | SISS-tuh | noun | A girl or woman who has the same parents as you.
cousin | KUZ-uhn | noun | The child of your aunt or uncle.
aunt | ahnt | noun | The sister of your mother or father.
uncle | UNG-kuhl | noun | The brother of your mother or father.
grandparent | GRAN-pair-uhnt | noun | The mother or father of one of your parents.
neighbour | NAY-buh | noun | A person who lives near you.
friend | frend | noun | Someone you like and enjoy spending time with.
personality | pur-suh-NAL-uh-tee | noun | The way you think, feel and behave.
confident | KON-fuh-duhnt | adjective | Feeling sure about yourself and what you can do.
curious | KYOOR-ee-uhss | adjective | Wanting to know or learn about things.
generous | JEN-uh-ruhss | adjective | Happy to give and share with other people.
honest | ON-ist | adjective | Telling the truth and not cheating.
patient | PAY-shuhnt | adjective | Able to wait calmly without getting annoyed.
cheerful | CHEER-fuhl | adjective | Happy and positive in a friendly way.
shy | shy | adjective | Nervous about talking to people you do not know well.
reliable | ri-LY-uh-buhl | adjective | Someone you can trust to do what they promise.
thoughtful | THAWT-fuhl | adjective | Caring about other people's feelings.
ambitious | am-BISH-uhss | adjective | Wanting very much to succeed at something.
stubborn | STUB-uhn | adjective | Refusing to change your mind, even when you should.
polite | puh-LYT | adjective | Speaking and behaving in a kind, respectful way.
proud | prowd | adjective | Pleased about something good that you or others have done.
embarrassed | im-BAR-uhst | adjective | Feeling shy or silly because of something you did.
worried | WURR-eed | adjective | Feeling anxious that something bad might happen.
jealous | JEL-uhss | adjective | Unhappy because someone has something you want.
grateful | GRAYT-fuhl | adjective | Thankful for something that someone has done for you.
describe | di-SKRYB | verb | To say what someone or something is like.
appearance | uh-PEER-uhns | noun | The way somebody or something looks.
height | hyt | noun | How tall someone or something is.
nickname | NIK-naym | noun | A short or funny name that friends call you.
teenager | TEEN-ay-juh | noun | A young person between thirteen and nineteen years old.
adult | AD-ult | noun | A grown-up person.
twin | twin | noun | One of two children born to the same mother at the same time.
stepmother | STEP-muth-uh | noun | The woman your father marries after your parents separate.
relative | REL-uh-tiv | noun | A member of your family.
ancestor | AN-sess-tuh | noun | A person in your family who lived a long time ago.
identity | eye-DEN-tuh-tee | noun | Who you are and what makes you unique.
background | BAK-grownd | noun | Your family history and the places you come from.
tradition | truh-DISH-uhn | noun | A custom that is passed from one generation to the next.
celebrate | SEL-uh-brayt | verb | To do something special to mark a happy event.
greet | greet | verb | To say hello to someone.
introduce | in-truh-DYOOSS | verb | To tell someone another person's name.
respect | ri-SPEKT | verb | To treat someone in a caring, polite way.
opinion | uh-PIN-yuhn | noun | What you think about something.
similar | SIM-uh-luh | adjective | Almost the same as something else.
different | DIF-ruhnt | adjective | Not the same as something else.
unique | yoo-NEEK | adjective | The only one of its kind; special and individual.
friendship | FREND-ship | noun | The relationship between friends.
`,
);
