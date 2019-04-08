class Board {

  constructor(cells=[], grid = []) {
    this.cells = cells
    this.grid = grid
    this.groups = []
    this.setFixed = true

    this.cellSize = (width / 9)

    this.selectedCell = undefined

    if (!grid.length || !cells.length)
      this.initGrid()
    this.initGroups()
  }

  loadBoard(b) {
    // b = JSON.parse(b.toString())
    
    const newGrid = []
    const newCells = []
    const newGroups = []
    for (let i = 0; i < 9; i++){
      let newRow = []
      for (let j = 0; j < 9; j++) {
        const newCell = new Cell(
          createVector(i, j),
          this.cellSize,
          b[i * 9 + j] == '.' ? 0 : b[i * 9 + j],
          true
        )
        // newCell.fixedValue = true
        newCells.push(newCell)
        newRow.push(newCell)
      }
      newGrid.push(newRow)
    }

    this.setInputMethod()
    this.grid = newGrid
    this.cells = newCells

    this.initGroups()
  }

  selectCell(c) {
    // if (c === this.selectedCell) return

    if (this.selectedCell)
      this.selectedCell.selected = false

    this.selectedCell = c

    if (c)
      c.selected = true

    this.clearShades()
    this.highlightCell(this.selectedCell)
  }

  initGrid() {
    let newGrid = []
    let newCellList = []
    for (let i = 0; i < 9; i++) {
      let newRow = []
      for (let j = 0; j < 9; j++) {
        const newCell = new Cell(
          createVector(i, j),
          this.cellSize,
          // (random() * 9) | 0
        )
        // newCell.fixedValue = true
        newCellList.push(newCell)
        newRow.push(newCell)
      }
      newGrid.push(newRow)
    }

    // for (var i = 0; i < 14; i++) {
    //   const randomCell = random(newCellList)
    //   if (randomCell.fixedValue && randomCell.value){
    //     i--
    //   }else{
    //     randomCell.fixedValue = true
    //   }
    // }

    this.grid = newGrid
    this.cells = newCellList
  }

  initGroups() {
    // Rows Groupings
    const rowGroups = this.grid.map(x=>new Group(x))

    // Column Groupings
    const transposedGrid = this.grid
      .reduce((prev, next) =>
        next.map((item, i) =>
          (prev[i] || []).concat(next[i])
        ), []
      )

    const columnGroups = transposedGrid.map(x=>new Group(x))

    // Box Groupings
    const boxGroups = []
    for(let i = 0; i < 9; i += 3){
      for(let j = 0; j < 9; j += 3){
        const thisCells = []
        for(let k = 0; k < 3; k ++){
          for(let l = 0; l < 3; l++){
            const aCell = this.grid[i + k][j + l]
            thisCells.push(aCell)
          }
        }

        const newGroup = new Group(thisCells)
        boxGroups.push(newGroup)
      }
    }

    this.groups = [...rowGroups, ...columnGroups, ...boxGroups]
  }

  update(){
    this.clearShades()
    this.highlightCell(this.selectedCell)
    this.highlightSimilars(this.selectedCell)
    this.groups.forEach(group => {
      group.checkErrors()
    })
  }

  errorsExist(){
    return Boolean(this.groups.find(group=>{
      return group.checkErrors().length
    }))
  }

  draw(){
    push()
    textSize(this.cellSize * 0.7)

    this.cells.forEach(cell =>{
        cell.draw()
    })

    const twi = width/3

    stroke(30)
    strokeWeight(3)

    line(twi, 0, twi, height)
    line(twi * 2, 0, twi * 2, height)

    line(0, twi, width, twi)
    line(0, twi * 2, width, twi * 2)

    pop()
  }

  clearShades(){
    this.cells.forEach(x=>x.clearShades())
  }

  clearUserInputs(){
    this.cells
      .forEach(x => {
        if(!x.fixedValue) x.value = 0
      })
  }

  highlightSimilars(c){
    if (c && c.value)
      this.cells
        .filter(x=>x.value==c.value)
        .forEach(x=>{
          x.similar = true
        })

  }

  highlightCell(cell){
    if (!cell) return
    cell.groups
      .forEach(y=>{
        y.highlight()
      })
  }

  getCellXY(px, py){
    let x, y
    if (x === undefined && y === undefined){
      x = (px / this.cellSize)
      y = (py / this.cellSize)
    }

    if(x < 0 || x >= 9 || y < 0 || y >= 9)
      return


    return this.grid[(x)|0][(y)|0]
  }

  setSelectedValue(v, override){
    const s = this.selectedCell
    s.setValue(v, self.setFixed)
    if (this.setFixed && v != 0){
      s.fixedValue = true
    }

    this.updatePencils(s)
  }

  setSelectedPencil(v){
    const s = this.selectedCell
    s.setPencil(v)
  }

  setInputMethod(ovr){
    this.setFixed = false
  }

  updatePencils(c){
    c.groups.forEach(g=>{
      g.cells.forEach(cell=>{

        if(cell.pencil.hasValue(c.value)){
          cell.setPencil(c.value)
        }
      })
    })
  }

  checkComplete(){
    const allFilled = !this.cells.filter(x=>!x.value).length

    const numErrors = this.groups.filter(x=>x.checkErrors().length)

    return allFilled && numErrors
  }

  clone(){

    const cloneCells = this.cells.map(x=>x.clone())

    const cloneGrid = this.grid.map(x=>x.map(c=>{
      return c.clone()
    }))

    const cloneBoard = new Board(cloneCells, cloneGrid)

    return cloneBoard

  }
}
