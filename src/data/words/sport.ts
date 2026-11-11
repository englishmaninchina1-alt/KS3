import { makeCategory } from '../parse';

export const sport = makeCategory(
  {
    id: 'sport',
    title: 'Sport & Hobbies',
    emoji: '⚽',
    tagline: 'Teams, training and the things you love doing for fun.',
    colours: ['#16a34a', '#84cc16'],
    ks3: 'KS3 English — recounting events, using sporting vocabulary and writing a match report.',
    prompts: [
      'Describe a hobby you would like to try and explain why.',
      'Talk about a time your team did not win. How did you feel?',
      'Explain why exercise is important for teenagers.',
    ],
  },
  `
exercise | EK-suh-syz | noun | Movement that makes your body stronger and healthier.
fitness | FIT-nuhss | noun | The condition of being strong and healthy.
training | TRAY-ning | noun | Regular practice that prepares you for a sport.
tournament | TOOR-nuh-muhnt | noun | A competition with several matches and one winner.
competition | kom-puh-TISH-uhn | noun | An event where people try to be the best.
opponent | uh-POH-nuhnt | noun | The person or team you play against.
teamwork | TEEM-wurk | noun | Working together well as a group.
referee | ref-uh-REE | noun | The official who makes sure the rules are followed.
spectator | spek-TAY-tuh | noun | A person who watches a sport.
stadium | STAY-dee-uhm | noun | A large sports ground with seats for the crowd.
athletics | ath-LET-iks | noun | Sports such as running, jumping and throwing.
gymnastics | jim-NASS-tiks | noun | A sport of strong, flexible movements and balances.
swimming | SWIM-ing | noun | Moving through water using your arms and legs.
cycling | SY-kling | noun | Riding a bicycle.
badminton | BAD-min-tuhn | noun | A racket game played with a shuttlecock over a net.
hockey | HOK-ee | noun | A team game played with sticks and a small ball.
netball | NET-bawl | noun | A team game where players throw a ball into a high net.
rugby | RUG-bee | noun | A team game played with an oval ball.
cricket | KRIK-it | noun | A bat-and-ball game played between two teams.
karate | kuh-RAH-tee | noun | A Japanese martial art of punches and kicks.
climbing | KLY-ming | noun | Going up rocks, walls or mountains.
sailing | SAY-ling | noun | Travelling on water in a boat with sails.
skateboarding | SKAYT-bawd-ing | noun | Riding on a board with wheels.
dancing | DAHN-sing | noun | Moving your body to music.
painting | PAYN-ting | noun | Making pictures with paint.
drawing | DRAW-ing | noun | Making pictures with a pencil or pen.
photography | fuh-TOG-ruh-fee | noun | Taking pictures with a camera.
knitting | NIT-ing | noun | Making clothes from wool using long needles.
chess | chess | noun | A thinking game played on a board of black and white squares.
guitar | gi-TAR | noun | A musical instrument with strings that you pluck.
orchestra | OR-kiss-truh | noun | A large group of musicians playing together.
choir | KWY-uh | noun | A group of people who sing together.
drama | DRAH-muh | noun | Acting and performing plays.
acting | AKT-ing | noun | Pretending to be a character in a play or film.
audience | AW-dee-uhnss | noun | The people who watch a performance.
rehearsal | ri-HUR-suhl | noun | A practice session before a performance.
performance | puh-FAW-muhnss | noun | A show that an audience watches.
hobby | HOB-ee | noun | Something you enjoy doing in your free time.
collect | kuh-LEKT | verb | To gather things as a hobby.
practise | PRAK-tiss | verb | To do something regularly to get better at it.
improve | im-PROOV | verb | To get better at something.
achieve | uh-CHEEV | verb | To succeed in doing something after effort.
stamina | STAM-uh-nuh | noun | The strength to keep going for a long time.
strategy | STRAT-uh-jee | noun | A plan for winning or reaching a goal.
score | skaw | noun | The number of points each side has.
trophy | TROH-fee | noun | A prize, often a cup, given to a winner.
medal | MED-uhl | noun | A metal disc given as a prize.
champion | CHAM-pee-uhn | noun | The best player or team in a competition.
volunteer | vol-uhn-TEER | verb | To work without pay because you want to help.
relax | ri-LAKS | verb | To rest and feel calm.
`,
);
