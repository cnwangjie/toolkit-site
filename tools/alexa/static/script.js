var input = document.getElementById('domain')
var result = document.getElementById('result')
var r0 = document.getElementById('r0')
var r1 = document.getElementById('r1')
var r2 = document.getElementById('r2')
var r3 = document.getElementById('r3')
var spinner = `<div class="mdui-spinner"></div>`


var running = false
function e() {
		if (!input.value) {
				return
		}

		if (running) {
				return
		}

		result.innerHTML = spinner
		mdui.updateSpinners()
		running = true
		$.ajax({
        url: '/alexa/api/',
        type: 'POST',
				data: {
					domain: input.value
				}
    }).done(function(data) {
				console.log(data)
				var re = ''
				if (data.indexOf('POPULARITY') < 0) {
					re = nodata
				} else {
					var start = data.lastIndexOf('<SD>')
					var end = data.lastIndexOf('</SD>')
	        data = data.substring(start, end)
					re += rank + ': ' + new RegExp('TEXT="([0-9]*)"', 'i').exec(data)[1] + '\n'
					re += reach + ': ' + new RegExp('REACH RANK="([0-9]*)"', 'i').exec(data)[1] + '\n'
					re += delta + ': ' + new RegExp('DELTA="([-+0-9]*)"', 'i').exec(data)[1] + '\n'
					var cty = new RegExp('NAME="([A-Za-z ]*)" *RANK="([0-9]*)"', 'i').exec(data)
					if (cty) {
						re += country + ': ' + cty[2] + ' in ' + cty[1] + '\n'
					}
				}
				result.innerText = re
    }).fail(function() {
				mdui.snackbar({
					message: 'ERROR!'
				})
		}).always(function() {
				running = false
		})
}
