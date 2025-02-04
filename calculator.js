class Calculator {
    /**
     * Creates the main object responsible for computation.
     * 
     * @param {number} width The width of the screen
     * @param {number} height The height of the screen
     */
    constructor(width, height) {
        this.STEP_SIZE = 10; // step 5 pixels in given direction
        this.charges = [];
        this.pointSets = [];

        this.width = width;
        this.height = height;

        this.STROKE_COLOR = [0, 255, 0];
    }

    /**
     * Resets the computed point sets in order to restart the computation of the field lines
     */
    resetPointSets() {
        this.pointSets.length = 0;
    }
    /**
     * Adds a charge to be accounted for in drawing the field lines
     * @param {Charge} charge 
     */
    addCharge(charge) {
        // assign click handler for the Delete button
        charge.deleteElement.mousePressed(() => this.deleteCharge(charge));
        this.charges.push(charge);
    }
    /**
     * Deletes a charge based on its position
     * @param {Charge} charge 
     */
    deleteCharge(charge) {
        charge.inputElement.hide();
        charge.deleteElement.hide();
        
        this.charges = this.charges.filter(_charge => _charge.x !== charge.x && _charge.y !== charge.y);
        this.computeFieldPoints();
    }

    /**
     * Displays the charges and draws the curves interpolating the computed point sets
     */
    display() {
        for (const charge of this.charges) charge.display();
        
        for (const pointSet of this.pointSets) {
            for (let i = 0; i < pointSet.length; i += 1) {
                const control1 = pointSet[i];
                const anchor1 = pointSet[i + 1];
                const anchor2 = pointSet[i + 2];
                const control2 = pointSet[i + 3];
                
                stroke(this.STROKE_COLOR);
                strokeWeight(1);
                if (control1 && anchor1 && anchor2 && control2)
                    curve(...control1, ...anchor1, ...anchor2, ...control2);
                
                // draw a directed triangle halfway along the point set
                if (i == Math.floor(pointSet.length / 2)) {
                    const dx = anchor1[0] - control1[0];
                    const dy = anchor1[1] - control1[1];

                    const p2 = [anchor1[0] - dy, anchor1[1] + dx];
                    const p3 = [anchor1[0] + dy, anchor1[1] - dx];
                    fill(0, 255, 0);
                    triangle(...control2, ...p2, ...p3);
                }
            }
        }
    }

    /**
     * Determines whether a given point lies inside of a negative charge
     * 
     * @param {number} x The x coordinate of the tested point
     * @param {number} y The y coordinate of the tested point
     * @returns Returns true if the condition described is satisfied, false otherwise
     */
    isInNegativeCharge(x, y) {
        for (const charge of this.charges) {
            if (charge.charge < 0 && dist(x, y, charge.x, charge.y) < charge.size / 2) {                
                return true;
            }
        }

        return false;
    }

    /**
     * Determines whether the given point is out of the screen's bounds
     * 
     * @param {number} x The x coordinate of the tested point
     * @param {number} y The y coordinate of the tested point
     * @returns Returns true if the condition described is satisfied, false otherwise.
     */
    isOffScreen(x, y) {
        return (x < 0 || x > this.width || y < 0 || y > this.height);
    }

    /**
     * Determines the direction of the net electric field at a point (x, y)
     * 
     * @param {number} x The x coordinate of the chosen point
     * @param {number} y The y coordinate of the chosen point
     * @returns The angle [0, 2*pi) formed by the electric field vector and the unit vector in the positive x direction, increasing counterclockwise.
     */
    computeFieldDirection(x, y) {
        let netX = 0;
        let netY = 0;

        for (const charge of this.charges) {
            const fieldStrength = 999 * Math.pow(10, 9) * charge.charge / (Math.pow(dist(charge.x, charge.y, x, y), 2));
            let r = [x - charge.x, y - charge.y]
            
            const magR = Math.sqrt(r[0] * r[0] + r[1] * r[1]);

            r[0] = r[0] / magR;
            r[1] = r[1] / magR;
            
            netX += r[0] * fieldStrength;
            netY += r[1] * fieldStrength;
        }

        const magnitude = Math.sqrt(netX * netX + netY * netY);
        let angle = Math.acos(netX / magnitude);

        if (netY < 0) {
            angle = 2 * PI - angle;
        }
        
        return angle;
        
    }

    /**
     * Determines rudimentarily whether arrays a and b are equal (contain the same elements in the same order).
     * 
     * @param {Array} a 
     * @param {Array} b 
     * @returns Returns true if the condition described is satisfied, false otherwise
     */
    arraysEqual(a, b) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }

        return true;
    }


    /**
     * Determines whether exactly two of the three given arrays are equal.
     * 
     * @param {Array} a 
     * @param {Array} b 
     * @param {Array} c 
     * @returns Returns true if the condition described is satisfied, false otherwise
     */
    twoOfThreeEqual(a, b, c) {
        if (this.arraysEqual(a, b) && !this.arraysEqual(b, c) || this.arraysEqual(b, c) && !this.arraysEqual(a, c) || this.arraysEqual(a, c) && !this.arraysEqual(b, c)) {
            return true;
        }
        return false;
    }

    /**
     * Computes the points along a field line. Depending on the magnitude of the charge, we begin sampling points outwardly from the charge and compute the net electric field due to all the charges at the point.
     * Then step in the direction of the electric field vector by a pre-determined offset, until the point is in a negative charge, or until the point is off the canvas.
     */
    computeFieldPoints() {
        this.resetPointSets();
        for (const charge of this.charges) {      
            const numPoints = Math.floor(charge.charge / 2) * 4;
            
            for (let i = 0; i < numPoints; i++) {
                let set = [];

                // compute position of initial point and draw it
                let x = charge.x + charge.size * Math.cos((i + 1) * (2 * PI / numPoints)) / 2;
                let y = charge.y + charge.size * Math.sin((i + 1) * (2 * PI / numPoints)) / 2;

                set.push([x, y]);
                
                while (!this.isOffScreen(x, y) && !this.isInNegativeCharge(x, y)) {
                    const direction = this.computeFieldDirection(x, y);

                    const newX = x + this.STEP_SIZE * Math.cos(direction);
                    const newY = y + this.STEP_SIZE * Math.sin(direction);

                    set.push([newX, newY]);
                    
                    // Detect if points begin to oscillate about an asymptote (where an electric field is zero)
                    const a = set.at(-1);
                    const b = set.at(-2);
                    const c = set.at(-3);

                    if (set.length > 3) {
                        if (this.twoOfThreeEqual(a, b, c) || a.some(isNaN) || b.some(isNaN) || c.some(isNaN)) {
                            set.length = 0;
                            break;
                        }
                    }

                    x = newX;
                    y = newY;
                }

                if (set.length > 0) {
                    this.pointSets.push(set);
                }
            }
        }
    }
}