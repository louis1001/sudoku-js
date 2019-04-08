
class Cell{
	constructor(position, size, value, fixedValue = false){
		this.value = value
    this.sz = size
    this.txtSize = (this.sz * 0.7) | 0
    this.pos = position
    this.pxpos = createVector(
      this.pos.x * this.sz,
      this.pos.y * this.sz
    )

    this.groups = []

    this.pencil = new Pencil(this)

    this.fixedValue = value ? fixedValue : false
    this.selected = false
    this.mistake = false
    this.clearShades()
	}

  addGroup(g){
    this.groups.push(g)
  }

  clearShades(){
    this.shade = false
    this.sameNumber = false
    this.mistake = false
    this.similar = false
  }

  draw(){
    push()

    stroke(100)
    if (this.selected){
      fill('#acbbf9')//80, 80, 240)
    } else if (this.similar){
      fill(210)
    } else if (this.shade) {
      fill(230)
    }
    rect(this.pxpos.x, this.pxpos.y, this.sz, this.sz)

    if (this.value){

      if(this.mistake){
        fill(200, 50, 50)
        stroke(200, 50, 50) 
      } else if(this.fixedValue){
        fill(0)
        stroke(0)
      } else {
        fill('#1717c8')
        stroke('#1717c8')
        noStroke()
      }

      strokeWeight(1)
      textSize(this.txtSize)
      text(this.value, this.pxpos.x + this.sz/2, this.pxpos.y + this.sz/2)
    }

    this.pencil.draw()

    pop()
  }

  setValue(v, override=false){
    if (override || !this.fixedValue || !this.value){
      this.value = v

      if (this.value){
        this.pencil.clear()
      }
    }
  }

  setPencil(v){
    if (!this.fixedValue){
      this.pencil.setValue(v)
      this.setValue(0)
    }
  }

  getPossibleValues(){
    const pValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    this.groups.forEach(x=>{
      const gVals = x.getValues()
      gVals.forEach(c=>{
        if (pValues.includes(c.value) && c.value){
          pValues.splice(pValues.indexOf(c.value), 1)
        }
      })
    })

    return pValues
  }

  clone(){
    const clonePosition = createVector(
      this.pos.x,
      this.pos.y  
    )

    const cloneSize = this.sz

    const cloneValue = this.value

    return new Cell(clonePosition, cloneSize, cloneValue)
  }
}







