class Charge {
    /**
     * Creates an instance of a charge on the plane at a given position and with given charge.
     * 
     * @param {number} x The x coordinate of the charge's position
     * @param {number} y The y coordinate of the charge's position
     * @param {number} charge The charge's charge
     */
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
        this.size = 30;

        this.inputElement = createInput(this.charge, "number"); // default value is the given charge
        this.inputElement.position(this.x, this.y + this.INPUT_ELEMENT_Y_OFFSET);
        this.inputElement.hide();

        this.isInputFocused = false;
        
    }

    /**
     * Computes the color of the drawn charge based on the sign of the charge
     */
    computeColor() {
        if (this.charge == 0) {
            this.color = this.ZERO_COLOR;
        } else if (this.charge < 0) {
            this.color = this.NEGATIVE_COLOR;
        } else {
            this.color = this.POSITIVE_COLOR;
        }
    }

    /**
     * Displays the particle based on its appearance properties.
     */
    display() {
        this.refresh();
        noStroke();
        fill(this.color);
        this.element = circle(this.x, this.y, this.size);
    }

     /**
     * Refresh the properties of the charge based on the value of the associated
     * input charge.
     */
    refresh() {
        this.charge = this.inputElement.value() ? parseInt(this.inputElement.value()) : 0;
        this.computeColor();
    }

    /**
     * Event handler for mouse click events. 
     */
    clickHandler() {
        if (this.isMouseOverElement()) {
            this.inputElement.show();
            this.isInputFocused = true;
        } else {
            this.inputElement.hide();
            this.isInputFocused = false;
        }
    }

    /**
     * Event handler for mouse drag events.
     */
    dragHandler() {
        if (this.isMouseOverElement()) {
            this.x = mouseX;
            this.y = mouseY;
            this.inputElement.position(this.x, this.y + this.INPUT_ELEMENT_Y_OFFSET);
        }
    }

    /**
     * Determines whether the mouse is positioned over the charge.
     * @returns Whether the mouse is positioned over the charge
     */
    isMouseOverElement() {
        return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
    }
}