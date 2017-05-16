var text = document.getElementById('text')
var result = document.getElementById('result')
function e() {
  var tmp = text.value
  var exist = {}
  tmp = tmp.split('\n').map(i => {
      if (i in exist) {
          return NaN
      }
      exist[i] = true
      return i
  }).filter(i => !isNaN(i)).join('\n')
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
