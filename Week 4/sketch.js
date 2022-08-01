function preload() {
  colors = loadJSON("colors.json");
  citydata = loadJSON("cityarray.json")
  data = loadJSON("datafile.json")
  playerdata = loadJSON("bowlercount.json")
  indiaOutline = loadImage("2022-08-01-02-30-28.png") 
}

function setup() {
  createCanvas(windowHeight/1.4, windowHeight);
  playerlist = Object.keys(playerdata)
  margin = 40
  lat1 = 7.4
  lat2 = 37.6
  long1 = 68.7
  long2 = 97.25
  textFont("Trebuchet MS");
  
  //image(indiaOutline, 0 , 0, width, height)
  background("White");

  printDots();
  //printNames();

}

function printDots() {
  for(stadiumno in data) {
    stadiumInfo = data[stadiumno]
    cityinfo = citydata[stadiumInfo.city]
    fill(assignColor(stadiumInfo.bowler))
    noStroke();

    xpos = map(cityinfo.longitude, long1, long2, 0, width)
    ypos = map(cityinfo.latitude, lat1, lat2, height, 0)
    arc(xpos, ypos, cityinfo.count * 15 - 5, cityinfo.count * 15 - 5, TWO_PI * cityinfo.curpos / cityinfo.count, TWO_PI * (cityinfo.curpos + 1) / cityinfo.count)
    citydata[stadiumInfo.city].curpos++
  }
}


function printNames() {
  for(i = 0; i < 5; i++) {
    fill(assignColor(playerlist[i]))
    textSize(16)
    text(playerlist[i], width/2, margin + i * 20)
    print(playerlist[i])
  }
  fill(colors.Grey.MainFullOpa)
  text("Other", width/2, margin + 5 * 20)
}

function assignColor(player) {
  playerpos = playerlist.indexOf(player)
  if (playerpos == 0) {
    return colors.Blue.MainFullOpa
  }
  if (playerpos == 1) {
    return colors.Red.MainFullOpa
  }
  if (playerpos == 2) {
    return colors.Green.MainFullOpa
  }
  if (playerpos == 3) {
    return colors.Yellow.MainFullOpa
  }
  if (playerpos == 4) {
    return colors.Purple.MainFullOpa
  }
  else {
    return colors.Grey.MainFullOpa
  }

}

function draw() {
}
