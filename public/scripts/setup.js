//-------------------------------------------------------------
// advance through sequence
let sequenceStep = 1;
let lastSeqStep = 7;

// transition animation
let transPerc = 0;
let transTime = 500;

// room size
let roomWidth = 200;
let roomHeight = 300;
//-------------------------------------------------------------
//styles
let labels = {
    abcs: ['a', 'b', 'c', 'd', 'e'],
    ABCs: ['A', 'B', 'C', 'D', 'E']
};
let labelSize = 24;
let palette = {
    white: '#ffffff',
    gray1: '#f2f2f2',
    gray2: '#cccccc',
    gray3: '#b3b3b3',
    gray4: '#999999',
    gray5: '#808080',
    red1: '#ed1c24',
    green1: '#22b573',
    blue1: '#0000ff',
    blue2: '#29abe2',
    blue3: '#5fd6ff',
    pink: '#ff99ff',
    gold: '#ffec14',
    orange: '#ff7f27',
    black: '#000000'
};
let selColor = [palette.blue2, palette.red1, palette.blue1];
//-------------------------------------------------------------
//flags
let selToggle      = [false, false, false];
let showLabels     = [false, false, false];
let showFormulas   = [false, false, false];
let showIncidences = [false, false, false];
let showNormals    = [false, false, false];
let useRealValues  = [false, false, false];
//-------------------------------------------------------------
let room, artifact, observer, grid, mouse;
let mirroredImages = [];
let reflectedImageLine;
let selHovered = false;
let startTime = 0;
let selFocus;
//-------------------------------------------------------------
//images
let ballImg, clownImg, handImg, clickSnd, popSnd, raysSnd;
let triggeredSound = true;
//-------------------------------------------------------------
function setup() {
    createCanvas(820, 720);
    rectMode(CENTER);
    textAlign(CENTER);

    grid = new Grid(createVector(130, 310));
    artifact = new Artifact(createVector(-24, 250));
    observer = new Observer(createVector(-18, -220));
    room = new Room(
        createVector(-roomWidth / 2, +roomHeight), //top left
        createVector(roomWidth / 2, +roomHeight),  //top right
        createVector(roomWidth / 2, -roomHeight),  //bottom right
        createVector(-roomWidth / 2, -roomHeight)  //bottom left
    );
    //uses dist from artifact to walls to determine reflected image positions
    reflectedImageLine = new ReflectedImageLine(3);
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
function resetFlags() {
    selToggle      = [false, false, false];
    showLabels     = [false, false, false];
    showFormulas   = [false, false, false];
    showIncidences = [false, false, false];
    showNormals    = [false, false, false];
    useRealValues  = [false, false, false];
    triggeredSound = false;
}
