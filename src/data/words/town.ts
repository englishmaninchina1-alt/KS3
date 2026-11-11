import { makeCategory } from '../parse';

export const town = makeCategory(
  {
    id: 'town',
    title: 'Town & Shopping',
    emoji: '🏙️',
    tagline: 'Streets, shops and getting around your local area.',
    colours: ['#db2777', '#f59e0b'],
    ks3: 'KS3 English — writing to persuade and giving clear directions.',
    prompts: [
      'Describe your ideal town for teenagers.',
      'Explain how to get from your school to the nearest shop.',
      'Do shopping centres make towns better or worse? Explain.',
    ],
  },
  `
town | town | noun | A place with houses and shops, smaller than a city.
city | SIT-ee | noun | A large and busy town.
village | VIL-ij | noun | A very small settlement in the countryside.
suburb | SUB-urb | noun | An area of homes on the edge of a city.
centre | SEN-tuh | noun | The middle part of a town or city.
high street | HY street | noun | The main street of a town, full of shops.
shopping centre | SHOP-ing SEN-tuh | noun | A large building containing many shops.
market | MAR-kit | noun | A place where people sell goods from stalls.
supermarket | SOO-puh-mar-kit | noun | A large shop that sells food and household items.
bakery | BAY-kuh-ree | noun | A shop that bakes and sells bread and cakes.
butcher | BOOCH-uh | noun | A shop that sells meat.
pharmacy | FAR-muh-see | noun | A shop that sells medicines.
bookshop | BOOK-shop | noun | A shop that sells books.
bank | bank | noun | A place that keeps and lends money.
post office | POHST of-iss | noun | A place where you send letters and parcels.
café | KAF-ay | noun | A small place selling drinks and light meals.
restaurant | RES-tuh-rahnt | noun | A place where you pay to sit and eat a meal.
queue | kyoo | noun | A line of people waiting for their turn.
cashier | ka-SHEER | noun | The person who takes your money in a shop.
customer | KUS-tuh-muh | noun | A person who buys something.
receipt | ri-SEET | noun | A piece of paper proving you paid.
discount | DIS-kownt | noun | Money taken off the usual price.
bargain | BAR-guhn | noun | Something bought for much less than its usual price.
price | pryss | noun | The amount of money something costs.
afford | uh-FAWD | verb | To have enough money to pay for something.
expensive | ik-SPEN-siv | adjective | Costing a lot of money.
cheap | cheep | adjective | Costing little money.
refund | REE-fund | noun | Money given back when you return something.
exchange | iks-CHAYNJ | verb | To give one thing and receive another in return.
purchase | PUR-chuhss | verb | To buy something.
trolley | TROL-ee | noun | A metal basket on wheels for shopping.
basket | BAH-skit | noun | A container for carrying your shopping.
aisle | eyel | noun | A narrow path between shelves in a shop.
checkout | CHEK-owt | noun | The place where you pay for your shopping.
cash | kash | noun | Money in notes and coins.
credit card | KRED-it kard | noun | A plastic card used to pay for things.
contactless | KON-takt-luhss | adjective | Paying by tapping a card without a PIN.
voucher | VOW-chuh | noun | A ticket you exchange for goods or money off.
shop assistant | shop uh-SISS-tuhnt | noun | A person who serves customers in a shop.
crossing | KROSS-ing | noun | A place where people can safely cross a road.
bench | bench | noun | A long seat for several people.
fountain | FOWN-tuhn | noun | A structure that sends water into the air.
museum | myoo-ZEE-uhm | noun | A building where interesting objects are displayed.
theatre | THEE-uh-tuh | noun | A building where plays and shows are performed.
cinema | SIN-uh-muh | noun | A building where films are shown.
leisure centre | LEZH-uh SEN-tuh | noun | A building with a pool and sports facilities.
playground | PLAY-grownd | noun | An outdoor area with equipment for children to play on.
community | kuh-MYOO-nuh-tee | noun | The people who live in the same area.
busy | BIZ-ee | adjective | Full of activity and people.
crowded | KROWD-id | adjective | Full of too many people.
`,
);
