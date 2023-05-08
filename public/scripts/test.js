let test = {

    lineDashes : () => {
        for(let i = 1; i <= 12; i++) {
            //draw vector lines from origin at 45 degrees
            let v = createVector(1,0);
            v.normalize();
            v.rotate(PI/6*i);
            v.setMag(300);
    
            //create a new Line from the vector
            let l = new Line(createVector(0,0), v);
    
            // ensure dashes and spacing look correct for each line
            l.displayDashed(1, 'gray');
        }
    }
}