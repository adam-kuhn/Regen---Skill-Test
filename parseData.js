function handleFiles (files) {
  // check for the File API support
  if (window.FileReader) {
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
  // when file loads process the data
  const csv = event.target.result
  processData(csv)
}

function errorHandler (evt) {
  if (evt.target.error.name === 'NotReadableError') {
    alert('Can not read file!')
  }
}

function processData (csv) {
  // convert the CSV to a workable form
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
  // remove the column titles from array. This makes it easier to run calculations
  completeFile.shift()
  const julyData = getJulyData(completeFile)
  // display calculated values on the HTML page
  document.getElementById('rainy-days').innerHTML = rainyDays(julyData)
  document.getElementById('avg-temp').innerHTML = avgTemp(julyData)
}

function getJulyData (allData) {
  // remove all data that is not in July
  return allData.filter(data => {
    return data[0].slice(5, 7) === '07'
  })
}

function rainyDays (monthData) {
  // filter out records that are not considered rainy days
  const rainyDays = monthData.filter(rainFall => {
    return Number(rainFall[2]) >= 2
  })
  // filter out records that are rainy
  const nonRainyDays = monthData.filter(rainFall => {
    return Number(rainFall[2]) < 2
  })
  // display calculated values on HTML page
  document.getElementById('rainy-temp').innerHTML = avgTemp(rainyDays)
  document.getElementById('non-rainy-temp').innerHTML = avgTemp(nonRainyDays)
  // the length of the rainyDays array is = to the number of rainy days in July
  return rainyDays.length
}

function avgTemp (monthData) {
  // convert all temperature data to a Number so we perform calculations
  const tempData = monthData.map(data => {
    return Number(data[1])
  })
  // sum up all the temperature data
  const sum = tempData.reduce((a, b) => {
    return a + b
  })
  // divide by the total number of data to get the average
  return sum / tempData.length
}
