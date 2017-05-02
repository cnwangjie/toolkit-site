var input = document.getElementById('domain')
var result = document.getElementById('result')
var spinner = `<div class="mdui-spinner"></div>`
var running = false
var text = ''
var json = ''
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
	  inst.show(0)
		$.ajax({
        url: '/dns-lookup/api/',
        type: 'POST',
        data: {
            domain: input.value,
        }
    }).done(function(data) {
				var resultText = ''
				for (var type in data) {
						switch (type) {
								case 'A':
								case 'AAAA':
								case 'CNAME':
								case 'NS':
										// 数组
										data[type].forEach(function(i) {
												resultText += '<div class="type">' + type + '</div><div class="value">' + i + '</div></br>'
										})
										break
								case 'MX':
										// 对象数组
										data[type].forEach(function(i) {
												resultText += '<div class="type">' + type + '</div>'
												for (var t in i) {
														resultText += '<div class="value">' + t + ':\t' + i[t] + '</div></br><div class="type"></div>'
												}
												resultText = resultText.substr(0, resultText.length - 24)
										})
										break
								case 'PTR':
								case 'SOA':
								case 'SRV':
										resultText += '<div class="type">' + type + '</div>'
										for (var t in data[type]) {
												resultText += '<div class="value">' + t + ':\t' + data[type][t] + '</div></br><div class="type"></div>'
										}
										resultText = resultText.substr(0, resultText.length - 24)
										// 对象
										break
								case 'TXT':
										resultText += '<div class="type">' + type + '</div>'
										data[type].forEach(function(i) {
												resultText += '<div class="value">' + i.join(' ') + '</div></br><div class="type"></div>'
										})
										resultText = resultText.substr(0, resultText.length - 24)
										// 二维字符串数组
										break
								default:
						}
				}
        result.innerHTML = resultText
				$('#jsonresult').children('textarea').val(JSON.stringify(data, null, 4))
    }).fail(function() {
				result.innerHTML = `<span style="color:red">ERROR</span>`
		}).always(function() {
				running = false
		})
}

var inst = new mdui.Tab($('#tab'))

$('#tab0').bind('show.mdui.tab', function(e) {
		$('#jsonresult').hide()
		$('#result').show()
})
$('#tab1').bind('show.mdui.tab', function(e) {
		$('#jsonresult').show()
		$('#result').hide()
})
