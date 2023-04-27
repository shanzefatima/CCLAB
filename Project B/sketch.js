//array of important elemts like q holds the electric charge/ q_x/q_y hold corresponding x and y charges - 1 is empty but it will hold the lines 
let osc;
let tempoSlider;
let playing = false;
let saveButton;
let instagramButton;
let snapchatButton;
var q = [2],
q_x = [100],
q_y = [100],
l = [],
lines = 150, //number of lines in every electric charge 
iterations = 2000,//number of simulations before it stops 
counter = 3, 
r1 = 0, //color combination 
g1 = 255,
b1 = 255,
r2 = 255,
g2 = 255,
b2 = 0,
charge = 1;
let freq = 440; // default frequency of oscillator
let amp = 0.5; // default amplitude of oscillator

tempoSlider = createSlider(60, 180, 120);
tempoSlider.position(x, y - buttonHeight - buttonMargin);
tempoSlider.style('width', `${buttonWidth}px`);

function setup() {
  let canvas = createCanvas(windowWidth-1, windowHeight-1);
  canvas.parent("canvasContainer");
  q_x = [width/2];
  q_y = [height/2];
  ellipseMode(RADIUS);
   initiate_l();
  background("black");
//initial_lines();

textAlign(CENTER);
textSize(20);

osc = new p5.Oscillator();
osc.setType('sine');

// Add a "save" button
saveButton = createButton('Save Beat');
saveButton.mousePressed(saveBeat);

}

function draw() {
stroke(255);
if (counter < iterations){
update_l();
counter++;
show_charges();
} else {
console.log("Done");
}

}

function keyPressed() {
  if (key == "0") {
    translate(0, 0);
  } else if (key == "2") {
    showGuide = !showGuide;
  }
}

class Line {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = 0;
      this.y = random(0, height);
      this.color = color(random(255), random(255), random(255));
    }
  }

  display() {
    stroke(this.color);
    line(this.x, this.y, this.x + 50, this.y);
  }
}

function togglePlay() {
  let button = document.getElementById("playButton");
  if (!playing) {
    osc.start();
    playing = true;
    osc.setType('sine');
    button.innerHTML = "Stop";
  } else {
    osc.stop();
    playing = false;
    button.innerHTML = "Play";
  }
}




function mouseClicked() {
  // Change the oscillator waveform type
  if (!playing) {
    osc.start();
    playing = true;
    osc.setType('sine');
  } else {
    osc.stop();
    playing = false;
  }

  // Change the beat tempo based on the mouse position
  let tempo = map(mouseX, 0, width, 60, 180);
  beatLength = 60 / tempo * 1000;

  // Change the oscillator frequency and amplitude based on the mouse position
  let freq = map(mouseY, height, 0, 100, 1000);
  let amp = map(mouseX, 0, width, 0.1, 1);
  osc.freq(freq);
  osc.amp(amp);
}

function mouseMoved() {
  let freq = map(mouseX, 0, width, 100, 1000);
  osc.freq(freq);

  let amp = map(mouseY, 0, height, 1, 0.1);
  osc.amp(amp);
}


function mousePressed(){
q.push(charge);
q_x.push(mouseX);
q_y.push(mouseY);
restart();
}


function restart(){
background(0);
l = [];
initiate_l();
counter = 0;
//initial_lines();
}

function update_l(){
var output = [];
for (let i = 0; i <= l.length-1; i++){
var nx = l[i][0]+force(l[i][0],l[i][1])[0],
    ny = l[i][1]-force(l[i][0],l[i][1])[1];
output.push([nx,ny]);
}
joining_lines(l,output);
l = output;
filter_();
}

function filter_(){
var output2 = [];
for (let i = 0; i <= l.length-1; i++){
if (least_distance(l[i][0],l[i][1]) >= 70){
  output2.push(l[i]);
}
}
l = output2
}



function least_distance(x,y){
var list = [];
for (let i = 0; i <= q.length-1; i++){
list.push(dist(x,y,q_x[i],q_y[i])-abs(q[i])*10);
}
return (min(list));
}

function joining_lines(a,b){
for (let i = 0; i <= a.length-1; i++){
var f_x = force(a[i][0],a[i][1])[0],
    f_y = force(a[i][0],a[i][1])[1],
    f = (f_x**2 + f_y**2)**0.5,
    k2 = 20;
stroke(r1+f/k2*(r2-r1),g1+f/k2*(g2-g1),b1+f/k2*(b2-b1));
line(a[i][0],a[i][1],b[i][0],b[i][1]);
}
}



function show_charges(){
noStroke();
for (let i = 0; i <= q.length-1; i++){
if (q[i] > 0){
  fill(255,0,0);
} else {
  fill(0,0,255);
}
ellipse(q_x[i],q_y[i],abs(q[i])*10);
}
}

function force(x,y){
var f_eq_x = 0,
  f_eq_y = 0;
for (let i = 0; i <= q.length-1; i++){
var qx = q_x[i],
    qy = q_y[i],
    qm = abs(q[i]),
    d = dist(x,y,qx,qy),
    k = 150000
    f_mag = k*qm/(d**2),
    f_dir = direction(qx,qy,x,y),
    f_x = f_mag*Math.cos(f_dir)*Math.sign(q[i]),
    f_y = -f_mag*Math.sin(f_dir)*Math.sign(q[i]);
f_eq_x += f_x;
f_eq_y += f_y;
}
return ([f_eq_x, f_eq_y]);
}

function initiate_l(){
for (let i = 0; i <= q.length-1; i++){
if (q[i] > 0){
  for (let j = 0; j <= lines-1; j++){
    l.push([q_x[i]+(55+abs(q[i]*10))*Math.cos(j*2*PI/lines),q_y[i]-(55+abs(q[i]*10))*Math.sin(j*2*PI/lines)]);
  }
}
}
}

function change_element(a,b,c){ //changes the b'th index element of a list a, with c
var out = [];
for (let i = 0; i <= a.length-1; i++){
if  (i === b){
  out.push (c);
} else {
  out.push(a[i]);
}
}
return out;
}

function is_present(a,b){
for (let i = 0; i <= b.length-1; i++){
if (b[i] === a){
  return true;
} else {
  return false;
}
}
}



function direction(a,b,c,d){ //gives the angle from point (a,b) to the point (c,d)
if (a === c){
if (b < d){
  return PI/12;
} else {
  return -PI/8;
}
} else {
return(Math.atan((d-b)/(c-a))+PI*Math.sign(1-Math.sign(c-a))+2*PI*Math.sign(Math.sign(a-c)-1)*Math.sign(Math.sign(d-b)-1));
}
}
