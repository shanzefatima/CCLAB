let bgColor;
let lineColor;
let circleSize = 10;
let circleMaxSize;
let circleColor1;
let circleColor2;
let eyeCircles = [];
let graphics;
let eyeSize = 30; // variable to track eye circle size

function setup() {
  let canvas=createCanvas(1000,600);
  canvas.parent=("canvasContainer");
  angleMode(DEGREES);
  circleMaxSize = width * 0.7;
  circleColor1 = color(255, 0, 0); 
  circleColor2 = color(255, 255, 0); 
  circleColor3 = color(255,255,255)

  bgColor = color(0);
  lineColor = color("white");

  // Create a graphics object with a different background
  graphics = createGraphics(200, 200);
}

function draw() {
  drawLines();
  drawGradientCircle();
  
  stroke(255);
    strokeWeight(2);
  
  

  // Draw and move all the eye circles
  for (let i = 0; i < eyeCircles.length; i++) {
    moveEyeCircle(eyeCircles[i]);
    drawEyeCircle(eyeCircles[i]);
    
    // Pulsate the eye circles
    eyeSize = 30 + sin(frameCount * 5 + i) * 10;
    //fill(255);
    ellipse(eyeCircles[i].x, eyeCircles[i].y, eyeSize, eyeSize);
    //fill(0);
    ellipse(eyeCircles[i].x, eyeCircles[i].y, eyeSize/3, eyeSize/3);

    // Find the closest triangle vertex to the eye circle
    let closestVertex;
    let closestDistance = Infinity;
    for (let j = 0; j < 10; j++) {
      let angle = frameCount * (j + 0.000001);
      let x = width / 2 + cos(angle) * 80;
      let y = height / 2 + sin(angle) * 80;
      let distance = dist(x, y, eyeCircles[i].x, eyeCircles[i].y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestVertex = { x: x, y: y };
      }
    }

    // Draw a line between the closest vertex and the eye circle
    
    line(closestVertex.x, closestVertex.y, eyeCircles[i].x, eyeCircles[i].y);
  }

  // Draw and rotate all the triangles
  noStroke();
  for (let i = 0; i < 10; i++) {
    push();
    translate(width / 2, height / 2);
    rotate(frameCount * (i + 0.00000000000001));
    //colorMode(HSB, 360, 27, 360);
    triangle(0, -80, -80, 150, 50, 50);
    pop();
  }
  // Save canvas image at frame 600
  //if (frameCount === 600) {
    //saveCanvas("myCanvas_frame100", "jpg");
  //}
}

function drawLines() {
  stroke(lineColor);
  strokeWeight(2);
  for (let i = 0; i < height; i += 50) {
    line(0, i, width, i);
  }
}



function drawGradientCircle() {
  let circleSizeMapped = map(circleSize, 0, circleMaxSize, 0, 1);
  let gradient = drawingContext.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    circleSize
  );
  gradient.addColorStop(0, circleColor1);
  gradient.addColorStop(circleSizeMapped, circleColor2);
  gradient.addColorStop(1, circleColor1);

  drawingContext.fillStyle = gradient;
  noStroke();
  ellipse(width / 2, height / 2, circleSize * 2, circleSize * 2);

  circleSize += 1;
  if (circleSize > circleMaxSize) {
    circleSize = 0;
    circleColor1 = circleColor2;
    circleColor2 = color(random(255), random(255), random(255));
  }
}

function mouseClicked() {
  for (let i = 0; i < 1; i++) {
    eyeCircles.push({ x: mouseX, y: mouseY });
  }
}

function moveEyeCircle(eyeCircle) {
  eyeCircle.x += random(-5, 5);
  eyeCircle.y += random(-5, 5);

  // Wrap the eye circle around the edges of the canvas
  if (eyeCircle.x < 0) {
    eyeCircle.x = width;
  } else if (eyeCircle.x > width) {
    eyeCircle.x = 10;
  }
  if (eyeCircle.y < 0) {
    eyeCircle.y = height;
  } else if (eyeCircle.y > height) {
    eyeCircle.y = 10;
  }
}

function drawEyeCircle(eyeCircle) {
  // Draw an eye-like circle at the given position
  push();
  translate(eyeCircle.x, eyeCircle.y);
  rotate(frameCount);
  fill(255);
  ellipse(0, 0, 30, 30);
  fill(0);
  ellipse(0, 0, 10, 10);
  pop();
}

  
  