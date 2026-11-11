import { makeCategory } from '../parse';

export const animals = makeCategory(
  {
    id: 'animals',
    title: 'Animals & Wildlife',
    emoji: '🐘',
    tagline: 'Creatures great and small, from pets to predators.',
    colours: ['#ca8a04', '#f59e0b'],
    ks3: 'KS3 English — classifying, describing and writing an animal fact file.',
    prompts: [
      'Describe your favourite animal without saying its name.',
      'Explain why some wild animals are endangered.',
      'Would you keep an unusual pet? Explain your answer.',
    ],
  },
  `
mammal | MAM-uhl | noun | A warm-blooded animal that feeds its babies milk.
reptile | REP-tyl | noun | A cold-blooded animal with scaly skin, like a lizard.
amphibian | am-FIB-ee-uhn | noun | An animal that can live in water and on land.
insect | IN-sekt | noun | A small creature with six legs and three body parts.
predator | PRED-uh-tuh | noun | An animal that hunts and eats other animals.
prey | pray | noun | An animal that is hunted by another animal.
species | SPEE-sheez | noun | A group of animals that can breed together.
creature | KREE-chuh | noun | Any living animal.
livestock | LYV-stok | noun | Farm animals kept for meat, milk or wool.
elephant | EL-uh-fuhnt | noun | A huge grey animal with a long trunk.
giraffe | juh-RAHF | noun | A tall African animal with a very long neck.
zebra | ZEB-ruh | noun | An African horse with black and white stripes.
lion | LY-uhn | noun | A large wild cat; males have a loud roar and a mane.
tiger | TY-guh | noun | A big wild cat with orange fur and black stripes.
leopard | LEP-uhd | noun | A big wild cat with dark spots on golden fur.
monkey | MUNG-kee | noun | A clever animal that climbs trees.
gorilla | guh-RIL-uh | noun | The largest ape, with black fur and strong arms.
panda | PAN-duh | noun | A black and white bear from China that eats bamboo.
kangaroo | kang-guh-ROO | noun | An Australian animal that jumps on strong back legs.
dolphin | DOL-fin | noun | A clever sea animal that breathes air.
whale | wayl | noun | The largest sea animal, which breathes through a blowhole.
shark | shark | noun | A large fish with sharp teeth.
octopus | OK-tuh-puhss | noun | A sea animal with eight bendy arms.
penguin | PEN-gwin | noun | A black and white bird that swims but cannot fly.
eagle | EE-guhl | noun | A large bird with strong wings and sharp eyes.
owl | owl | noun | A night bird with big eyes and a round face.
parrot | PAR-uht | noun | A colourful bird that can copy human speech.
swan | swon | noun | A large white water bird with a long neck.
tortoise | TAW-tuhss | noun | A slow land animal with a hard shell.
crocodile | KROK-uh-dyl | noun | A large reptile with a long mouth and strong jaws.
snake | snayk | noun | A long reptile with no legs that slides along the ground.
lizard | LIZ-uhd | noun | A small reptile with four legs and a long tail.
frog | frog | noun | A green amphibian that jumps and croaks.
butterfly | BUT-uh-fly | noun | An insect with large, colourful wings.
bee | bee | noun | A flying insect that makes honey.
spider | SPY-duh | noun | A small creature with eight legs that spins webs.
ant | ant | noun | A tiny insect that lives in large groups.
rabbit | RAB-it | noun | A small furry animal with long ears.
hamster | HAM-stuh | noun | A small furry pet that stores food in its cheeks.
squirrel | SKWIR-uhl | noun | A small bushy-tailed animal that climbs trees.
hedgehog | HEJ-hog | noun | A small animal covered with sharp spines.
fox | foks | noun | A wild animal with red-brown fur and a bushy tail.
badger | BAJ-uh | noun | A stocky night animal with black and white stripes on its face.
deer | deer | noun | A gentle wild animal; males often have antlers.
otter | OT-uh | noun | A playful river animal with smooth brown fur.
nocturnal | nok-TUR-nuhl | adjective | Active at night rather than during the day.
domestic | duh-MESS-tik | adjective | Kept by people as a pet or on a farm.
tame | taym | adjective | Not wild; used to living with people.
fierce | feerss | adjective | Wild and likely to attack.
poisonous | POY-zuh-nuhss | adjective | Containing something that can make you very ill.
`,
);
