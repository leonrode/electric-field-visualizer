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
    // A click can only place a charge when:
    // 1. the user did not clicking on existing charge, and
    // 2. any charge had an input in focus (allow for defocus of input)
    let cannotPlaceNewCharge = false;
    for (const charge of calculator.charges) {
        if (dist(mouseX, mouseY, charge.x, charge.y) < charge.size / 2 || charge.isInputFocused) {
            cannotPlaceNewCharge = true;
        }
    }
    
    if (!cannotPlaceNewCharge) {
        calculator.addCharge(new Charge(mouseX, mouseY, 10, calculator.deleteCharge));
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


