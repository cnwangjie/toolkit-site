var text = document.getElementById('text')
var result = document.getElementById('result')
function e() {
  var tmp = text.value
  var exist = {}
  tmp = tmp.split('\n').filter(i => i).filter(i => {
      return i.split('').filter(j => j.charCodeAt(0) != 32).join('')
  }).join('\n')
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
