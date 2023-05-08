/* Classes:
    - Artifact
    - Grid
    - Incidence
    - Line
    - Normal
    - Observer
    - ReflectedImageLine
    - Room
    - Wall
 */
class Artifact {
    constructor(pos, isVirtual) {
        this.size = 100;
        this.pos = pos.copy();
        this.extent = createVector(random(1000), random(1000));
        this.angle = 0;
        this.isVirtual = isVirtual;
    }
    displayLabel(text) {
        if (!this.isVirtual) return;
        push();
        strokeWeight(1);
        fill(palette.gray2);
        translate(this.pos.x, this.pos.y);
        stroke(palette.gray4)
        fill(palette.gray1);
        ellipse(0, 0, this.size - 20, this.size - 20);
        drawText(text, -2, -10, labelSize, palette.gray2); //draw number on artifact
        pop();
    }
    display(invert, scaled, opacity) {
        push();
        strokeWeight(1);
        fill(palette.gray2);
        translate(this.pos.x, this.pos.y);
        if (this.isVirtual) { //virtual image placeholder
            let size = this.size * ((scaled) ? scaled : 1);
            strokeWeight(0.5);
            stroke(palette.gray5);
            ellipse(0, 0, this.size, this.size);
            stroke(palette.gray4)
            if (invert) scale(-1, 1);
            tint(250, opacity); // tint image with opacity   
            image(ballImg, -size / 2, -size / 2, size, size);
        } else if (!this.isVirtual) {//original image
            stroke(palette.white);
            image(ballImg, -this.size / 2, -this.size / 2, this.size, this.size);
        }
        pop();
    }
}
class Grid {
    constructor(pos) {
        this.pos = pos.copy();
        this.x = pos.x;
        this.y = pos.y;
    }
    display() {
        push();
        translate(0, 0);
        stroke(palette.pink);
        strokeWeight(0.5);
        line(0, -height, 0, height);
        line(-width, 0, width, 0);
        pop();
    }
}
class Incidence {
    constructor(line, imageNum) {
        let wall = (line.A.x > line.B.x) ? room.getWall('east') : room.getWall('west');
        this.pos = this.getPointOfIncidence(line, wall);
        this.normal = new Normal(this, selColor[imageNum - 1]);
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
        stroke(selColor[this.imageNum - 1]);
        ellipse(this.pos.x, this.pos.y, 50, 50);
        pop();
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
        this.m = calcSlope(this.A, this.B);
        this.b = calcYIntercept(this.A, this.m);
        this.l = this.A.dist(this.B);
        this.M = p5.Vector.add(this.A, this.B).div(2);
        this.angle = atan2(this.B.y - this.A.y, this.B.x - this.A.x);
    }
    getAngle() {
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
        if (this.B.y < this.A.y) scale(-1, -1);

        drawText(round(this.l / 12), 5, 5, 'black', 10);
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
        let v1, v2 = createVector(0, 0);
        let i = 1;
        while (v2.mag() < this.l) {
            push();
            strokeWeight(size);
            stroke(color);

            translate(this.A.x, this.A.y);
            v1 = createVector(this.B.x - this.A.x, this.B.y - this.A.y);
            v2 = v1.copy();
            v1.setMag(dashSize * i);
            v2.setMag(dashSize * (i + 1));
            line(v1.x, v1.y, v2.x, v2.y);
            pop();
            i += 2;
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
class Observer {
    constructor(pos) {
        this.pos = pos.copy();
        this.size = 100;
        this.verticalBound = 100;
    }
    moveTo(pos) {
        this.pos = pos.copy();
        if (this.pos.y > this.verticalBound) {
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
        if (mouseX > width) mouseX = width;
        if (mouseX < 0) mouseX = 0;
        if (mouseY > height) mouseY = height;
        if (mouseY < 0) mouseY = 0;
        pupilPos.x = map(mouseX, 0, width, -30, -12);
        pupilPos.y = map(mouseY, 0, height, 28, 34);
        ellipse(pupilPos.x, 5 + pupilPos.y, 15, 15);
        strokeWeight(0.5);
        pop();
    }
}
class ReflectedImageLine {
    constructor(numReflections) {
        this.showReflectsInMirror1 = false;
        this.showReflectsInMirror2 = true;
        this.update(numReflections);
    }
    update(numReflections) {//TODO: cleanup
        //reset arrays
        mirroredImages = [];
        this.mirror1Images = [];
        this.mirror2Images = [];

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
            for (let i = 0; i < this.numReflections; i++) {
                let img = this.mirror2Images[i];
                ellipse(img.pos.x, img.pos.y, 10, 10)
            }
        }
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
            case 'east': wall = this.walls[1]; break;
            case 'south': wall = this.walls[2]; break;
            case 'west': wall = this.walls[3]; break;
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
        this.walls.forEach((wall, i) => {
            if (i == 2) return;//skip south wall
            wall.display();
        });
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
        if (this.isMirrored) {
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
            drawText("⬅ mirror", this.M.x + 52, this.M.y - 180, 20, palette.gray4);
        } else {
            line(this.A.x, this.A.y, this.B.x, this.B.y);
        }
        pop();
    }
}