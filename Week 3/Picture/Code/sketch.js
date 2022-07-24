//create bar charts showing increment in property per word in title

function preload() {
  data = loadJSON("data.json");
  colors = loadJSON("colors.json");
  pdatafile = loadJSON("property-data.json");
  posterlong = loadImage("posterlong.jpg");
  postershort = loadImage("postershort.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  showTitle = 1;
  genres = Object.keys(pdatafile);

  //defining design elements
  wmargin = 30;
  hmargin = 75;
  textAlign(CENTER, CENTER);
  textFont("Trebuchet MS");
}

function draw() {
  background(colors.Grey.Light);

  makeTables();
  makeSubtitle();
  makeCredit();
}

function makeTables() {
    //find tables in use based on the buttons currently pressed
  TablesInUse =
    Object.values(pdatafile).filter((p) => p.inUse == 1).length + showTitle;
  
  //define columns and rows based on no of tables
  totalColumns = ceil(Math.sqrt(TablesInUse));
  totalRows = ceil(TablesInUse / totalColumns);
  tableNo = 0;
  
  //print title
  if (showTitle == 1) {
    makeTitle(0, 0);
    tableNo += 1;
  }
  else {
    drawButton("Title", width / 2, height - hmargin / 3);
  }

  //print each chart and button
  wstaggerbutton = 0;
  for (let i = 0; i < genres.length; i++) {
    
    //print button
    drawButton(genres[i], wmargin + wstaggerbutton, hmargin - 50);
    wstaggerbutton += width / genres.length;

    //print chart
    if (pdatafile[genres[i]].inUse == 1) {
      rowno = floor(tableNo / totalColumns);
      columnno = tableNo % totalColumns;
      makeTable(genres[i], rowno, columnno);
      tableNo += 1;
    }
  }
}

//draw a chart based on property
function makeTable(prop, row, column) {
  defineDimensions(row, column);
  pdata = pdatafile[prop];

  drawLegend(prop);
  drawChart("Fill", prop);
  drawChart("Stroke", prop);
  drawBottomtext(prop);
}

//draw the project title
function makeTitle(row, column) {
  defineDimensions(row, column);

  push();
  translate(dimx1, dimy1);
  hstagger = 0;
  wstagger = (tableW - 350) / 2;

  textAlign(LEFT);
  fill(colors.Grey.Dark);
  textSize(32);
  textStyle(BOLD);
  hstagger += 32;
  textWrap(WORD);
  text("How Much Does a Word Cost?", wstagger, hstagger, 350);
  hstagger += 56;

  textSize(12);
  textStyle(ITALIC);
  text(
    "(why it should've been Prem Ratan Dhan Payo instead)",
    wstagger,
    hstagger
  );

  //line to cross out "Dhan Payo"
  strokeWeight(2);
  line(
    textWidth("(why it should've been Prem Ratan ") + wstagger,
    hstagger,
    textWidth("(why it should've been Prem Ratan Dhan Payo") + wstagger,
    hstagger
  );
  hstagger += 25;

  //calculation for posters to center and take up remaining space
  textSize(48);
  textStyle(BOLD);
  balarea = tableH - hstagger + hmargin - 15;
  if (balarea / 0.7 + textWidth(" >  ?") > tableW) {
    balarea = (tableW - textWidth(" >  ?")) * 0.7;
  }
  wstagger = (tableW - (balarea / 0.7 + textWidth(" >  ?"))) / 2;
  image(postershort, wstagger, hstagger, balarea / 1.4, balarea);
  wstagger += balarea / 1.4;
  text(" > ", wstagger, hstagger + balarea / 2);
  wstagger += textWidth(" > ");
  image(posterlong, wstagger, hstagger, balarea / 1.4, balarea);
  wstagger += balarea / 1.4;
  text(" ?", wstagger, hstagger + balarea / 2);
  pop();

  push();
  textSize(14);
  textStyle(BOLD);
  text("CLICK BUTTONS TO TOGGLE", width / 2, hmargin - 20);
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

//draw the subtitle
function makeSubtitle() {
  push();
  noStroke();
  fill(0);
  textSize(12);
  textAlign(RIGHT);
  textStyle(BOLD);
  fill(colors.Grey.Dark);
  text(
    "incremental value of number of words in a movie's title",
    width - wmargin,
    height - hmargin / 3
  );
  pop();
}

//define useful dimensional variables
function defineDimensions(row, column) {
  tableW = (width - (2 * totalColumns + 1) * wmargin) / totalColumns;
  tableH = (height - (totalRows + 1) * hmargin) / totalRows;
  dimx1 = 2 * wmargin + column * (tableW + 2 * wmargin);
  dimxmid = dimx1 + tableW / 2;
  dimx2 = dimx1 + tableW;

  dimy1 = hmargin + row * (tableH + hmargin);
  dimymid = dimy1 + tableH / 2;
  dimy2 = dimy1 + tableH;
}

//draw horizontal lines, legend
function drawLegend(prop) {
  push();
  textSize(10);
  strokeWeight(0.5);
  for (i = 0; i < 5; i++) {
    ypos = map(i, 0, 4, dimy1, dimy2);

    //horizontal lines
    stroke(colors[pdata.Color].Dark);
    line(dimx1, ypos, dimx2, ypos);

    //numbers on right
    stroke(colors[pdata.Color].Light);
    textAlign(RIGHT, CENTER);
    mapvalue = map(i, 0, 4, pdata.MaxVal, -pdata.MaxVal) + pdata.Unit;
    if (i < 2) {
      text("+" + mapvalue, dimx1 - 5, ypos);
    } else if (i == 2) {
      push();
      textSize(10);
      textStyle(BOLD);
      text(data[0][prop] + pdata.Unit, dimx1 - 5, ypos);
      pop();
    } else {
      text(mapvalue, dimx1 - 5, ypos);
    }
  }
  pop();

  //draw number of words
  for (i = 0; i < 6; i++) {
    push();
    textSize(10);
    fill(colors[pdata.Color].Dark);
    textStyle(ITALIC);
    text(i + 1, dimx1 + (tableW * (i + 0.5)) / 6, dimymid + 7.5);
    pop();
  }
}

//draw either stroke or fill of chart
function drawChart(type, prop) {
  beginShape();
  for (i = 0; i < 6; i++) {
    propincrement = round(data[i][prop] - data[0][prop], 2);
    barheight = map(propincrement, 0, pdata.MaxVal, dimymid, dimy1);
    vertex(dimx1 + (tableW * (i + 0.5)) / 6, barheight);
  }
  if (type == "Fill") {
    vertex(dimx1 + (tableW * 5.5) / 6, dimymid);
  }

  push();
  if (type == "Fill") {
    fill(colors[pdata.Color].Main);
    strokeWeight(0);
  } else if ((type = "Stroke")) {
    noFill();
    stroke(colors[pdata.Color].Dark);
    strokeWeight(2);
  }
  endShape();
  pop();
}

//draw title of chart on the bottom
function drawBottomtext(prop) {
  push();
  fill(colors[pdata.Color].Dark);
  textSize(18);
  textStyle(BOLD);
  text(prop, dimxmid, dimy2 + 18);
  pop();
}

function drawButton(prop, w, h) {
  button = createButton(prop);
  
  if (prop == "Title") {
    buttoncolor = 200
    textcolor = 50
  }
  else {
    buttoncolor = colors[pdatafile[prop].Color].Light
    textcolor = colors[pdatafile[prop].Color].Dark
    if(pdatafile[prop].inUse == 1) {
      button.style("transform: scale(0.95)")
    }
    else{
      button.style("transform: scale(1)")
    }
  }

  button.style("background-color", color(buttoncolor));
  button.style("color", color(textcolor));
  button.style("border-style: Light");
  button.style("font-family: Trebuchet MS")
  button.position(w, h);
  button.mousePressed(() => {
    changeInUse(prop);
  });
}

function changeInUse(prop) {
  if (prop == "Title") {
    showTitle = 1;
    redraw();
  } else {
    pdatafile[prop].inUse = pdatafile[prop].inUse ? 0 : 1;
    showTitle = 0;
    redraw();
  }
}
