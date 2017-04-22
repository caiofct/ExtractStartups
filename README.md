## Extracts startup data from the site: http://startupbase.abstartups.com.br/startups

Basically it goes in each page using jquery to traverse the dom and makes a http
request to get the needed data. It then appends each page data in the result.csv file.

Uses node.js verson 4.2.1
And has the following dependencies:

* jquery@latest
* jsdom@3.x
* request@latest
