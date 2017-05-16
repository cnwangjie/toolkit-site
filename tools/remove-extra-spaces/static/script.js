var text = document.getElementById('text')
var result = document.getElementById('result')
var lh = document.getElementById('lh')

function e() {
  var tmp = text.value
  var exist = {}
  tmp = tmp.split(' ').filter(i => i).join(' ')
  if (lh.checked) {
    tmp = tmp.split('\n').map(i => i.replace(/^\s+/, '')).join('\n')
  }
  result.value = tmp
  result.focus()
  text.focus()
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
