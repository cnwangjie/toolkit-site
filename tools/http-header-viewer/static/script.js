var input = document.getElementById('url')
var result = document.getElementById('result')
var spinner = `<div class="mdui-spinner"></div>`
var running = false
function s() {
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
        url: '/http-header-viewer/api/',
        type: 'POST',
        data: {
            url: input.value,
        }
    }).done(function(data) {
        result.innerText = data
    }).fail(function() {
				result.innerHTML = `<span style="color:red">ERROR</span>`
		}).always(function() {
				running = false
		})
}
