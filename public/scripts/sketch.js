
//-------------------------------------------------------------
function handleLessonSequence() {
    switch (sequenceStep) {
        //------------------------------------------------------------- //STEP 1
        case 1:
            room.getWall('east').isMirrored = true;
            room.getWall('west').isMirrored = false;

            //update and display reflected image line
            //number of reflections to extend to
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
// user-event handlers
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
    clickSnd.play();
    sequenceStep++;
    transPerc = 0;
    startTime = millis();
    resetFlags();
    if (sequenceStep > lastSeqStep) { 
        sequenceStep = 1; 
    }
}
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
    //show hand pointer icon
    if (hovering) { 
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
function draw() {
    clear();
    background(200);
    translate(grid.x, grid.y);
    scale(1, -1); //standard cartesian, with center (0,0)

    //---------------------
    // test.lineDashes();
    // noLoop();
    //---------------------

    room.display();
    grid.display();
    room.getWall('east').display('bold');
    room.getWall('west').display('bold');
    
    handleLessonSequence();

    observer.display();
    artifact.display();
}
//-------------------------------------------------------------
function displayMirroredImage(imgNum) {
    let inverted = (imgNum % 2 != 0); //every other reflection inverted
    let imgIndex = imgNum - 1;
    let scaled   = map(imgNum, 1, 3, 1, 0.75);
    let opacity  = map(imgNum, 1, 3, 255, 100);
    mirroredImages[imgIndex].display(inverted, scaled, opacity);
}
//-------------------------------------------------------------
function displayImagePlaceholder(imgNum, imgLabel) {
    let imgIndex = imgNum - 1;
    mirroredImages[imgIndex].displayLabel(imgLabel);
}
//-------------------------------------------------------------
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
            pop();
        
            push();
            noStroke();
            fill(palette.gray1);
            translate(sightLine.M.x, sightLine.M.y);
            rotate(atan2(sightLine.B.y - sightLine.A.y, sightLine.B.x - sightLine.A.x));
            if (sightLine.B.y < sightLine.A.y) scale(-1, -1);
            if(useRealValues[imageNum - 1]) {
                let dist = round(observer.pos.dist(sightLine.A) / 12);
                ellipse(13, -36, 36, 36);
                drawText(dist, 15, -45, labelSize, palette.black);
            } else {
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
    //draw reflected rays, stemming from artifact
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