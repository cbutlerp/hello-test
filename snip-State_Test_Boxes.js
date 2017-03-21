//put in the render return of the Component
<div id='boxc' className='box'>
  <h2>Put Test Functions Here</h2>
  <h4>Box C</h4>
    <div style={{fontSize:'100%', position:"relative"}}>
      <SpanItems teami={this.state.teamOfInterest}
        team_ArrObj={this.state.team_ArrObj} />
    </div>
</div>


<div id='testbox' className='testbox'>
  <h2>Your state: </h2>
  <h4>Test Box</h4>
    <p>  this.state.numteams: {this.state.numteams}</p>
    <p>  this.state.teamOfInterest: {this.state.teamOfInterest}</p>
    <p style={{fontSize:'50%'}}>this.state.team_ArrObj:<br/>
    {JSON.stringify(this.state.team_ArrObj)}</p>
</div>

//------------fucntion, put above the Component
function SpanItems(props) {
  var teami = props.teami;
  var teams = props.team_ArrObj;
  var oppoHs = getHomeOpponentIDs(teami,numgames,numteams);
  var oppoAs = getAwayOpponentIDs(teami,numgames,numteams);

  var hSpan = oppoHs.map((oppoH, i) =>
        <span key={i.toString()} index={i.toString()} data-teami={oppoH.toString()} >
          {teams[teami].teamName} vs {teams[oppoH].teamName} Home matchup<br/>
        </span>
    );

  var aSpan = oppoAs.map((oppoA, i) =>
        <span key={i.toString()} index={i.toString()}  data-teami={oppoA.toString()} >
          {teams[oppoA].teamName} vs {teams[teami].teamName} Away matchup<br/>
        </span>
    );
  return( <p>{hSpan} {aSpan} </p>)
}
//-----------------------------------------------
