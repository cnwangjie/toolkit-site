var input = document.getElementById('input')
var t1 = document.getElementById('t1')

input.onchange = function() {
    var r = new FileReader()
    r.onload = function() {
        var cvs = document.createElement('canvas')
        var ctx = cvs.getContext('2d')
        var img = new Image
        img.src = r.result
        img.onload = function() {
            cvs.width = img.width
            cvs.height = img.height
            ctx.drawImage(img, 0, 0, img.width, img.height)
            var imageData = ctx.getImageData(0, 0, img.width, img.height)
            var pixels = imageData.data
            var nums = imageData.width * imageData.height
            for (var i = 0; i < nums; i += 1) {
                pixels[i * 4] = 255 - pixels[i * 4]
                pixels[i * 4 + 1] = 255 - pixels[i * 4 + 1]
                pixels[i * 4 + 2] = 255 - pixels[i * 4 + 2]
            }
            ctx.putImageData(imageData, 0, 0)
            t1.src = cvs.toDataURL('image/png')
        }
    }
    r.readAsDataURL(input.files[0])
}
