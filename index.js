var jsdom = require("jsdom");
var $ = require("jquery")(jsdom.jsdom().parentWindow);
var request = require('request');
var fs = require('fs');
// File stream to save on: result.csv
var stream = fs.createWriteStream("result.csv");
// Base url from where to get the data
var base_url = "http://startupbase.abstartups.com.br";
// The first page from which we need to extract the data
var loc = "http://startupbase.abstartups.com.br/startups?page=119";
var csv_string = "";
// CSV header
csv_string = "Nome;Data Fundação;Cidade;Estado;Email;Site;Mercado;Momento;Modelo de negócios;Descrição\n"
// Writing the csv header
stream.write(csv_string);
// Initializing the variables
var rows = '';
var main_info = '';
var info_list = '';
var nome = '';
var data_fundacao = '';
var cidade = '';
var estado = '';
var email = '';
var site = '';
var mercado = '';
var momento = '';
var modelo_negocios = '';
var descricao = '';

// Function to get each page data
function getNextPage(location) {
  request(
    location,
    function(error, response, data) {
      console.log('Página Base: ' + location);
      console.log('statusCode:', response && response.statusCode);
      // getting each row in the page through a selector
      rows = $(data).find("div.result-box");
      $.each(rows, function(i, row) {
        request(
          base_url + $($(row).find("a")[0]).attr('href'),
          function(error, response, article_data) {
            console.log('Página da Startup: ' + base_url + $($(row).find("a")[0]).attr('href'));
            csv_string = "";
            // console.log('statusCode:', response && response.statusCode);
            // getting the data from the page in each row
            main_info = $(article_data).find("div.main-info");
            info_list = $(main_info).find('ul.details');
            nome = $(main_info).find('h1').text()
            data_fundacao = $(info_list).find("li[title='Data de fundação']").text().trim();
            cidade = $(info_list).find("li[title='Cidade']").text().trim();
            estado = $(info_list).find("li[title='Estado']").text().trim();
            email = $(info_list).find("li[title='Email']").text().trim();
            site = $(info_list).find("li[title='Site da startup']").text().trim();
            mercado = $(article_data).find('div.market').text().trim().split(':')[1];
            momento = $(article_data).find('div.moment:not(.business-model-all)').text().trim().split(':')[1];
            modelo_negocios = $(article_data).find('div.moment.business-model-all').text().trim().split(':')[1];
            descricao = $(article_data).find('div.description').find('div.white-box > p').text().trim();

            csv_string += "'" + nome + "';";
            csv_string += "'" + data_fundacao + "';";
            csv_string += "'" + cidade + "';";
            csv_string += "'" + estado + "';";
            csv_string += "'" + email + "';";
            csv_string += "'" + site + "';";
            csv_string += "'" + mercado + "';";
            csv_string += "'" + momento + "';";
            csv_string += "'" + modelo_negocios + "';";
            csv_string += "'" + descricao + "';";
            csv_string += "\n";
            stream.write(csv_string);
        });
      });
      // going to the next page
      next_page = $(data).find("ul.nav-pagination").find('li.current').next();
      if (next_page.length > 0) {
        getNextPage(base_url + next_page.find('a').attr('href'))
      }
    });
}

getNextPage(loc);
