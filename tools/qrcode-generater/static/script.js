var msg = document.getElementById('msg')
var re = document.getElementById('re')
var size = document.getElementById('size')
var correctlevel = document.getElementById('correctlevel')
var background = document.getElementById('background')
var foreground = document.getElementById('foreground')
var pdground = document.getElementById('pdground')
var image = document.getElementById('image')
var imagesize = document.getElementById('imagesize')

function e() {
  re.innerHTML = ''
  let opt = {
    text: msg.value
  }
  if (size.value) { opt.size = size.value }
  if (correctlevel.value) { opt.correctlevel = correctlevel.value }
  if (background.value) { opt.background = background.value }
  if (foreground.value) { opt.foreground = foreground.value }
  if (pdground.value) { opt.pdground = pdground.value }
  if (image.value) { opt.image = image.value }
  if (imagesize.value) { opt.imagesize = imagesize.value }
  let cvs
  try {
    cvs = new AraleQRCode(opt)
  } catch (e) {
    mdui.snackbar({
      message: 'Wrong Paramaters!'
    })
    return
  }
  re.append(cvs)
}
