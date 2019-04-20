"use strict";

const ccxt = require ('ccxt')
const asciichart = require ('asciichart')
const log = require ('ololog').configure ({ locate: false })
const text2png = require('text2png')
const imgur = require('imgur')
imgur.setClientId('947ba3967a16848')

require ('ansicolor').nice

exports.chart = async function (timeRange = '15m') {
    // retrieve pricing data
    const index = 4 // [ timestamp, open, high, low, close, volume ]
    const ohlcv = await new ccxt.okcoinusd ().fetchOHLCV ('BTC/USD', timeRange)
    const lastPrice = ohlcv[ohlcv.length - 1][index] // closing price
    const series = ohlcv.map (x => x[index])         // closing price
    const bitcoinRate = ('₿ = $' + lastPrice).green

    // generate ascii plot of pricing data
    const chart = asciichart.plot (series, { height: 15, offset: 2, padding: '' })
    
    // log chart
    log.yellow ("\n" + chart, bitcoinRate, "\n")
    
    const pngConfig = {
        font: '30px Source Code Pro', 
        localFontPath: __dirname + '/SourceCodePro-Regular.ttf', 
        localFontName: 'Source Code Pro', 
        color: 'yellow', 
        backgroundColor: 'black', 
        output: 'buffer'
    }

    // convert ascii chart to canvas, then a png
    const buffer = await text2png(chart + "\n\nBTC = $" + lastPrice, pngConfig);
    
    // upload png to imgur, and return link
    return imgur.uploadBase64(buffer.toString('base64'))
        .then(function (json) {
            return json.data.link;
        })
        .catch(function (err) {
            console.error(err.message);
        });
}