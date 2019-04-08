class Pencil{
	constructor(cell){
		this.values = []

		this.cell = cell

		this.marksSize = cell.sz / 3
		this.textSize = this.marksSize * 0.6
	}

	setValue(v){
		if (!v) return
		if (this.hasValue(v)){
			this.values.splice(this.values.indexOf(v), 1)
		} else {
			this.values.push(v)
			this.values.sort()
		}
	}

	hasValue(v){
		return this.values.includes(v)
	}

	clear(){
		this.values = []
	}

	draw(){
		push()
		translate(this.cell.pxpos.x + this.marksSize/2, this.cell.pxpos.y + this.marksSize/2)
		textSize(this.textSize)
		stroke(80)
		fill(80)
		this.values.forEach(val=>{
			const x = (val-1) % 3
			const y = Math.floor((val-1) / 3)

			text(val, x * this.marksSize, y * this.marksSize)
		})
		pop()
	}
}