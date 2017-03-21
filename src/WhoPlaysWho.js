import React from 'react';

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

function WhoPlaysWhoList(props) {
  const onMouseEnter = props.onMouseEnter;
  const onMouseLeave = props.onMouseLeave;
  let groupi = props.groupi;
  let teami = props.teami;
  let group_ArrObj = props.group_ArrObj // get desiredgames in here
  let groupteamArrArr = props.groupteam_ArrArr;

  //let teams = groupteamArrArr[0];  //how to subset the 2 dim ArrArr
  //teams is an array of only group 0s!! Awesome!
  //console.log("teams[1]: " + JSON.stringify(teams[1]));
  let teams = groupteamArrArr[groupi];  //get only teams from groupi
  let numteams = teams.length;
  let numgames = group_ArrObj[groupi].desiredGames;

  const oppoHs = getHomeOpponentIDs(teami,numgames,numteams);
  const oppoAs = getAwayOpponentIDs(teami,numgames,numteams);
  //console.log ("oppoHs: " +oppoHs + "  oppoAs: "+ oppoAs);

  function whoTopStyle (oppo) {
      const top = (oppo * 1/numteams * 100);
      return (top+'%') }

  const hSpans = oppoHs.map((oppoH, i) =>
      <span  key={i.toString()} id={"h"+oppoH} className="whotip whohometip"
        style={{ position:'absolute', top:whoTopStyle(oppoH)}}
        >
        {teams[teami].teamName} vs {teams[oppoH].teamName} -- Home<br/>
      </span>
    );

  const aSpans = oppoAs.map((oppoA, i) =>
      <span  key={i.toString()} id={"a"+oppoA} className="whotip whoawaytip"
        style={{ position:'absolute', top:whoTopStyle(oppoA)}}
        >
        {teams[oppoA].teamName} vs {teams[teami].teamName} -- Away<br/>
      </span>
    );

  const iaSpan =
      <span id={"ta"+teami} className="whotip"
        style={{ position:'absolute', top:whoTopStyle(teami-.3),
        left:'35%', color:'purple', fontSize:'65%'}}
        >
        &#8593; Away Matchups &#8593;<br/>
      </span>
  const ihSpan =
      <span id={"th"+teami} className="whotip"
        style={{ position:'absolute', top:whoTopStyle(teami+.3),
        left:'35%', color: 'blue', fontSize:'65%'}}
        >
        &#8595; Home Matchups &#8595;
      </span>

  function whoboxStyle (i, teami) {
      if (i === teami) {return {background:'white', color:'black',
        boxShadow: '5px 5px 8px 5px rgba(0, 0, 0, 0.2), -5px -5px 8px 5px rgba(0, 0, 0, 0.2)'} }
      if (oppoAs.includes(i)) {return {background:'#fdf7ef'} }
      if (oppoHs.includes(i)) {return {background:'#fdf7ef'} }
      else {return {background:'#F3F3F3', color:'lightgray'} }
  }

  const teamlist = teams.map((team, i) =>
      <li key={"t"+ i}  id={"t"+ i}  data-teami={i.toString()}
         style={whoboxStyle(i, teami) }
         onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        >
          {teams[i].groupteamName}
      </li>
    )

return (
  <ul> {teamlist} {aSpans} {hSpans} {iaSpan} {ihSpan} </ul>
  )
}
// end of WhoPlaysWhoList Component -------------------------------------

function DivButtons(props) {
  //let groupi = props.groupi;
  //don't need cuz demo auto picks grp 1 in sortable team lists
  let groups = props.group_ArrObj;
  const onClick = props.onClick;

  const groupButtons = groups.map((group, i) =>
     <button key={i.toString()} data-groupi={i.toString()} onClick={onClick}
       style={{boxShadow:'3px 3px 2px 2px rgba(0, 0, 0, 0.2), 3px 5px 2px 2px rgba(0, 0, 0, 0.2)'}}>
         {group.groupName}
     </button>
  )
  return (  <div> {groupButtons} </div>  )
 }
// end of DivButtons Component -------------------------------------

export {WhoPlaysWhoList, DivButtons};
