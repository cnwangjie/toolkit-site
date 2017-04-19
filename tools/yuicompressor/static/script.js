var input = document.getElementById('input')
var result = document.getElementById('result')
var radio = document.getElementsByName('codelang')
var nomunge = document.getElementById('nomunge')
var presemi = document.getElementById('presemi')
var disopt = document.getElementById('disopt')
var textareanum = 1
function add() {
    if (textareanum > 9) {
        return
    }
    var textarea = document.createElement('textarea')
    textarea.classList.add('mdui-textfield-input')
    textarea.setAttribute('placeholder', holder)
    input.append(textarea)
    textareanum += 1
}
var locked = false
function e() {
    if (locked) {
        return
    }
    var value = []
    for (let i of input.children) {
        if (i.value != '') {
            value.push(i.value)
        }
    }
    if (value == null) {
        return
    }
    var codelang = ''
    for (let i of radio) {
        if (i.checked) {
            codelang = i.value
        }
    }
    locked = true
    setTimeout(function() {
        locked = false
    }, 2000)
    console.log(codelang, value)
    $.ajax({
        url: '/yuicompressor/api/',
        type: 'POST',
        data: {
            cl: codelang,
            v: value.join('\n'),
            nomunge: nomunge.checked,
            presemi: presemi.checked,
            disopt: disopt.checked,
        }
    }).done(function(data) {
        result.value = data
    })
}
