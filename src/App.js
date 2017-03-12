import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
//const random = require('lodash/fp/random');

function Welcome(props) {
  return <div>Howdy {props.user}</div>
}

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

//----------------end helper functions -----------

//Set up Constants:
const numteams = 12;
const numgames = 8;
const teamIDs =
  Array.from({length: numteams}, (v,i) => i);
const teamNames =
  Array.from({length: numteams}, (v,i) => "Team " + (i + 1))

const teamArrObj = []
for (let i=0; i<numteams; i++) {
  teamArrObj.push(
  {teamID:i, teamName:("Team " + (i + 1)), defaultOrder:i}
  )
}
//console.log(teamArrObj[11].defaultOrder);
//console.log(teamArrObj[5].teamName);

const teamJson = JSON.stringify(teamArrObj);
//console.log(teamJson);

//------------------------------------------------------
  const SortableItem = SortableElement(({value}) =>
    <li className="SortableItem">{value}</li>
  );

  const SortableList = SortableContainer(({items}) => {
    return (
      <ul className="SortableList">
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value.teamName} />
        ))}
      </ul>
    );
  });

//-----------------------------------------------------
function Test() {
  return (<p> "This is a test" </p>)
}  //--------------------------------------------------

function WhoPlaysWhoList(props) {
  const onMouseEnter = props.onMouseEnter;
  const onMouseLeave = props.onMouseLeave;
  var teami = props.teami;
  var teams = props.team_ArrObj;

  const oppoHs = getHomeOpponentIDs(teami,numgames,numteams);
  const oppoAs = getAwayOpponentIDs(teami,numgames,numteams);
  //console.log ("oppoHs: " +oppoHs + "  oppoAs: "+ oppoAs);

  function whoTopStyle (oppo) {
      const top = (oppo * 1/numteams * 100);
      return (top+'%') }

  const hSpans = oppoHs.map((oppoH, i) =>
      <span  id={"h"+oppoH} className="whotip whohometip"
        style={{ position:'absolute', top:whoTopStyle(oppoH)}}
        >
        {teams[teami].teamName} vs {teams[oppoH].teamName} -- Home<br/>
      </span>
    );

  const aSpans = oppoAs.map((oppoA, i) =>
      <span  id={"a"+oppoA} className="whotip whoawaytip"
        style={{ position:'absolute', top:whoTopStyle(oppoA)}}
        >
        {teams[oppoA].teamName} vs {teams[teami].teamName} -- Away<br/>
      </span>
    );

  const iaSpan =
      <span id={"ta"+teami} className="whotip"
        style={{ position:'absolute', top:whoTopStyle(teami-.5),
        left:'41%', color:'purple', fontSize:'75%'}}
        >
        &#8593; Away Matchups &#8593;<br/>
      </span>
  const ihSpan =
      <span id={"th"+teami} className="whotip"
        style={{ position:'absolute', top:whoTopStyle(teami+.35),
        left:'41%', color: 'blue', fontSize:'75%'}}
        >
        &#8595; Home Matchups &#8595;
      </span>

  function whoboxStyle (i, teami) {
      if (i === teami) {return {background:'white', color:'black'} }
      if (oppoAs.includes(i)) {return {background:'#fdf7ef'} }
      if (oppoHs.includes(i)) {return {background:'#fdf7ef'} }
      else {return {background:'#F3F3F3', color:'lightgray'} }
  }

  const teamlist = teams.map((team, i) =>
      <li key={"t"+ i}  id={"t"+ i}  data-teami={i.toString()}
         style={whoboxStyle(i, teami) }
         onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        >
          {teams[i].teamName}
      </li>
    )

return ( <ul> {teamlist} {aSpans} {hSpans}
              {iaSpan} {ihSpan} </ul> )
}
// end of WhoPlaysWhoList Component -------------------------------------

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      numteams: 12,
      teamOfInterest: Math.ceil(numgames / 2),
      team_ArrObj: teamArrObj,
    };
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
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
  toggleVisibility(ev) {
    console.log("ev.target.parentNode.id: " + ev.target.parentNode.id)
    let refName = ev.target.parentNode.id;
    this.refs[refName].style.visibility==="hidden" ?
        this.refs[refName].style.visibility="visible" :
        this.refs[refName].style.visibility="hidden"  ;
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    //console.log("oldIndex: " + oldIndex + "   newIndex: "+ newIndex);
      this.setState({
        team_ArrObj: arrayMove(this.state.team_ArrObj, oldIndex, newIndex),
      })
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
/////////////////////
  render() {

      return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Game Scheduling App for Leagues</h2>
        </div>

        <div className='Main'>
          <p> <Welcome user="Cindy"/> </p>

          <div id='inputBox' className='box'>
            <h2>Input Your League Data</h2>
            <div id='input1' className='inputBox'>
              <h4>1 Quick SetUp</h4>
            </div>
            <div id='input2' className='inputBox'>
              <h4>2 Game Dates and Times</h4>
            </div>
            <div id='input3' className='inputBox'>
              <h4>3 Locations</h4>
            </div>
            <div id='input4' className='inputBox'>
              <h4>4 Teams</h4>
            </div>
            <div id='matchups' className='inputBox'
                  onClick={this.toggleVisibility}>
              <h4>5 Matchups</h4>
            </div>
            <div id='input6' className='inputBox'>
              <h4>6 Constraints</h4>
            </div>
            <div id='input7' className='inputBox'>
              <h4>7 Customizations</h4>
            </div>
          </div>

          <div id='mu' ref='matchups'
                style={{visibility:'hidden'}}>
            <div id='whoBox' className='whoBox'>
              <h2>Who Plays Who<br/>Matchups for {this.state.team_ArrObj[ this.state.teamOfInterest].teamName}</h2>
              <h4>(mouseover other teams, don't drag)  </h4>
                <div id='whoInnnerBox' className='whoInnerBox'>
                  <WhoPlaysWhoList  onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} teami={this.state.teamOfInterest}
                  team_ArrObj={this.state.team_ArrObj}/>
                </div>
            </div>

            <div id='sortTeamsBox' className='box'>
              <h2>To Change Matchups</h2>
              <h4>(drag/drop teams to reorder)  </h4>
                <SortableList items={this.state.team_ArrObj}
                          onSortEnd={this.onSortEnd}
                          helperClass="SortableHelper"
                          lockAxis="y"
                          lockToContainerEdges="true"  />
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
