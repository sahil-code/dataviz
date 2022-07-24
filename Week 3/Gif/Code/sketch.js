function preload() {
  data = loadJSON("data.json");
  colors = loadJSON("colors.json");
  genreTotals = loadJSON("genrelist.json")
  genreYearly = loadJSON("genrelist.json")
  totalMovies = 3005
}

i = 2800;
timeoutperiod = 0.0005;
stopper = 0

function setup() {
  createCanvas(windowWidth, windowHeight);
  hmargin = 100;
  wmargin = 50;
  rightcolumn = 20;
  printName();
  maxmovt = 1000;
  maxmovy = 100;
  genreList = Object.keys(genreYearly);
  data[3006] = { Year: 9999 }
}

function draw() {
  background(colors.Grey.Light);
  text(i, 25, 25);
  text(data[i].Name, 60, 25);
  text(data[i].Year, 300, 25);

  drawLegend(0, maxmovy);
  drawChart("Stroke", 0, genreYearly, maxmovy);
  drawChart("Fill", 0, genreYearly, maxmovy);

  drawLegend(1, maxmovt);
  drawChart("Stroke", 1, genreTotals, maxmovt);
  drawChart("Fill", 1, genreTotals, maxmovt);
}

function printName() {
  if (stopper == 0) {
    if (data[i].Year != data[i + 1].Year) {
      print("move!")
      n = Math.max(...Object.values(genreYearly));
      conductMovement();
    }
    genreYearly[data[i].Genre] += 1;
    if (i < totalMovies) {
      i += 1;
      setTimeout(printName, timeoutperiod);
    }
    if (i == totalMovies + 1) {
      stopper = 1
    }
  }
}

function conductMovement() {
  for (let g = 0; g < genreList.length; g++) {
    stopper = 1;
    curgen = genreList[g];
    if (genreYearly[curgen] > n) {
      genreYearly[curgen] -= 1;
      genreTotals[curgen] += 1;
      print("doing")
      redraw();
    }
  }
  if (i == totalMovies + 1) {
    noLoop()
  }
  if (n > 0) {
    n--;
    setTimeout(conductMovement, timeoutperiod);
  } else {
    stopper = 0;
    printName();
  }
}

//define useful dimensional variables
function defineDimensions(row) {
  tableW = width - hmargin - rightcolumn;
  tableH = (height - 3 * hmargin) / 2;
  dimx1 = wmargin;
  dimxmid = dimx1 + tableW / 2;
  dimx2 = dimx1 + tableW;

  dimy1 = hmargin + row * (tableH + hmargin);
  dimymid = dimy1 + tableH / 2;
  dimy2 = dimy1 + tableH;
}

//draw horizontal lines, legend
function drawLegend(row, maxMovies) {
  defineDimensions(row);
  push();
  textSize(10);
  strokeWeight(0.5);
  for (let i = 0; i < 5; i++) {
    ypos = map(i, 0, 4, dimy2, dimy1);

    //horizontal lines
    stroke(31, 40, 51);
    line(dimx1, ypos, dimx2, ypos);

    //numbers on left
    stroke(31, 40, 51);
    textAlign(RIGHT, CENTER);
    mapvalue = map(i, 0, 4, 0, maxMovies);
    text(mapvalue, dimx1 - 10, ypos);
  }
  pop();

  //draw number of words
  for (let i = 0; i < genreList.length; i++) {
    push();
    textSize(10);
    fill(colors.Grey.Dark);
    textStyle(ITALIC);
    text(
      genreList[i],
      dimx1 + (tableW * (i + 0.5)) / genreList.length,
      dimy2 + 15
    );
    pop();
  }
}

//draw either stroke or fill of chart
function drawChart(type, row, dataobj, maxMovies) {
  defineDimensions(row);
  beginShape();

  if (type == "Fill") {
    vertex(dimx1 + (tableW * 0.5) / genreList.length, dimy2);
  }

  for (let i = 0; i < genreList.length; i++) {
    barheight = map(dataobj[genreList[i]], 0, maxMovies, dimy2, dimy1);
    vertex(dimx1 + (tableW * (i + 0.5)) / genreList.length, barheight);
  }
  if (type == "Fill") {
    vertex(
      dimx1 + (tableW * (genreList.length - 0.5)) / genreList.length,
      dimy2
    );
  }

  push();
  if (type == "Fill") {
    fill(colors.Grey.Main);
    strokeWeight(0);
  } else if ((type = "Stroke")) {
    noFill();
    stroke(colors.Grey.Dark);
    strokeWeight(2);
  }
  endShape();
  pop();
}
