let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});

// Раздача статики
app.use(express.static(`public`));

// Настройка handlebars
let hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

// POST-запросы
app.use(express.urlencoded({ extended: true }));

// Настройка faker
let { faker } = require(`@faker-js/faker`);

let items = [];
for (let i =0; i <= 20; i++) {
    let sex = faker.name.sex();

    items.push({
        id: i,
        name: faker.name.firstName(sex),
        sex: sex,
        age: faker.datatype.number({ max: 20 }),
        image: faker.image.cats(400, 400, true) ,
        breed: faker.animal.cat(),
        isActive: faker.datatype.boolean(),
        isWanted: false
    });
};

app.get(`/`, function (req, res) {
    let array = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].isActive) {
            array.push(items[i]);
        }
    }
    res.render(`index`, {items: array});
});

app.get(`/is-home`, function (req, res) {
    let array = [];
    for (let i = 0; i < items.length; i++) {
        if (!items[i].isActive) {
            array.push(items[i]);
        }
    }
    res.render(`index`, {items: array});
});

app.get(`/search`, function (req, res) {
    res.render(`search`);
});

app.get(`/search-result`, function (req, res) {
    let isold = req.query.isold;
    let iskitten = req.query.iskitten;
    let isadult = req.query.isadult;
    let sex = req.query.sex;

    let array = [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (items[i].isActive) {
            if (items[i].sex == sex || sex == 'all') {
                if (isold && item.age >= 11) {
                    array.push(item);
                }
                if (iskitten && item.age <= 2) {
                    array.push(item);
                }
                if (isadult && item.age >= 3 && item.age <= 10) {
                    array.push(item);
                }
            }
           
        }
    };
    res.render(`index`, {items: array});
});

app.get(`/admin`, function (req, res) {
    res.render(`admin`, {items: items});
});

app.post(`/admin-add`, function (req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let sex = req.body.sex;
    let breed = req.body.breed;

    let item = {
        id: items.length,
        name: name,
        age: age,
        sex: sex,
        image: faker.image.cats(400, 400, true),
        breed: breed,
        isActive: true,
        isWanted: false
    };
    items.push(item); 
    console.log(items)
    res.redirect(`/admin`);
});

app.get(`/admin-home`, function (req, res) {
    let id = req.query.id;
    let item = items[id];

    if (item) {
        item.isActive = false;
        item.isWanted = false;
    }
    res.redirect(`/admin`);
});

app.get(`/home`, function (req, res) {
    let id = req.query.id;
    let item = items[id];
    if (item) {
        item.isWanted = true;
        res.redirect(`/success`);
    }
});

app.get(`/success`, function (req, res) {
    res.render(`success`);
})
