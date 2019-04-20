const bitcoinChart=require('./bitcoin-chart')

bitcoinChart.chart()
  	.then(link => { console.log(link) })
  	.catch(err => { console.log(err) })