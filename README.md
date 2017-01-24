# Схемы общественного транспорта: проект для 2 курса ФКН

## План проекта

1. Написать на node веб-скрепер, который собирает из интернета данные о координатах
остановок и маршрутах транспорта между ними.
  1. Выбрать сайт.
  2. Найти страницы с нужной информацией и придумать, как обойти их все (по каким адресам).
  3. Найти на страницах информацию и придумать, как вытащить из страницы только её.
  4. Собрать информацию и сложить в JSON-файл.
  5. Обработать информацию: убрать лишнее и привести к формату, который мы обсудим.
2. Написать веб-приложение, которое делает из данных первого этапа схему и позволяет менять ее.
  * Можно рисовать маршруты на настоящей карте, можно в виде схемы.
  * Используются оптимизирующие алгоритмы, например:
    * Подвинуть остановки, чтобы равномерно распределить их по схеме
    * Минимизировать число пересечений линий
    * Расставить подписи остановок так, чтобы они не наезжали друг на друга
    * Сгруппировать похожие маршруты
  * Через интерфейс можно управлять схемой:
    * Менять визуальные элементы: шрифт, цвета линий, обозначения остановок
    * Редактировать данные: подвинуть или переименовать остановку.
    * настраивать параметры алгоритмов.
  * Результат можно экспортировать.

## Занятия

1. 11.11.16: [вводное занятие](lessons/01-intro).
1. 18.11.16: [функциональное программирование в js](lessons/02).
1. 25.11.16: [Классы, несколько функций ядра и API OSM](lessons/03).
1. 24.01.16: [HTTP и кейс: JSON-скрепер](lessons/04-case-api).

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
