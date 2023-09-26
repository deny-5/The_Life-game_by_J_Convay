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
        console.log(cordParse(this.className));
        
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