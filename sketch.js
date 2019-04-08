let theBoard

function setup(){
	createCanvas(800, 800)

	textFont('Courier New')
	textAlign(CENTER, CENTER)

	theBoard = new Board()
	const board = sudoku.generate('hard')
	theBoard.loadBoard(board)
	noLoop()
}

function draw(){
	background(255)

	theBoard.update()
	theBoard.draw()

	noFill()
	stroke(100)
	rect(0, 0, width-1, height-1)
}

// addEventListener('focus', ()=>{
// 	loop()
// })

// addEventListener('blur', ()=>{
// 	noLoop()
// })

function mouseMoved(){
	const moCell = theBoard.getCellXY(mouseX, mouseY)
	if (moCell !== theBoard.selectedCell){
		theBoard.selectCell(moCell)
		draw()
	}

}

function keyPressed(){
	const numKey = keyCode - 48
	// console.log(key)
	if (numKey >= 0 && numKey <= 9){
		if (keyIsDown(16)){
			theBoard.setSelectedPencil(numKey)
		}else{
			theBoard.setSelectedValue(numKey, true)
		}
	} else if (key == 't' ){
		theBoard.selectedCell.fixedValue = !theBoard.selectedCell.fixedValue
	} else if (key == 'k'){
		theBoard.setInputMethod(false)
	} else if (key == 'r'){
		setup()
	} else if (key == 'C'){
		theBoard.clearUserInputs()
	}

	draw()
}
