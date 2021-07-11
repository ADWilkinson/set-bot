# set-bot

PoC - Shockingly Bad Code

# how it works
- runScrape dumps raw tokenset page sources into /scrapingData
- runReports parses raw page source and finds total AUM and token price and creates a json in /report for each set
- runGetMessage ingests report and formats a message for discord
- runPostMessageToDiscord posts the formatted message to discord via webhook

## TODO: 
- replace entire local file storage with DB
- seperate index.js into modules
- create some actual tests 👉👈
