import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//const random = require('lodash/fp/random');


function Welcome(props) {
  return <div>Howdy {props.user}</div>
}

//C tips: how to use styling in JSX
//  style={{background:"white", border:"1px solid #333", boxShadow:"0px 0px 10px 5px #ccc inset", boxSizing:"border-box"}}

//-----------Begin Helper Functions ----------------
// 1- Continuously Loop thru Array, either forward or backward
//    if i is negative, wrap around the array at the top
//    if i is greater than length = n, wrap around the array at the bottom
function arrayLoopIndex (i, n) {
  if (i < 0)  {i = (i % n) + n}
  if (i >= n) {i = (i % n) }
  return i;
  }
//    to test arrayLoopIndex above for array of length 12:
//for (var i=-13; i<13; i++) {console.log(i + ": " + arrayLoopIndex(i, 12))}

// 2- Get opponentIDs -- eligible opponents for teami are
//    within +/- numgames/2 (if even numgames only! )
//    homegames, ie teamID is greater than teami
//    away games, ie teamID is less than teami
function getHomeOpponentIDs (teami, numgames, numteams) {
  // if numgames is even
  if (numgames % 2 === 0) {
    const numHomeGames = numgames/2 ;
    const homeOpponentIDs =
      Array.from({length: numHomeGames}, (v,i) =>
        arrayLoopIndex( (teami + i + 1), numteams) );
    return homeOpponentIDs;
  }}
//   to test getHomeOpponentIDs above for 12 teams, 8 games:
//for (var i=0; i<12; i++) {console.log(i + ": " + getHomeOpponentIDs(i, 8, 12))}

function getAwayOpponentIDs (teami, numgames, numteams) {
  // if numgames is even
  if (numgames % 2 === 0) {
    const numAwayGames = numgames/2 ;
    const awayOpponentIDs =
      Array.from({length: numAwayGames}, (v,i) =>
        arrayLoopIndex( (teami - i - 1), numteams) );
    return awayOpponentIDs;
  }}
//  to test getAwayOpponentIDs above for 12 teams, 8 games:
//for (var i=0; i<12; i++) {console.log(i + ": " + getAwayOpponentIDs(i, 8, 12))}

/*
//3- A helper function to subset array by filtering, using refs inthis case:
const refs = Object.keys(this.refs);
function filterRefs(query) {
  const jj = refs.filter(ref => ref.indexOf(query) > -1);
    //console.log(filterRefs('a')); // ['a0', 'a1','a2', 'a3']
  const kk = jj.map(j => "t" + j.slice(1));
   //console.log(filterRefs('a'));  ['0', '1','2', '3']
  return kk;
}
const teamawayrefs=filterRefs("a");
const teamhomerefs=filterRefs("h");
console.log(teamawayrefs); // ['a0', 'a1','a2', 'a3']
console.log(teamhomerefs); // ['a0', 'a1','a2', 'a3']
*/

//----------------end helper functions -----------

//Set up Constants:
const numteams = 12;
const numgames = 8;
const teamIDs =
  Array.from({length: numteams}, (v,i) => i);
const teamNames =
  Array.from({length: numteams}, (v,i) => "Team " + (i + 1))

const teamObj = []
for (let i=0; i<numteams; i++) {
  teamObj.push(
  {teamID:i, teamName:("Team " + (i + 1)), defaultOrder:i, preferOrder:""}
  )
}
console.log(teamObj[11].defaultOrder);
console.log(teamObj[5].teamName);

const teamObjJson = JSON.stringify(teamObj);
console.log(teamObjJson);

//-------------------------------------------------------------------------
  function OrigOrderTeamList(props) {
    const onDragStart = props.onDragStart;
    const onDragEnd = props.onDragEnd;
    const listItems = teamIDs.map((teamID) =>
      <li key={teamID.toString()} data-teami={teamID.toString()}
        data-deforder={teamID.toString()} data-preforder={""}
        draggable={true}
        onDragStart={onDragStart} onDragEnd={onDragEnd}
        >
        {teamNames[teamID]}
      </li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }

//-------------------------------------------------------------------------
function PrefOrderTeamList(props) {
  const onDragOver = props.onDragOver;
  const onDrop = props.onDrop;
  const onDragEnter = props.onDragEnter;
  const onDragLeave = props.onDragLeave;
  const listItems = teamIDs.map((teamID) =>
    <li key={teamID.toString()} data-teami={teamID.toString()}
      data-deforder={""} data-preforder={teamID.toString()}
      onDragOver={onDragOver} onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{color:'lightgray'}}
      >
      drag here
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}  //-------------------------------------------------------------------------

function Test() {
  return (<p> "This is a test" </p>)
}  //-------------------------------------------------------------------------

function SpanItems(props) {
  var teami = props.teami;
  var oppoHs = getHomeOpponentIDs(teami,numgames,numteams);
  var oppoAs = getAwayOpponentIDs(teami,numgames,numteams);
  //console.log ("oppoHs: " +oppoHs + "  oppoAs: "+ oppoAs);

  var hSpan = oppoHs.map((oppoH, i) =>
        <span key={i.toString()} index={i.toString()} data-teami={oppoH.toString()}
          //className="whotip whohometip"
          >
            {teamNames[teami]} vs {teamNames[oppoH]}Home matchup<br/>
        </span>
    );

  var aSpan = oppoAs.map((oppoA, i) =>
        <span key={i.toString()} index={i.toString()}  data-teami={oppoA.toString()}
          //className="whotip whoawaytip"
          >
            {teamNames[oppoA]} vs {teamNames[teami]} Away matchup<br/>
        </span>
    );
  return( <p>{hSpan} {aSpan} </p>)
}  //---------------------------------------------------------------

function WhoPlaysWhoList(props) {
  const onMouseEnter = props.onMouseEnter;
  const onMouseLeave = props.onMouseLeave;
  var teami = props.teami;
  var team_Obj = props.team_Obj;
  var hasPreferOrder = props.hasPreferOrder;

  const oppoHs = getHomeOpponentIDs(teami,numgames,numteams);
  const oppoAs = getAwayOpponentIDs(teami,numgames,numteams);
  //console.log ("oppoHs: " +oppoHs + "  oppoAs: "+ oppoAs);

  function whotipStyle (oppo) {
      const top = (oppo * 1/numteams * 100) - (1/numteams);
      return (top+'%') }

  const hSpans = oppoHs.map((oppoH, i) =>
      <span key={i.toString()}  id={"h"+oppoH} className="whotip whohometip"
        style={{ position:'absolute', top:whotipStyle(oppoH)}}
        >
        {teamNames[teami]} vs {teamNames[oppoH]} -- Home<br/>
      </span>
    );

  const aSpans = oppoAs.map((oppoA, i) =>
      <span key={i.toString()}  id={"a"+oppoA} className="whotip whoawaytip"
        style={{ position:'absolute', top:whotipStyle(oppoA)}}
        >
        {teamNames[oppoA]} vs {teamNames[teami]} -- Away<br/>
      </span>
    );

  function whoboxStyle (i, teami) {
      if (i === teami) {return {background:'white', color:'black'} }
      if (oppoAs.includes(i)) {return {background:'lightblue', color:'gray'} }
      if (oppoHs.includes(i)) {return {background:'lightgreen', color:'gray'} }
      else {return {background:'lightgray', color:'gray'} }
  }

  const teamlist = teamIDs.map((teamID,i) =>
      <li key={teamID.toString()} id={"t"+ i} data-teami={teamID.toString()}
         //className={'whobox #t' + i}
         style={whoboxStyle(i, teami) }
         onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
           >
          {teamNames[teamID]}
      </li>
    )

return ( <ul style={{width:'80%'}}> {teamlist} {aSpans} {hSpans} </ul> )
} // end of WhoPlaysWhoList Component -------------------------------------

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      numteams: 12,
      team_i: Math.ceil(numteams / 2),
      hasPreferOrder: "false",
      dragTeamID: "",
      value: "snowdrop",
      teamObj: teamObj,

    };
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.drag = this.drag.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.drop = this.drop.bind(this);
    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);
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

  handleClickClear(ev) {
    for (let i = 0; i< teamObj.length; i++) {
      teamObj[i].preferOrder = "";
    }
    var parent = ev.target.parentNode;
    this.setState({value : parent.children[4].innerHTML,
                   teamObj: teamObj});
  }

  handleClickSave(ev) {
    const prefArray =
      Array.from({length: this.state.teamObj.length}, (v,i) => this.state.teamObj[i].preferOrder);
    var prefcheck;
    if(prefArray.every(x => Number.isInteger(x))) {
      prefcheck = "everybody has a pref";
      this.setState({teamObj: teamObj});
    } else {
      prefcheck = "not everybody has a pref";
    };
    this.setState({value : prefcheck});
  }


  drag(ev) {   //  onDragStart
      this.setState({dragTeamID: ev.target.dataset.teami });
      ev.dataTransfer.setData("text/plain", ev.target.innerHTML);
      ev.dataTransfer.effectAllowed = "move";
      ev.target.style.backgroundColor = 'rgba(0,0,0,.5)';
  }

  dragEnd(ev) {   //refers to original element that is being dragged
      ev.target.style.visibility = 'hidden';
  }

  // dragenter, dragover, dragleave, drop

  dragEnter(ev) {   //refers to droppable zone
    ev.target.style.border = '1px dashed blue';
  }

  dragLeave(ev) {   //refers to droppable zone
    ev.target.style.border = '1px solid gray';
  }

  allowDrop(ev) {  //on DragOver
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move"  // Set the dropEffect to move
  }

  drop(ev) {
      ev.preventDefault();
      let defOrder  = parseInt(this.state.dragTeamID); //number
      let prefOrder = parseInt(ev.target.dataset.preforder); //number
      teamObj[defOrder].preferOrder = prefOrder ; // put number into teamObject
      // this.setState({teamObj: teamObj}); //moved to ClickSave above

      let teamname = ev.dataTransfer.getData("text");
      ev.target.innerHTML= prefOrder + ".  " + teamname + "  " +
      "(OrigOrder: "  + defOrder + ")";

      ev.target.style.color="red";
  }

  highlight(ev) {
    //reset the "team of interest" state upon mouseover:
    var teami = parseInt(ev.target.dataset.teami);
    this.setState({team_i: teami   });
    //console.log("team_i is:  " + teami);

    ev.target.style.cursor='pointer';
    ev.target.style.background = 'white';
  }

/*-------------------Tips for Stlying ev.targets:
      //If you have refs, they are in an object and can be found thusly:
      console.log("Object.keys(this.refs)" + Object.keys(this.refs))
      console.log("Object.values(this.refs)" + Object.values(this.refs))
      console.log(Object.values(this.refs[13]));
      ev.target.innerHTML = this.refs.t4.innerHTML; //?I think this works
      this.refs.t1.innerHTML= this.refs.a5.innerHTML; //? I think this works
      ev.target.setAttribute("style", "color:purple");
      ev.target.setAttribute("value", "Hello World!"); //for inputs
      ev.target.getElementsByTagName("span")[1].style.visibility="visible";
      var parent = ev.target.parentNode
      var children = parent.children; // is array
      var child3 = parent.children[3];
      var child3 = children[3]; //shorter than above
*/

  unhighlight(ev) {
      ev.target.parentNode.style.background = 'lightgray';
  }


  render() {

      return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Who Plays Who</h2>
        </div>

        <div className='Main'>
          <p> <Welcome user="Cindy"/> </p>

          <div id='boxa' className='box'>
            <h2>Default Order</h2>
            <h4>Box A</h4>
              <button></button>
              <button></button>
              <OrigOrderTeamList onDragStart={this.drag} onDragEnd={this.dragEnd} onDragEnter={this.dragEnter}
                onDragLeave={this.dragLeave}
                onDrop={this.drop} onDragOver={this.allowDrop} />
          </div>

          <div id='boxb' className='box'>
            <h2>Preferred Order</h2>
            <h4>Box B</h4>
            <button onClick={this.handleClickClear}>Reset/Clear</button>
            <button onClick={this.handleClickSave}>Save</button>
              <PrefOrderTeamList onDrop={this.drop} onDragOver={this.allowDrop}
              onDragLeave={this.dragLeave} onDragEnter={this.dragEnter} />
          </div>

          <div id='boxc' className='box'>
            <h2>Who Plays Who</h2>
            <h4>Box C</h4>
              <div id='whobox' className='whobox' style={{height:'100%', position:'relative', marginLeft:'20%'}}>
                <WhoPlaysWhoList  onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} teami={this.state.team_i}
                hasPreferOrder={this.state.hasPreferOrder}
                team_Obj={this.state.teamObj}/>
              </div>
          </div>

          <p>Your state: </p>
          <p>  this.state.numteams: {this.state.numteams}</p>
          <p>  this.state.team_i: {this.state.team_i}</p>
          <p>  this.state.hasPreferOrder: {this.state.hasPreferOrder}</p>
          <p>  this.state.dragTeamID: {this.state.dragTeamID}</p>
          <p style={{fontSize:'50%'}}>this.state.teamObj:<br/>
          {JSON.stringify(this.state.teamObj)}</p>
          <p>  this.state.value: {this.state.value}</p>

          <div id='boxd' className='box'>
            <h2>Put Test Functions Here</h2>
            <h4>Box D</h4>
              <div style={{fontSize:'100%', position:"relative"}}>
                <SpanItems teami={this.state.team_i} />
              </div>
          </div>
        </div>
      </div>  //end of 'App' div
    );
  }
}

export default App;
