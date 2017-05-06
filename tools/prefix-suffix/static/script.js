var text = document.getElementById('text')
var result = document.getElementById('result')
var suffix = document.getElementById('suffix')
var prefix = document.getElementById('prefix')
function a() {
  var t = text.value
  t = t.split('\n')
       .map(function(i) {
          return suffix.value + i + prefix.value
       })
       .join('\n')
  result.value = t
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
  suffix.value = ''
  prefix.value = ''
}
