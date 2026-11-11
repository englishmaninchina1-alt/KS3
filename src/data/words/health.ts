import { makeCategory } from '../parse';

export const health = makeCategory(
  {
    id: 'health',
    title: 'Body & Health',
    emoji: '🫀',
    tagline: 'Your body, feeling well and asking for help.',
    colours: ['#e11d48', '#f97316'],
    ks3: 'KS3 English — explaining a problem clearly and writing advice for healthy living.',
    prompts: [
      'Explain what you do when you feel unwell.',
      'Give three pieces of advice for staying healthy at school.',
      'Why is sleep important for teenagers?',
    ],
  },
  `
health | helth | noun | The condition of your body and mind.
wellbeing | wel-BEE-ing | noun | Feeling comfortable, healthy and happy.
body | BOD-ee | noun | All the physical parts of a person.
skeleton | SKEL-uh-tuhn | noun | All the bones that support your body.
muscle | MUS-uhl | noun | Body tissue that tightens to help you move.
brain | brayn | noun | The organ inside your head that controls your body and thoughts.
heart | hart | noun | The organ that pumps blood around your body.
lungs | lungz | noun | The two organs you use to breathe.
stomach | STUM-uhk | noun | The organ where food is digested.
skin | skin | noun | The outer covering of your body.
bone | bohn | noun | A hard part of the skeleton.
blood | blud | noun | The red liquid that travels around your body.
shoulder | SHOHL-duh | noun | The joint where your arm joins your body.
elbow | EL-boh | noun | The joint in the middle of your arm.
wrist | rist | noun | The joint between your hand and your arm.
ankle | ANG-kuhl | noun | The joint between your foot and your leg.
knee | nee | noun | The joint in the middle of your leg.
thumb | thum | noun | The short thick finger on the side of your hand.
finger | FING-guh | noun | One of the five long parts at the end of your hand.
forehead | FOR-id | noun | The part of your face above your eyes.
eyebrow | EYE-brow | noun | The line of hair above your eye.
cheek | cheek | noun | The soft part of your face below your eye.
chin | chin | noun | The part of your face below your mouth.
throat | throht | noun | The passage inside your neck.
cough | kof | verb | To push air out of your throat with a sharp sound.
sneeze | sneez | verb | To blow air out of your nose suddenly and loudly.
headache | HED-ayk | noun | A pain in your head.
fever | FEE-vuh | noun | A body temperature that is higher than normal.
medicine | MED-uh-sin | noun | Something you take to treat an illness.
prescription | pri-SKRIP-shuhn | noun | A doctor's written note allowing you to get medicine.
appointment | uh-POYNT-muhnt | noun | An arranged time to see a doctor or other professional.
symptom | SIM-tuhm | noun | A sign that shows you are unwell.
infection | in-FEK-shuhn | noun | An illness caused by germs.
allergy | AL-uh-jee | noun | A reaction that makes you ill when you touch or eat something.
injury | IN-juh-ree | noun | Physical damage to your body.
bandage | BAN-dij | noun | A strip of cloth used to cover a wound.
ambulance | AM-byuh-luhnss | noun | A vehicle that takes sick people to hospital.
hospital | HOS-pit-uhl | noun | A building where sick people are treated.
surgery | SUR-juh-ree | noun | A place where doctors see patients, or a medical operation.
nutrition | nyoo-TRISH-uhn | noun | Getting the right food for your body to work well.
sleep | sleep | noun | The rest your body and brain need every night.
breathe | breeth | verb | To take air in and let it out.
thirsty | THUR-stee | adjective | Feeling that you need to drink something.
hungry | HUNG-gree | adjective | Feeling that you need to eat something.
rest | rest | verb | To stop activity and relax for a while.
hygiene | HY-jeen | noun | Keeping your body and surroundings clean.
toothbrush | TOOTH-brush | noun | A small brush for cleaning your teeth.
suncream | SUN-kreem | noun | A cream that protects your skin from the sun.
mental health | MEN-tuhl helth | noun | How you think and feel about yourself and your life.
stress | stres | noun | Worry or pressure that makes you feel tense.
`,
);
