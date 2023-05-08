// helper functions
// required by classes, sketch
function calcSlope(A, B) {
    return (B.y - A.y) / (B.x - A.x);
}
function calcYIntercept(point, slope) {
    return point.y - slope * point.x;
}
function calcXIntercept(slope, point) {
    return point.x - point.y / slope;
}
function calcIntersectX(m1, m2, b1, b2) {
    // calc x-coord by passing a line's slope (m) and intercept values (b)
    return (b2 - b1) / (m1 - m2);
}
function getIntersection(line1, line2) {
    let xCoord;
    if (abs(line2.m) === Infinity) {
        xCoord = line2.A.x; //vertical line
    } else {
        xCoord = calcIntersectX(line1.m, line2.m, line1.b, line2.b);
    }
    // with the x coord we can solve for the y,
    // y = m * x + b (slope-intercept form)
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