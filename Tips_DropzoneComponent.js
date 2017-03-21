//this goes into the package.json file:
    "react-dropzone-component": "^1.4.1",
//this goes into the App.js file:
    import DropzoneComponent from 'react-dropzone-component';
    import '../node_modules/react-dropzone-component/styles/filepicker.css'
    import '../node_modules/dropzone/dist/min/dropzone.min.css'

var componentConfig = {
    iconFiletypes: ['.csv'],
    showFiletypeIcon: true,
    postUrl: '/',
    djsConfig :{ autoProcessQueue: true },
    eventHandlers : { addedfile: (file) => console.log(file) },
};

//Next I put the following in global variables put they could go in event handlers:
//To provide a single callback, simply override one of these events with your function reference. If you want to provide multiple callbacks, simply provide an array with your function references.

var callbackArray = [
    function () {
        console.log('Look Ma, I\'m a callback in an array!');
    },
    function () {
        console.log('Wooooow!');
    }
];

var simpleCallBack = function () {
    console.log('I\'m a simple callback');
};

var eventHandlers = {
    // This one receives the dropzone object as the first parameter
    // and can be used to additional work with the dropzone.js
    // object
    init: null,
    // All of these receive the event as first parameter:
    drop: callbackArray,
    dragstart: null,
    dragend: null,
    dragenter: null,
    dragover: null,
    dragleave: null,
    // All of these receive the file as first parameter:
    addedfile: simpleCallBack,
    removedfile: null,
    thumbnail: null,
    error: null,
    processing: null,
    uploadprogress: null,
    sending: null,
    success: null,
    complete: null,
    canceled: null,
    maxfilesreached: null,
    maxfilesexceeded: null,
    // All of these receive a list of files as first parameter
    // and are only called if the uploadMultiple option
    // in djsConfig is true:
    processingmultiple: null,
    sendingmultiple: null,
    successmultiple: null,
    completemultiple: null,
    canceledmultiple: null,
    // Special Events
    totaluploadprogress: null,
    reset: null,
    queuecomplete: null
}
//this goes where you want to render it, but I couldn't get it to work past added file!!!
<DropzoneComponent
  config={{iconFiletypes: ['.csv'],
  showFiletypeIcon: true, postUrl: 'no url'}}
  eventHandlers={{addedfile: this.handleFileAdded, success: this.success}}
  djsConfig={{addRemoveLinks:true, acceptedFiles:"text/csv",
    autoProcessQueue:false }}
  />
//this goes in the handler functions area:
this.handleFileAdded = this.handleFileAdded.bind(this);
this.success = this.success.bind(this);

  handleFileAdded (file) {
    console.log('Object.keys(file):  ' + Object.keys(file));
    console.log(file.upload);
    console.log(file.status);
  }

  success (file) {
    console.log('uploaded', file.upload);
  }
