var text = document.getElementById('text')
var result = document.getElementById('result')
var rto = document.getElementById('rto')
var wt = document.getElementById('wt')
var before = document.getElementById('before')
var after = document.getElementById('after')
var encs = document.getElementById('encs')
function r() {
  var t = text.value
  t = t.replace(/\n/g, rto.value)
  result.value = t
}

function a() {
  var t = text.value
  var rpt = wt.value
  if (before.checked) rpt = '\n' + rpt
  if (after.checked) rpt = rpt + '\n'
  t = t.replace(new RegExp(wt.value, 'g'), rpt)
  t = t.split('')
  var r = ''
  for (var i = 0; i < t.length; i += 1) {
    r += t[i]
    if (i % encs.value == 0) {
      r += '\n'
    }
  }
  result.value = r
}

function s() {
  result.select()
  document.execCommand('copy')
  mdui.snackbar({
    message: 'Copied!'
  })
}

function c() {
  text.value = ''
  result.value = ''
}
