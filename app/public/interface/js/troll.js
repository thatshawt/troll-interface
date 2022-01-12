$("#submit").click(async () => {

    var data = {}//the json data we are gonna send
    //turn form data into a json thing we can send
    $("form").serializeArray().forEach(element => {
      data[element.name] = element.value;
    });

    fetch("/api/troll/addConfig", {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      //redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => {
      response.json().then((data) =>{
        console.log(data)
        $("#result").text(data.result);
        $("#result").attr("href", data.result);
      })
    })
    // var result = response.json()//.result;
    // console.log(result)
    // $("#result").text(result);
    // $("#result").attr("href", result);
  })