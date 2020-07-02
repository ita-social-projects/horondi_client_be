/* eslint-disable no-undef */
const axios = require('axios');
const { apolloClient } = require('../../utils/apolloClient');
require('dotenv').config();

describe('querries', () => {
  test('should receive id,title', async () => {
    const res = apolloClient(`
            query {
              getAllNews {
                _id
                title {
                  lang
                  value
                }
              }
            }
          `);

    expect(res).toEqual([
      {
        _id: '5ef25be18456ef0604ebb825',
        title: [
          {
            lang: 'uk',
            value: 'Модні новинки сумок на сезон осінь-зима 2019-2020',
          },
          {
            lang: 'en',
            value: 'Fasionable new bags for fall-winter 2019-2020 season',
          },
        ],
      },
      {
        _id: '5ef25be18456ef0604ebb826',
        title: [
          {
            lang: 'uk',
            value:
              'Що носити модницям влітку 2020: добірка трендових сумок для спекотного сезону',
          },
          {
            lang: 'en',
            value:
              'A selection of trendy bags for the hot season of summer 2020',
          },
        ],
      },
      {
        _id: '5ef25be18456ef0604ebb827',
        title: [
          {
            lang: 'uk',
            value: 'Аксесуар на пояс, зручна сумка, стильна штучка!',
          },
          {
            lang: 'en',
            value: 'Belt accessory, comfortable bag, stylish thingy!',
          },
        ],
      },
    ]);
  });

  test('should receive title', async () => {
    const res = await axios
      .post(`${process.env.BASE_URI}`, {
        query: `query {
          getAllNews {
            title {
              lang
              value
            }
          }
        }`,
      })
      .then(res => res);
    expect(res.data.data.getAllNews).toMatchSnapshot();
    expect(res.data.data.getAllNews).not.toBe(null);
    expect(res.data.data.getAllNews).toEqual([
      {
        title: [
          {
            lang: 'uk',
            value: 'Модні новинки сумок на сезон осінь-зима 2019-2020',
          },
          {
            lang: 'en',
            value: 'Fasionable new bags for fall-winter 2019-2020 season',
          },
        ],
      },
      {
        title: [
          {
            lang: 'uk',
            value:
              'Що носити модницям влітку 2020: добірка трендових сумок для спекотного сезону',
          },
          {
            lang: 'en',
            value:
              'A selection of trendy bags for the hot season of summer 2020',
          },
        ],
      },
      {
        title: [
          {
            lang: 'uk',
            value: 'Аксесуар на пояс, зручна сумка, стильна штучка!',
          },
          {
            lang: 'en',
            value: 'Belt accessory, comfortable bag, stylish thingy!',
          },
        ],
      },
    ]);
  });

  test('should receive text', async () => {
    const res = await axios
      .post(`${process.env.BASE_URI}`, {
        query: `query {
          getAllNews {
            text {
              lang
              value
            }
          }
        }`,
      })
      .then(res => res);
    expect(res.data.data.getAllNews).toMatchSnapshot();
    expect(res.data.data.getAllNews).not.toBe(null);
    expect(res.data.data.getAllNews).toEqual([
      {
        text: [
          {
            lang: 'uk',
            value:
              '<p>Ми виділили для вас топ найгарячіших трендів на цей аксесуар.</p><p>Сучасні модниці не мислять своїх образів без модної сумки, змінюючи практично кожен день одну модель на іншу, демонструючи щоразу свіжі образи з новинками сумок.</p><p>Як йдеться сумок багато не буває, і це не даремно. Адже у кожної модної сумки є своє призначення, коли її краще включити в образ, а коли краще залишити вдома на полиці.</p><p>Дизайнери весь час вносять нові корективи в моделі сумок, що і сталося в сезоні осінь-зима 2019-2020. Модні сумки в прийдешньому сезоні будуть більш гармонійними та делікатними, без зайвого епатажу і химерності.</p><p>Серед новинок сезону осінь-зима, виявляться сумки в незвичайних рішеннях. Це хутряні та сумки плюшеві, що бездоганно увіллються в осінньо-зимові тандеми жіночих образів на холодний сезон.</p><p>Продовжиться тренд на різні форми сумок, але ось круглі моделі сумок осінь-зима, відійдуть на другий план. На піку популярності будуть трикутні сумки, подовжені сумки, сумки квадратної і прямокутної форми, у вигляді піраміди та циліндра, а також інших неймовірних форм.</p><p>Розглядаючи фото звіти з останніх показів осінь-зима на Тижнях моди, варто виділити головні тренди сумок 2019-2020 роки:</p><ul><li>хутряні та сумки плюшеві;</li><li>сумки в стилі «тотал лук» або тон-в-тон;</li><li>об’єднані сумки;</li><li>сумки з ефектним декором і шипами;</li><li>стьобані сумки капітоні;</li><li>сумки на широкому ремінці;</li><li>сумки з квітковими деталями та аплікаціями;</li><li>хиже забарвлення на сумках осінь-зима;</li><li>яскраві неонові та кислотні кольори сумок осінь-зима;</li><li>сумка сетчел на осінь-зиму;</li><li>сумки з логотипами;</li><li>геометричні сумки.</li></ul><p>Це не повний перелік трендів, що будуть головувати в області новомодних сумок осінь-зима 2019-2020. Більше ідей ви зможете відшукати на фото колекції, що ми підготували.</p><p>Хотілося б ще акцентувати на модне рішення, що запропонували дизайнери — це комплект сумок. Що це означає? Ви зможете підібрати велику сумку, як наприклад, шоппер, доповнивши її маленькою сумкою або так званою мікро-сумкою.</p><p>В такому чудовому тандемі кожна сумка на осінь-зиму виконуватиме свою функцію і призначення, як це і годиться, що дуже зручно. Такий новий тренд з модними сумочками осінь-зима модниці зможуть по достоїнству оцінити вже зовсім скоро.</p><p>Ми підготували для вас зручний фото рейтинг найбільш модних сумок на майбутній сезон, розглядаючи який ви зможете легко зорієнтуватися, які сумки будуть трендовими і бажаними найближчим часом.</p>',
          },
          {
            lang: 'en',
            value:
              '<p>We have selected for you the top hottest trends for this accessory.</p><p>Modern fashionistas do not think of their images without a fashionable bag, changing almost every day one model to another, showing each time fresh images with new bags.</p><p>As they say, there are not many bags, and this is not in vain. After all, every fashionable bag has its purpose, when it is better to include it in the image, and when it is better to leave it on the shelf at home.</p><p>Designers are constantly making new adjustments to the model of bags, which happened in the autumn-winter season 2019-2020. Fashionable bags in the coming season will be more harmonious and delicate, without unnecessary outrage and whimsy.</p><p>Among the novelties of the autumn-winter season, bags will be found in unusual solutions. These are fur and plush bags that will perfectly fit into the autumn-winter tandems of women&apos;s images for the cold season.</p><p>The trend for different forms of bags will continue, but the round models of autumn-winter bags will recede into the background. At the peak of popularity will be triangular bags, elongated bags, bags of square and rectangular shape, in the form of a pyramid and a cylinder, as well as other incredible shapes.</p><p>Considering the photo reports from the latest shows of autumn-winter at the Fashion Weeks, it is worth highlighting the main trends of handbags 2019-2020:</p><ul><li>fur and plush bags;</li><li>bags in the style of "total bow" or tone-on-tone;</li><li>combined bags;</li><li>bags with spectacular decor and spikes;</li><li>quilted captain&apos;s bags;</li><li>bags on a wide strap;</li><li>bags with floral details and applications;</li><li>predatory coloring on bags autumn-winter;</li><li>bright neon and acid colors of autumn-winter bags;</li><li>satchel bag for fall-winter;</li><li>bags with logos;</li><li>geometric bags.</li></ul><p>This is not a complete list of trends that will lead in the field of new-fangled bags fall-winter 2019-2020. You can find more ideas in the photo of the collection we have prepared.</p><p>I would like to emphasize the fashionable solution offered by the designers - a set of bags. What does it mean? You can choose a large bag, such as a shopper, complementing it with a small bag or so-called micro-bag.</p><p>In such a wonderful tandem, each bag for autumn-winter will perform its function and purpose, as it should, which is very convenient. This new trend with fashionable handbags fall-winter fashionistas will be able to appreciate very soon.</p><p>We have prepared for you a convenient photo rating of the most fashionable bags for the upcoming season, considering which you can easily find out which bags will be trendy and desirable in the near future.</p>',
          },
        ],
      },
      {
        text: [
          {
            lang: 'uk',
            value:
              '<p>Зараз сумка - це більше, ніж просто аксесуар. У 2020 році вона стала головною деталлю трендового образу. Дизайнери презентували у своїх колекціях безліч універсальних та яскравих моделей, які з легкістю можна інтерпретувати у повсякденні луки. До класичних моделей додали більше кольору, фасону та матеріалів.</p><h3>Солом’яні сумки</h3><p>Уже кілька років поспіль солом’яні сумки залишаються на найвищих позиціях. Вони підходять для курорту та прогулянки містом. Також їх можна одягати під класичний костюм чи вишукану сукню. Дизайнерка Соломія Небожук розповідає, що солом’яні сумки зроблять ваш образ розслабленим та додадуть до нього нотки паризького стилю. Ви можете комбінувати їх з джинсами, білою сорочкою та лоферами. Солом’яна сумка-шопер гарно пасуватиме і до білих кюлотів та шовкової сорочки. Така сумка - це база літнього гардеробу 2020, своєрідний плацдарм для модних експериментів. Дизайнери щороку удосконалюють модель класичної солом’яної сумки. Головні трендові позиції серед солом’яних сумок зайняли: сумка-шоппер, мінодьєр, сумка-кросбаді, top handle.</p><h3>Об’ємний та м’який клатч</h3><p>У сезоні весна-літо 2020 абсолютну першість серед трендових сумок зайняли клатчі. М’які, не структуровані та великі клатчі увійшли у базовий гардероб усіх модниць. Засновником та королем цього тренду став італійський бренд Bottega Veneta, який презентував культовий клатч Pouch. Відтоді й інші бренди почали активно пропонувати у своїх колекціях такі сумки. Стилістка Соломія Небожук пояснює, що клатч стане універсальним елементом вашого гардеробу. Його можна поєднати з повсякденними образами, вечірніми чи коктейльними сукнями. Важливо пам’ятати, що його не варто комбінувати з дуже розслабленими речами, оскільки ваш образ може перетворитися на занадто домашній. Краще надавати перевагу структурованим джинсам, жакетам чи сорочкам. Також сильну розслабленість образу можна компенсувати головними уборами та взуттям.</p><h3>Сумки з масивними ланцюжками</h3><p>Ланцюжки всюди - основне кредо трендів літа 2020 року. Дизайнери додають масивні ланцюжки до всіх моделей сумок. Вони, скоріше, виконують функцію прикраси, ніж повноцінної ручки в аксесуарі. Такі сумки можна поєднувати з кежуал образами, в такому випадку аксесуар стане акцентом. З елегантними спідницями та блузами його також можна скомбінувати. Тоді сумка з ланцюжком зменшить градус романтичності в образі.</p><h3>Мікросумки</h3><p>Як і торік, у 2020-му мікросумки займають своє місце серед трендів. Основоположником ідеї їх використання став модний будинок Jacquemus, який випустив свою найвідомішу мікросумку. Вона настільки маленька, що в неї можна помістити лише кілька монет. Зараз мінісумки майже втратили свою функцію та стали радше аксесуаром. Найчастіше їх роблять з довгими ланцюгами. За словами стилістки Соломії Небожук, такі сумки-гаманці комбінують з іншими сумками. Іноді модниці використовують їх як намисто. На диво, цей тренд чудово комбінується з кожним стилем. Мікросумка може стати частинкою кежуал, бохо, вечірнього чи мінімалістичного образу. До того ж, вона вдихне трохи свіжості та трендовості у звичайний базовий лук.</p><h3>Стьобані сумки crossbody (через плече)</h3><p>Такий вид сумки вважають найбільш універсальним. Ідейником цього тренду був також італійський бренд Bottega Veneta. Їхня сумка через плече Cassette стала дуже популярною серед поціновувачів моди. Цю модель підхопили і масмаркети, тому сьогодні схожу модель можна знайти на полицях бюджетних магазинів. Сумку кросбаді можна гарно застилізувати зі сукнями в квітковий принт, джинсами та класичними футболками (можливо поло) або ж із костюмами в білизняному стилі. Такий вид трендових сумок може повністю претендувати на місце в базовому гардеробі. Цей аксесуар дизайнерка рекомендує обирати нейтрального кольору та фасону, оскільки тоді вона підійде до багатьох комбінацій одягу.</p><h3>Артові сумки</h3><p>Якщо вам хочеться додати яскравого акценту в повсякденний лук, то артові сумки в цьому допоможуть. Сумки з тваринним принтом, незвичайні мінодьєри, сумки з пір’ям, бісером, в’язані аксесуари, джинсові сумки - це ще не весь перелік фантазії дизайнерів у 2020 році. Вони можуть поєднувати в собі різні кольори, мати додаткові аплікації чи незвичайні форми та матеріал. Їх краще носити з мінімалістичним та спокійним одягом або робити акцент на взутті чи головних уборах. Також можна поекспериментувати з сережками, ланцюжками або браслетами, які будуть перегукуватися з принтами на сумці.</p><h3>Сумка-багет</h3><p>Ця модель сумки стала відомою в 2000 роках завдяки головній героїні серіалу “Секс у великомі місті” Кері Бредшоу. Саме вона обожнювала та колекціонувала моделі сумок Fendi Baguette (багет). Зараз в колекціях майже кожного модного будинку можна зустріти свої інтерпретації культової сумки-багету. Дизайнери експериментують з усіма її деталями, тому вона може стати акцентом базового гардеробу. Також сумка-багет є чудовим доповненням будь-якого образу, оскільки додає до нього нотки вінтажності.</p>',
          },
          {
            lang: 'en',
            value:
              '<p>Now a bag is more than just an accessory. In 2020, it became the main detail of the trend image. Designers presented in their collections many universal and bright models that can be easily interpreted in everyday bows. More colors, styles and materials were added to the classic models.</p><h3>Straw bags</h3><p>For several years in a row, straw bags have remained at the top. They are suitable for resort and city walks. They can also be worn under a classic suit or an elegant dress. Designer Solomiya Nebozhuk says that straw bags will make your image relax and add a touch of Parisian style. You can combine them with jeans, a white shirt and loafers. A straw shopper bag will go well with white culottes and a silk shirt. This bag is the basis of the 2020 summer wardrobe, a kind of springboard for fashion experiments. Designers improve the model of a classic straw bag every year. The main trend positions among straw bags were: shopper bag, minodiere, crossbody bag, top handle.</p><h3>Bulky and soft clutch</h3><p>In the spring-summer 2020 season, clutches took the absolute lead among trend bags. Soft, unstructured and large clutches are part of the basic wardrobe of all fashionistas. The founder and king of this trend was the Italian brand Bottega Veneta, which presented the cult clutch Pouch. Since then, other brands have begun to actively offer such bags in their collections. Stylist Solomiya Nebozhuk explains that a clutch will become a universal element of your wardrobe. It can be combined with casual images, evening or cocktail dresses. It is important to remember that it should not be combined with very relaxed things, as your image may become too homely. It is better to prefer structured jeans, jackets or shirts. Also, the strong relaxation of the image can be compensated by hats and shoes.</p><h3>Bags with massive chains</h3><p>Chains everywhere are the main credo of summer 2020 trends. Designers add massive chains to all models of bags. They perform the function of decoration rather than a full-fledged handle in the accessory. Such bags can be combined with casual images, in which case the accessory will be an accent. It can also be combined with elegant skirts and blouses. Then a bag with a chain will reduce the degree of romance in the image.</p><h3>Microbags</h3><p>As last year, in 2020 microbags take their place among the trends. The founder of the idea of ​​their use was the fashion house Jacquemus, which released its most famous microbag. It is so small that only a few coins can be placed in it. Now mini-bags have almost lost their function and have become more of an accessory. Most often they are made with long chains. According to stylist Solomiya Nebozhuk, such purse bags are combined with other bags. Sometimes fashionistas use them as a necklace. Surprisingly, this trend is perfectly combined with every style. The microbag can become a part of a casual, boho, evening or minimalist image. In addition, it will breathe a little freshness and trendiness into a regular base bow.</p><h3>Quilted crossbody bags (over the shoulder)</h3><p>This type of bag is considered the most versatile. The ideologue of this trend was also the Italian brand Bottega Veneta. Their shoulder bag Cassette has become very popular among fashion connoisseurs. This model was picked up by mass markets, so today a similar model can be found on the shelves of budget stores. The crossbad bag can be beautifully styled with floral dresses, jeans and classic T-shirts (possibly polo) or with lingerie-style suits. This type of trendy bags can fully claim a place in the basic wardrobe. The designer recommends choosing this accessory in a neutral color and style, because then it will suit many clothing combinations.</p><h3>Art bags</h3><p>If you want to add a bright accent to your everyday bow, art bags will help. Bags with animal prints, unusual minodieri, bags with feathers, beads, knitted accessories, denim bags - this is not the whole list of fantasy of designers in 2020. They can combine different colors, have additional applications or unusual shapes and materials. It is better to wear them with minimalist and calm clothes or to emphasize shoes or hats. You can also experiment with earrings, chains or bracelets that will resonate with the prints on the bag.</p><h3>Baguette bag</h3><p>This bag model became famous in the 2000s thanks to the main character of the series "Sex in the Big City" Carrie Bradshaw. It was she who adored and collected models of Fendi Baguette bags. Now in the collections of almost every fashion house you can find their interpretations of the iconic baguette bag. Designers experiment with all its details, so it can become the focus of the basic wardrobe. Also, the baguette bag is a great addition to any image, as it adds a touch of vintage.</p>',
          },
        ],
      },
      {
        text: [
          {
            lang: 'uk',
            value:
              "<p>У далекі буремні 90-ті без цього предмету побуту своє існування не уявляли ні тусовщики, ні спортсмени, ні гучні продавці на ринках, ні валютники біля обмінників, ні зайняті мами, ні бізнесмени. «Бельтбег», «омоньер», «сумка-нирка», «барижка», «бананка» ... Скільки імен у цієї модної деталі костюма! На сьогоднішній день цей вид сумки отримав заслужену любов і визнання.</p><p><strong>Бананка</strong> - все необхідне під рукою. Але чи всі ви знаєте, що історія сумок на пояс почалася в ті далекі часи, коли одяг шився без кишень, а перші гроші - залізні та мідні монети - вже з'явилися? О, як же незручно було переносити монети! Це була дійсно актуальна проблема тих років. Ось тоді і знайшлися підприємливі спритні кравці, які вигадали спеціальні поясні мішечки, в яких можна зберігати і транспортувати гроші. Минуло трохи часу, та ці сумки стали невід'ємним елементом гардеробу і чоловіків, і жінок. Саме по сумці, що висіла на поясі, можна було визначити статус людини. У простолюдинів вони були з простих міцних матеріалів. Представники вищих верств суспільства могли дозволити собі сумки з дорогих тканин, щедро розшиті всілякими візерунками і дорогоцінним камінням. Носили в таких сумочках гроші, парфуми, хустки, нюхальну сіль або навіть інструменти та зброю.</p><p>З тих пір сенс поясної сумки не втратив своєї актуальності, лише вміст злегка оновився: смартфон, банківська картка, ключі - і вперед! Ви готові до пригод!</p><h3>Плюсами цього супермодного аксесуара є:</h3><ul><li>практичність і універсальність. Все необхідне з вами, при цьому руки залишаються вільними. Сумки не мають «вікових обмежень»: підходять і дітям, і підліткам, і людям старшого віку і навіть пенсіонерам.</li><li>різноманітність. Маса моделей дозволить обрати «свою» сумку.</li><li>ненав’язливість. Не привертає зайву увагу та не виглядає об’ємним. У той же час може стати прекрасним акцентом, що надає особливий шик вашому образу.</li></ul><h3>Для кого ж призначена ця сумка?</h3><ul><li>Для любителів гарнітури «вільні руки» і «бути без нічого» - коли немає необхідності тягти об’ємну сумку або рюкзак, а кілька дрібниць захопити потрібно. Наприклад, для повсякденної прогулянки, на дискотеку, шопінг, побачення або прогулянку з собакою.</li><li>Для мандрівників - турист ховає документи, гроші, телефон і не боїться крадіжки, бо все на виду.</li><li>Для працівників сфери торгівлі або водіїв таксі - сумки відмінно замінюють портмоне й ідеально підходять для виручки.</li><li>Для будівельників і монтажних працівників - міцні і функціональні. Для спортсменів - телефон, ключі не обтягують кишені, а лежать в сумці і не заважають пересуванню.</li></ul><h3>Сумки на пояс відрізняються моделями:</h3><ul><li>повсякденні (міські) бананки - компактні, без зайвих деталей, але дарують комфорт.</li><li>спортивні - виготовляються з дихаючих і водонепроникних матеріалів.</li><li>сумки гаманці - невеликого розміру для мінімальної кількості речей.</li><li>клатч на пояс - модно, стильно і дуже зручно.</li><li>якір - головна відмінність - трапецієвидна форма і більший розмір.</li><li>сумка теслі - місткість - головна перевага.</li><li>сумка для годування тварин - використовується на виставках, прогулянці, в процесі дресирування вихованця.</li></ul><h3>Може виникнути цілком резонне питання: як і з чим носити таку сумку?</h3><ul><li>бельтбег носять: на поясі, як попереду, так і ззаду, що досить логічно, враховуючи, що це поясна сумка. Хочете підкреслити талію - підніміть пояс вище, відвернути увагу від неї - опустіть нижче;</li><li>через плече перед собою - завжди на виду і практично недосяжна для злодіїв;</li><li>на стегнах ближче до спини - ідеально для тих, хто побачив кілька зайвих сантиметрів на своїй талії або має вузькі стегна.</li></ul><p>Носити бананку можна практично з будь-яким одягом: класичний костюм, джинси і футболки, легке плаття до підлоги або міні-спідниця; на поясі під розкритим пальто восени або поверх пуховика взимку.</p><h3>Отже, підводимо підсумки.</h3><p>Сумки - бананки ефектно доповнять ваш образ, незалежно від того, повсякденний це гардероб або вечірнє вбрання. Залежно від обраної моделі ви можете виглядати жіночно (мужньо) і стильно, або зухвало і сміливо. Це поєднання комфорту і стілю. В сучасному мегаактивному ритмі життя кондукторка - незамінний аксесуар. Адже ніщо не сковує рухів, що дуже важливо. Ви можете спокійно займатися шопінгом, їздити на велосипеді або бігати в парку, веселитися на дискотеці, насолоджуватися екскурсією, фотографувати або навіть спілкуватися в соцмережах. З цього виходить, що ця універсальна, практична сумка повинна бути в гардеробі у кожної людини!</p>",
          },
          {
            lang: 'en',
            value:
              '<p>In the turbulent 1990s, no partygoers, no athletes, no loud sellers in the markets, no money changers near exchangers, no busy mothers, no businessmen imagined their existence without this household item. «Beltbag», «omonier», «kidney bag», «baryzhka», «banana» ... How many names in this fashionable detail of a suit! To date, this type of bag has received well-deserved love and recognition.</p><p><strong>Fanny pack</strong> - everything you need at hand. But do you all know that the history of belt bags began in those distant times, when clothes were sewn without pockets, and the first money - iron and copper coins - had already appeared? Oh, how inconvenient it was to carry coins! This was a really pressing issue in those years. That\'s when there were enterprising nimble tailors who invented special waist bags in which you can store and transport money. It took some time, but these bags have become an integral part of the wardrobe of both men and women. It was on the bag that hung on his belt, it was possible to determine the status of the person. In the common people, they were made of simple durable materials. Representatives of the upper strata of society could afford bags made of expensive fabrics, generously embroidered with all sorts of patterns and precious stones. They carried money, perfumes, handkerchiefs, sniffing salt or even tools and weapons in such bags.</p><p>Since then, the meaning of the waist bag has not lost its relevance, only the content has been slightly updated: smartphone, bank card, keys - and so on! You are ready for adventure!</p><h3>The advantages of this super fashionable accessory are:</h3><ul><li>practicality and versatility. Everything you need is with you, while your hands remain free. Bags have no "age restrictions": they are suitable for children, teenagers, the elderly and even retirees.</li><li>variety. A lot of models will allow you to choose "your" bag.</li><li>unobtrusiveness. Does not attract too much attention and does not look bulky. At the same time, it can be a great accent that gives a special chic to your image.</li></ul><h3>Who is this bag for?</h3><ul><li>For fans of the headset "hands free" and "to be without anything" - when there is no need to carry a bulky bag or backpack, and a few little things need to be captured. For example, for a daily walk, a disco, shopping, a date or a walk with a dog.</li><li>For travelers - a tourist hides documents, money, phone and is not afraid of theft, because everything is in sight.</li><li>For trade workers or taxi drivers, bags are a great replacement for a purse and are ideal for revenue.</li><li>For builders and installers - strong and functional. For athletes - a phone, the keys do not fit in your pocket, but lie in a bag and do not interfere with movement.</li></ul><h3>Belt bags differ in models:</h3><ul><li>everyday (urban) bananas - compact, without unnecessary details, but give comfort.</li><li>sports - are made of breathable and waterproof materials.</li><li>handbags wallets - small size for a minimum number of things.</li><li>belt clutch - fashionable, stylish and very comfortable.</li><li>anchor - the main difference - a trapezoidal shape and larger size.</li><li>carpenter’s bag - capacity - the main advantage.</li><li>bag for feeding animals - used at exhibitions, walks, in the process of training a pet.</li></ul><h3>A very reasonable question may arise: how and with what to carry such a bag?</h3><ul><li>Beltbag is worn: on the belt, both in front and behind, which is quite logical, given that it is a waist bag. Want to emphasize the waist - raise the belt higher, distract from it - lower;</li><li>over his shoulder in front of him - always in sight and almost inaccessible to thieves;</li><li>on the thighs closer to the back - ideal for those who saw a few extra inches at their waist or have narrow thighs.</li></ul><p>You can wear a banana with almost any clothing: a classic suit, jeans and T-shirts, a light floor-length dress or a mini-skirt; on the belt under an open coat in autumn or on top of a down jacket in winter.</p><h3>So, let’s summarize.</h3><p>Bags - bananas will effectively complement your image, regardless of whether it is an everyday wardrobe or evening dress. Depending on the chosen model, you can look feminine (masculine) and stylish, or bold and bold. It is a combination of comfort and style. In the modern megaactive rhythm of life, the conductor is an indispensable accessory. After all, nothing restricts movement, which is very important. You can go shopping, ride a bike or run in the park, have fun at a disco, enjoy a tour, take photos or even chat on social networks. It follows that this versatile, practical bag should be in everyone’s wardrobe!</p>',
          },
        ],
      },
    ]);
  });

  test('should receive _id, date, video', async () => {
    const res = await axios
      .post(`${process.env.BASE_URI}`, {
        query: `query {
          getAllNews {
            _id
            date
            video
          }
        }`,
      })
      .then(res => res);
    expect(res.data.data.getAllNews).toMatchSnapshot();
    expect(res.data.data.getAllNews).not.toBe(null);
    expect(res.data.data.getAllNews).toEqual([
      {
        _id: '5ef3970c0ab5dd42436dd5cf',
        date: '1565824238000',
        video: 'https://www.youtube.com/embed/maP6Daq83fM',
      },
      {
        _id: '5ef3970c0ab5dd42436dd5d0',
        date: '1591019702000',
        video: 'https://www.youtube.com/embed/VGqZMqMGjgA',
      },
      {
        _id: '5ef3970c0ab5dd42436dd5d1',
        date: '1582477846000',
        video: 'https://www.youtube.com/embed/Y7L_gvaGfx0',
      },
    ]);
  });

  test("should receive autor's name and image", async () => {
    const res = await axios
      .post(`${process.env.BASE_URI}`, {
        query: `query {
          getAllNews {
            author {
              name {
                lang
                value
              }
              image {
                small
              }
            }
          }
        }
        `,
      })
      .then(res => res);
    expect(res.data.data.getAllNews).toMatchSnapshot();
    expect(res.data.data.getAllNews).not.toBe(null);
    expect(res.data.data.getAllNews).toEqual([
      {
        author: {
          name: [
            {
              lang: 'uk',
              value: 'Данута Ланська',
            },
            {
              lang: 'en',
              value: 'Danuta Lanska',
            },
          ],
          image: {
            small: 'https://ukr.media/static/ba/aimg/4/1/7/417067_0.jpg',
          },
        },
      },
      {
        author: {
          name: [
            {
              lang: 'uk',
              value: 'Марія Нашова',
            },
            {
              lang: 'en',
              value: 'Mariya Nashova',
            },
          ],
          image: {
            small:
              'https://s.032.ua/section/userphoto/upload/managers/photos/000/051/775/866162337758924195687066424348618920034304n_5e4a57bc8f345.jpg',
          },
        },
      },
      {
        author: {
          name: [
            {
              lang: 'uk',
              value: 'Денис Когут',
            },
            {
              lang: 'en',
              value: 'Denys Kogut',
            },
          ],
          image: {
            small:
              'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          },
        },
      },
    ]);
  });
  test('should receive images', async () => {
    const res = await axios
      .post(`${process.env.BASE_URI}`, {
        query: `query {
          getAllNews {
            images {
              primary {
                medium
              }
              additional {
                small
                medium
              }
            }
          }
        }`,
      })
      .then(res => res);
    expect(res.data.data.getAllNews).toMatchSnapshot();
    expect(res.data.data.getAllNews).not.toBe(null);
    expect(res.data.data.getAllNews).toEqual([
      {
        images: {
          primary: {
            medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_1.jpg',
          },
          additional: [
            {
              small: null,
              medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_3.jpg',
            },
            {
              small: null,
              medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_4.jpg',
            },
            {
              small: null,
              medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_5.jpg',
            },
          ],
        },
      },
      {
        images: {
          primary: {
            medium:
              'https://s.032.ua/section/newsInternalIcon/upload/images/news/icon/000/052/185/trendi-lita-golovna_5edf9266621db.jpg',
          },
          additional: [
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/solomani_5edf8e4b209ed.jpg',
            },
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/11_5edf8f3209c11.jpg',
            },
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/cepki_5edf8fffc7403.jpg',
            },
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/ertfg4_5edf90563e5b1.jpg',
            },
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/9_5edf90b4381c8.jpg',
            },
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/11_5edf9163c6237.jpg',
            },
            {
              small: null,
              medium:
                'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/7_5edf942a343c8.jpg',
            },
          ],
        },
      },
      {
        images: {
          primary: {
            medium:
              'https://images.stylight.net/image/upload/t_web_post_500x667/q_auto,f_auto/post-c27c63a5b58deb0d4535ddd5993e68b2e4d0776d756fdc41c0f7c391.jpg',
          },
          additional: [
            {
              small: 'https://intersumka.ua/image/catalog/_all/banan2.jpg',
              medium: null,
            },
            {
              small: 'https://intersumka.ua/image/catalog/_all/banan3.jpg',
              medium: null,
            },
          ],
        },
      },
    ]);
  });
});
