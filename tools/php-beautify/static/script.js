var t0 = CodeMirror.fromTextArea(document.getElementById('t0'), {
  lineNumbers: true,
  theme: 'material',
})
var t1 = CodeMirror.fromTextArea(document.getElementById('t1'), {
  lineNumbers: true,
  theme: 'material',
})
t0.setSize('100%', 200)
var locked = false
function b() {
    var ori = t0.getValue()
    if (ori == '' || locked) {
        return
    }
    locked = true
    setTimeout(function() {
        locked = false
    }, 1000)
    var url = `/php-beautify/api/`
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            c: ori
        }
    }).done(function(data) {
        t1.setValue(data)
    })
}
