# nosql2018-song_quotes

## Screencast:
https://drive.google.com/open?id=12oLoSRi9JEknDU_ZWWoAFpkc2WzuhX2l

## Тема курсовой

Поиск подходящих цитат из песен

### Комментарий

На основании набора коротких текстов найдите созвучные/рифмующиеся фрагменты песен.

## Выбор технологий

Для реализации будут использованы 2 языка программирования:

- Python

На нем будет реализован API сервер, который будет выполнять логику приложения и взаимодействие с базой данных.

- JavaScript

На нем, используя Node.js, будет реализован front-end сервер.

Как базы данных будут использоваться:

- MongoDB

Как основная база даннх, в ней будут зраниться песни.

## Сценарии использования

Пользователь будет заходить на сайт, где он будет иметь возожность:

- Произвести поиcк рифм по слову.

Пользователь должен иметь возможность произвести поиск рифм по слову, 
результатом поиска будет сама песня, также некоторые статистики 
(сколько раз повторялось лово в песне, сколько там рифм было вообще, сколько среднее кол-во раз повторялись слова,
 сколько разных слов), 
также будет статистика по всем словам и песням, она будет показывать похожие метрики, 
только они будут собраны по всем песням. 

*Порядок действий*:

1. Пользователь заходит на сайт
2. Далее он вводит слово, рифмы к которому он хочет найти вводит в `input`
3. Далее при нажатии на `button` на сервер отправляется запрос
4. Пользователю выдается список песен с выделенными в нем рифмами и статистикой. 

- Добавить песню.

Пользователь должен иметь возможность добавлять песню в базу данных, чтобы по ней также проводился поиск.

*Порядок действий*:

1. Пользователь заходи на сайт
2. Переходит на страницу добавления песни
3. Вводит информацию о песне в некоторый `input`
4. Отправляет песню на сервер нажатием на `button`, где она сохраняется, и пользователь видит подтверждение успеха, либо неудачи

- Удалить песню.

Удалять ненужные песни из базы данных.

*Порядок действий*:

1. Пользователь заходи на сайт
2. Переходит на страницу удаления песни
3. Вводит информацию о песне в некоторый `input`
4. Отправляет песню на сервер нажатием на `button`, где она удаляется, и пользователь видит подтверждение успеха, либо неудачи, если её не было до этого

- Редактировать песню.

Изменять атрибуты песен, если вдруг это потребуется.

*Порядок действий*:

1. Пользователь заходи на сайт
2. Переходит на страницу редактирование песни
3. Вводит информацию о песне в некоторый `input`
4. Отправляет песню на сервер нажатием на `button`, где она редакируется, и пользователь видит подтверждение успеха, либо неудачи.

- Импортировать песни.

Должна быть возможность получать dump базы данных.

*Порядок действий*:

1. Пользователь заходи на сайт
2. Переходит на страницу импортирвоания данных
3. При нажатии на `button` он получает файл, который содержит dump базы данных.

## Модель данных

### Общая структура базы данных

Данные храняться в MongoDB, как 2 коллекции: english & russian - их структура идентична,
так что рассматривать их отдельно не имеет смысла, разница в том, что алгоритмы обрабатывают их по-разному.
Для русского языка используется небольшое преобразование символов на созвучные, 
затем удаляются согласные и рифма смотрится по последней гласной, в английском за 
преобразование на схожие звуки отвечает известный алгоритм metaphone2, затем сверяются 2 последние звука.

Будем считать, что песни на 2 языках идентичны по потреблению памяти.

***Почему все так как есть?***

Большая часть логики у нас заключена не в самой СУБД, а в сервере непосредственно, т.к. СУБД не имеет возможности как-то искать рифмы к словам, есть идея построить индекс рифм, что с одной стороны хорошая идея, индекс всегда ускорит поиск, но мы не можем предсказать по какому слову пользователю понадобятся рифмы, поэтому нам придется считать как-то с запасом, что неочень понятно как сделать, дял русского языка все более или менее понятно,  надо для всех гласных найти рифмы в песне, сохранить их рядом с песней и получится огромное кол-во данных, с каждой песней, это неочень хороший подход, для английского все еще сложней, т.к. мы смотрим на последние 2 символа, что делает эту задачу еще более плачевной, т.к. комбинаций расстановки этих 2 символов еще больше, чем глассных в русском языке, поэтому мы решили вынести всю логику в сервер и считать статистику на нем же.

### Структура документа

Для определения размера документа условимся, что у нас используются отлько ASCII-символы,
чтобы было проще считать место, занимаемое полем документа,
т.е. один символ будет занимать 1-байт.  

Документ:

- Идентификатор

Поле, которое автоматически генерируется MongoDB, его размер 12-байт, судя по
[документации](https://docs.mongodb.com/v3.0/reference/bson-types/#objectid).  

- Название песни

Будем считать название песни размером в 20 символов, т.е. его ориентировочный размер будет 20-байт.  

- Название исполнителя

Также будет считать как 20 символов, т.е. его размер будет около 20-байт, также как и название песни.

- Текст песни

Кол-во слов в песне лежит где-то между 100-300 слов, зависит от жанра и многих других условий, примем его равным 300, т.е. размер песни будет составлять 300-байт.

Пример `JSON`:

```json
{
    "artist": "...",
    "text": "...",
    "title": "...",
    "_id": 123
}
```

Приняв во внимание то, что написано выше, мы получим, что средний размер документа: 
`sizeof(id) + sizeof(title) + sizeof(artist) + sizeof(text) = 12 + 20 + 20 + 300 = 352`, 
следовательно размер одного документа будет равен 352-байта. Что довольно мало, это хорошо.  

#### Сравнение с SQL

Нам понадобилось бы несколько сущностей: **Artist**, **Song**, также надо учесть,
что исполнители могут писать одну песню вместе, т.е. между этими сущностями будет отношение many-to-many, т.е. составим таблицы:

```sql
CREATE TABLE Artist (
    id SERIAL,
    name VARCHAR(20) NOT NULL,
    CONSTRAINT PK_ARTIST PRIMARY KEY (id)  
);

CREATE TABLE Song (
    id SERIAL,
    name VARCHAR(20) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    CONSTRAINT PK_SONG PRIMARY_KEY (id)
)

CREATE TABLE SongToArtist (
    song_id INTEGER NOT NULL REFERENCES Song,
    artist_id INTEGER NOT NULL REFERENCES Artist,
)
```

Можно было сделать структуру оптимизированную для нашей задачи, но я сделал её такой, какой требует этого рациональный смысл, а не глупое желание оптимизтровать все подряд.

##### Запросы

*Поиск*:

- NoSQL

`collection.find({})`

- SQL

```sql
SELECT song_id, name, text, name FROM (
    SELECT * FROM SongTOArtist 
    JOIN Song ON Song.id == sond_id
    JOIN ARtist ON Artist.id == artist_id
);
```

Тут видно, что в `MongoDB` мы делаем это за `O(n)`, а в `SQL` будет `O(n + (n / k)log(n / k)) ~ O(nlog(n))`

*Обновление*:

- NoSQL

```javascript
collection.update_one({
                '_id': id
            }, {
                '$set': song
            })
```

- SQL

```sql
UPDATE TABLE Song SET text = $song WHERE id == $id;
```

В двух случаях оценка сложности `O(n)`, т.к. нету `JOIN`. 

*Удаление*:

- NoSQl

```javascript
collection.delete_one({
    '_id': id
    })
```

- SQL

```sql
DELETE TABLE Song WHERE id == $id;
```

В двух случаях оценка сложности `O(n)`, т.к. нету `JOIN`. 

Для сравнения допустим, что у нас `1000` песен и `20` исполнителей, т.е. у исполнителя примерно `50` песен, это значит, что `n = 1000` , а `k = 20`.

##### Память

Размеры данных:

- NoSQL

`n * 352 = 1000 * 352 = 352000`

- SQL

`n * (20 + 300 + 8) + k * (20 + 8) + n * (8 + 8) = n * 344 + k * 28 = 1000 * 328 + 20 * 28 + 1000 * 16 = 344560`

Даже здесь SQL же выигрывает, но это довольно плотные данные.

Из таблиц видно, что в случае SQL, мы бы потребляли больше памяти в случае однородных данных, т.е. если бы у нас было много одиниковых исполнителей и их песен, то мы бы выйграли по памяти, н оу нас такое не гарантируется, данные у нас будут разнообразные, т.к. песни добавляются спонтанно, значит случай NoSQL нам подходит больше, но нельзя сказать, что он лучше.

NoSQL: 0,  
SQL: 1

Не вижу смысла сравнивать в абсолютных величинах, тут все прозрачно в пользу SQL в общем случае, но для нашего разницы нет.  

##### Скорость

Поиск у нас происходит за 1 команду, а в случае SQL, нам бы пришлось сделать JOIN, что, как известно является не самой быстрой операцией, т.к. внутри используется сортировка ключей, обычно она работает за `nlog(n)`, а наше решение работает за линию, что в любом случае будет быстрее, т.к. выйгрыш по кол-ву записей в таблице Song будет на константу, сравнивая с нашей коллекцией, а сложность будет возрастать не на константу, а на логарифм, с увеличением кол-ва песен, также там поиск будет проводится по всем песням, следовательнос cложность будет `(n+ m)log(n + m)`,а у нас `n` что показывает выйгрыш NoSQL базы данных.

Тут также считаю что видно еще только на просмотре сложностей операций.

NoSQL: 1,  
SQL: 1

##### Удобство

В NoSQL мыс сможем не закреплять структуру нашего документа, что поможет сохранять нам в БД некоторую мета-информацию и проще расширяться, можно будет делать некйи кэш, прямо в mongodb, также мыможем захотеть еще хранить альбомы, в SQL это сильно устранит структуру, а у нас просто добавится одно поле.

NoSQL: 2,  
SQL: 1,
