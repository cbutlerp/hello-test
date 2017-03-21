import React from 'react';

function QuickSetUp(props) {
  const numgames = props.numgames;
  const numgamedates = props.numgamedates;
  const numgametimes = props.numgametimes;
  const numteams = props.numteams;
  const numgroups = props.numgroups;
  const numfields = props.numfields;
  const onChangeDemo = props.onChangeDemo;

  return (
    <form>
    <label>
      Number of Games<br/>for each Team:<br/>(even only, odd not coded yet):
      <input
        name="numgames"
        type="number" min="2" max="20" step="2"
        value={numgames}
        onChange={onChangeDemo} />
    </label> <br/><br/>
    <label>
      Number of Game Dates:<br/>
      <input
        name="numgamedates"
        type="number" min="1" max="30"
        value={numgamedates}
        onChange={onChangeDemo} />
    </label> <br/><br/>
    <label>
      Number of Game Times <br/>per date (approx):<br/>
      <input
        name="numgametimes"
        type="number" min="1" max="24"
        value={numgametimes}
        onChange={onChangeDemo} />
    </label> <br/><br/>
    <label>
      Number of Locations:<br/>
      <input
        name="numfields"
        type="number" min="1" max="50"
        value={numfields}
        onChange={onChangeDemo} />
    </label> <br/><br/>
    <label>
      Number of Divisions<br/>(teams play others in same):
      <input
        name="numgroups"
        type="number" min="1" max="16"
        value={numgroups}
        onChange={onChangeDemo} />
    </label> <br/><br/>
    <label>
      Number of Teams per Division<br/>(approx):<br/>
      <input
        name="numteams"
        type="number" min="2" max="50"
        value={numteams}
        onChange={onChangeDemo} />
    </label> <br/><br/>
    </form>
  )
}

export {QuickSetUp};
