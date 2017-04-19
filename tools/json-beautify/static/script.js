var t0 = CodeMirror.fromTextArea(document.getElementById('t0'), {
  lineNumbers: true,
  theme: 'material',
})

function noq() {
    b()
    var v = t0.getValue()
    v = v.split('\n')
         .map(i => i.replace(/"(\S*)"/, '$1'))
         .join('\n')
    t0.setValue(v)
}

function b() {
  var v = t0.getValue()
  var r = {}
  try {
    r = JSON.parse(v)
  } catch (e) {
    mdui.snackbar({
      message: 'JSON Format Error!'
    })
    return
  }
  var idtv = document.getElementById('idt').value - 0
  if (idtv < 0) {
    idtv = 0
  }
  t0.setValue(JSON.stringify(r, null, idtv))
}
