// sketches/dynamicCircle.js
export default function sketch(p) {
	// Thanks to Matt Gadient for compiling the hex color values for the default mac terminal color schemes:
	// https://mattgadient.com/once-again-macos-themes-for-the-windows-terminal/
	
	let aShader;
	let pw,s,n,cs,quads,attributes;
	let colorschemes, colorscheme;
	let hash = "0x2e19578058f73d66340423b269d6677882e87c771ef46a6ef04ff76eb8ddf574";
	
	const basic = {
	  name: "Basic",
	  background: "#FFFFFF",
	  foreground: "#000000",
	  selectionBackground: "#A5CDFF",
	  cursorColor : "#7F7F7F"
	}
	
	const grass = {
	  name: "Grass",
	  background: "#13773D",
	  foreground: "#FFF0A5",
	  selectionBackground: "#B64926",
	  cursorColor : "#8E2800"
	}
	
	const homebrew = {
	  name: "Homebrew",
	  background: "#000000",
	  foreground: "#28FE14",
	  selectionBackground: "#0900E9",
	  cursorColor : "#38FE27"
	}
	
	const manpage = {
	  name: "Man Page",
	  background: "#FEF49C",
	  foreground: "#000000",
	  selectionBackground: "#BFB875",
	  cursorColor : "#7F7F7F"
	}
	
	const novel = {
	  name: "Novel",
	  background: "#DFDBC3",
	  foreground: "#3B2322",
	  selectionBackground: "#747350",
	  cursorColor : "#3A2322"
	}
	
	const ocean = {
	  name: "Ocean",
	  background: "#224FBC",
	  foreground: "#FFFFFF",
	  selectionBackground: "#216DFF",
	  cursorColor : "#7F7F7F"
	}
	
	const pro = {
	  name: "Pro",
	  background: "#2b3238", // to emulate transparency
	  foreground: "#F2F2F2",
	  selectionBackground: "#414141",
	  cursorColor : "#4D4D4D"
	}
	
	const redsands = {
	  name: "Red Sands",
	  background: "#7A251E",
	  foreground: "#D7C9A7",
	  selectionBackground: "#3D1916",
	  cursorColor : "#FFFFFF"
	}
	
	const silveraerogel = {
	  name: "Silver Aerogel",
	  background: "#7F7F7F",
	  foreground: "#000000",
	  selectionBackground: "#65668A",
	  cursorColor : "#D9D9D9"
	}
	
	const blackwhite = {
	  name: "Black and White",
	  background: "#000000",
	  foreground: "#FFFFFF",
	  selectionBackground: "#000000",
	  cursorColor : "#FFFFFF"
	}
	
	function hex2rgb(hex) {
	  let c = color(hex);
	  return [red(c)/255,green(c)/255,blue(c)/255];
	}
	
	function randomHash() {
	  let hash = "";
	  for(var i=0; i<64; i++) {
		hash += hex(floor(random(16)),1);
	  }
	  return hash;
	}
	
	function getSeed(number) {
	  // pw can be 8 to 150, integer even
	  // we discretize as (4 to 75) * 2
	  let pw = floor(number % (75-4) + 4) * 2;
	  number = floor(number/(75-4));
	  
	  // s can be 2 to 1e6, float
	  let s = number % (1e6 - 2) + 2;
	  number = floor(number/(1e6 - 2));
	  
	  // n can be 0.1 to 10, float
	  // we discretize as (1 to 100)/10
	  let n = floor(number % (100-1) + 1) / 10;
	  number = floor(number/(100-1));
	  
	  // cs can be 0 to 8, integer inclusive
	  let cs = floor(number % 9);
	  number = floor(number/9);
	  
	  // quads can be 0 to 2, integer inclusive
	  let quads = floor(number % 3);
	  number = floor(number/3);
	  
	  return [pw,s,n,cs,quads];
	}
	
	function mouseClicked() {
	  let filename = "pw"+String(pw)+"s"+String(s)+"n"+String(n)+"cs"+String(cs)+"quads"+String(quads);
	  saveCanvas(filename + ".png");
	  let writer = createWriter(filename + ".txt");
	  writer.write(JSON.stringify(attributes));
	  writer.close();
	}
	
	
	
	// ------------ Main --------------
	
	
	
	function preload() {
	  aShader = loadShader('assets/shader.vert', 'assets/shader.frag');
	}
	
	function setup() {
	  createCanvas(512, 512, WEBGL);
	  shader(aShader);
	  colorschemes = [basic, grass, homebrew, manpage, novel, ocean, pro, redsands, silveraerogel];
	  //hash = randomHash(); // generator for testing... comment or replace as needed
	  
	  // setting manually:
	//   let pw = floor(random(25,100));
	//   let s = random(1,10e6); 
	//   let n = random(0.1,10);
	//   let quads = random([0,1,2]);
	//   let colorscheme = random([basic, grass, homebrew, manpage, novel, ocean, pro, redsands, silveraerogel]);
	  
	  // setting from hash:
	  [pw,s,n,cs,quads] = getSeed(unhex(hash.substring(2)));
	  colorscheme = colorschemes[cs];
	  
	  // sets about 5% to black and white
	  if(floor(n*2)/2 == cs) {
		colorscheme = blackwhite;
	  }
	  
	  attributes = {
		attributes: [
		{trait_type: "Pixels", value:pw},
		{trait_type: "s", value:s},
		{trait_type: "n", value:n},
		{trait_type: "Colorscheme", value:colorscheme.name},
		{trait_type: "Quadrants", value:pow(2,quads)},
		]
	  }
	  print(JSON.stringify(attributes));
	  
	  // print("pixels = " + pw);
	  // print("s = " + s);
	  // print("n = " + n);
	  // print("colorscheme = " + colorscheme.name);
	  // print("quadrants = " + pow(2,quads));  
	}
	
	function draw() {
	  
	  noLoop();
	  
	  aShader.setUniform('uResolution', [width, height]);
	  aShader.setUniform('s', s);
	  aShader.setUniform('n', n);
	  aShader.setUniform('d', width/pw);
	  aShader.setUniform('quads', quads);
	  aShader.setUniform('col0', hex2rgb(colorscheme.background));
	  aShader.setUniform('col1', hex2rgb(colorscheme.foreground));
	  aShader.setUniform('col2', hex2rgb(colorscheme.selectionBackground));
	  aShader.setUniform('col3', hex2rgb(colorscheme.cursorColor));
	
	  rect(0,0,width,height);
	  
	}

}
