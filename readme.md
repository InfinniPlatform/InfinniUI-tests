# infinni-ui-e2e

Фреймворк для создания интеграционных тестов в проектах использующих контролы из [infinni-ui](https://github.com/InfinniPlatform/InfinniUI)


### Инструкция по запуску.

1) Все сценарии необходимо рекомендуется поместить в директорию "./features/".

2) Перед запуском необходимо создать config.js файл и экспортировать из него необходимые параметры. Подробнее про возможные параметры [здесь](#parameters).

3) При необходимости, можно создать файл  extensions.js с расширением стандартного функционала. Файл необходимо разместить в директории "./features/support/". Подробнее [здесь](#extensions).

4) При необходимости можно создать свои определения шагов. Данные файлы необходимо разместить в директории "./features/step_definitions/". Подробнее [здесь](#step-definitions).

5) Установить все зависимости командой "npm install".

6) Запустить тестирование командой "npm test".


# Default parameters

```js
    var path = require( 'path' );

    module.exports = {

        timeouts: {
            main: 10000,
            wait: 10
        },

        //
        defaultBrowserName: 'chrome',

        screen: {
            width: 1920,
            height: 1080
        },

        // browsers options for webdriver
        browsers: {
            chrome: {}, // Not supported yet
            firefox: {}, // Not supported yet
            opera: {}, // Not supported yet
            ie: {}, // Not supported yet
            edge: {}, // Not supported yet
            safari: {}, // Not supported yet
            phantomjs: {
                // binaryPath: 'some_path'
            }
        },

        // folder for search by cucumber
        // add here full path for your 'features' folder
        folders: [
            path.resolve( __dirname, 'features' ) // folder with default files will add automitically
        ],

        // all user options goes here
        userOptions: {
            // browser: 'browser_name',
            // teamcity: true,
            // width: 'some_width',
            // height: 'some_height',
        },

        // all cucumber options goes here
        options: {
            '--tags': 'not @ignore',
            '--format': 'summary'
        }

    };

```


# Parameters

Позволяют задать различные настройки для запуска тестов. Объект с параметрами всегда доступен во время выполнения тестов через глобальный объект process.myConfig.

* timeouts - установка дополнительных таумаутов.

* defaultBrowserName - браузер по умолчанию.

* screen - разрешение браузера во время тестов.

* browsers - различные настройки для каждого браузера. В данный момент не поддерживается.

* folders - папки в которых находятся сценарии и дополнительные определения шагов.

* userOptions - пользовательские параметры, которые позволяют менять конфигурацию. Есть возможность передачи через командную строку. Они имеют синтаксис вида "--parameterKey:parameterValue". Подробнее [здесь](#пользовательские-параметры).

Пример:
```js
    userOptions: {
        browser: 'opera',
        teamcity: true,
        width: '2500',
        height: '1440',
    }
```

* options - параметры для cucumber'a передаются в виде объекта где key это полное имя параметра через стандартный синтаксис cucumber'a, а value это полное значение. Так же можно передавать их в командную строку через стандартный синтаксис cucumber'a. Подробнее про параметры cucumber'a [здесь](https://github.com/cucumber/cucumber-js/blob/650fa4ef9e597f0e6acd115b316dac88a84624ae/docs/cli.md).

Пример:
```js
    options: {
        '--tags': 'not @ignore',
        '--format': 'summary'
    }
```


# User options

Все параметры всегда доступны через глобальный объект process.myConfig.userOptions.

* browser - позволяет указать браузер который будет использоваться для запуска тестов. Допустимые значения: 'chrome', 'firefox', 'ie', 'opera', 'edge', 'safari', 'phantomjs'. Для работы браузеров необходимо скачать их вебдрайверы [здесь](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html) и добавть в переменную окружения PATH путь до папки где лежат эти драйвера.

* teamcity - запуск тестов на teamcity. Допустимые значения true, false.

* width - ширина экрана браузера

* height - высота экрана браузера


# Extensions

Позволяют зарегистрировать дополнительные подписки на события. Список событий можно посмотреть [здесь](https://github.com/cucumber/cucumber-js/blob/650fa4ef9e597f0e6acd115b316dac88a84624ae/docs/support_files/event_handlers.md). Внутри подписок нет доступа до глобального объекта [world](#world), поэтому он доступен только через глобальный объект process.world.

### Пример создания дополнительной подписки.

```js
    var cucumber = require( 'cucumber' );

    cucumber.defineSupportCode( function( consumer ) {

        consumer.registerHandler( 'BeforeScenario', function( scenario ) {
            return new Promise( function( resolve, reject ) {

                var world = process.world;

                // your code

                resolve();
            } );
        } );

    } );
```

# Step definitions

Позволяют создать описание для кастомных шагов, которых нет в infinni-ui. Внутри описания шага в объекте this доступен глобальный объект world. Синтаксис создания описания шага можно посмотреть [здесь](https://github.com/cucumber/cucumber-js/blob/650fa4ef9e597f0e6acd115b316dac88a84624ae/docs/support_files/step_definitions.md).

### Пример описания шага

```js
    var cucumber = require( 'cucumber' );

    cucumber.defineSupportCode( function( consumer ) {

        consumer.Then( /^замри на "([^"]*)"$/, function( time ) {
            return new Promise( function( resolve ) {
                setTimeout( resolve, parseInt( time ) * 1000 );
            } );
        } );

        consumer.When( /^я пройду проверку безопасности$/, function() {
            return new Promise( function( resolve, reject ) {

                // some code here

                resolve( /* some result */ );
            } );
        } );

    } );
```

# World

Глобальный объект cucumber'a. Содержит в себе экземпляры driver'a, webdriver'a, currentView, описания селекторов infinni-ui, библиотеку underscore.

* config - параметры
* webdriver - экземпляр selenium-webdriver
* driver - экземпляр драйвера текущего браузера
* by - экземпляр webdriver.By
* selectors - объект с описаниями селекторов infinni-ui;
* helpers - вспомогательные методы
* assert - объект фреймворка chai
* _ - библиотека underscore
* keys - экземпляр webdriver.Key;
* selectAll - метод
* currentView - текущая вьюха;
