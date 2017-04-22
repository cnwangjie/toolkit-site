var ts = document.getElementById('ts')
var fm = document.getElementById('fm')
var re = document.getElementById('re')

function pf(e) {
  switch (e.srcElement.id) {
    case 'ts':
      re.value = moment(+ts.value).format(fm.value)
      break;
    case 'fm':
      re.value = moment(+ts.value).format(fm.value)
    case 're':
      ts.value = moment(re.value, fm.value).valueOf()
    default:

  }
}

ts.addEventListener('change', pf)
fm.addEventListener('change', pf)
re.addEventListener('change', pf)

ts.value = Date.now()
re.value = moment(+ts.value).format('YYYY-MM-DD HH:mm:ss')
