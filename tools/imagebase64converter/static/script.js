var input = document.getElementById('input')
var t0 = document.getElementById('t0')
var t1 = document.getElementById('t1')

input.onchange = function() {
    var r = new FileReader()
    r.onload = function() {
        t0.value = r.result
    }
    r.readAsDataURL(input.files[0])
}

function d() {
    t1.src = t0.value
}
