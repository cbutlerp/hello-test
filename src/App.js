import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {WhoPlaysWhoList, DivButtons} from './WhoPlaysWho';
import {QuickSetUp} from './QuickSetUp';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import format from 'date-fns/format'; //a dateformatter easy to use
import addDays from 'date-fns/add_days';
import addHours from 'date-fns/add_hours';

import Datetime from 'react-datetime';  //date & time picker & css below
import './react-datetime.css';
//import moment from 'moment';  //need this dateformatter for picker above

import DownloadLink from 'react-download-link';

//const random = require('lodash/fp/random');
import flatten from 'lodash/flatten';

import Dropzone from 'react-dropzone';

import Baby from 'babyparse';

import { readFileSync, readFile } from 'fs';
import { join } from 'path';



//--------Set up global Constants--------------------
/*
  const teamIDs =
    Array.from({length: numteams}, (v,i) => i);
  const teamNames =
    Array.from({length: numteams}, (v,i) => "Team " + (i + 1))
*/

let now = new Date();
//console.log(now);
//console.log(moment(now).format('YYYY-MM-DD'));
//console.log(format(now, 'MM/DD/YYYY'));
//console.log(format(addDays(now, 3), 'MM/DD/YYYY'));
//console.log(format(addHours(now, i), 'h A'));


//-----------Begin Helper Functions ----------------
function getDateArrObj (numgamedates) {
  const dateArrObj = []
  for (let i=0; i < numgamedates; i++) {
    dateArrObj.push(
      {dateID: i,
       date: format(addDays(now, 30+(i*7)), 'MM/DD/YYYY'), })
  }
  return dateArrObj; //console.log(JSON.stringify(dateArrObj));
}

function getTimeArrObj (numgametimes) {
  const timeArrObj = []
  for (let j=0; j < numgametimes; j++) {
    timeArrObj.push(
      {timeID: j, time: format(addHours(now, j), 'h A'), })
  }
  return timeArrObj; //console.log(JSON.stringify(timeArrObj));
}

function getDateTimeArrObj (numgamedates, numgametimes) {
  const datetimeArrObj = []
  let counter = -1;
  for (let i=0; i<numgamedates; i++) {
    for (let j=0; j<numgametimes; j++) {
    counter ++ ;
    datetimeArrObj.push(
      {datetimeID: counter,
       datetime: format(addHours(addDays(now, 30+(i*7)), j), 'YYYY-MM-DD ddd ha'), })
  }}
  return datetimeArrObj; //console.log(JSON.stringify(datetimeArrObj));
}

function getFieldArrObj (numfields) {
  const fieldArrObj = []
  for (let i=0; i<numfields; i++) {
    fieldArrObj.push(
    {fieldID:i, fieldName:("Field " + (i + 1)), })
  }
  return fieldArrObj;   //console.log(JSON.stringify(fieldArrObj));
}

function getGroupArrObj (numgroups, numgames) {
  const groupArrObj = []
  for (let i=0; i<numgroups; i++) {
    groupArrObj.push(
    {groupID:i,
     groupName:("Div " + (i + 1)),
     desiredGames: numgames, })
  }
  return groupArrObj;  //console.log(JSON.stringify(groupArrObj));
}

function getTeamArrObj (numteams) {
  const teamArrObj = []
  for (let j=0; j<numteams; j++) {
    teamArrObj.push(
    {teamID:j, teamName:("Team " + (j + 1)), defaultOrder:j})
  }
  return teamArrObj;   //const teamJson = JSON.stringify(teamArrObj);
}

function getGroupTeamArrArr (numgroups, numteams, numfields) {
  //create empty 2 dimensional array
  for (var groupteamArrArr = []; groupteamArrArr.push([]) < numgroups;);
  //fill the 2 dimensional array
  let counter = -1;
  for (let i=0; i<numgroups; i++) {
    for (let j=0; j<numteams; j++) {
      counter ++;
      let fieldcounter = counter % numfields;
      groupteamArrArr[[i]].push(
        {groupID: i,
         groupName: "Div " + (i + 1),
         teamID: counter,
         teamName: "Team " + (counter+1),
         defaultOrder: j,
         preferOrder: "",
         groupteamName: ("Div" + (i + 1) + " Team" + (counter+1)),
         homeFieldID: fieldcounter,
         homeFieldName: ("Field " + (fieldcounter+1)) }, )
  }}
  return groupteamArrArr;
  //  console.log(JSON.stringify(groupteamArrArr[8][14]));
}

function getPreferOrder (groupteamArrArr) {
  //fill the 2 dimensional array preferOrder variable
  for (let i=0; i<groupteamArrArr.length; i++) {  //eq to numgroups
    for (let j=0; j<groupteamArrArr[i].length; j++) {  //eq to numteams in group
      groupteamArrArr[i][j].preferOrder = j;
    }
  }
  return groupteamArrArr;
}

//----------------end helper functions -----------

function Welcome(props) {
  return <div>Howdy {props.user}</div>
}

//------------------------------------------------

const SortableItem = SortableElement(({value}) =>
  <li className="SortableItem">{value}</li>
);

const SortableList = SortableContainer(({teamrows}) => {
  return (
    <ul className="SortableList">
      {teamrows.map((teamrow, index) => (
        <SortableItem key={`item-${index}`} index={index} value={teamrow.groupteamName} />
      ))}
    </ul>
  );
});
//-------End Sortable List Component ----------------------

// function QuickSetUp(props) {

//-----------------------------------------------------

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      numgames: 8,
      numgamedates: 12,
      numgametimes: 4,
      numteams: 15,
      numgroups: 9,
      numfields: 20,
      teamOfInterest: 4, // index Math.ceil(numgames / 2)
      groupOfInterest: 0,
      date_ArrObj: [],
      time_ArrObj: [],
      datetime_ArrObj: [],
      field_ArrObj: [],
      group_ArrObj: getGroupArrObj(9, 8),
      team_ArrObj: getTeamArrObj(15),
      groupteam_ArrArr: getGroupTeamArrArr(9,15,20),
      csvfile: '' ,
      uploadedteamfile: '',
      teamUploadFile: [],
    };

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.onChangeDemo = this.onChangeDemo.bind(this);
    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onClickGroupButton = this.onClickGroupButton.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.uploadFile = this.uploadFile.bind(this);

  }
/*
  componentDidMount() {
  this.timerID = setInterval(
    () => this.tick(),
    1000
  );
}

tick() {
  this.setState({
    date: new Date()
  });
}
*/
  componentDidMount() {
    this.setState({
      date_ArrObj: getDateArrObj(this.state.numgamedates),
      time_ArrObj: getTimeArrObj(this.state.numgametimes),
      datetime_ArrObj: getDateTimeArrObj(this.state.numgamedates,
        this.state.numgametimes),
      field_ArrObj: getFieldArrObj(this.state.numfields),
    })
  }

  toggleVisibility(ev) {
    console.log("ev.target.parentNode.id: " + ev.target.parentNode.id)
    let refName = ev.target.parentNode.id;
    this.refs[refName].style.display==="none" ?
        this.refs[refName].style.display="block" :
        this.refs[refName].style.display="none"  ;
  }

  onChangeDemo(ev) {
    let name = ev.target.name;
    if (name === "numgames") {
      this.setState({numgames: ev.target.value ,
        teamOfInterest: Math.ceil(ev.target.value / 2)  , })
    }
    if (name === "numgamedates") {
      this.setState({
        numgamedates: ev.target.value ,
        date_ArrObj: getDateArrObj(ev.target.value),
        datetime_ArrObj: getDateTimeArrObj(ev.target.value,
          this.state.numgametimes),
      })
    }
    if (name === "numgametimes") {
      this.setState({
        numgametimes: ev.target.value ,
        time_ArrObj: getTimeArrObj(ev.target.value),
        datetime_ArrObj: getDateTimeArrObj(this.state.numgamedates,
          ev.target.value),
       })
    }
    if (name === "numfields") {
      this.setState({
        numfields: ev.target.value ,
        field_ArrObj: getFieldArrObj(ev.target.value),
      })
    }
    if (name === "numgroups") {
      this.setState({
        numgroups: ev.target.value ,
        group_ArrObj: getGroupArrObj(ev.target.value, this.state.numgames),
        groupteam_ArrArr: getGroupTeamArrArr(ev.target.value,
          this.state.numteams, this.state.numfields),
      })
    }
    if (name === "numteams") {
      this.setState({
        numteams: ev.target.value ,
        team_ArrObj: getTeamArrObj(ev.target.value),
        groupteam_ArrArr: getGroupTeamArrArr(this.state.numgroups, ev.target.value, this.state.numfields),
      })
    }
  }

  onClickGroupButton(ev) {
    //reset the "group of interest" state :
    var groupi = parseInt(ev.target.dataset.groupi, 10);
    this.setState({groupOfInterest: groupi   });
    //console.log("groupoOfInterest is:  " + groupi);
  }

  highlight(ev) {
    //reset the "team of interest" state upon mouseover:
    var teami = parseInt(ev.target.dataset.teami, 10);
    this.setState({teamOfInterest: teami   });
    //console.log("teamOfInterest is:  " + teami);

    ev.target.style.cursor='pointer';
    ev.target.style.background = 'white';
  }

  unhighlight(ev) {
      ev.target.parentNode.style.background = 'lightgray';
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    /*console.log("oldIndex: " + oldIndex + " newIndex: "+ newIndex);
      this.setState({
        team_ArrObj: arrayMove(this.state.team_ArrObj, oldIndex, newIndex),
      })
    */
      let reorderedTeamRows =
        arrayMove(this.state.groupteam_ArrArr[this.state.groupOfInterest], oldIndex, newIndex);
      let reorderedArrArr = this.state.groupteam_ArrArr;
      reorderedArrArr[this.state.groupOfInterest] = reorderedTeamRows;
      this.setState({
        groupteam_ArrArr: reorderedArrArr ,
      })
    }

  saveData() {
    this.setState({
      groupteam_ArrArr: getPreferOrder (this.state.groupteam_ArrArr) ,
    })
    //CREATE CSV FILE from ArrArrObj
      const groupteamArrArrObj = this.state.groupteam_ArrArr;
      let csvArrObj = flatten(groupteamArrArrObj); //lodash's flatten
      //console.log(csvArrObj)

      // handle stringify's null values with replacer argument
      const replacer = (key, value) => value === null ? '' : value
      const header = Object.keys(groupteamArrArrObj[0][0])
      //console.log(header)
      let csv = csvArrObj.map(oneteamobj =>
               header.map(fieldName =>
                 JSON.stringify(oneteamobj[fieldName], replacer)).join(','))
      csv.unshift(header.join(','))
      csv = csv.join('\r\n')
      //console.log(csv)

    this.setState({
      csvfile: csv ,
    })
  }

  handleFiles (ev) {
    ev.preventDefault();

    console.log("1. ev.target.id: " + ev.target.id)
    var files = ev.target.files;
    //let fileToRead = files[0]
    var file = files[0];
    console.log("1b. file: " + file + "this is a 'File' Object");
    var count = files.length;

    let read = new FileReader();  //the actual read command occurs at bottom

    //return {teamUploadFile: xxx}
    //console.log("1c. JSON.stringify(this.state)" + JSON.stringify(this.state));
    console.log("1d.  files" + files);
    console.log("2. File Count: " + count);
    console.log("3. file: " + files[0] )

    read.onloadend = (function(e) {
      //console.log("4. read.result: " + read.result); //result of read.readasText...
      //console.log("4. e.target.result: " + e.target.result); //same as above
      console.log("5. Got the file\n"
            +"name: " + file.name + "\n"
            +"type: " + file.type + "\n"
            +"size: " + file.size + " bytesn\n"
            + "headers: " + read.result.substr(0, read.result.indexOf("\n")));

      let contents = read.result;  //this is the text string
      newfunction (contents)
    })

    function newfunction (contents) {
      //turn the text into a JSON object
      let config = { header: true, dynamicTyping: true}
      let babypO = Baby.parse (contents, config);
      console.log("6. Baby.parse obj of 3 arrays(data, errors, meta): babypO", babypO);
      console.log("7. Grab the data ArrObj, babypO.data :", babypO.data)

      // Store
      localStorage.setItem("jj", babypO.data);
    }

    read.readAsText(file);

    // Retrieve
    let kk = localStorage.getItem("jj")

    this.setState({teamUploadFile: kk});
}


  //Dropzone's onDrop property: has 2 args (acceptedFiles, rejectedFiles)
  uploadFile (acceptedFiles, rejectedFiles) {
    let file = acceptedFiles[0]
    console.log('file.preview: ' + file.preview);
    console.log('Accepted files: ', acceptedFiles[0]);
    console.log('Rejected files: ', rejectedFiles);

    let config = {
      header: true,
      dynamicTyping: true,
    }

    let content

    let rows= Baby.parse (content, config);
    console.log(rows[1]);


        //let rows = Baby.parse(reader.result, config);
        //  console.log('rows.data[0].teamName : ' + rows.data[0].teamName ) ;
      //  console.log('rows.errors[0].message : ' +
      //    rows.errors.map( error => error.message) + '. delimiter:   ' +
      //    rows.meta.delimiter + '. linebreak:  ' +  rows.meta.linebreak + '. aborted: '+ rows.meta.aborted + '. fields: ' +  rows.meta.fields + '. truncated: ' +  rows.meta.truncated)
      //  }
/*
	delimiter: // Delimiter used
	linebreak: // Line break sequence used
	aborted:   // Whether process was aborted
	fields:    // Array of field names
	truncated: // Whether preview consumed all input
*/
    //console.log(rows[1].teamName)
    //this.setState({
    //  uploadedteamfile: JSON.stringify(newstuff[0]) ,
    //})

  }


/////////////////////
  render() {
    const totalGames =
      this.state.numgames * this.state.numteams * this.state.numgroups / 2 ;
    const inventory =
      this.state.numfields * this.state.numgamedates * this.state.numgametimes ;
    const result = totalGames > inventory ?
      <span style={{color:'red'}}>You need more date-time-locations</span> :
      <span style={{color:'green'}}>There seems to be enough date-time-locations, but depends on constraints</span> ;

      return (
      <div className="App">
        <div className="App-header">
          <span style={{position:'absolute', right:'10%', top:'10px', fontSize:'.8em'}}>
              <Welcome user="Cindy"/> </span>
          <img src={logo} className="App-logo" alt="logo" />
          <span style={{fontSize:'2em'}}>Game Scheduling App for Leagues</span>
        </div>

        <div className='Main'>
          <div className='LeftPanel'>

            <div id='inputData'>
              <h2>Input Your League Data</h2>

              <button onClick={this.saveData}>SAVE DATA</button><br/>
              <DownloadLink
                  filename="teamdata.csv"
                  label="Download Team Data as csv file"
                  exportFile={ () => this.state.csvfile } />

              <div id='quickSetUp' className='inputBox'
                    onClick={this.toggleVisibility}>
                <h4>1 Quick SetUp</h4>
              </div>
              <div id='datetimes' className='inputBox'
                  onClick={this.toggleVisibility}>
                <h4>2 Game Dates and Times</h4>
              </div>
              <div id='locations' className='inputBox'
                onClick={this.toggleVisibility}>
                <h4>3 Locations</h4>
              </div>
              <div id='teaminputs' className='inputBox'
                onClick={this.toggleVisibility}>
                <h4>4 Divisions and Teams</h4>
              </div>
              <div id='matchups' className='inputBox'
                    onClick={this.toggleVisibility}>
                <h4>5 Matchups</h4>
              </div>
              <div id='constraints' className='inputBox'
                onClick={this.toggleVisibility}>
                <h4>6 Constraints</h4>
              </div>
              <div id='customizations' className='inputBox'
                onClick={this.toggleVisibility}>
                <h4>7 Customizations</h4>
              </div>
            </div>
          </div>

          <div className='CenterPanel'>

            <div id='qs' ref='quickSetUp' style={{display:'none'}} className='centerBox'>
              <div id='quicksetup' className='centerLeftBox'>
                <h4>Quick Planner</h4>
                <QuickSetUp numgames={this.state.numgames}
                  numgamedates={this.state.numgamedates}
                  numgametimes={this.state.numgametimes}
                  numteams={this.state.numteams}
                  numgroups={this.state.numgroups}
                  numfields={this.state.numfields}
                  onChangeDemo={this.onChangeDemo}
                />
              </div>
              <div id='quicksummary' className='centerRightBox'>
                <h4>Quick Summary</h4>
                <p>You need to plan for {totalGames} games</p>
                <p>You have about {inventory}<br/>game date-time-locations available</p>
                <p>{result}</p>

              </div>
            </div>

            <div id='dt' ref='datetimes' style={{display:'none'}}>
              <h4>Pick your game dates and times: </h4>
            </div>

            <div id='loc' ref='locations' style={{display:'none'}}>
              <h4>Enter your venues: </h4>
                <form onSubmit={this.handleSubmit}>
                   <label>
                     Please Enter a list of your venues:
                     <textarea value='snowdrops'  />
                   </label>
                   <input type="submit" value="Submit" />
                 </form>
            </div>

            <div id='teaminputs' ref='teaminputs' style={{display:'block'}}>
              <h4>Enter your team info: </h4>
              <div id='parentofcsv'>
                  {JSON.stringify(this.state.teamUploadFile)}
              <input type='file' id='csvFileInput' onChange={this.handleFiles}
                          accept='text/csv' multiple='false' />
              <br/><br/><br/>
              </div>

                <Dropzone onDrop={this.uploadFile}
                  accept={'text/csv'} multiple={false}>

                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (isDragActive) {
                          return <div><img src={acceptedFiles.preview} role="presentation"  />
                                </div>
                        }
                        if (isDragReject) {
                          return <div>
                                  This file is NOT authorized
                                </div>
                        }
                        return acceptedFiles.length || rejectedFiles.length
                          ? `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`
                          : "Upload csv file \n click or drop"
                      }}

                </Dropzone>
            </div>

            <div id='mu' ref='matchups' style={{display:'none'}}>
              <h2>Who Plays Who<br/></h2>
             <DivButtons style={{float:'left'}}
                groupi={this.state.groupOfInterest}
                group_ArrObj={this.state.group_ArrObj}
                onClick={this.onClickGroupButton}
              /><br/>

              <div id='whoBox' className='whoBox'>
                <h2>Matchups for {this.state.group_ArrObj[ this.state.groupOfInterest].groupName}</h2>
                <h4>mouseover teams</h4>
                  <div id='whoInnnerBox' className='whoInnerBox'>
                    <WhoPlaysWhoList
                    groupi={this.state.groupOfInterest}
                    groupteam_ArrArr={this.state.groupteam_ArrArr}
                    group_ArrObj={this.state.group_ArrObj}
                    numgames={this.state.numgames}
                    teami={this.state.teamOfInterest}
                    onMouseEnter={this.highlight}  onMouseLeave={this.unhighlight}
                  />
                  </div>
              </div>

              <div id='sortTeamsBox' className='sortBox'>
                <h2>To Change</h2>
                <h4>drag teams to reorder</h4>
                  <SortableList teamrows={this.state.groupteam_ArrArr[this.state.groupOfInterest]}
                    onSortEnd={this.onSortEnd}
                    helperClass="SortableHelper"
                    lockAxis="y"
                    lockToContainerEdges={true}  />
              </div>
            </div>

            <div id='constraints' ref='constraints' style={{display:'none'}}>
              <h4>Enter your constraints: </h4>
            </div>

            <div id='customizations' ref='customizations' style={{display:'none'}}>
              <h4>Enter your customizations: </h4>
            </div>
          </div>

          <div className='RightPanel'>

            <div id='testbox' className='testbox'>
              <h2>Your state: </h2>
              <h4>Test Box</h4>
                <p>  </p>
                <Datetime />
                <p style={{fontSize:'40%'}}>  this.state.teamUploadFile:<br/> {this.state.teamUploadFile}</p>
                <p>  this.state.numgames: {this.state.numgames}</p>
                <p>  this.state.numgamedates: {this.state.numgamedates}</p>
                <p>  this.state.numgametimes: {this.state.numgametimes}</p>
                <p>  this.state.numfields: {this.state.numfields}</p>
                <p>  this.state.numgroups: {this.state.numgroups}</p>
                <p>  this.state.numteams: {this.state.numteams}</p>
                <p>  this.state.groupteam_ArrArr.length: { this.state.groupteam_ArrArr.length}</p>
                <p>  this.state.teamOfInterest: {this.state.teamOfInterest}</p>
                <p>  this.state.groupOfInterest: {this.state.groupOfInterest}</p>
                <p style={{fontSize:'50%'}}>this.state.date_ArrObj:<br/>
                {JSON.stringify(this.state.date_ArrObj)}</p>
                <p style={{fontSize:'50%'}}>this.state.time_ArrObj:<br/>
                {JSON.stringify(this.state.time_ArrObj)}</p>
                <p style={{fontSize:'50%'}}>this.state.datetime_ArrObj:<br/>
                {JSON.stringify(this.state.datetime_ArrObj)}</p>
                <p style={{fontSize:'50%'}}>this.state.field_ArrObj:<br/>
                {JSON.stringify(this.state.field_ArrObj)}</p>
                <p style={{fontSize:'50%'}}>this.state.group_ArrObj:<br/>
                {JSON.stringify(this.state.group_ArrObj)}</p>
                <p style={{fontSize:'50%'}}>this.state.team_ArrObj:<br/>
                {JSON.stringify(this.state.team_ArrObj)}</p>
                <p style={{fontSize:'50%'}}>this.state.groupteam_ArrArr:<br/>
                {JSON.stringify(this.state.groupteam_ArrArr)}</p>
            </div>
          </div>

        </div>

        <div className="App-footer">
          <p> &#169; 2017 Combinetics LLC</p>
        </div>

      </div>  //end of 'App' div
    );
  }
}

export default App;
