# Схемы общественного транспорта: самый странный проект для 2 курса ФКН

## План проекта

1. Написать на node веб-скрепер, который собирает из интернета данные о координатах
остановок и маршрутах транспорта между ними.
  1. Выбрать сайт.
  2. Найти страницы с нужной информацией и придумать, как обойти их все (по каким адресам).
  3. Найти на страницах информацию и придумать, как вытащить из страницы только её.
  4. Собрать информацию и сложить в JSON-файл.
  5. Обработать информацию: убрать лишнее и привести к формату, который мы обсудим.
2. Написать веб-приложение, которое делает из данных первого этапа схему и позволяет менять ее.
Работа оценивается исходя из реализованных функций:
  1. Геометрическая кластеризация остановок и линий. В кластер входят "близкие" остановки — выбор
  метрики для кластеризации на вас. Из линий (последовательность остановок) сделать ребра
  графа с вершинами-кластерами. __+0.5__
  Интерфейс — включить / отключить кластеризацию, выбрать параметр
  кластеризации (метрику или расстояние). __+0.5__
  2. Кластеризация линий. В кластер входят линии, которые имеют много общих остановок
  (по абсолютному количеству или по доле) или идут по общей трассе. __+0.5__
  Интерфейс — выбор параметра кластеризации (конкретное количество или процент). __+0.5__
  3. Анализ транспортной системы: вычисление центральности остановок, поиск кратчайшего
  пути, минимальный разрез (выберите одно). Важно также пояснить, *что* метрика значит для
  транспортной системы. __+1__
  4. Настройка отображения:
    1. Выбор цвета линии. __+0.5__
    2. Выбор маркера остановки (не совсем тривиальный вроде размера кружочка, а любая пара из http://artgorbunov.ru/bb/soviet/20151208/). __+0.5__
  5. Интерактивное отображение информации об остановках и линиях (по нажатию)
    1. Подсветка выбранной линии. __+0.3__
    2. Подсветка линий, проходящих через выбранную остановку. __+0.3__
    3. Информация: протяженность линии, количество остановок, номер линии, название остановки. __+0.4__
  6. Линейная схема. Базовый вариант — схема одной линии, вытянутая в прямую. Лучше работать не с отдельными
  остановками, а с кластерами (п. 1)
    1. Названия всех остановок (не наезжают друг на друга) __+0.5__
    2. На каждой остановке номера линий, на которые тут можно пересесть. __+0.5__
    3. Упрощение геометрии — не вытягиваем в прямую, а показываем повороты, но привязываем к
    сетке и ограничиваем углы. __+1__
    4. Схема не одной линии, а кластера (п. 2). __+1__
  7. Экспорт в SVG или PNG. __+1__


## Занятия

1. 11.11.16: [вводное занятие: синтаксис, node.js, npm и модуль request](lessons/01-intro).
1. 18.11.16: [функциональное программирование в js и сбор данных из HTML через cheerio](lessons/02).
1. 25.11.16: [Классы, несколько функций ядра и API OpenStreetMap](lessons/03).
1. 24.01.17: [HTTP и кейс: JSON-скрепер](lessons/04-case-api).
1. Не знаю когда: [работа с JSON-файлами](lessons/06-json-transform).
1. 28.02.17: [визуализация: HTML, Leaflet и D3](lessons/07-vis).
1. 07.03.17: [git и хостинг на gh-pages](lessons/08-git-and-speed).

## Мини-чекпойнт ~10 февраля

Я очень рассчитываю, что к этому времени все соберут свои данные. Артефакты в репо:
- Папка `scraper` с кодом скрепера и `readme.md`, который поясняет, как его запустить.
- Файл `scrape-report.md`: пара слов о том, как именно вы собирали данные.
- Файл `data.json` с собранными данными в таком минимальном виде (можно добавить любые данные):
```js
{
  // Маршруты
  "routes": {
    "<route_uid>": {
      "id": "<номер или название маршрута>",
      "trips": {
        // Разные варианты маршрута: например, А->B и B->A. Они часто различаются.
        // Если вариант один, все равно записать так.
        "<trip_uid>": {
          "stops": [ "<stop_id_0>", ... ],
          // Трассировка маршрута между остановками, если доступна.
          // Если таких данных нет, просто переложить кооринаты остановок
          "shape": [
            {
              "lat": <широта>,
              "lon": <долгота>
            },
            ...
          ]
        }
      }
    },
    ...
  },
  "stops": {
    "<stop_id>": {
      "lat": <широта>,
      "lon": <долгота>,
      "title": "<название>"
    },
    ...
  }
}
```

## К первому чекпойнту:

Cоздать приватный репозиторий в GitHub, дать доступ мне (thoughtspile) и
кураторам (cs-hse-projects-curator). В readme записать:

* Ф.И.О. студента, номер группы и тема проекта;
* Город, для которого строится схема.
* Описание актуальности решаемой задачи, в том числе, обзор существующих решений. Почитайте вступления
статей из литератыры внизу. Из рассказов дизайнеров возьмите немного боли и поясните, почему компьютер
тут очень к месту.
* Обзор используемых технологических решений, и обоснование их выбора. Не знаю, что посоветовать. Если
пишете не веб-приложение или не на js, упомяните про это.
* План работы по реализации функциональности проекта. Предлагаю план в формате "простыня фич": список того, что было бы здорово сделать, по группам (привожу фичи просто для примера):
  * Данные: **(обязательно) указать 2-5 источников, собрать данные об остановках и маршрутах**. Например, добавить данные о реках или достопримечательностях или расписание; сравнить данные из нескольких источников и пометить те, которые упомянуты только в одном.
  * По алгоритмам: упрощение геометрии, группировка похожих маршрутов, изменение масштаба в зависимости
  от плотности остановок.
  * Для дизайнеров схем: изменение цветов линий и обозначений остановок, управление параметрами
  алгоритмов, редактирование подписей, экспорт в SVG для доработки в редакторе.
  * Для пользователей: **(обязательно) отрисовка схемы,** поиск кратчайшего маршрута, фильтрация
  (например, все остановки, до которых можно добраться за полчаса), показ объектов рядом с остановками.
  * Дополнительно: почему это будет _не просто карта._ Например, можно собрать данные о годах открытия
  остановок и  сделать визуализацию развития сети.

Для каждой фичи укажите приоритет (у обязательных — самый высокий) и сложность. Нет ничего плохого, если
половина останется нереализованной.

## Литература

* Рассказы дизайнеров:
  * Схема московского метро
    * https://www.artlebedev.ru/metro/ (смотрите процесс)
    * Блог http://moscow-metromap.livejournal.com/
    * Другой вариант http://ilyabirman.ru/projects/moscow-metro/
  * http://www.jugcerovic.com/maps/
  * Цикл Ильи Бирмана: http://artgorbunov.ru/bb/soviet/20160105/
* Лайт посты / блоги
  * Рассказ про приложение, которое генерирует схемы: https://medium.com/transit-app
  * Блог с кучей схем и описанием, почему они хороши или плохи: http://transitmap.net/
    * http://transitmap.net/post/118783719435/luxembourg-bus-2015
    * http://transitmap.net/post/120503282870/luxembourg-bus-cerovic
    * http://transitmap.net/post/82106605247/redesigned-metros-cerovic
  * http://blog.visualmotive.com/2009/automatic-generation-of-transit-maps/
  * http://gizmodo.com/how-to-design-the-perfect-subway-map-1543146718
  * http://glantz.net/blog/the-worlds-best-designed-metro-maps
  * http://moovitapp.com/blog/
* Визуализации
  * http://ray-mon.com/urbandatachallenge/
  * TRAVIC
    * http://tracker.geops.ch/?z=14&s=1&x=-13624674.3456&y=4548253.9633&l=transport
    * http://www.citylab.com/commute/2015/05/what-you-can-learn-watching-the-movements-of-an-entire-public-transportation-system/393281/
    * http://www.theage.com.au/victoria/watch-melbournes-public-transport-system-move-in-real-time-20150506-ggvt0i
* Статьи
  1. [Automatic Visualisation of Metro Maps and Transportation Networks (Hong et al.)](http://www.cs.usyd.edu.au/~dmerrick/papers/HongEtAl2004b.pdf)
  1. http://i11www.iti.uni-karlsruhe.de/extra/publications/n-asamm-14.pdf
  1. http://www.ijcsi.org/papers/IJCSI-10-4-2-225-229.pdf
  1. [Fast Automatic Schematics for Public Transport Spider Maps (Ribeiro, Rijo, Leal)](http://ac.els-cdn.com/S221201731200504X/1-s2.0-S221201731200504X-main.pdf?_tid=260c5e7e-acf7-11e6-9fc9-00000aab0f01&acdnat=1479408997_0fded62103caa4c60fbedadda659c0f0)
  1. [Generating Topologically Correct Schematic Maps (Müller)](http://matthias-mueller-fischer.ch/publications/schematicMaps.pdf)
  1. [SCHEMATIC BUS TRANSIT MAPS FOR THE WEB USING GENETIC ALGORITHMS (Galvão)](https://run.unl.pt/bitstream/10362/18403/1/TGEO0150.pdf)
  1. [Metro Map Layout Using Multicriteria Optimization (Stott, Rodgers)](https://www.cs.kent.ac.uk/pubs/2004/1925/content.pdf)
  https://kar.kent.ac.uk/30781/1/tvcgMetro.pdf
  1. [Line Crossing Minimization on Metro Maps (Bekos, Kaufmann et al.)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.114.6776&rep=rep1&type=pdf)
  1. [The Metro Map Layout Problem (Hong, Merrick, do Nascimento)]
  (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.89.1137&rep=rep1&type=pdf)
  http://crpit.com/confpapers/CRPITV35Hong.pdf
  http://www.cs.usyd.edu.au/~dmerrick/papers/HongEtAl2004b.pdf
  https://pdfs.semanticscholar.org/0084/4fa771c341e44d56ffb53ff6ea779df0c950.pdf
  1. [Drawing and Labeling High-Quality Metro Maps by Mixed-Integer Programming (Nöllenburg, Wolff)](http://www1.pub.informatik.uni-wuerzburg.de/pub/wolff/pub/nw-dlhqm-10.pdf)
  1. [Rendering Effective Route Maps: Improving Usability Through Generalization (Agrawala, Stolte)](http://graphics.stanford.edu/papers/routemaps/)
  1. [On Metro-Line Crossing Minimization (Argyriou, Bekos)](http://www.math.ntua.gr/~symvonis/publications/j_2010_ABKS_On%20Metro-Line%20Crossing%20Minimization.pdf)
  1. [An Improved Algorithm for the Metro-Line Crossing Minimization Problem (Nöllenburg)](http://i11www.iti.uni-karlsruhe.de/extra/publications/n-iamlc-10.pdf)
  1. [Computer-aided design of bus route maps (Sadahiro, Tanabe et al.)](http://www.csis.u-tokyo.ac.jp/dp/126.pdf)
  1. [Automated Drawing of Metro Maps (Nöllenburg)](http://i11www.iti.uni-karlsruhe.de/extra/publications/n-admm-05d.pdf)
