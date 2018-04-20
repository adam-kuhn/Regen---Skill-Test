function handleFiles (files) {
  // check for the File API support
  if (window.FileReader) {
    console.log('here')
    getAsText(files[0])
  } else {
    alert('FileReader is not supported in this browser')
  }
}

function getAsText (fileToRead) {
  const reader = new FileReader()
  // read file into memory as UTF-8
  reader.readAsText(fileToRead)
  // Handle errors load
  reader.onload = loadHandler
  reader.onerror = errorHandler
}

function loadHandler (event) {
  const csv = event.target.result
  processData(csv)
}

function processData (csv) {
  const allTextLines = csv.split(/\r\n|\n/)
  const lines = []
  for (let i = 0; i < allTextLines.length; i++) {
    const data = allTextLines[i].split(';')
    const tarr = []
    for (let j = 0; j < data.length; j++) {
      tarr.push(data[j])
    }
    lines.push(tarr)
  }
  const completeFile = lines.map(data => {
    return data[0].split(',')
  })
  completeFile.shift()
  const julyData = getJulyData(completeFile)
  console.log(julyData)
  const julyRainyDays = rainyDays(julyData)
  const avgJulyTemp = avgTemp(julyData)
  console.log(avgJulyTemp)
}

function errorHandler (evt) {
  if (evt.target.error.name === 'NotReadableError') {
    alert('Can not read file!')
  }
}

function getJulyData (allData) {
  return allData.filter(data => {
    return data[0].slice(5, 7) === '07'
  })
}

function rainyDays (monthData) {
  const rainData = monthData.map(rain => {
    return Number(rain[2])
  })
  console.log('all rain', rainData)
  const rainyDays = rainData.filter(rainFall => {
    return rainFall >= 2
  })
  console.log('number of rainy days', rainyDays.length)
  return rainyDays.length
}

function avgTemp (monthData) {
  const tempData = monthData.map(data => {
    return Number(data[1])
  })
  const sum = tempData.reduce((a, b) => {
    return a + b
  })
  return sum / tempData.length
  console.log('temp sum', sum)
}
