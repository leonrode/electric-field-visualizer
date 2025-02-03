class Calculator {
    constructor(width, height) {
        this.STEP_SIZE = 5; // step 5 pixels in given direction
        this.charges = [];
        this.pointSets = [];

        this.width = width;
        this.height = height;

        this.STROKE_COLOR = [0, 255, 0];

    }

    resetPointSets() {
        this.pointSets.length = 0;
    }
    addCharge(charge) {
        this.charges.push(charge);
    }

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
                
                // draw directional triangle
                if (i == Math.floor(pointSet.length / 2)) {
                    const dx = anchor1[0] - control1[0];
                    const dy = anchor1[1] - control1[1];

                    const p2 = [anchor1[0] - dy, anchor1[1] + dx];
                    const p3 = [anchor1[0] + dy, anchor1[1] - dx];
                    fill(0, 255, 0);
                    triangle(...control2, ...p2, ...p3);
                }
            }
            // for (const point of pointSet) {
            //     circle(point[0], point[1], 2);
            // }
        }
    }

    isInSink(x, y) {
        for (const charge of this.charges) {
            if (charge.charge < 0 && dist(x, y, charge.x, charge.y) < charge.size / 2) {                
                return true;
            }
        }

        return false;
    }

    isOffScreen(x, y) {
        return (x < 0 || x > this.width || y < 0 || y > this.height);
    }

    computeFieldDirection(x, y) {
        let netX = 0;
        let netY = 0;


        for (const charge of this.charges) {
            // if positive positive, vector points towards currX, currY
            // if negative charge, vector points towards charge

            const fieldStrength = 999 * Math.pow(10, 9) * charge.charge / (Math.pow(dist(charge.x, charge.y, x, y), 2));
            let r = [x - charge.x, y - charge.y]
            
            const magR = Math.sqrt(r[0] * r[0] + r[1] * r[1]);

            r[0] = r[0] / magR;
            r[1] = r[1] / magR;
            
            netX += r[0] * fieldStrength;
            netY += r[1] * fieldStrength;

            

        }

        
        // now we have the net vector, and we want to compute the angle
        // at which to move

        const magnitude = Math.sqrt(netX * netX + netY * netY)
        let angle = Math.acos(netX / magnitude);
        if (netY < 0) {
            angle = 2 * PI - angle;
        }
        console.log(angle);
        
        
        return angle;
        
    }

    arraysEqual(a, b) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }

        return true;
    }



    twoOfThreeEqual(a, b, c) {
        if (this.arraysEqual(a, b) && !this.arraysEqual(b, c) || this.arraysEqual(b, c) && !this.arraysEqual(a, c) || this.arraysEqual(a, c) && !this.arraysEqual(b, c)) {
            return true;
        }
        return false;
    }

    computeFieldPoints() {
        this.resetPointSets();
        for (const charge of this.charges) {
            // depending on the magnitude of the charge,
            // we begin sampling points outwardly from the charge
            // and computing the net electric field due to all the charges.
            // depending on the sample density, we step in the direction
            // of the electric field vector, until the point is in a sink, or until
            // the point is off the canvas. once the set of points is establishsed,
            // we connect them using spline curves
            
            const numPoints = Math.floor(charge.charge / 2) * 4;
            
            for (let i = 0; i < numPoints; i++) {
                
                
                let set = [];

                // compute position of initial point and draw it
                let x = charge.x + charge.size * Math.cos((i + 1) * (2 * PI / numPoints)) / 2;
                let y = charge.y + charge.size * Math.sin((i + 1) * (2 * PI / numPoints)) / 2;

                set.push([x, y]);
                
                let j = 0;
                while (!this.isOffScreen(x, y) && !this.isInSink(x, y)) {
                    console.log(`charge type: ${charge.charge > 0}`);
                    
                    j++;
                    // compute field direction
                    // move into that direction
                    // add point into set
      
                    const direction = this.computeFieldDirection(x, y);

                    const newX = x + this.STEP_SIZE * Math.cos(direction);
                    const newY = y + this.STEP_SIZE * Math.sin(direction);

                    set.push([newX, newY]);

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