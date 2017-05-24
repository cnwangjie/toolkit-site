var input = document.getElementById('input')
var result = document.getElementById('result')

input.onchange = function() {
    var r = new FileReader()
    r.onload = function() {
        var cvs = document.createElement('canvas')
        cvs.id = 'qr-canvas'
        cvs.style.display = 'none'
        document.body.append(cvs)
        var ctx = cvs.getContext('2d')
        var img = new Image
        img.src = r.result
        img.onload = function() {
            cvs.width = img.width
            cvs.height = img.height
            ctx.drawImage(img, 0, 0, img.width, img.height)
            var re = qrcode.decode()
            result.innerText = re
        }
    }
    r.readAsDataURL(input.files[0])
}
