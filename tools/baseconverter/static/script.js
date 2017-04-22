var n0 = document.getElementById('n0')
var n1 = document.getElementById('n1')
var b0 = document.getElementById('b0')
var b1 = document.getElementById('b1')


function c(e) {
    switch (e.srcElement.id) {
      case 'n0':
      case 'b1':
        n1.value = parseInt(n0.value, b0.value).toString(b1.value)
        break;
      case 'n1':
      case 'b0':
        n0.value = parseInt(n1.value, b1.value).toString(b0.value)
        break;
      default:

    }
}

n0.addEventListener('change', c)
n1.addEventListener('change', c)
b0.addEventListener('change', c)
b1.addEventListener('change', c)
