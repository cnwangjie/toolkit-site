var t0 = CodeMirror.fromTextArea(document.getElementById('t0'), {
  lineNumbers: true,
  theme: 'material',
})
var t1 = CodeMirror.fromTextArea(document.getElementById('t1'), {
  lineNumbers: true,
  theme: 'material',
})
t0.setSize('100%', 200)
function b() {
    t1.setValue(vkbeautify.sql(t0.getValue()))
}
function m() {
    t1.setValue(vkbeautify.sqlmin(t0.getValue()))
}
