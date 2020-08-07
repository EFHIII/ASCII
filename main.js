let invert=false;

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
async function ASCII(url,size){
  D('v').innerHTML = `<img src="${url}" id="s"><canvas id="i">`
  D = a => document.getElementById(a);
  c = D('i');
  X = c.getContext('2d');
  s = document.getElementById('s');
  s.crossOrigin = "Anonymous";
  await p();
  W = c.width = size;
  H = c.height = size * s.height / s.width;
  X.filter = "grayscale(100) contrast(1)";
  X.drawImage(s, 0, 0, W, H);
  a = X.getImageData(0, 0, W, H).data;
  t = '';
  // $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'.
  // gbv,._
  // P*"^'`
  C = [
    "gP@",
    "gP$",
    "gPB",

    "g*%",
    "g*8",
    "g*O",

    ",\"Z",
    ",\"C",
    ",\"U",

    ",\"t",
    ",\"i",
    ",\"=",

    ".'/",
    ".':",
    ".'-",

    "_` ",
    "_` ",
  ];
  d = 255;b = 0;
  for(i = 0; i < H - 1; i++) {
    for(j = 0; j < W - 1; j++) {
      A = a[(i * (W >> 0) + j) * 4];
      d = Math.min(A, d);
      b = Math.max(A, b);
    }
  }
  R = a => (a - d) * 255 / (255 - d - (255 - b));
  if(invert){
    R = a => 255 - (a - d) * 255 / (255 - d - (255 - b));
  }
  for(i = 0; i < H - 1; i += 2) {
    for(j = 0; j < W; j++) {
      A = R(a[(i * (W >> 0) + j) * 4]), B = R(a[((i + 1) * (W >> 0) + j) * 4]);
      t += C[(A + B) / 512 * C.length >> 0][Math.abs(A - B) < 512 / 25 ? 2 : A > B ? 0 : 1];
    }
    t += '\n';
  }
  D('c').innerHTML=escapeHtml(t);
}

let black=false;
function toggleBlack(){
  black=!black;
  if(black){
    document.body.style="color:white;background-color:black;";
  }
  else{
    document.body.style="";
  }
  invertColors();
}
function invertColors(){
  invert=!invert;
  submitSearch();
}
toggleBlack();

function submitSearch(){
  ASCII(D('url').value,D('size').value);
  return false;
}

submitSearch();
