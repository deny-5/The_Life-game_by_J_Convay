ТЗ:

    Игра жизнь - вебсайт - клеточный автомат.

    1) макет страницы
        1.1) поле игры с использованием grid
        1.2) консоль управления
        1.3) скрипт генерации сетки
    2) мигающая клетка
        2.1) управляемая мигающая клетка
    3) алгоритм пересчета позиций
        3.1) структура данных для хранения состояния игры
    4) алгоритм отображения
    5) логика пользовательского интерфейса

    В процессе написания кода, используя процедурный подход
    я столкнулся с рядом трудностей, в силу асинхронного выполнения
    команд, реализовать цикл игры оказалось не так просто как это
    было бы при синхронном последовательном выполнении, к которому
    я привык при использовании императивных языков программирования.

    Мне удалось выполнить пункт 1.1 и пункт 2. Сейчас проблема в том что
    игровой цикл построенный на setTimeout и вложенном setInterval, не
    может (или я просто не понимаю как) изменять элемент DOM с которым я
    работаю. 
    
    Идея - переписать логику в ООП стиле, так чтобы не осталось
    глобальных переменных и функций, инкапсулируя все это в объекты.
