let invert = false;

Ratio = 0.82;

P = [
  [
    "gP$",
    "gP#",

    "g*Z",
    "g*2",

    "g\"t",
    "g\"i",
    ",\"/",

    ",\"/",
    ",\";",
    ",\">",

    ".':",
    ".',",
    ".'-",

    "_`.",
    "_``",
    "_` ",
  ],
  [
    "@@@",
    "%%%",
    "###",
    "***",
    "+++",
    "===",
    ":::",
    "---",
    "...",
    "   "
  ],
  [
    "gP#",
    ",\"t",
    ",\"+",
    "_`-",
    "   "
  ],
  [
    "###",
    "   "
  ],
];

R = a => (a - d) * 255 / (255 - d - (255 - b));

function dither(x, y, v, sh) {
  n = R(v) / 255;
  if(sh){
    n = Math.pow(n, 2 / 3);
    n = (n+64/255)*(255-64)/255;
  }
  let mat = [
    [1, 33, 13, 45, 3, 35, 15, 47],
    [59, 17, 49, 25, 57, 19, 51, 27],
    [9, 41, 5, 37, 11, 43, 7, 39],
    [55, 29, 61, 21, 53, 31, 63, 23],

    [4, 36, 16, 48, 2, 34, 14, 46],
    [58, 20, 52, 28, 60, 18, 50, 26],
    [12, 44, 8, 40, 10, 42, 6, 38],
    [54, 32, 64, 24, 56, 30, 62, 22],
  ];
  if(n > (mat[x % 8][y % 8]-0.5) / 64) {
    return 1;
  }
  return 0;
};

let brail = "⠠⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿";

C = P[0];

let Brail = false;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/ /g, "&nbsp;")
    .replace(/\n/g, "<br>");
}
p = a => new Promise((r) => { setTimeout(r, 1e3) });
D = a => document.getElementById(a);

let defaultUrl = { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png', size: 200, ratio: 1, type:"5" };

function setUrl() {
  if(!history.pushState) { return; }
  let qs = '?';
  let first = true;
  for(let el in defaultUrl) {
    let element = document.getElementById(el);
    if(element.value != defaultUrl[el]) {
      if(!first) { qs += '&'; }
      first = false;
      qs += el + '=' + encodeURIComponent(element.value);
    }
  }
  let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + qs;
  window.history.pushState({ path: newurl }, '', newurl);
}

function drawBrail(w, h, a) {
  let t = '';
  for(i = 0; i < h - 2; i += 4) {
    for(j = 0; j < w - 1; j += 2) {
      let bin = '';
      bin += dither(j + 1, i + 3, a[((i + 3) * (w >> 0) + j + 1) * 4], true) ? 0 : 1;
      bin += dither(j, i + 3, a[((i + 3) * (w >> 0) + j + 1) * 4], true) ? 0 : 1;
      for(let bx = 1; bx >= 0; bx--) {
        for(let by = 2; by >= 0; by--) {
          bin += dither(j + bx, i + by, a[((i + by) * (w >> 0) + j + bx) * 4], true) ? 0 : 01;
        }
      }
      t += brail[parseInt(bin, 2)];
    }
    t += '\n';
  }
  return t;
}

function floyd(colorDepth, tempData, width, height) {
  let ans=tempData.slice();

  let maxV = colorDepth / 255;

  let mem = [[],[]];
  for (let i = 0; i < width; i++) {
    mem[0][i] = 4/16+tempData[i*4]*maxV;
    //mem[0][i] = Math.min(colorDepth,Math.random()*colorDepth/2 + tempData[i]*maxV);
    mem[1][i] = tempData[(i+width)*4]*maxV;
  }
  //mem[1][0] += (Math.random()*4 + 4) / 16;
  mem[1][0] += 4 / 16;

  let y = 0;
  while (y < height) {
    for (let x = 0; x < width; x++) {
      let oldp = mem[0][x];
      let newp = Math.max(0,Math.min(colorDepth,Math.round(oldp>>0)));//Math.max(0,Math.min(colorDepth,Math.round(oldp)));
      let err = oldp-newp;//oldp - newp;
      mem[0][x + 1] += Math.max(0,Math.min(colorDepth,err * 7 / 16));
      mem[1][x - 1] += Math.max(0,Math.min(colorDepth,err * 3 / 16));
      mem[1][x] += Math.max(0,Math.min(colorDepth,err * 5 / 16));
      mem[1][x + 1] += Math.max(0,Math.min(colorDepth,err * 1 / 16));
    }
    if (y > 0) {
      for (let x = 0; x < width; x++) {
        ans[x + (y - 1) * width] = Math.max(0,Math.min(colorDepth,mem[0][x] >> 0));
        //ans[x + (y - 1) * width] = Math.max(0,mem[0][x]>>0);//Math.max(0,Math.min(colorDepth,(Math.round(mem[0][x]))));
      }
    }
    mem.reverse();
    for (let x = 0; x < width; x++) {
      mem[1][x] = tempData[(x + (y + 1) * width)*4]*maxV;
    }
    mem[1][0] += 4 / 16;
    y++;
  }
  for (let x = 0; x < width; x++) {
    ans[x + (y - 1) * width] =  Math.max(0,Math.min(colorDepth,mem[0][x] >> 0));
  }
  return ans;
}

let sv=[];

function drawBoxDevisionSilhouette(w, h, a) {
  const blocks = " ▖▗▄▘▌▚▙▝▞▐▟▀▛▜█";

  a=a.map(a=>(a/255)>0.5?1:0);

  let t = '';
  for(i = 0; i < h-3; i +=2) {
    for(j = 0; j < w-1; j +=2) {
      if(invert){
        t += blocks[
          a[(j+(1+i)*w)*4]*1+
          a[(1+j+(1+i)*w)*4]*2+
          a[(j+(i)*w)*4]*4+
          a[(1+j+(i)*w)*4]*8];
      }
      else{
        t += blocks[
          15-a[(j+(1+i)*w)*4]*1-
          a[(1+j+(1+i)*w)*4]*2-
          a[(j+(i)*w)*4]*4-
          a[(1+j+(i)*w)*4]*8];
      }
    }
    t += '\n';
  }
  return t;
}

let palette = ' ▏▎▍▌▋▊▉█';
let palette2 = ["`'\"P▀█", " :+#■█", ".,╥g▄█"];
let palette3 = ['▀▀██',' ■█','▄▄█'];

function drawBoxGradient(w, h, a) {
  a=a.map(a=>(a/255)*(a/255)*255);

  let t = '';
  for(i = 0; i < h; i ++) {
    for(j = 0; j < w; j ++) {
      if(invert){
        t += palette[(a[(j+i*w)*4]/255*(palette.length-1)>>0)+1-dither(i,j,((a[(j+i*w)*4]/255*(palette.length-1))%1)*255)];
      }
      else{
        t += palette[palette.length-1-(a[(j+i*w)*4]/255*(palette.length-1)>>0)+1-dither(i,j,((a[(j+i*w)*4]/255*(palette.length-1))%1)*255)];
      }
    }
    t += '\n';
  }
  return t;
}
function drawBoxDevision(w, h, a) {
  const blocks = " ▖▗▄▘▌▚▙▝▞▐▟▀▛▜█";

  a=a.map(a=>(a/255)*(a/255)*255);

  let t = '';
  for(i = 0; i < h-1; i +=2) {
    for(j = 0; j < w-1; j +=2) {
      t += blocks[
        15-dither(i,j+1,a[(1+j+(i)*w)*4])*8-
        dither(i+1,j+1,a[(1+j+(1+i)*w)*4])*2-
        dither(i,j,a[(j+(i)*w)*4])*4-
        dither(i+1,j,a[(j+(1+i)*w)*4])];
    }
    t += '\n';
  }
  return t;
}

function drawBoxGradientFloyd(w, h, a) {
  let newData = floyd(palette.length-1, a.map(a=>(a/255)*(a/255)*255), w*1, h*1);

  sv=newData;

  let t = '';
  for(i = 0; i < h; i ++) {
    for(j = 0; j < w; j ++) {
      t += palette[newData[j+i*w]];
    }
    t += '\n';
  }
  return t;
}
function drawBoxDevisionFloyd(w, h, a) {
  const blocks = " ▖▗▄▘▌▚▙▝▞▐▟▀▛▜█";

  let newData = floyd(1, a.map(a=>(a/255)*(a/255)*255), w*1, h*1);

  sv=newData;

  let t = '';
  for(i = 0; i < h-1; i +=2) {
    for(j = 0; j < w-1; j +=2) {
      t += blocks[
        newData[1+j+(i)*w]*8+
        newData[1+j+(1+i)*w]*2+
        newData[j+(i)*w]*4+
        newData[j+(1+i)*w]];
    }
    t += '\n';
  }
  return t;
}


function drawBoxGradient2(W, H, a, pal = palette2) {
  let newData = [];

  for(let j=0;j<H;j++){
    for(let i=0;i<W;i++){
      newData.push((a[(i+j*W)*4]/255*(pal[0].length-1.5)>>0)+1-dither(i,j,(a[(i+j*W)*4]/255*(pal[0].length-1.5)%1)*255),0,0,255);
    }
  }

  let t = '';
  for(i = 0; i < H-1; i +=2) {
    for(j = 0; j < W; j ++) {
        A = Math.round(R(255-newData[(i * W + j) * 4]*255/(pal[0].length-1.5))/255*(pal[0].length-1.5));
        B = Math.round(R(255-newData[((i + 1) * W + j) * 4]*255/(pal[0].length-1.5))/255*(pal[0].length-1.5));
        t += pal[A == B ? 1 : A > B ? 0 : 2][(A + B) / 2 >> 0];
    }
    t += '\n';
  }
  return t;
}

function drawBoxGradientFloyd2(w, h, a) {
  let newData = floyd(palette2[0].length-1.5, a, w*1, h*1);

  let t = '';
  for(i = 0; i < H-1; i +=2) {
    for(j = 0; j < W; j ++) {
        A = Math.round(R(255-newData[i * W + j]*255/(palette2[0].length-1.5))/255*(palette2[0].length-1.5));
        B = Math.round(R(255-newData[(i + 1) * W + j]*255/(palette2[0].length-1.5))/255*(palette2[0].length-1.5));
        t += palette2[A == B ? 1 : A > B ? 0 : 2][(A + B) / 2 >> 0];
    }
    t += '\n';
  }
  return t;
}

async function ASCII(url, size) {
  D('v').innerHTML = `<img src="${url}" id="s"><canvas id="i">`;
  s = document.getElementById('s');
  s.crossOrigin = "Anonymous";
  c = D('i');
  X = c.getContext('2d');
  await p();
  W = c.width = size;
  H = c.height = size * s.height / s.width * Ratio * (Brail ? 1.35 : 1) * (DV > 6 ? 0.5 : 1);
  X.filter = DV == 6 ? "grayscale(100%) contrast(25600%)" : "grayscale(100%)";
  X.drawImage(s, 0, 0, W, H);
  a = X.getImageData(0, 0, W, H).data;

  t = '';
  // $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'.
  // gbv,._
  // P*"^'`
  d = 255;
  b = 0;
  for(i = 0; i < H - 1; i++) {
    for(j = 0; j < W - 1; j++) {
      A = a[(i * W + j) * 4];
      d = Math.min(A, d);
      b = Math.max(A, b);
    }
  }
  R = a => (a - d) * 255 / (255 - d - (255 - b));
  if(invert) {
    R = a => 255 - (a - d) * 255 / (255 - d - (255 - b));
  }
  if(Brail) {
    return drawBrail(W, H, a);
  }

  if(DV == 4){
    return drawBoxGradient2(W, H, a);
  }
  if(DV == 5){
    return drawBoxGradientFloyd2(W, H, a);
  }
  if(DV == 6){
    return drawBoxGradient2(W, H, a, palette3);
  }

  if(DV == 7){
    return drawBoxGradient(W, H, a);
  }
  if(DV == 8){
    return drawBoxDevision(W, H, a);
  }
  if(DV == 9){
    return drawBoxGradientFloyd(W, H, a);
  }
  if(DV == 10){
    return drawBoxDevisionFloyd(W, H, a);
  }
  if(DV == 11){
    return drawBoxDevisionSilhouette(W, H, a);
  }
  for(i = 0; i < H - 1; i += 2) {
    for(j = 0; j < W; j++) {
      A = R(a[(i * W + j) * 4]), B = R(a[((i + 1) * W + j) * 4]);
      t += C[(A + B) / 512 * C.length >> 0][Math.abs(A - B) < 512 / 25 ? 2 : A > B ? 0 : 1];
    }
    t += '\n';
  }
  return t;
}

let black = false;

function toggleBlack() {
  black = !black;
  if(black) {
    document.body.style = "color:white;background-color:black;";
  } else {
    document.body.style = "";
  }
  invertColors();
}
let start = true;

function invertColors() {
  invert = !invert;
  if(!start) {
    submitSearch();
  }
  start = false;
}
toggleBlack();
DV = '5';
async function submitSearch(a) {
  Ratio = D('ratio').value;
  if(a||DV != D('type').value) { await loadExample(); }
  D('c').innerHTML = escapeHtml(await ASCII(D('url').value, D('size').value));
  return false;
}

async function loadExample() {
  DV = D('type').value;
  setUrl();
  if(D('type').value >= 0) {
    Brail = false;
    C = P[D('type').value];
  } else {
    Brail = true;
  }
  D('t').innerHTML = escapeHtml(await ASCII('test.png', 49)) + '<br><hr><br>' + escapeHtml(await ASCII('test.png', 100)) + '<br><hr><br>' + escapeHtml(await ASCII('test.png', 199));
  await submitSearch();
}
loadExample();
