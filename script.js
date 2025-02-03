let canvas;
const WIDTH = window.screen.width;
const HEIGHT = window.screen.height;

const BACKGROUND = [10, 10, 10];

const calculator = new Calculator(WIDTH, HEIGHT);
function setup() {
    noStroke();
    canvas = createCanvas(WIDTH, HEIGHT);
    // linking custom click handler to canvas prevents
    // input elements from triggering the function when focused
    canvas.mouseClicked(onClick); 
    background(BACKGROUND);

    calculator.computeFieldPoints();
    
}

function draw() {
    background(BACKGROUND)
    
    calculator.display();

}

function onClick() {
    // only create new charge if no charge exists at given location
    // can only place new charge if 
    // 1. not clicking on existing charge, and
    // 2. a charge had an input in focus
    let cannotPlaceNewCharge = false;
    for (const charge of calculator.charges) {
        if (dist(mouseX, mouseY, charge.x, charge.y) < charge.size / 2 || charge.isInputFocused) {
            cannotPlaceNewCharge = true;
        }
    }
    
    if (!cannotPlaceNewCharge) {
        calculator.charges.push(new Charge(mouseX, mouseY, 10));
    }

    for (const charge of calculator.charges) {
        charge.clickHandler();
    }
    calculator.computeFieldPoints();

}

function mouseDragged() {
    for (const charge of calculator.charges) {
        charge.dragHandler();
    }
    calculator.computeFieldPoints();
}


