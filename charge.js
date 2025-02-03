class Charge {
    constructor(x, y, charge) {
        this.INPUT_ELEMENT_Y_OFFSET = 20;
        this.SIZE_FACTOR = 5;
        this.DEFAULT_SIZE = 5; // minimum size of charge
        this.ZERO_COLOR = [230, 230, 230];
        this.NEGATIVE_COLOR = [255, 0, 0];
        this.POSITIVE_COLOR = [0, 255, 0];

        this.element = null;

        this.x = x;
        this.y = y;
        this.charge = charge;

        this.color = this.computeColor(); // color can depend on type of charge
        this.computeSize(); // display size, later this can be proportional to charge

        this.inputElement = createInput(this.charge, "number"); // default value is the given charge
        this.inputElement.position(this.x, this.y + this.INPUT_ELEMENT_Y_OFFSET);
        this.inputElement.hide();

        this.isInputFocused = false;
        
    }

    computeColor() {
        if (this.charge == 0) {
            this.color = this.ZERO_COLOR;
        } else if (this.charge < 0) {
            this.color = this.NEGATIVE_COLOR;
        } else {
            this.color = this.POSITIVE_COLOR;
        }
    }

    computeSize() {
        //this.size = this.DEFAULT_SIZE + abs(this.charge) * this.SIZE_FACTOR;
        this.size = 30; // size doesnt depend on the charge
    }

    display() {

        
        this.refresh();

        // display charge as a circle
        noStroke();
        fill(this.color);

        this.element = circle(this.x, this.y, this.size);
    }

    
    refresh() {
        
        this.charge = this.inputElement.value() ? parseInt(this.inputElement.value()) : 0;
        

        this.computeSize();
        this.computeColor();


        
        
    }

    showInput() {
        
    }

    clickHandler() {
        if (this.isMouseOverElement()) {
            this.inputElement.show();
            this.isInputFocused = true;
        } else {
            this.inputElement.hide();
            this.isInputFocused = false;
        }
    }

    dragHandler() {
        if (this.isMouseOverElement()) {
            this.x = mouseX;
            this.y = mouseY;
            this.inputElement.position(this.x, this.y + this.INPUT_ELEMENT_Y_OFFSET);
        }
    }

    isMouseOverElement() {
        // distance from mouse position to
        // center of circle
        return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
    }




}