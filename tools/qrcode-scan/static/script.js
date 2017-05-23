var input = document.getElementById('input')
var result = document.getElementById('result')

input.onchange = function() {
    var r = new FileReader()
    r.onload = function() {
        result.innerText = qrcode.decode(r.result)
    }
    r.readAsDataURL(input.files[0])
}
