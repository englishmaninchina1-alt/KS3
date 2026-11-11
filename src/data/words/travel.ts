import { makeCategory } from '../parse';

export const travel = makeCategory(
  {
    id: 'travel',
    title: 'Travel & Transport',
    emoji: '✈️',
    tagline: 'Journeys, tickets and seeing new places.',
    colours: ['#0284c7', '#6366f1'],
    ks3: 'KS3 English — writing to inform, reading timetables and describing a journey.',
    prompts: [
      'Describe the best journey you have ever made.',
      'Explain how you would travel from your home to another country.',
      'Talk about why some people prefer trains to planes.',
    ],
  },
  `
journey | JUR-nee | noun | The act of travelling from one place to another.
destination | dess-tuh-NAY-shuhn | noun | The place you are travelling to.
passenger | PASS-uhn-juh | noun | A person travelling in a vehicle.
driver | DRY-vuh | noun | The person who controls a vehicle.
ticket | TIK-it | noun | A piece of paper or a code that lets you travel.
platform | PLAT-fawm | noun | The raised area where you wait for a train.
departure | di-PAR-chuh | noun | The time when a journey begins.
arrival | uh-RY-vuhl | noun | The time when you reach a place.
luggage | LUG-ij | noun | The bags you take when you travel.
suitcase | SOOT-kayss | noun | A large case with a handle for clothes.
passport | PASS-pawt | noun | An official document you need to travel abroad.
boarding pass | BAW-ding pass | noun | A card that shows you are allowed on a plane.
airport | AIR-pawt | noun | A place where aeroplanes take off and land.
aeroplane | AIR-uh-playn | noun | A vehicle with wings that flies through the air.
helicopter | HEL-uh-kop-tuh | noun | An aircraft with spinning blades on top.
ferry | FAIR-ee | noun | A boat that carries people across water.
coach | kohch | noun | A comfortable bus for long journeys.
tram | tram | noun | A small train that runs through city streets.
underground | UN-duh-grownd | noun | A railway system that runs under a city.
bicycle | BY-sik-uhl | noun | A vehicle with two wheels that you pedal.
scooter | SKOO-tuh | noun | A small vehicle you stand on and push along.
motorbike | MOH-tuh-byk | noun | A fast two-wheeled vehicle with an engine.
lorry | LOR-ee | noun | A large vehicle that carries goods.
motorway | MOH-tuh-way | noun | A wide, fast road between cities.
traffic | TRAF-ik | noun | The vehicles moving along a road.
pedestrian | puh-DESS-tree-uhn | noun | A person walking rather than driving.
pavement | PAYV-muhnt | noun | The path beside a road for walking on.
roundabout | ROWND-uh-bowt | noun | A circular junction where roads meet.
crossroads | KROSS-rohdz | noun | A place where two roads cross each other.
traffic lights | TRAF-ik lytss | noun | Coloured lights that control traffic.
seatbelt | SEET-belt | noun | A strap that keeps you safe in a vehicle.
delay | di-LAY | noun | A time when something happens later than planned.
cancel | KAN-suhl | verb | To decide that something will not happen.
route | root | noun | The path you take to get somewhere.
map | map | noun | A drawing of an area seen from above.
compass | KUM-puhss | noun | A tool that shows which way is north.
direction | duh-REK-shuhn | noun | The way something moves or points.
abroad | uh-BRAWD | adverb | In or to another country.
tourist | TOOR-ist | noun | A person visiting a place on holiday.
souvenir | soo-vuh-NEER | noun | Something you buy to remember a place.
accommodation | uh-kom-uh-DAY-shuhn | noun | A place to stay, such as a hotel.
hotel | hoh-TEL | noun | A building where travellers pay to stay.
campsite | KAMP-syt | noun | An area where people pitch tents.
itinerary | eye-TIN-uh-ruh-ree | noun | A plan of a journey with times and places.
explore | ik-SPLAW | verb | To travel around a place to learn about it.
adventure | ad-VEN-chuh | noun | An exciting, unusual experience.
landscape | LAND-skayp | noun | The shape and features of an area of land.
culture | KUL-chuh | noun | The customs, art and way of life of a group.
currency | KUR-uhn-see | noun | The money a country uses.
insurance | in-SHOOR-uhnss | noun | Payments that protect you if something goes wrong.
`,
);
