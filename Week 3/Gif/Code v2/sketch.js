function preload() {
  data = loadJSON("data.json");
  colors = loadJSON("colors.json");
  genreTotals = loadJSON("genrelist.json")
  genreYearly = loadJSON("genrelist2.json")
  totalMovies = 3005
}

i = 0;
timeoutperiod = 0.0005;
stopper = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  hmargin = 100;
  wmargin = 50;
  rightcolumn = 20;
  textAlign(CENTER, CENTER);
  textFont("Trebuchet MS");
  maxy = 100;
  genreList = Object.keys(genreYearly);
  data[3006] = { Year: 9999 }
  colorlist = ["Blue", "Red", "Yellow", "Green", "Purple"];
  curfinalyear = 2000
  iterateMovie();
}

function draw() {
  background(colors.Grey.Light);
  text(data[i].Name, width / 2, 25);

  drawLegend(0, maxy);
  drawLegend(1, 100);

  push();
  curcolor = colorlist[(data[i - 1].Year % 5)];
  fill(colors[curcolor].Dark);
  textSize(24);
  drawChart(0, genreYearly, maxy, curcolor);


  fill(colors.Grey.Dark)
  for (let y = data[i].Year; y >= data[0].Year; y--) {
    percentilegraph(1, genreTotals[y], colorlist[y % 5]);
  }
  text(`Genre for ${data[0].Year} to ${curfinalyear}`, dimxmid, dimy2 + 50)

  strokeWeight(2)
  line(dimx1 + (tableW * 0.5 / genreList.length), dimy1, wdist - tableW / genreList.length, dimy1)
  textSize(24)
  text(data[i].Year, width / 2, dimy1 - 25)
  pop()


  makeCredit()
}

function percentilegraph(row, dataobj, colorname) {

  push()
  defineDimensions(row);
  beginShape();

  wdist = dimx1 + (tableW * 0.5 / genreList.length)
  vertex(wdist, dimy2);

  for (var curgenre of genreList) {
    barheight = map(dataobj[curgenre], 0, genreTotals[curfinalyear][curgenre], dimy2, dimy1);
    vertex(wdist, barheight);
    wdist += tableW / genreList.length
  }
  vertex(wdist - tableW / genreList.length, dimy2);

  fill(colors[colorname].MainFullOpa);
  strokeWeight(0);
  endShape();
  pop();
}

//iterate through the movielist by calling itself until i exceeds total
function iterateMovie() {
  if (stopper == 0) {
    if (data[i].Year != data[i + 1].Year) {
      print("move!")
      n = Math.max(...Object.values(genreYearly));
      curyear = data[i].Year
      curfinalyear = curyear
      if (curyear != data[0].Year) {
        genreTotals[curyear] = Object.assign({}, genreTotals[curyear - 1])
        print("changing", genreTotals[curyear - 1], genreTotals[curyear])
      }
      conductMovement();
    }
    genreYearly[data[i].Genre] += 1;
    if (i < totalMovies) {
      i += 1;
      setTimeout(iterateMovie, timeoutperiod);
    }
    if (i == totalMovies + 1) {
      stopper = 1
    }
  }
}

//activated every time year changes, to move from yearly data to annual
function conductMovement() {
  for (let g = 0; g < genreList.length; g++) {
    stopper = 1;
    curgen = genreList[g];
    if (genreYearly[curgen] > n) {
      genreYearly[curgen] -= 1;
      genreTotals[curyear][curgen] += 1;
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
    iterateMovie();
  }
}

//define useful dimensional variables
function defineDimensions(row) {
  tableW = width - hmargin - rightcolumn;
  tableH = (height - 2 * hmargin) / 2;
  dimx1 = wmargin;
  dimxmid = dimx1 + tableW / 2;
  dimx2 = dimx1 + tableW;

  dimy1 = hmargin + row * (tableH);
  dimymid = dimy1 + tableH / 2;
  dimy2 = dimy1 + tableH;
}

//draw horizontal lines, legend
function drawLegend(row, maxMovies) {
  defineDimensions(row);
  push();
  if (row == 0) {
    textSize(10);
    strokeWeight(0.5);
    stroke(31, 40, 51);
    for (let i = 1; i < 5; i++) {
      ypos = map(i, 0, 4, dimy2, dimy1);

      //horizontal lines
      line(dimx1, ypos, dimx2, ypos);

      //numbers on left
      textAlign(RIGHT, CENTER);
      mapvalue = map(i, 0, 4, 0, maxMovies);
      text(mapvalue, dimx1 - 10, ypos);
    }
  }

  if (row == 1) {
    //draw number of words
    for (let i = 0; i < genreList.length; i++) {
      textSize(10);
      fill(colors.Grey.Dark);
      textStyle(ITALIC);
      text(
        genreList[i],
        dimx1 + (tableW * (i + 0.5)) / genreList.length,
        dimy2 + 15
      );
    }
  }
  pop();
}

//draw either stroke or fill of each chart
function drawChart(row, dataobj, maxMovies, colorname) {
  push()
  defineDimensions(row);
  beginShape();

  vertex(dimx1 + (tableW * 0.5) / genreList.length, dimy2);

  for (let i = 0; i < genreList.length; i++) {
    barheight = map(dataobj[genreList[i]], 0, maxMovies, dimy2, dimy1);
    vertex(dimx1 + (tableW * (i + 0.5)) / genreList.length, barheight);
  }
  vertex(dimx1 + (tableW * (genreList.length - 0.5)) / genreList.length, dimy2);

  fill(colors[colorname].MainFullOpa);
  strokeWeight(0);
  endShape();
  pop();
}

//draw the credit lines
function makeCredit() {
  push();
  noStroke();
  fill(0);
  textSize(10);
  textAlign(LEFT);
  fill(colors.Grey.Dark);
  text(
    "Data Source: Bollywood Movies on Kaggle / IMDB",
    wmargin,
    height - hmargin / 3
  );
  text(
    "Created by Sahil Agarwal using p5.js for IIP-Dataviz Week 3",
    wmargin,
    height - hmargin / 3 + 15
  );
  pop();
}