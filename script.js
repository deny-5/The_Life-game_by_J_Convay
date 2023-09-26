// SCRIPT FOR GRID GENERATION

// Аабсолютный размер - сторона квадрата сетки в px
const SIDE = 580;
const DEFAULT = "#bdf";
const ACTIVE = "#b1d28f";

// Объект для инкапсуляции кода создания сетки
let field = {

    cellNum: 0,
    cellSize: 0,
    elemNumb: 1,
    
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
                // console.log(cordParse(newdiv.className));               //test
                this.elemNumb++;
            }     
        }
    },
}

//Объект для выбора живых клеток
let selectUnit = {

    listOfcells: [],
    listOfcord: [],
    cordPair: [],
    cellsCount: 0,

    //Служебный метод очистки
    flushAll() {
        this.listOfcells = this.listOfcord = this.cordPair = [];
    },

    //Метод для выбора колекции элементов живых клеток
    selectCells() {
        this.flushAll();
        let allGrid = document.querySelectorAll("#grid_box div");
        for (let grid_el of allGrid) {      
            if(grid_el.style.backgroundColor != "") {
                let strcord = grid_el.getAttribute("class");
                this.cordPair = cordParse(strcord);
                this.listOfcord.push(this.cordPair);
                this.cellsCount++;                          //Просто так
            }
        }
        return this.listOfcord;
    }
}

//Объет расчета нового поколения
let arithmCore = {
    
    gridSide: 0,
    currGen: [],

    neithbours: [],
    neithboursAll: [],
    survives: [],     
    newiesList: [],
    newGen: [],

    pair:[],

    //Метод инициализации получает конфигурацию текущего поколения
    init(arr, maxNum) {
        this.gridSide = maxNum;    
        this.currGen = arr.slice();
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
    OFCheck(Value) {
        if(value > this.gridSide) return 0;
        else if (value < 1) return this.gridSide;
        else return value;
    },

    //Вычислить соседей данной клетки
    findNeithbour(coupleCord) {
        
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]),
            this.OFCheck(coupleCord.slice()[0]+1)
        );        
        this.neithbours.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]+1),
            this.OFCheck(coupleCord.slice()[0])
        );        
        this.neithbours.push(this.pair);
        this.pair = [];    
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]+1),
            this.OFCheck(coupleCord.slice()[0]-1)
        );        
        this.neithbours.push(this.pair);
        this.pair = [];        
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]+1),
            this.OFCheck(coupleCord.slice()[0]+1)
        );        
        this.neithbours.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]),
            this.OFCheck(coupleCord.slice()[0]-1)
        );        
        this.neithbours.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]-1),
            this.OFCheck(coupleCord.slice()[0])
        );        
        this.neithbours.push(this.pair);
        this.pair = [];         
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]-1),
            this.OFCheck(coupleCord.slice()[0]+1)
        );        
        this.neithbours.push(this.pair);
        this.pair = [];        
        this.pair.push(                     //1
            this.OFCheck(coupleCord.slice()[0]-1),
            this.OFCheck(coupleCord.slice()[0]-1)
        );        
        this.neithbours.push(this.pair);
        this.pair = [];

        return this.neithbours;             //!!!
    },

    //Метод вычисления выживших клеток
    findSurvives(){
        let copyArr = this.currGen.slice();
        for (let el of copyArr){
            let count = 0;
            this.neithbours = this.findNeithbour(el);
            for (let el1 of this.neithbours){
                if(this.matchCheck(el1, this.currGen)) count++;
            }
            if (count == 2 || count == 3){
                this.survives.push(el);
            }
            count = 0;
        }
        this.neithbours = [];

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
        for (let el of this.neithboursAll) {
            if (this.matchCounter(el, this.neithboursAll) == 3){
                this.newiesList.push(el);
            }
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

    //Главный метод арифметического ядра
    //После вызова init объект имеет заполненые поля
    //gridSide и currGen фууф)) ну поехали
    nextGenCalculus(){

        this.findSurvives();
        this.findAllN();
        this.findNewies();

        while (this.survives.length > 0){
            let pair = this.survives.shift();
            this.newGen.push(pair);            
        }

        while (this.newiesList.length > 0){
            let pair = this.newiesList.shift();
            this.newGen.push(pair);            
        }

        this.flushObj();        

        return this.newGen;
    },


} 



let testButton = document.getElementById('test_button');
let testWindow = document.getElementById('output');
testButton.onclick = function() {console.log(selectUnit.selectCells());}
let form = document.getElementsByName("number");
let button = document.getElementById('button');
button.onclick = function() {
    if ( form[0].value < 2 || form[0].value > 100) {
        alert("Число должно находится в диапазоне от 2 до 100");
    } else {
        field.createField(form[0].value);
    }
}


//Функция строковой обработки для получения пары числовых кординат
//я не уверен должна ли эта функция быть определена для обьекта игрового
//поля либо для какого то другого(к примеру для обьекта вычислителя)
//по этому пусть пока что полежит в глобальной области видимости
function cordParse(string) {
    let y = Math.trunc(parseFloat(string));
    let pos = string.indexOf(".", 0);
    let cutstr = string.slice(pos+1);
    let x = parseInt(cutstr);
    return [y, x];
}