
function OrigOrderTeamList(props) {
  const teamsArrObj = props.team_Obj;
  const listItems = teamsArrObj.map((team, i) =>
    <li key={team.teamID.toString()} data-teami={i.toString()}
      draggable={true}  >
      {team.teamName}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
//-------------------------------------------------------------------------

function PrefOrderTeamList(props) {
  const onDragEnter = props.onDragEnter;
  const onDragOver = props.onDragOver;
  const onDragLeave = props.onDragLeave;
  const onDrop = props.onDrop;
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

this.handleClickClear = this.handleClickClear.bind(this);
this.handleClickSave = this.handleClickSave.bind(this);


<div id='boxb' className='box'>
  <h2>Preferred Order</h2>
  <h4>Box B</h4>
    <PrefOrderTeamList onDrop={this.drop} onDragOver={this.allowDrop}
    onDragLeave={this.dragLeave} onDragEnter={this.dragEnter} />
</div>
