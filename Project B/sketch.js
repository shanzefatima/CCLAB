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

function setup(){
  createCanvas(windowWidth-1, windowHeight-1);
  q_x = [width/2];
  q_y = [height/2];
  ellipseMode(RADIUS);
  initiate_l();
  background("black");
  //initial_lines();
}

function draw(){
  stroke(255);
  if (counter < iterations){
    update_l();
    counter++;
    show_charges();
  } else {
    console.log("Done");
  }
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