
var cors = 'https://cors-anywhere.herokuapp.com/';
var cluesLink = 'http://jservice.io/api/clues/?';
var randomLink = 'http://jservice.io/api/random/?count=100';

function getURL(){

    if((typeof jServiceCategoryList === 'undefined')){
            $.getJSON("https://joshuacrivera.github.io/categories.json").done(function(results){
                    jServiceCategoryList = results;
                    searchList(document.getElementById("searchInput"));
            });
            return(cors + randomLink);
      }

          url = cors + cluesLink;

          url+="&category="+jServiceCategoryList[CategoryNum];

      if(typeof Value !== 'undefined' && !isNaN(Value)){
          url+="&value=" + Value;
      }

      if((typeof AirDate !== 'undefined')){
          url+="&min_date=" + AirDate[0].toISOString().slice(0,10) + "&max_date="+AirDate[1].toISOString().slice(0,10);
      }
      return(url);
}

function searchList(questionObjects) {
    listResults = Object.keys(jServiceCategoryList);

    questionObjects.addEventListener("input", function(e) {
        var listResult = document.getElementsByClassName("searchList-items");
        for (var i = 0; i < listResult.length; i++) {
              listResult[i].parentNode.removeChild(listResult[i]);
            }

        if (!this.value) {
          return false;
        }

        var a = document.createElement("DIV");
        a.setAttribute("class", "searchList-items");

        this.parentNode.appendChild(a);

        for (var i = 0; i < listResults.length; i++) {

            if (listResults[i].substr(0, this.value.length).toUpperCase() == this.value.toUpperCase()) {
              var b = document.createElement("DIV");
                b.innerHTML = listResults[i] + "<input type='hidden' value='" + listResults[i] + "'>";

                b.addEventListener("click", function(e) {
                    questionObjects.value = this.getElementsByTagName("input")[0].value;
                    CategoryNum = questionObjects.value;
                    for (var i = 0; i < listResult.length; i++) {
                            listResult[i].parentNode.removeChild(listResult[i]);
                    }
                    $('.lds-ring').show();
                    refresh();
                });
                a.appendChild(b);
            }
        }
    });
}

var AirDate = [ new Date("September 10, 1984"), new Date() ];

startDateInput.value = AirDate[0].toISOString().slice(0,10);
endDateInput.value = AirDate[1].toISOString().slice(0,10);

document.getElementById('startDateInput').addEventListener('input', function(e){
    if(AirDate[0].getTime() > AirDate[1].getTime()){
        startDateInput.value = endDateInput.value;
    }

    AirDate[0] = new Date(startDateInput.value);
});

document.getElementById('endDateInput').addEventListener('input', function(e){
    if(AirDate[0].getTime() > AirDate[1].getTime()){
        endDateInput.value = startDateInput.value;
    }
    AirDate[1] = new Date(endDateInput.value);
});

document.getElementById('valueInput').addEventListener('input', function(e) {

    Value = Math.round(document.getElementById('valueInput').value);

});


function refresh(){

      setTimeout(function() {
        $.getJSON(getURL()).done(function(data){
                $('#searchResults').empty();
                for(var i = 0; i < data.length; i++){

                        if(data[i].answer == "=" || data[i].category.title == "="){
                          continue;
                        }

                        if(data[i].value == null || data[i].value == 0){
                          continue;
                        }

                    results = $('<p></p>').attr({
                        "class":"entry"
                    });
                    jeopardyQuestion = $('<p></p>').attr({
                        "class":"question"
                    });
                    whatIs = $('<p></p>').attr({
                        "class":"answer"
                    });
                    info = $('<p></p>').attr({
                        "class":"details"
                    });

                    if(data[i].answer.substring(0, 2).localeCompare("<i>") != 0){
                      var temp = "";
                      temp = data[i].answer.replace("<i>", "");
                      data[i].answer = temp.replace("</i>", "");
                    }

                    jeopardyQuestion.text(data[i].question);
                    whatIs.text("What is " + data[i].answer + "?");

                      month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        info.text(data[i].category.title.charAt(0).toUpperCase() + data[i].category.title.slice(1)
                        + " -- " +
                        month[new Date(data[i].airdate).getMonth()]+ " " + new Date(data[i].airdate).getDate()+ ", "+ new Date(data[i].airdate).getFullYear()
                        + " -- " +
                        data[i].value);

                    $('#searchResults').append(results.append(jeopardyQuestion, whatIs, info));
                    $('.lds-ring').hide();
                }
            });
    });
}
