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
    t1.setValue(html_beautify(t0.getValue()))
}
