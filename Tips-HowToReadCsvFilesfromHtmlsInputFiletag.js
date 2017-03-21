handleFiles (ev) {
  ev.preventDefault();
  console.log("1. ev.target.id: " + ev.target.id)
  var files = ev.target.files;
  var file = files[0];
  console.log("1b. file: " + file + "this is a 'File' Object");

  //let fileToRead = files[0]
  var count = files.length;
  console.log("2. File Count: " + count);
  console.log("3. file: " + files[0] )

  let contents ; //init variable outside function

  var read = new FileReader();

  read.onload = function(ev) {
      console.log("4. read.result: " + read.result); //result of read.readasText...

      contents = ev.target.result;

      console.log("5. Got the file\n"
            +"name: " + file.name + "\n"
            +"type: " + file.type + "\n"
            +"size: " + file.size + " bytesn"
            + "headers: " + contents.substr(0, contents.indexOf("\n")));

      //turn the text into a JSON object
      let config = { header: true, dynamicTyping: true}
      let babypO= Baby.parse (contents, config);
      console.log("6. Baby.parse obj of 3 arrays(data, errors, meta): babypO", babypO);
      console.log("7. Finally grab the data array of objects, babypO.data :", babypO.data)

      contents = babypO.data;

      pleaseSet(babypO.data)
    }

  read.readAsText(file);

  read.onloadend=function(e) {
    //contents = babypO.data
    console.log("8. from onloadend function, new contents: " + contents);
    pleaseSet(contents)
  }

  function pleaseSet (x) {
    console.log("9. from pleaseSet func- x[0].groupName: " + x[0].groupName);
  }

  //this setstate doesnt work cuz readfile hasn't loaded yet before it runs!!!!
  this.setState({teamUploadFile: contents[0].groupName, })

}
