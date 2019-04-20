const fdk=require('@autom8/fdk');
const a8=require('@autom8/js-a8-fdk')
const bitcoinChart=require('./bitcoin-chart')

let timeRange = '15m';

fdk.handle(function(input){
  if (input.timeRange) {
    timeRange = input.timeRange;
  }
  bitcoinChart.chart(timeRange)
  	.then(link => { return link })
  	.catch(err => { return err })
})

fdk.slack(function(result){
	bitcoinChart.chart(timeRange)
		.then(link => {
			return {
		        "response_type": "in_channel",
		        "blocks" : [
			        {
					"type": "image",
					"title": {
						"type": "plain_text",
						"text": "Current Bitcoin Price",
						"emoji": true
					},
					"image_url": link,
					"alt_text": "bitcoinprice"
					}
		        ]
		    }
		})
		.catch(err => { 
			return {
		        "response_type": "in_channel",
		        "blocks" : [
		            {
		                "type": "section",
		                "text": {
		                    "type": "mrkdwn",
		                    "text": "Error generating chart."
		                }
		            }
		        ]
		    }

		})
})

fdk.discord(function(result){
	bitcoinChart.chart(timeRange)
		.then(link => {
		    return {
		        "embed": {
					"image": {
						"url": link
					} 
		        }
		    }
		})
		.catch(err => {
			return {
		        "content": "Error generating chart."
		    }
		})
})

