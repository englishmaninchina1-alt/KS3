import { makeCategory } from '../parse';

export const nature = makeCategory(
  {
    id: 'nature',
    title: 'Weather & Nature',
    emoji: '🌈',
    tagline: 'Seasons, storms, landscapes and looking after our planet.',
    colours: ['#0891b2', '#3b82f6'],
    ks3: 'KS3 English — writing descriptively about place and arguing about the environment.',
    prompts: [
      'Describe a thunderstorm using three weather words.',
      'Explain one thing people can do to protect nature.',
      'Which season is the best? Give reasons for your answer.',
    ],
  },
  `
weather | WETH-uh | noun | The state of the air and sky at a certain time.
forecast | FAW-kahst | noun | A guess about what the weather will be like.
temperature | TEM-pruh-chuh | noun | How hot or cold something is.
climate | KLY-mit | noun | The usual weather of a place over many years.
season | SEE-zuhn | noun | One of the four parts of the year.
spring | spring | noun | The season when plants begin to grow again.
summer | SUM-uh | noun | The warmest season of the year.
autumn | AW-tuhm | noun | The season when leaves change colour and fall.
winter | WIN-tuh | noun | The coldest season of the year.
sunshine | SUN-shyn | noun | Light and heat from the sun.
shower | SHOW-uh | noun | A short period of light rain.
drizzle | DRIZ-uhl | noun | Very light rain made of tiny drops.
downpour | DOWN-paw | noun | A sudden, very heavy fall of rain.
thunder | THUN-duh | noun | A loud rumble heard during a storm.
lightning | LYT-ning | noun | A bright flash of electricity in the sky.
rainbow | RAYN-boh | noun | An arch of colours seen when sunlight hits rain.
breeze | breez | noun | A gentle wind.
gale | gayl | noun | A very strong wind.
frost | frost | noun | A thin white layer of ice on cold surfaces.
icicle | EYE-sik-uhl | noun | A pointed piece of ice hanging down.
blizzard | BLIZ-uhd | noun | A snowstorm with strong winds.
humid | HYOO-mid | adjective | Having a lot of water in the air; damp and warm.
freezing | FREE-zing | adjective | Extremely cold.
mild | myld | adjective | Not too hot and not too cold.
overcast | oh-vuh-KAHST | adjective | Covered by grey cloud.
mountain | MOWN-tuhn | noun | A very high hill with steep sides.
valley | VAL-ee | noun | The low land between hills or mountains.
river | RIV-uh | noun | A long stream of water flowing to the sea.
stream | streem | noun | A small, narrow river.
waterfall | WAW-tuh-fawl | noun | Water that falls from a high place.
lake | layk | noun | A large area of water surrounded by land.
ocean | OH-shuhn | noun | A very large area of salt water.
coast | kohst | noun | The land beside the sea.
cliff | klif | noun | A high rock face, often beside the sea.
forest | FOR-ist | noun | A large area covered with trees.
meadow | MED-oh | noun | A field of grass and wild flowers.
desert | DEZ-uhrt | noun | A very dry area where little grows.
island | EYE-luhnd | noun | Land with water all around it.
volcano | vol-KAY-noh | noun | A mountain that can shoot out hot rock.
earthquake | URTH-kwayk | noun | A sudden shaking of the ground.
environment | in-VY-ruhn-muhnt | noun | The natural world around us.
pollution | puh-LOO-shuhn | noun | Harmful things that dirty the air, water or land.
recycle | ree-SY-kuhl | verb | To turn old materials into new things.
renewable | ri-NYOO-uh-buhl | adjective | Able to be replaced naturally, like wind power.
habitat | HAB-uh-tat | noun | The natural home of a plant or animal.
wildlife | WYLD-lyf | noun | Animals and plants living in the wild.
endangered | in-DAYN-juhd | adjective | At risk of no longer existing.
conservation | kon-suh-VAY-shuhn | noun | Protecting nature and looking after it.
sustainable | suh-STAY-nuh-buhl | adjective | Able to continue without harming the planet.
wilderness | WIL-duh-nuhss | noun | A wild place where few people live.
`,
);
