import { makeCategory } from '../parse';

export const food = makeCategory(
  {
    id: 'food',
    title: 'Food & Drink',
    emoji: '🍎',
    tagline: 'Tastes, cooking and making healthy choices.',
    colours: ['#f97316', '#ef4444'],
    ks3: 'KS3 English — using sensory description and writing instructions for a recipe.',
    prompts: [
      'Describe your favourite meal using three taste words.',
      'Explain how to make a simple healthy breakfast.',
      'Should schools ban fizzy drinks? Give your opinion.',
    ],
  },
  `
bread | bred | noun | A baked food made from flour, water and yeast.
cheese | cheez | noun | A solid food made from milk.
chicken | CHIK-in | noun | A farm bird, or the meat from it.
rice | rys | noun | Small white or brown grains that are cooked and eaten.
pasta | PASS-tuh | noun | Italian food made from flour and water, like spaghetti.
potato | puh-TAY-toh | noun | A round vegetable that grows under the ground.
tomato | tuh-MAH-toh | noun | A soft red fruit often used in salads and sauces.
onion | UN-yuhn | noun | A round vegetable with a strong taste that can make you cry.
carrot | KAR-uht | noun | A long orange vegetable that grows under the ground.
pepper | PEP-uh | noun | A crunchy vegetable that can be red, green or yellow.
apple | AP-uhl | noun | A round fruit with red or green skin.
banana | buh-NAH-nuh | noun | A long curved fruit with yellow skin.
orange | OR-inj | noun | A round citrus fruit with thick orange skin.
strawberry | STRAW-buh-ree | noun | A small sweet red fruit with tiny seeds on the outside.
grapes | grayps | noun | Small round fruit that grow in bunches.
vegetable | VEJ-tuh-buhl | noun | A plant or part of a plant that we eat as food.
fruit | froot | noun | The sweet part of a plant that contains seeds.
breakfast | BREK-fuhst | noun | The first meal of the day.
lunch | lunch | noun | The meal you eat in the middle of the day.
dinner | DIN-uh | noun | The main meal of the day, usually in the evening.
snack | snak | noun | A small amount of food eaten between meals.
dessert | di-ZURT | noun | Sweet food eaten at the end of a meal.
ingredient | in-GREE-dee-uhnt | noun | One of the foods you use to make a dish.
recipe | RESS-uh-pee | noun | A set of instructions for cooking a dish.
delicious | di-LISH-uhss | adjective | Tasting extremely good.
nutritious | nyoo-TRISH-uhss | adjective | Full of the goodness your body needs.
healthy | HEL-thee | adjective | Good for your body and mind.
vitamin | VIT-uh-min | noun | A natural substance in food that keeps your body working.
protein | PROH-teen | noun | A food nutrient that helps your body grow and repair.
energy | EN-uh-jee | noun | The power your body uses to move, think and grow.
flavour | FLAY-vuh | noun | The taste of a food or drink.
spicy | SPY-see | adjective | Having a hot, strong taste.
savoury | SAY-vuh-ree | adjective | Salty or herby rather than sweet.
sour | SOW-uh | adjective | Having a sharp taste, like a lemon.
bitter | BIT-uh | adjective | Having a sharp, unpleasant taste, like coffee.
sweet | sweet | adjective | Tasting of sugar or honey.
salty | SAWL-tee | adjective | Tasting strongly of salt.
crispy | KRISS-pee | adjective | Pleasantly hard and crunchy when bitten.
oven | UV-uhn | noun | A hot box in a kitchen used for baking food.
saucepan | SAWSS-puhn | noun | A deep metal pan with a handle for cooking on a hob.
chop | chop | verb | To cut food into small pieces.
stir | stur | verb | To move food around with a spoon.
boil | boyl | verb | To heat a liquid until it bubbles.
bake | bayk | verb | To cook food in an oven.
fry | fry | verb | To cook food in hot oil.
grill | gril | verb | To cook food using strong heat from above.
taste | tayst | verb | To try food with your mouth to see what it is like.
balanced diet | BAL-uhnst DY-ut | noun | Eating a good mix of different foods to stay healthy.
vegetarian | vej-uh-TAIR-ee-uhn | noun | A person who does not eat meat or fish.
takeaway | TAYK-uh-way | noun | A meal you buy from a restaurant and eat somewhere else.
`,
);
