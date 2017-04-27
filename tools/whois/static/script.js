var input = document.getElementById('domain')
var result = document.getElementById('result')
var spinner = `<div class="mdui-spinner"></div>`
var running = false
function whois() {
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
        url: '/whois/api/',
        type: 'POST',
        data: {
            domain: input.value,
        }
    }).done(function(data) {
        result.innerText = data
    }).fail(function() {
				result.innerHTML = `<span style="color:red">ERROR</span>`
		}).always(function() {
				running = false
		})
}
