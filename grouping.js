
class Group{
	constructor(cells){
		this.cells = cells

		this.cells.forEach(x=>x.addGroup(this))
	}

	hasCell(cell){
		return this.cells.includes(cell)
	}

	highlight(){
		this.cells.forEach(x=>x.shade = true)
	}

	checkErrors(){
		const numSlots = new Array(10)

		this.cells.forEach(x=>{
			if (numSlots[x.value]){
				numSlots[x.value] = [x].concat(numSlots[x.value])
			}else{
				numSlots[x.value] = [x]
			}
		})

		const errArray = numSlots.filter(x=>x.length > 1)

		errArray.forEach(slot=>{
			slot.forEach(cell => {if (cell.value) cell.mistake = true})
		})

		return errArray
	}

	getValues(){
		const vals = []
		this.cells.forEach(x=>{
			vals.push(x)
		})

		return vals.sort()
	}
}
