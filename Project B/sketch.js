let osc;
distance=0
let frequencyInput = document.getElementById("frequency-input");
let amplitudeInput = document.getElementById("amplitude-input");
let playing = false;
let audioContext;    
    //array of important elemts like q holds the electric charge/ q_x/q_y hold corresponding x and y charges - 1 is empty but it will hold the lines 
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

    let recorder; // declare recorder variable

    // add event listener to detect key presses

    document.addEventListener('keydown', function(event) {
      if (event.keyCode === 52) { // check if "4" key is pressed
        startRecording();
      } else if (event.keyCode === 57) { // check if "9" key is pressed
        stopRecording();
      }
    });
    // function to start screen recording
    function startRecording() {
      navigator.mediaDevices.getDisplayMedia({video: true, audio: true})
        .then(function(stream) {
          recorder = new MediaRecorder(stream);
          recorder.start();
        });
    }
    // function to stop screen recording and save the video data
    function stopRecording() {
      recorder.stop();
      recorder.ondataavailable = function(event) {
        // create a new blob with recorded video data
        let videoBlob = new Blob([event.data], {type: 'video/webm'});
        let videoUrl = URL.createObjectURL(videoBlob); //// create a link element
        let link = document.createElement('a');
        link.href = videoUrl;
        link.download = 'recording.webm'; //// set the filename for the downloaded video
        link.click();
      };
    }
    




function setup(){
  let canvas=createCanvas(windowWidth,windowHeight);
  canvas.parent=("canvasContainer");
  q_x = [width/2];
  q_y = [height/2];
  ellipseMode(RADIUS);
  initiate_l();
  background("black");

  audioContext = new AudioContext();
  osc = audioContext.createOscillator();
  osc.type = 'sine';
  osc.connect(audioContext.destination);

  osc = new p5.Oscillator();
  osc.setType('sine');
  //initial_lines();
}

function draw(){
    if (keyIsDown(51)) { // if key 3 is pressed
      saveCanvas('myCanvas', 'png'); // save canvas image as PNG file
    }
      
  
  
  stroke(255);
  if (counter < iterations){
    update_l();
    counter++;
    show_charges();
  } else {
    console.log("Done");
  }
  //text('Click to play sound', width/2, height/2);

}

//  It adds a new charge to the q, q_x, and q_y arrays and restarts the simulation. If the sound is not currently playing, it sets the frequency and amplitude of the oscillator and starts it.
function mousePressed() {
  q.push(charge);
  q_x.push(mouseX);
  q_y.push(mouseY);
  restart();

  if (!playing) {
    let freq = frequencyInput.value;
    let amp = amplitudeInput.value;
    osc.frequency.value = freq;
    osc.gain.value = amp;
    osc.start();
    playing = true;
  }
}
function mouseReleased() {
  if (playing) {
    osc.stop();
    playing = false;
  }
}
function mouseClicked() {
  if (!playing) {
    osc.start();
    playing = true;
  } else {
    osc.stop();
    playing = false;
  }
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



// Check if two line segments intersect
function intersect(a, b, c, d) {
  let x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
  let x3 = c[0], y3 = c[1], x4 = d[0], y4 = d[1];
  let ua = ((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/((y4-y3)*(x2-x1)-(x4-x3)*(y2-y1));
  let ub = ((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/((y4-y3)*(x2-x1)-(x4-x3)*(y2-y1));
    return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
  }


// Itremoves any line segments that are too close to each other. It does this by iterating through each line segment and comparing its length to a predefined threshold. If the length is less than the threshold, the line segment is removed. This function helps to reduce visual clutter and improves the readability of the simulation.
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

//function initializes l array with lines number of lines for each electric charge. It does this by iterating through each electric charge, and for each charge, it generates lines number of line segments around it that extend outward. The joining_lines() function is then called to connect the line segments, which creates a visual representation of the electric field around the charges.
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

function keyPressed() {
  if (keyCode === 48) { // stop sound when key "0" is pressed
    osc.stop();
    playing = false;
  } else if (keyCode === 50) { // reset sketch to initial state when key "2" is pressed
    q = [2];
    q_x = [100];
    q_y = [100];
    l = [];
    lines = 150;
    iterations = 2000;
    counter = 3;
    r1 = 0;
    g1 = 255;
    b1 = 255;
    r2 = 255;
    g2 = 255;
    b2 = 0;
    charge = 1;
    restart();
    if (playing) {
      osc.stop();
      playing = false;
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