function makeTeamList (team_Obj, hasPreferOrder){
  for (let i = 0; i< team_Obj.length; i++){
    <li key={team_Obj[i].teamID.toString()} id={"t"+ i} data-teami={team_Obj[i].teamID.toString()}
       //className={'whobox #t' + i}
       style={whoboxStyle(i, teami) }
       onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
         >
        {team_Obj[i].teamName}
    </li>
  }
}

const teamlist = makeTeamList(team_Obj, hasPreferOrder);
