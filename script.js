// SCRIPT FOR GRID GENERATION

// Аабсолютный размер - сторона квадрата сетки в px
const SIDE = 580;

// Объект для инкапсуляции кода создания сетки
let field = {

    cellNum: 0,
    cellSize: 0,
    elemNumb: 1,
    
    // запрашивает  у пользователя количество клеток в стороне квадратного поля
    getParam(param) {this.cellNum = +param;}, 
    
    // Вычисляет размер клетки по заданному количеству и размеру поля
    calcCellSize() { this.cellSize = SIDE / this.cellNum; },

    //Метод для очистки сетки
    clearField() {
        if(this.elemNumb != 1) {
            let node = document.getElementById("grid_box");
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
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
                newdiv.className = `${this.elemNumb}_grid_el`;
                elem.append(newdiv);
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