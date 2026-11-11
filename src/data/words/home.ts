import { makeCategory } from '../parse';

export const home = makeCategory(
  {
    id: 'home',
    title: 'Home & Furniture',
    emoji: '🏠',
    tagline: 'Rooms, objects and the place where you live.',
    colours: ['#0d9488', '#22c55e'],
    ks3: 'KS3 English — describing settings and using prepositions of place.',
    prompts: [
      'Describe your bedroom using at least four position words.',
      'Explain what makes a house feel like a home.',
      'Talk about a room you would love to design.',
    ],
  },
  `
house | howss | noun | A building where people live.
flat | flat | noun | A home on one level of a larger building.
bungalow | BUNG-guh-loh | noun | A house with only one floor.
kitchen | KICH-in | noun | The room where food is cooked.
bedroom | BED-room | noun | The room where you sleep.
bathroom | BAHTH-room | noun | The room with a bath, shower or toilet.
living room | LIV-ing room | noun | The room where a family sits together.
hallway | HAWL-way | noun | The passage just inside the front door.
garden | GAR-duhn | noun | The outdoor area next to a house.
garage | GAR-ij | noun | A building where a car is kept.
attic | AT-ik | noun | A room or space just under the roof.
cellar | SEL-uh | noun | A room below the ground floor of a house.
furniture | FUR-nuh-chuh | noun | Things like tables, chairs and beds that fill a room.
sofa | SOH-fuh | noun | A long soft seat for two or more people.
armchair | ARM-chair | noun | A soft chair with sides to rest your arms on.
wardrobe | WAW-drohb | noun | A tall cupboard where you hang clothes.
cupboard | KUB-uhd | noun | A piece of furniture with doors and shelves.
bookshelf | BOOK-shelf | noun | A shelf for keeping books.
mattress | MAT-riss | noun | The thick soft part of a bed that you lie on.
pillow | PIL-oh | noun | A soft cushion for your head when you sleep.
duvet | DOO-vay | noun | A thick cover filled with feathers or soft material.
curtain | KUR-tuhn | noun | Cloth that hangs over a window.
carpet | KAR-pit | noun | A soft covering for a floor.
mirror | MIR-uh | noun | A piece of glass where you can see yourself.
lamp | lamp | noun | An object that gives light.
radiator | RAY-dee-ay-tuh | noun | A metal panel that warms a room.
fridge | frij | noun | A cold machine that keeps food fresh.
kettle | KET-uhl | noun | A container used to boil water.
dishwasher | DISH-wosh-uh | noun | A machine that washes dirty plates and cups.
washing machine | WOSH-ing muh-SHEEN | noun | A machine that washes clothes.
vacuum | VAK-yoom | verb | To clean a floor with a machine that sucks up dirt.
cosy | KOH-zee | adjective | Warm, comfortable and snug.
spacious | SPAY-shuhss | adjective | Having plenty of room.
modern | MOD-uhn | adjective | Designed in a new, up-to-date style.
traditional | truh-DISH-uh-nuhl | adjective | Following an old, familiar style.
tidy | TY-dee | adjective | Neat, with everything in its place.
messy | MESS-ee | adjective | Untidy, with things spread everywhere.
clutter | KLUT-uh | noun | Too many things lying around in a messy way.
decorate | DEK-uh-rayt | verb | To add colour or pretty things to a room.
renovate | REN-uh-vayt | verb | To repair and improve an old building.
landlord | LAND-lawd | noun | A person who owns a property and rents it to others.
tenant | TEN-uhnt | noun | A person who pays rent to live in a property.
rent | rent | noun | Money you pay regularly to live in someone's property.
mortgage | MAW-gij | noun | A loan used to buy a house.
neighbourhood | NAY-buh-hood | noun | The area around where you live.
privacy | PRIV-uh-see | noun | Being away from other people so you can be alone.
comfortable | KUMF-tuh-buhl | adjective | Giving a pleasant, relaxing feeling.
upstairs | up-STAIRZ | adverb | On a higher floor of a building.
downstairs | down-STAIRZ | adverb | On a lower floor of a building.
balcony | BAL-kuh-nee | noun | A small platform outside an upstairs window.
`,
);
