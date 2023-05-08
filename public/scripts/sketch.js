// Mirror Sketch
//-------------------------------------------------------------
//style settings
let palette = {
    white:  '#ffffff',
    gray1:  '#f2f2f2',
    gray2:  '#cccccc',
    gray3:  '#b3b3b3',
    gray4:  '#999999',
    gray5:  '#808080',
    red1:   '#ed1c24',
    green1: '#22b573',
    blue1:  '#0000ff',
    blue2:  '#29abe2',
    blue3:  '#5fd6ff',
    pink:   '#ff99ff',
    gold:   '#ffec14', 
    orange: '#ff7f27',
    black:  '#000000'
};

let labels = {
    abcs : ['a', 'b', 'c', 'd', 'e'],
    ABCs : ['A', 'B', 'C', 'D', 'E']
};
let labelSize = 24;

//-------------------------------------------------------------
//gui
let selFocus;
let selColor = [palette.blue2, palette.red1, palette.blue1];
let startTime = 0;

//-------------------------------------------------------------
// advance through scenarios
let sequenceStep = 1;
let lastSeqStep = 7;

// transition animation
let transPerc = 0;
let transTime = 500;

let selHovered  = false;

//flags
let selToggle      = [false, false, false];
let showLabels     = [false, false, false];
let showFormulas   = [false, false, false];
let showIncidences = [false, false, false];
let showNormals    = [false, false, false];
let useRealValues  = [false, false, false];

let roomWidth = 200;
let roomHeight = 300;
let room, artifact, observer, grid, mouse;
let mirroredImages = [];
let reflectedImageLine;

//images
let ballImg, clownImg, handImg, clickSnd, popSnd, raysSnd;
let triggeredSound = false;
function resetFlags() {
    selToggle      = [false, false, false];
    showLabels     = [false, false, false];
    showFormulas   = [false, false, false];
    showIncidences = [false, false, false];
    showNormals    = [false, false, false];
    useRealValues  = [false, false, false];
    triggeredSound = false;
}
//-------------------------------------------------------------
function handleLessonSequence() {
    switch (sequenceStep) {
        //------------------------------------------------------------- //STEP 1
        case 1:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = false;

            //update and display reflected image line
            reflectedImageLine.update(1);
            reflectedImageLine.display();
            displayReflectedRays(1, transPerc);
            displayImagePlaceholder(1, "?");

            transPerc = easeInQuad(millis() - startTime, 0, 1, transTime);
            if(transPerc > 1.0) transPerc = 1.0;
            checkMouseOverFor([1]);

            if (!triggeredSound) {
                raysSnd.play();
                triggeredSound = true;
            }
            break;
        //------------------------------------------------------------- // STEP 2
        case 2:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = false;
            
            //update and display reflected image line
            reflectedImageLine.update(1);
            reflectedImageLine.display();
            displayReflectedRays(1, transPerc);
            displayMirroredImage(1);
            
            //animated light rays
            transPerc = easeInQuad(millis() - startTime, 0, 1, transTime);
            if (transPerc > 1.0) transPerc = 1.0;

            // checkMouseOverFor([1]);
            break;
        //-------------------------------------------------------------// STEP 3
        case 3:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = true;

            reflectedImageLine.update(3);
            reflectedImageLine.display();

            displayReflectedRays(2, transPerc);
            displayReflectedRays(3, transPerc);
            
            //animated light rays
            transPerc = easeInQuad(millis() - startTime, 0, 1, transTime);
            if (transPerc > 1.0) transPerc = 1.0;

            displayMirroredImage(1);
            displayImagePlaceholder(2, '?');
            displayImagePlaceholder(3, '?');            
        
            let numToggled = 0;
            selToggle.forEach((toggle, i) => {
                if(toggle) {
                    numToggled++;
                    displayReflectedRays(i+1, 1.0, true);
                    displayMirroredImage(i+1)
                }
            });
            checkMouseOverFor([2,3]);
            if(numToggled === 2) { 
                cursor();
                sequenceStep = 4;
            } //advance to next step
            if (!triggeredSound) {
                raysSnd.play();
                triggeredSound = true;
            }
            break;
        //-------------------------------------------------------------// STEP 4
        case 4:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = true;
            
            reflectedImageLine.update(3);
            reflectedImageLine.display();
            
            displayReflectedRays(2, 1.0, true);
            displayReflectedRays(3, 1.0, true);
            
            displayMirroredImage(1);
            displayMirroredImage(2);
            displayMirroredImage(3);
            break;
        //-------------------------------------------------------------// STEP 5
        case 5:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = false; 

            showLabels[0]     = true;
            showFormulas[0]   = true;

            //update and display reflected image line
            reflectedImageLine.update(1);
            reflectedImageLine.display();
            displayReflectedRays(1, transPerc, true);
            displayMirroredImage(1);

            //animated light rays
            transPerc = easeInQuad(millis() - startTime, 0, 1, transTime);
            if (transPerc > 1.0) transPerc = 1.0;
            break;
        //-------------------------------------------------------------// STEP 6
        case 6:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = true;

            showLabels[1] = true;
            showFormulas[1] = false;
            useRealValues[1] = true;

            //update and display reflected image line
            reflectedImageLine.update(2);
            reflectedImageLine.display();

            displayReflectedRays(2, transPerc, true);
            displayMirroredImage(2);

            //animated light rays
            transPerc = easeInQuad(millis() - startTime, 0, 1, transTime);
            if (transPerc > 1.0) transPerc = 1.0;   
            break;
        //-------------------------------------------------------------// STEP 7
        case 7:            
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = true;
            
            showIncidences[2] = true;
            showNormals[2]    = true;

            //update and display reflected image line
            reflectedImageLine.update(3);
            reflectedImageLine.display();

            displayMirroredImage(1);
            displayMirroredImage(2);
            displayReflectedRays(3, transPerc, true);
            displayMirroredImage(3);

            //animated light rays
            transPerc = easeInQuad(millis() - startTime, 0, 1, transTime);
            if (transPerc > 1.0) transPerc = 1.0;
            if (!triggeredSound) {
                raysSnd.play();
                triggeredSound = true;
            }
            break;
    }
    push();
    fill(palette.white);
    rect(480, -250, 400, 300, 20);
    showPrompt(sequenceStep);
    pop();
}
function showPrompt(n) {
    for (let i = 1; i <= lastSeqStep; i++) {
        document.getElementById(`seq_step_${i}`).style.display = 'none';
    }
    document.getElementById(`seq_step_${n}`).style.display = 'block';
}
//-------------------------------------------------------------
//handlers
function mousePressed() {
    if (!selHovered) return;
    switch (sequenceStep) {
        case 1:
            popSnd.play();
            triggeredSound = false;
            sequenceStep=2;
            cursor();
            break;
        case 3:
            popSnd.play();
            selToggle[selHovered - 1] = true;
        default:
            break;
    }
}
function buttonClicked(event) {
    console.log(event);
    clickSnd.play();
    sequenceStep++;
    transPerc = 0;
    startTime = millis();
    console.log(sequenceStep);
    resetFlags();
    if (sequenceStep > lastSeqStep) { 
        // resetFlags();
        sequenceStep = 1; 
    }
}
//-------------------------------------------------------------
function checkMouseOverFor(ids) {
    let hovering = false;
    mouse = createVector(mouseX - grid.x, (mouseY * -1) + grid.y);

    mirroredImages.forEach((img, i) => {
        if (ids.find(imgNum => imgNum === (i + 1))) {
            if (p5.Vector.dist(mouse, img.pos) < 50) {
                hovering = true;
                selHovered = i + 1;
            }
        }
    });
    if (hovering) { //show hand pointer icon
        noCursor();
        push();
        scale(1, -1)
        image(handImg, mouse.x - 14, (mouse.y * -1) - 5);
        pop();
    } else {
        selHovered = false;
        cursor();
    }
}

//-------------------------------------------------------------
function preload() {
    soundFormats('mp3');
    ballImg  = loadImage('images/ball.png');
    clownImg = loadImage('images/clown.png');
    handImg  = loadImage('images/hand.png');
    clickSnd = loadSound('sounds/click.mp3');
    popSnd   = loadSound('sounds/pop.mp3');
    raysSnd  = loadSound('sounds/rays.mp3');
}
//-------------------------------------------------------------
function setup() {
    createCanvas(820, 720);
    rectMode(CENTER);
    textAlign(CENTER);

    grid = new Grid(createVector(130, 310));
    artifact = new Artifact(createVector(-24,250));
    observer = new Observer(createVector(-18,-220)); 
    room = new Room(
        createVector(-roomWidth/2, +roomHeight), //top left
        createVector(roomWidth/2,  +roomHeight), //top right
        createVector(roomWidth/2,  -roomHeight), //bottom right
        createVector(-roomWidth/2, -roomHeight)  //bottom left
        );

    //calcs dists from artifact to walls to determine reflected image positions
    reflectedImageLine = new ReflectedImageLine(3);
}

//-------------------------------------------------------------
function draw() {
    // console.log('sequenceStep', sequenceStep);
    clear();
    background(200);
    translate(grid.x, grid.y);
    scale(1, -1); //standard cartesian, with center (0,0)

    //---------------------
    // test.lineDashes();
    // noLoop();
    //---------------------

    grid.display();
    room.display();
    room.getWall('east').display('bold');
    room.getWall('west').display('bold');
    
    handleLessonSequence();

    observer.display();
    artifact.display();
}

function displayMirroredImage(imgNum) {
    let inverted = (imgNum % 2 != 0); //every other reflection inverted
    let imgIndex = imgNum - 1;
    let scaled   = map(imgNum, 1, 3, 1, 0.75);
    let opacity  = map(imgNum, 1, 3, 255, 100);
    mirroredImages[imgIndex].display(inverted, scaled, opacity);
}
function displayImagePlaceholder(imgNum, imgLabel) {
    let imgIndex = imgNum - 1;
    mirroredImages[imgIndex].displayLabel(imgLabel);
}
function displayReflectedRays(imageNum, perc, highlight) {
    let mirrorPattern = [[2], [2, 1], [2, 1, 2]]; //mirror 1 or 2
    let images = [];
    let incidences = [];
    let rays = [];
    let sightLine;

    for (let i = 0; i < mirrorPattern[imageNum - 1].length; i++) {
        let mirrorNum = mirrorPattern[imageNum - 1][i];
        images.push(
            reflectedImageLine.getReflectedImage(mirrorNum, imageNum - i));
        incidences.push(
            new Incidence(
                new Line(images[i].pos, (i > 0) ? incidences[i - 1].pos : observer.pos), imageNum));
        rays.push(
            new Line(incidences[i].pos, (i > 0) ? incidences[i - 1].pos : observer.pos));
        
        if (showIncidences[imageNum - 1]) {
            incidences[i].display(highlight);
        }
        if(showNormals[imageNum - 1]) {
            incidences[i].displayNormal();
        }

        if (i == 0) {
            sightLine = new Line(images[i].pos, incidences[i].pos);
        }
        if (i == mirrorPattern[imageNum - 1].length - 1) {
            rays.push(new Line(artifact.pos, incidences[i].pos));
        }
    }

    if (highlight) {
        sightLine.displayDashed(2.5, selColor[imageNum - 1]);
        if (showFormulas[imageNum - 1]) {

            //draw a black line of the sightline
            push();
            stroke(palette.black);
            strokeWeight(1);
            translate(6,-20);
            let measureLine = new Line(createVector(sightLine.A.x, sightLine.A.y), observer.pos);
            measureLine.displayDashed(0.5, palette.black);
            // rotate(atan2(sightLine.B.y - sightLine.A.y, sightLine.B.x - sightLine.A.x));
            // line(sightLine.A.x, sightLine.A.y, observer.pos.x, observer.pos.y);
            pop();
        
            push();
            noStroke();
            fill(palette.gray1);
            translate(sightLine.M.x, sightLine.M.y);
            rotate(atan2(sightLine.B.y - sightLine.A.y, sightLine.B.x - sightLine.A.x));
            if (sightLine.B.y < sightLine.A.y) scale(-1, -1);
            
            if(useRealValues[imageNum - 1]) {
                let dist = round(observer.pos.dist(sightLine.A) / 12);
                // fill(palette.gray1);
                ellipse(13, -36, 36, 36);
                drawText(dist, 15, -45, labelSize, palette.black);
            } else {
                //flip text if line is upside down
                // create a string of the letters of the rays in reverse order
                let letters = "";
                for (let i = 0; i < rays.length; i++) {
                    letters += labels.abcs[i];
                    if (i < rays.length - 1) letters += " + ";
                }
                drawText(letters, 15, -45, labelSize, palette.black);
            }
            pop();
            
            
        }

    } else {
        sightLine.displayDashed(2, palette.gray5);
    }

    //draw the vector rays of the reflection, coming from the real artifact
    rays.forEach((ray, i) => {
        if (highlight) {
            ray.displayArrow(8, selColor[imageNum-1], perc);
        } else {
            ray.displayArrow(4, palette.gray5, perc);
        }
        if (highlight && showLabels[imageNum - 1]) {
            let dist = round(ray.A.dist(ray.B) / 12);
            push();
            noStroke();
            fill(palette.gray1);
            ellipse(ray.M.x, ray.M.y, 32, 32);
            if (useRealValues[imageNum - 1]) {
                drawText(dist, ray.M.x, ray.M.y - 7, labelSize, palette.black);
            } else {
                drawText(labels.abcs[rays.length - (i + 1)], ray.M.x, ray.M.y - 7, labelSize, palette.black);
            }
            pop();
        }
    });
}

//-------------------------------------------------------------
class ReflectedImageLine {
    constructor(numReflections) {
        this.showReflectsInMirror1 = false;
        this.showReflectsInMirror2 = true;
        this.update(numReflections);
    }
    update(numReflections) {//TODO: cleanup
        //reset arrays
        mirroredImages      = [];
        this.mirror1Images  = [];
        this.mirror2Images  = [];

        let distToWestWall = abs(room.getWall('west').A.x - artifact.pos.x);
        let distToEastWall = abs(room.getWall('east').A.x - artifact.pos.x);

        let dists = [0, 0], WEST_OF = 0, EAST_OF = 1;
        for (let i = 0; i < numReflections; i++) {
            dists[WEST_OF] += (i % 2 == 0) ? distToWestWall * 2 : distToEastWall * 2;
            dists[EAST_OF] += (i % 2 == 0) ? distToEastWall * 2 : distToWestWall * 2;
            this.mirror1Images.push(new Artifact(createVector(artifact.pos.x - dists[WEST_OF], artifact.pos.y), true));
            this.mirror2Images.push(new Artifact(createVector(artifact.pos.x + dists[EAST_OF], artifact.pos.y), true));
            mirroredImages = this.mirror2Images.concat(this.mirror2Images);
        }
        this.mirror1Line = new Line(
            createVector(artifact.pos.x, artifact.pos.y),
            createVector(artifact.pos.x - dists[WEST_OF], artifact.pos.y));
        this.mirror2Line = new Line(
            createVector(artifact.pos.x, artifact.pos.y),
            createVector(artifact.pos.x + dists[EAST_OF], artifact.pos.y));
        
    }
    getReflectedImage(nMirror, nReflection) {
        let img = null;
        if (nMirror == 1) {
            img = this.mirror1Images[nReflection - 1];
        } else if (nMirror == 2) {
            img = this.mirror2Images[nReflection - 1];
        }
        return img;
    }
    display() {
        if (this.showReflectsInMirror1) {
            this.mirror1Line.displayDashed(2, palette.gray4);
            this.mirror1Images.forEach((img, i) => ellipse(img.pos.x, img.pos.y, 10, 10));
            // this.mirror1Images.forEach((img, i) => img.display(i+1, (i % 2 == 0)));
        }
        if (this.showReflectsInMirror2) {
            this.mirror2Line.displayDashed(2, palette.gray4);
            for(let i = 0; i < this.numReflections; i++) {
                let img = this.mirror2Images[i];
                ellipse(img.pos.x, img.pos.y, 10, 10)
            }
        }
    }
}

//-------------------------------------------------------------

class Incidence {
    constructor(line, imageNum) {
        let wall = (line.A.x > line.B.x) ? room.getWall('east') : room.getWall('west');
        this.pos = this.getPointOfIncidence(line, wall);
        this.normal = new Normal(this, selColor[imageNum-1]);
        this.imageNum = imageNum;
    }
    getPointOfIncidence(line, wall) {
        let i = getIntersection(line, wall);
        return i ? i : null;
    }
    displayNormal() {
        push();
        noFill();
        strokeWeight(1.5);
        stroke(selColor[this.imageNum - 1]);
        this.normal.display(true);
        pop();
    }
    display() {
        push();
        noFill();
        strokeWeight(1.5);
        stroke(selColor[this.imageNum-1]);
        ellipse(this.pos.x, this.pos.y, 50, 50);
        pop();
    }
} 
class Normal {
    constructor(incidence, selColor) {
        this.i = incidence;
        this.n = createVector((incidence.pos.x > 0) ? -1 : 1, 0);
        this.n.setMag(50);
        this.line = new Line(createVector(0, 0), this.n);
        this.selColor = selColor;
    }
    display(selected) {
        let color = (selected) ? this.selColor : palette.gray1;
        let weight = (selected) ? 2 : 1;
        push();
        translate(this.i.pos.x, this.i.pos.y);
        this.line.displayGuide(weight, color);
        pop();
    }
}
class Grid {
    constructor(pos) {
        this.pos = pos.copy();
        this.x = pos.x;
        this.y = pos.y;
        // this.grid = [];
    }
    display() {
        push();
        translate(0,0);
        stroke(palette.pink);
        strokeWeight(0.5);
        line(0, -height, 0, height);
        line(-width, 0, width, 0);
        pop();
    }
}
class Observer {
    constructor(pos) {
        this.pos = pos.copy();
        this.size = 100;
        this.verticalBound = 100;
    }
    moveTo(pos) {
        this.pos = pos.copy();
        if(this.pos.y > this.verticalBound) {
            this.pos.y = this.verticalBound;
        }
    }
    display() {
        push();
        stroke(0);
        fill(255);
        translate(this.pos.x, this.pos.y);
        scale(1, -1);
        image(clownImg, -90, -0);
        fill(palette.white);
        let pupilPos = createVector(-20, 30);
        if(mouseX > width) mouseX = width;
        if(mouseX < 0) mouseX = 0;
        if(mouseY > height) mouseY = height;
        if(mouseY < 0) mouseY = 0;
        pupilPos.x = map(mouseX, 0, width, -30, -12);
        pupilPos.y = map(mouseY, 0, height, 28, 34);
        ellipse(pupilPos.x, 5 + pupilPos.y, 15, 15);
        strokeWeight(0.5);
        pop();
    }
}
class Artifact { 
    constructor(pos, isVirtual) {
        this.size = 100;
        this.pos = pos.copy();
        this.extent = createVector(random(1000),random(1000));
        this.angle = 0;
        this.isVirtual = isVirtual;
    }
    displayLabel(text) {
        if(!this.isVirtual) return;
        push();
        strokeWeight(1);
        fill(palette.gray2);
        translate(this.pos.x, this.pos.y);
        stroke(palette.gray4)
        fill(palette.gray1);
        ellipse(0, 0, this.size - 20, this.size - 20);
        // if (invert) scale(-1, 1);
        drawText(text, -2, -10, labelSize, palette.gray2); //draw number on artifact
        pop();
    }
    display(invert, scaled, opacity) {
        push();
        strokeWeight(1);
        fill(palette.gray2);
        translate(this.pos.x, this.pos.y);
        if (this.isVirtual) { //virtual image placeholder
            let size = this.size * ((scaled)? scaled : 1);
            strokeWeight(0.5);
            stroke(palette.gray5);
            ellipse(0, 0, this.size, this.size);
            // strokeWeight(2);
            stroke(palette.gray4)
            if (invert) scale(-1, 1);
            tint(250, opacity); // tint image with opacity   
            image(ballImg, -size / 2, -size / 2, size, size);

            //drawText(imageNum, -2, -10, 30, palette.gray2); //draw number on artifact
        } else if (!this.isVirtual) {//original image
            stroke(palette.white);
            // ellipse(0, 0, this.size, this.size);
            image(ballImg, -this.size / 2, -this.size / 2, this.size, this.size);
        }
        pop();
    }
}
class Room {
    constructor(p1, p2, p3, p4) {
        this.points = [p1, p2, p3, p4];
        this.walls = [
            new Wall(p1, p2, false), //north
            new Wall(p2, p3, false),  //east (mirrored)
            new Wall(p3, p4, false), //south
            new Wall(p4, p1, false)   //west (mirrored)
        ];
    }
    //get east, west, north, south wall by name
    getWall(name) {
        let wall;
        switch (name) {
            case 'north': wall = this.walls[0]; break;
            case 'east' : wall = this.walls[1]; break;
            case 'south': wall = this.walls[2]; break;
            case 'west' : wall = this.walls[3]; break;
            default: break;
        }
        return wall;
    }  
    display() {
        //fill the room with a color
        push();
        noStroke();
        fill('#E5E5E5');
        beginShape();

        this.points.forEach(point => {
            vertex(point.x, point.y);
        });
        endShape(CLOSE);
        pop();
        this.walls.forEach( (wall, i) => {
            if(i == 2) return;//skip south wall
            wall.display();
        });
    }
}
// Line class
// represents a line in the form of y = mx + b
// m = slope
// b = y-intercept
// l = length
// M = midpoint
class Line {
    constructor(A, B) {
        this.A = A.copy();
        this.B = B.copy();
        // this.bounds = [];
        this.update();
    }
    update() {
        // console.log(this.A, this.B);
        this.m = calcSlope(this.A, this.B);
        this.b = calcYIntercept(this.A, this.m);
        this.l = this.A.dist(this.B);
        this.M = p5.Vector.add(this.A, this.B).div(2);
        this.angle = atan2(this.B.y - this.A.y, this.B.x - this.A.x);
    }
    getAngle () {
        return atan2(this.B.y - this.A.y, this.B.x - this.A.x);
    }
    display() {
        push();
        stroke(0);
        line(this.A.x, this.A.y, this.B.x, this.B.y);
        pop();
    }
    displayGuide(weight, color) {
        push();
        stroke(color)
        strokeWeight(weight);
        line(this.A.x, this.A.y, this.B.x, this.B.y);
        pop();
    }
    displayLength() {
        push();
        translate(this.M.x, this.M.y);
        rotate(atan2(this.B.y - this.A.y, this.B.x - this.A.x));
        //flip text if line is upside down
        if(this.B.y < this.A.y) scale(-1, -1);

        drawText(round(this.l/12), 5, 5, 'black', 10);
        pop();
    }
    displayArrow(size, color, perc) {
        let p = perc || 1.0;
        let s = size || 8;
        let c = color || 'black';
        let v = createVector(this.B.x - this.A.x, this.B.y - this.A.y);
        let m = v.mag() * p;
        v.setMag(m)
        push();
        stroke(c);
        noFill();
        strokeWeight(s * 0.45);
        translate(this.A.x, this.A.y);
        line(0, 0, v.x, v.y);
        rotate(v.heading());
        translate(v.mag() - s, 0);
        triangle(0, s / 2, 0, -s / 2, s, 0);
        pop();
    }
    displayDashed(size, color) {
        let dashSize = 10;
        let v1, v2 = createVector(0,0);  
        let i = 1;
        while (v2.mag() < this.l) {
            push();
            strokeWeight(size);
            stroke(color);

            translate(this.A.x, this.A.y);
            v1 = createVector(this.B.x - this.A.x, this.B.y - this.A.y);
            v2 = v1.copy();
            v1.setMag(dashSize * i);
            v2.setMag(dashSize * (i+1));
            line(v1.x, v1.y, v2.x, v2.y);
            pop();
            i+=2;
        }
    }
    //draw perpendicular line from this line's midpoint using the slope of the line
    displayNormal() {
        push();
        stroke(0);
        let p = createVector(0, 0);

        let normal = createVector(1, (-1 / this.m));
        normal.normalize();
        normal.setMag(100); //invert to reverse direction
        let normalEnd = p5.Vector.add(this.M, normal);
        drawArrow(this.M, normalEnd, 'blue');
        pop();
    }
    displayMidpoint() {
        push();
        fill(0);
        noStroke();
        ellipse(this.M.x, this.M.y, 10, 10);
        //drawText(round(this.m, 2), this.M.x + 10, this.M.y + 10, 'black', 10);
        pop();
    }
}

class Wall extends Line {
    constructor(start, end, isMirrored) {
        super(start, end);
        this.isMirrored = isMirrored;
    }
    display(style) {
        if (style === 'bold') {
            stroke(100);
            strokeWeight(2);
        } else {
            stroke(150);
            strokeWeight(1);
        }
        push();
        if(this.isMirrored) {
            let spacing = 5;
            let dashSize = 10;
            let v1, v2 = createVector(0, 0);
            let i = 1;
            let flipped = (this.A.x < 0);
            let xOff = (flipped) ? -dashSize : dashSize;
            stroke(palette.blue3);
            strokeWeight(2);
            line(this.A.x, this.A.y, this.B.x, this.B.y);
            line(this.A.x + xOff, this.A.y, this.B.x + xOff, this.B.y);
            strokeWeight(0.5);
            stroke(palette.black);
            while (v2.mag() < this.l - dashSize) {
                push();
                v1 = createVector(this.B.x - this.A.x, this.B.y - this.A.y);
                v2 = v1.copy();
                v1.setMag(spacing * i);
                v2.setMag(spacing * (i + 1));
                if (flipped) {
                    rotate(PI)
                    translate(this.A.x + roomWidth, this.A.y);
                    line(v1.x, v1.y, v1.x + dashSize, v1.y + dashSize);
                } else {
                    translate(this.A.x, this.A.y);
                    line(v1.x, v1.y, v1.x + dashSize, v1.y - dashSize);
                }
                pop();
                i += 2;
            } 
            drawText("⬅ mirror", this.M.x+52, this.M.y-180, 20, palette.gray4);
        } else {
            line(this.A.x, this.A.y, this.B.x, this.B.y);
        }
        pop();
    }
}

//-------------------------------------------------------------
//helper functions

function calcSlope(A, B) {
    return (B.y - A.y) / (B.x - A.x);
}
function calcYIntercept(point, slope) {
    return point.y - slope * point.x;
}
function calcXIntercept(slope, point) {
    return point.x - point.y / slope;
}
// calc x-coord by passing both line's slope (m) and intercept values (b)
function calcIntersectX(m1, m2, b1, b2) {
    return (b2 - b1) / (m1 - m2);
}

function getIntersection(line1, line2) {
    let xCoord;

    if(abs(line2.m) === Infinity) {
        // console.log('line is vertical');
        xCoord = line2.A.x;
    } else {
        xCoord = calcIntersectX(line1.m, line2.m, line1.b, line2.b);
    }
    // with the x coord we can solve for the y,

    // slope-intercept form of a line
    // y = m * x + b
    let yCoord = line1.m * xCoord + line1.b;
     
    let intersection = createVector(xCoord, yCoord);

    if (xCoord > line1.A.x && xCoord < line1.B.x || xCoord < line1.A.x && xCoord > line1.B.x) {
        return intersection;
    } else {
        return null;
    }
}
function easeLinear(t, b, c, d) {
    return c * t / d + b;
}
function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
}
function drawText(str, x, y, size, color) {
    push();
    fill(color);
    noStroke();
    scale(1, -1);
    textSize(size);
    text(str, x, y * -1);
    pop();
}