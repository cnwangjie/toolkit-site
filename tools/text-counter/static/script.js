var text = document.getElementById('text')
var dncs = document.getElementById('dncs')
var tc = document.getElementById('tc')
var tw = document.getElementById('tw')
var ts = document.getElementById('ts')
var tl = document.getElementById('tl')
var cc = document.getElementById('cc')
var cw = document.getElementById('cw')
var cs = document.getElementById('cs')
var cl = document.getElementById('cl')
var sc = document.getElementById('sc')
var sw = document.getElementById('sw')
var ss = document.getElementById('ss')
var sl = document.getElementById('sl')

text.addEventListener('keydown', ctotal)
text.addEventListener('change', ctotal)
text.addEventListener('mousedown', ctotal)
text.addEventListener('keydown', ccursor)
text.addEventListener('mousedown', ccursor)
text.addEventListener('keydown', cselected)
text.addEventListener('mousedown', cselected)

function ctotal() {
  var r = c(text.value)
  tc.innerHTML = r.c
  tw.innerHTML = r.w
  ts.innerHTML = r.s
  tl.innerHTML = r.l
}

function ccursor() {
  if (document.activeElement.id != 'text') {
    return
  }

  var r = c(text.value.substr(0, text.selectionStart))
  cc.innerHTML = r.c
  cw.innerHTML = r.w
  cs.innerHTML = r.s
  cl.innerHTML = r.l
}

function cselected() {
  if (document.activeElement.id != 'text') {
    return
  }

  var text = window.getSelection().toString()

  var r = c(text)
  sc.innerHTML = r.c
  sw.innerHTML = r.w
  ss.innerHTML = r.s
  sl.innerHTML = r.l
}

function c(text) {
  var r = {}
  r.c = dncs.checked ? text.replace(/\s/g, '').length : text.length
  r.w = text.replace(/[,.!?;()\[\]"'/\\:]/g, ' ').split(' ').filter(function(i) {
    return i
  }).length
  r.s = text.match(/[.!?]/g) ? text.match(/[.!?]/g).length : 0
  r.l = text.split('\n').length
  return r
}
