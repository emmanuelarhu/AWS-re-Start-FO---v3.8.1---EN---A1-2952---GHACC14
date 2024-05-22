
document.domain = "vocareum.com";
parent.iframeWindow = window;

function toggleAnswers()
{
  console.log("toggle answers ...");

  var items = document.getElementsByClassName("voc_answers");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    item.style.display = "block";
  }
}


function saveData(data)
{
  console.log("Saving data: ");
  console.log(data);

  parent.vocSaveFormData(data)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log("ERROR");
      console.log(error)
    })
}

function vocOnBlur(event)
{
  console.log("saving one item...");

  if ((event == null) || (event.target == null))
  {
    saveAllData();
    return;
  }

  var data = {};

  item = event.target;
  data[item.id] = item.value;

  saveData(data);
}

function saveAllData()
{
  console.log("saving all...");

  var data = {};

  var items = document.getElementsByClassName("voc_textarea");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    data[item.id] = item.value;
  }

  var items = document.getElementsByClassName("voc_selector");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    data[item.id] = item.value;
  }

  var items = document.getElementsByClassName("voc_radio");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    data[item.id] = item.checked;
  }

  saveData(data);
}

function retrieveData()
{
  console.log("retrieving...");

  parent.vocRetrieveFormData()
    .then(data => {
      console.log("THEN");
      console.log(data);
      try {
        var result = JSON.parse(data);
        console.log(result);
        for (r in result) {
          item = document.getElementById(r);
          if (item) {
            if (item.type === 'radio') {
              item.checked = result[r];
            } else {  
              item.value = result[r];
            }
          }
        } 
      } catch(err) {
        // probably empty json
      }
    })
    .catch(error => {
      console.log("ERROR");
      console.log(error)
    })
}

window.onload = function() {
  retrieveData();
};
