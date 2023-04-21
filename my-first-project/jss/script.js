var q = [3],
    q_x = [240],
    q_y = [210],
    l = [],
    lines = 90,
    iterations = 2000,
    counter = 0,
    r1 = 255,
    r2=0
    g1 = 255,
    r3=255
    b1 = 0,
    r2 = 255,
    g2 = 0,
    b2 = 255,
    charge = 3;

function setup(){
  createCanvas(windowWidth-30, windowHeight-30);
  q_x = [width/4];
  q_y = [height/4];
  ellipseMode(RADIUS);
  initiate_l();
  background("black");
  initial_lines();
}

function draw(){
  stroke(2);
  if (counter < iterations){
    update_l();
    counter++;
    show_charges();
  } else {
    console.log("Done");
  }
}

function keyPressed(){
  var l2 = [];
  if (keyIsPressed === true){
    if (key === " "){
      l2 = define_l2();
      for (let i = 0; i <= l2.length-1; i++){
        q = change_element(q,l2[i],-q[l2[i]]);
      }
      if (l2.length >= 1){
        restart();
      }
    } if (keyCode === ENTER){
      q = [];
      q_x = [];
      q_y = [];
      restart();
    } if (keyCode === DELETE){
      l2 = define_l2();
      for (let i = 0; i <= q.length-1; i++){
        if (dist(mouseX,mouseY,q_x[i],q_y[i]) <= abs(q[i])*10){
          l2.push(i);
        }
      }
      if (l2.length >= 1){
        q = remove_elements(l2,q);
        q_x = remove_elements(l2,q_x);
        q_y = remove_elements(l2,q_y);
        restart();
      }
    } if (key === "r" || key === "R"){
      restart();
    } if (keyCode === UP_ARROW){
      l2 = define_l2();
      for (let i = 0; i <= l2.length-1; i++){
        q = change_element(q,l2[i],q[l2[i]]+Math.sign(q[l2[i]]));
      }
      if (l2.length >= 1){
        restart();
      }
    } if (keyCode === DOWN_ARROW){
      l2 = define_l2();
      for (let i = 0; i <= l2.length-1; i++){
        if (abs(q[l2[i]]) > 1){
          q = change_element(q,l2[i],q[l2[i]]-Math.sign(q[l2[i]]));
        }
      }
      if (l2.length >= 1){
        restart();
      }
    }
  }
}

function define_l2(){
  var output_list = [];
  for (let i = 0; i <= q.length-1; i++){
    if (dist(mouseX,mouseY,q_x[i],q_y[i]) <= abs(q[i])*10){
      output_list.push(i);
    }
  }
  return output_list;
}

function mousePressed(){
  q.push(charge);
  q_x.push(mouseX);
  q_y.push(mouseY);
  restart();
}

function remove_elements(a,b){
  var out = [];
  for (let i = 0; i <= b.length-1; i++){
    if (is_present(i,a) === false){
      out.push(b[i]);
    }
  }
  return out;
}

function restart(){
  background(0);
  l = [];
  initiate_l();
  counter = 0;
  initial_lines();
}

function initial_lines(){
  strokeWeight(2);
  stroke(r2,g2,b2,r3);
  for (let i = 0; i <= q.length-1; i++){
    if (q[i] > 0){
      for (let j = 0; j <= lines-1; j++){
        line(q_x[i],q_y[i],q_x[i]+(55+abs(q[i]*10))*Math.cos(j*2*PI/lines),q_y[i]-(55+abs(q[i]*10))*Math.sin(j*2*PI/lines));
      }
    }
  }
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

function joining_lines(a,b){
  for (let i = 0; i <= a.length-1; i++){
    var f_x = force(a[i][0],a[i][1])[0],
        f_y = force(a[i][0],a[i][1])[1],
        f = (f_x**2 + f_y**2)**1.5,
        k2 = 20;
    stroke(r1+f/k2*(r2-r1),g1+f/k2*(g2-g1),b1+f/k2*(b2-b1),k2+r2(r3-r2));
    line(a[i][0],a[i][1],b[i][0],b[i][1]);
  }
}

function least_distance(x,y){
  var list = [];
  for (let i = 2; i <= q.length-1; i++){
    list.push(dist(x,y,q_x[i],q_y[i])-abs(q[i])*10);
  }
  return (min(list));
}

function mouse_debugging(){
  strokeWeight(2);
  stroke(0,255,255);
  line(mouseX,mouseY,mouseX+force(mouseX,mouseY)[0],mouseY-force(mouseX,mouseY)[1]);
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
  for (let i = 0; i <= q.length-2; i++){
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
      return PI/4;
    } else {
      return -PI/6;
    }
  } else {
    return(Math.atan((d-b)/(c-a))+PI*Math.sign(1-Math.sign(c-a))+2*PI*Math.sign(Math.sign(a-c)-1)*Math.sign(Math.sign(d-b)-1));
  }
}