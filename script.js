// SCRIPT FOR GRID GENERATION

// Аабсолютный размер - сторона квадрата сетки в px
const SIDE = 580;
const DEFAULT = "#bdf";
const ACTIVE = "#b1d28f";





///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект для инкапсуляции кода создания сетки
let field = {

    cellNum: 0,
    cellSize: 0,
    elemNumb: 1,

    // Создает квадратное поле с количеством ячеек вдоль стороны,
    // указаном пользователем. Изменяет параметры grid-контейнера,
    // заполняет его узлами пронумерованными в атрибуте класс. 
    createField(param) {
        this.clearField();
        this.getParam(param);
        this.calcCellSize();

        let elem = document.getElementById("grid_box");
        elem.setAttribute(`style`,`grid-template-rows:
                                   repeat(${this.cellNum},${this.cellSize}px);
                                   grid-template-columns: 
                                   repeat(${this.cellNum},${this.cellSize}px);`);
        
        for (let i = 1 ; i <= this.cellNum ; i++) {
            for(let j = 1; j <= this.cellNum ; j++) {
                let newdiv = document.createElement("div");
                newdiv.className = `${this.decartCords()}_grid_el`;
                newdiv.onclick = this.setCell;
                elem.append(newdiv);
                this.elemNumb++;
            }     
        }
    },
    
    // запрашивает  у пользователя количество клеток в стороне квадратного поля
    getParam(param) {this.cellNum = +param;}, 
    
    // Вычисляет размер клетки по заданному количеству и размеру поля
    calcCellSize() { this.cellSize = SIDE / this.cellNum; },

    //Метод для создания декартовых кординат
    decartCords() {
        let y = (this.elemNumb % this.cellNum == 0) 
            ? (this.elemNumb / this.cellNum)
            : (Math.trunc(this.elemNumb / this.cellNum)+1);
        let x = (this.elemNumb % this.cellNum == 0)
            ? this.cellNum
            : this.elemNumb % this.cellNum;
        let stringyx = `${y}.${x}`;
        return stringyx;
    },

    //Метод для очистки сетки
    clearField() {
        if(this.elemNumb != 1) {
            let node = document.getElementById("grid_box");
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
            this.elemNumb = 1;
        }
    },

    //Метод для реагирования на щелчок мышью
    setCell() {    
        this.setAttribute('style', `background-color:${ACTIVE};`);       
    },
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Объект для выбора живых клеток
let selectUnit = {

    listOfcells: [],
    listOfcord: [],
    cordPair: [],
    //cellsCount: 0,

    //Функция строковой обработки для получения пары числовых кординат
    cordParse(string) {
            let y = Math.trunc(parseFloat(string));
            let pos = string.indexOf(".", 0);           //Ищет точку с начала строки
            let cutstr = string.slice(pos+1);
            let x = parseInt(cutstr);
            return [y, x];
        },

    //Служебный метод очистки
    flushAll() {
        this.listOfcells = this.listOfcord = this.cordPair = [];
    },

    //Метод для выбора колекции элементов живых клеток
    selectCells() {
        this.flushAll();
        this.listOfcells = document.querySelectorAll("#grid_box div");
        for (let grid_el of this.listOfcells) {      
            if(grid_el.style.backgroundColor != "") {
                let strcord = grid_el.getAttribute("class");
                this.cordPair = this.cordParse(strcord);
                this.listOfcord.push(this.cordPair);
                //this.cellsCount++;                          //Просто так
            }
        }
        return this.listOfcord;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Объет расчета нового поколения
let arithmCore = {
    
    gridSide: 0,
    currGen: [],

    neithbours: [],
    neithboursAll: [],
    survives: [],     
    newiesList: [],

    pair:[],

    //Метод инициализации получает конфигурацию текущего поколения
    init(arr, maxNum) {
        this.gridSide = maxNum;    
        this.currGen = arr.slice();
    },

    //Главный метод арифметического ядра
    //После вызова init объект имеет заполненые поля
    //gridSide и currGen фууф)) ну поехали
    nextGenCalculus(){

        this.findSurvives();
        this.findAllN();
        this.findNewies();

        let newGen = [];

        while (this.survives.length > 0){
            let pair = this.survives.shift();
            newGen.push(pair);            
        }

        while (this.newiesList.length > 0){
            let pair = this.newiesList.shift();
            newGen.push(pair);            
        }

        this.flushObj();        

        return newGen;
    },
    //Метод сравнения двух массивов из двух элементов
    comparePair(arr1, arr2) {           
        return (arr1[0] == arr2[0])?((arr1[1] == arr2[1])?true:false):false; 
    },

    //Метод проверяющий входит ли пара в массив
    matchCheck(couple, arr) {
        for (let el of arr){
            if(this.comparePair(couple, el)) return true;
        } return false;
    },

    //Вспомогательный метод для нахождения числа вхождений
    //заданной пары в исходном массиве
    matchCounter(couple, arr) {
        let count = 0;
        for (let curr of arr){
            if (this.comparePair(curr,couple)) count++;
        }
        return count;
    },

    //Метод обралотки рождения клетки за пределами сетки
    OFCheck(value) {
        if(value > this.gridSide) return 0;
        else if (value < 1) return this.gridSide;
        else return value;
    },

    //Вычислить соседей данной клетки
    findNeithbour(coupleCord) {
        let neithb = [];
        this.pair.push(                     //1
            (coupleCord.slice()[0]),
            (coupleCord.slice()[1]+1)
        );        
        neithb.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            (coupleCord.slice()[0]+1),
            (coupleCord.slice()[1])
        );        
        neithb.push(this.pair);
        this.pair = [];    
        this.pair.push(                     //1
            (coupleCord.slice()[0]+1),
            (coupleCord.slice()[1]-1)
        );        
        neithb.push(this.pair);
        this.pair = [];        
        this.pair.push(                     //1
            (coupleCord.slice()[0]+1),
            (coupleCord.slice()[1]+1)
        );        
        neithb.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            (coupleCord.slice()[0]),
            (coupleCord.slice()[1]-1)
        );        
        neithb.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            (coupleCord.slice()[0]-1),
            (coupleCord.slice()[1])
        );        
        neithb.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            (coupleCord.slice()[0]-1),
            (coupleCord.slice()[1]+1)
        );        
        neithb.push(this.pair);
        this.pair = [];        
        this.pair.push(                     //1
            (coupleCord.slice()[0]-1),
            (coupleCord.slice()[1]-1)
        );        
        neithb.push(this.pair);
        this.pair = [];

        return neithb;             //!!!
    },

    //Метод вычисления выживших клеток
    findSurvives(){
        // let copyArr = this.currGen;     //slice();                  
        for (let el of this.currGen){                                  // Пройти по всем парам кординат из массива текущего поколениия
            let count = 0;                                             // Установить счетчик для вложенного цикла
            this.neithbours = this.findNeithbour(el);                  // Получить соседей для каждой из живых клеток
            for (let el1 of this.neithbours){                          // Для каждого из соседей выбраной во внешнем цикле клетки 
                if(this.matchCheck(el1, this.currGen)) count++;        // Проверить, есть ли такая пара кординат среди живущих на данный момент клеток
            }                                                          // Если есть увеличить счетчик совпадений 
            if (count == 2 || count == 3){                             // Если после перебора колличество 2 или 3 - добавить рассмотренную клетку
                this.survives.push(el);                                // исходного поколения к списку выживших
            }
            this.neithbours = [];                                      // Очистить массив соседей
        }
    },

    //Метод вычисления соседей всех клеток
    findAllN(){
        for (let curr of this.currGen) {
            this.neithbours = this.findNeithbour(curr);
            while (this.neithbours.length > 0) {
                let pair = this.neithbours.shift();
                this.neithboursAll.push(pair);
            }
        }
        this.neithbours = [];
    },

    //Метод вычисления новорожденных клеток
    findNewies() {
        let x3arr = [];
        for (let el of this.neithboursAll) {                        
            if (this.matchCounter(el, this.neithboursAll) == 3) x3arr.push(el);
        }
        x3arr.sort();
        for (let i = 0; i < x3arr.length; i++){
            if(i%3 == 0 ) this.newiesList.push(x3arr[i]);
        }
    },

    //Метод очистки объекта
    flushObj(){
        this.gridSide = 0;
        this.currGen = [];
        this.neithbours = [];
        this.neithboursAll = [];
        this.pair = [];
    },
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Объект для функций отрисовки
let renderUnit = {

    getPair(cordPair){},
    //Создать живую клетку по кординатам в массиве переданном в параметре
    spawnOneCell(cordPair) {
        let elem = document
            .querySelector(
            `div[class="${cordPair[0]}.${cordPair[1]}_grid_el"]`);

        // console.log(elem);                                                          /////////////////////////////
        elem.setAttribute('style', `background-color:${ACTIVE};`);  
    },
    //Создать конфигурацию клеток по массиву пар чисел
    spawnGen(arrPair) {
        for (let pairEl of arrPair) {
            this.spawnOneCell(pairEl);
        }
    },
    //Очистить игровое поле
    clearCurrGrid() {
        let Grid = document.querySelectorAll("div[class$='grid_el']");
        for (let el of Grid) {
            el.setAttribute("style", "background=''");
        }
    },
}



                // ****MAIN GAME CICLE****
////////////////////////////////////////////////////////////////

function gameIteration() {

    let currentSize = field.cellNum;

    let currentGen = selectUnit.selectCells();

    arithmCore.init(currentGen, currentSize);

    let nextGen = arithmCore.nextGenCalculus();

    renderUnit.clearCurrGrid();

    renderUnit.spawnGen(nextGen);

}




let testButton = document.getElementById('test_button');
let testWindow = document.getElementById('output');
testButton.onclick = function() {gameIteration()};




let form = document.getElementsByName("number");
let button = document.getElementById('button');
button.onclick = function() {
    if ( form[0].value < 2 || form[0].value > 100) {
        alert("Число должно находится в диапазоне от 2 до 100");
    } else {
        field.createField(form[0].value);
    }
}









// let cell = {
				
//     color: DEFAULT,
//     idnum: 1,
//     elem: document.getElementById(`1_grid_item`),

//     setCell(){
//         this.elem = document.getElementById(`${this.idnum}_grid_item`);
//     },

//     incrId(){(this.idnum == MAX_ELEM) ? this.idnum = 1 :  this.idnum++ ; return this;},

//     moveCell(){this.incrId().setCell();},

//     changeColor(){
//         this.color = (this.color == DEFAULT) ? GREEN: DEFAULT;
//     },

//     setColor(){
//         this.changeColor();
//         this.elem.setAttribute(`style`, `background:${this.color}`);
//     },
    

// }

// function blink(cell){

//     setTimeout(() => {

//         cell.setColor();

//         setTimeout(()=> cell.moveCell(), 50);

//     }, 50);
//     cell.setColor();
// }

// setInterval(blink, 100, cell);