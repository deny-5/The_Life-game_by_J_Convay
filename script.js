// SCRIPT FOR GRID GENERATION

const SIDE = 580;

let field = {

    cellNum: 0,
    cellSize: 0,
    elemNumb: 1,

    getParam() {
        do {
            this.cellNum = +prompt("Введите параметр поля", "10...58");
        } while (this.cellNum < 10 || this.cellNum > 58);
    },

    calcCellSize() { this.cellSize = SIDE / this.cellNum; },
 
    createField() {
        this.getParam();
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

field.createField();


