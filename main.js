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

function dither(x, y, v) {
  n = R(v) / 256;
  n = Math.pow(n, 2 / 3);
  var mat = [
    [1, 33, 13, 45, 3, 35, 15, 47],
    [59, 17, 49, 25, 57, 19, 51, 27],
    [9, 41, 5, 37, 11, 43, 7, 39],
    [55, 29, 61, 21, 53, 31, 63, 23],

    [4, 36, 16, 48, 2, 34, 14, 46],
    [58, 20, 52, 28, 60, 18, 50, 26],
    [12, 44, 8, 40, 10, 42, 6, 38],
    [54, 32, 64, 24, 56, 30, 62, 22],
  ];
  if(n > mat[x % 8][y % 8] / 64) {
    return 1;
  }
  return 0;
};

var brail = "⠂⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿";

C = P[0];

var Brail = false;

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

var defaultUrl = { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png', size: 200, ratio: 0.82, type:"0" };

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
  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + qs;
  window.history.pushState({ path: newurl }, '', newurl);
}

function drawBrail(w, h, a) {
  let t = '';
  for(i = 0; i < h - 2; i += 4) {
    for(j = 0; j < w - 1; j += 2) {
      var bin = '';
      bin += dither(j + 1, i + 3, a[((i + 3) * (w >> 0) + j + 1) * 4]) ? 0 : 1;
      bin += dither(j, i + 3, a[((i + 3) * (w >> 0) + j + 1) * 4]) ? 0 : 1;
      for(var bx = 1; bx >= 0; bx--) {
        for(var by = 2; by >= 0; by--) {
          bin += dither(j + bx, i + by, a[((i + by) * (w >> 0) + j + bx) * 4]) ? 0 : 01;
        }
      }
      t += brail[parseInt(bin, 2)];
    }
    t += '\n';
  }
  return t;
}

async function ASCII(url, size) {
  D('v').innerHTML = `<img src="${url}" id="s"><canvas id="i">`
  D = a => document.getElementById(a);
  c = D('i');
  X = c.getContext('2d');
  s = document.getElementById('s');
  s.crossOrigin = "Anonymous";
  await p();
  W = c.width = size;
  H = c.height = size * s.height / s.width * Ratio * (Brail ? 1.35 : 1);
  X.filter = "grayscale(100) contrast(1)";
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
      A = a[(i * (W >> 0) + j) * 4];
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
  for(i = 0; i < H - 1; i += 2) {
    for(j = 0; j < W; j++) {
      A = R(a[(i * (W >> 0) + j) * 4]), B = R(a[((i + 1) * (W >> 0) + j) * 4]);
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
DV = '-1';
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
