var text = document.getElementById('text')
var result = document.getElementById('result')
var tf = document.getElementById('tf')
var rt = document.getElementById('rt')
var ure = document.getElementById('ure')
var glo = document.getElementById('glo')
var ica = document.getElementById('ica')
function e() {
  let re
  let way = ''
  if (glo.checked) {
    way += 'g'
  }
  if (ica.checked) {
    way += 'i'
  }
  if (ure.checked) {
    try {
      re = new RegExp(tf.value, way)
    } catch (e) {
      mdui.snackbar({
        message: 'Invalid regular expression!'
      })
      return
    }
  } else {
    re = new RegExp(tf.value.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1'), way)
  }
  result.value = text.value.replace(re, rt.value)

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
  tf.value = ''
  rt.value = ''
}
