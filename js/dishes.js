// Данные меню. Чтобы добавить блюдо — добавьте объект в массив DISHES.
const CATEGORIES = {
  starters: "Закуски",
  soups: "Супы",
  main: "Горячее",
  desserts: "Десерты",
  drinks: "Напитки",
};

// label — метка (badge): "hit" — хит, "new" — новинка, "veg" — вегетарианское, "" — без метки
const DISHES = [
  { id: 1, name: "Брускетта с томатами", cat: "starters", price: 290, weight: "180 г", img: "images/bruschetta.jpg", label: "veg", desc: "Хрустящий хлеб, спелые томаты, базилик и оливковое масло.", ingr: "хлеб, томаты, базилик, чеснок, оливковое масло" },
  { id: 2, name: "Рулеты из баклажанов", cat: "starters", price: 340, weight: "200 г", img: "images/eggplant-rolls.jpg", label: "veg", desc: "Запечённые баклажаны с ореховой начинкой и гранатом.", ingr: "баклажаны, грецкий орех, чеснок, гранат" },
  { id: 3, name: "Карпаччо из говядины", cat: "starters", price: 520, weight: "150 г", img: "images/carpaccio.jpg", label: "new", desc: "Тонкие ломтики говядины, руккола, пармезан, соус песто.", ingr: "говядина, руккола, пармезан, песто" },
  { id: 4, name: "Борщ с пампушками", cat: "soups", price: 350, weight: "350 г", img: "images/borscht.jpg", label: "hit", desc: "Классический борщ на говяжьем бульоне со сметаной.", ingr: "говядина, свёкла, капуста, картофель, сметана" },
  { id: 5, name: "Крем-суп из тыквы", cat: "soups", price: 320, weight: "300 г", img: "images/pumpkin-soup.jpg", label: "veg", desc: "Нежный суп-пюре со сливками и тыквенными семечками.", ingr: "тыква, сливки, лук, семечки" },
  { id: 6, name: "Солянка мясная", cat: "soups", price: 390, weight: "350 г", img: "images/solyanka.jpg", label: "", desc: "Наваристая солянка с копчёностями, оливками и лимоном.", ingr: "говядина, колбаса, оливки, огурцы, лимон" },
  { id: 7, name: "Паста карбонара", cat: "main", price: 480, weight: "300 г", img: "images/carbonara.jpg", label: "hit", desc: "Спагетти, гуанчале, желток и пекорино.", ingr: "спагетти, бекон, желток, сыр" },
  { id: 8, name: "Стейк рибай", cat: "main", price: 1290, weight: "280 г", img: "images/ribeye.jpg", label: "new", desc: "Мраморная говядина на гриле с овощами и соусом демиглас.", ingr: "говядина, овощи гриль, демиглас" },
  { id: 9, name: "Лосось на гриле", cat: "main", price: 890, weight: "250 г", img: "images/salmon.jpg", label: "", desc: "Филе лосося с картофельным пюре и лимонным соусом.", ingr: "лосось, картофель, лимон, сливки" },
  { id: 10, name: "Пицца Маргарита", cat: "main", price: 560, weight: "450 г", img: "images/pizza-margherita.jpg", label: "veg", desc: "Томатный соус, моцарелла и свежий базилик.", ingr: "тесто, томаты, моцарелла, базилик" },
  { id: 11, name: "Тирамису", cat: "desserts", price: 310, weight: "150 г", img: "images/tiramisu.jpg", label: "hit", desc: "Савоярди, маскарпоне и эспрессо.", ingr: "маскарпоне, савоярди, кофе, какао" },
  { id: 12, name: "Чизкейк «Нью-Йорк»", cat: "desserts", price: 330, weight: "140 г", img: "images/cheesecake.jpg", label: "", desc: "Классический чизкейк с ягодным соусом.", ingr: "сливочный сыр, печенье, ягоды" },
  { id: 13, name: "Лимонад домашний", cat: "drinks", price: 190, weight: "400 мл", img: "images/lemonade.jpg", label: "veg", desc: "Лимон, мята, тростниковый сахар и лёд.", ingr: "лимон, мята, сахар, вода" },
  { id: 14, name: "Морс клюквенный", cat: "drinks", price: 170, weight: "400 мл", img: "images/morse.jpg", label: "", desc: "Натуральный морс из свежей клюквы.", ingr: "клюква, вода, сахар" },
  { id: 15, name: "Капучино", cat: "drinks", price: 210, weight: "250 мл", img: "images/cappuccino.jpg", label: "", desc: "Двойной эспрессо и молочная пенка.", ingr: "кофе, молоко" },
];

const LABELS = {
  hit: { text: "Хит", cls: "text-bg-danger" },
  new: { text: "Новинка", cls: "text-bg-success" },
  veg: { text: "Вегетарианское", cls: "text-bg-warning" },
};

