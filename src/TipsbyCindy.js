// how to use styling in JSX:
  style={{background:"white", border:"1px solid #333", boxShadow:"0px 0px 10px 5px #ccc inset", boxSizing:"border-box"}}

//--Tips for Stlying ev.targets:
    ev.target.setAttribute("style", "color:purple");
    ev.target.setAttribute("value", "Hello World!"); //for inputs
    ev.target.getElementsByTagName("span")[1].style.visibility="visible";
    var parent = ev.target.parentNode
    var children = parent.children; // is array
    var child3 = parent.children[3];
    var child3 = children[3]; //shorter than above
//----------------------

/*--Tips for getting the refs from event.target:
    If you have refs, they are in an object and can be found thusly:  */
    console.log("Object.keys(this.refs): " + Object.keys(this.refs))
    console.log("Object.values(this.refs): " + Object.values(this.refs))
    console.log("this.refs.matchups: " + this.refs.matchups)
    console.log("this.refs.matchups.style.visibility: " + this.refs.matchups.style.visibility)

    this.refs.matchups.style.visibility="hidden";  //this WORKS~!~
      ev.target.innerHTML = this.refs.t4.innerHTML; //?I think this works
      this.refs.t1.innerHTML= this.refs.a5.innerHTML; //? I think this works

//  A helper function to subset array by filtering, using refs in this case:
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

//-------------put in handle function area
  drag(ev) {   //  onDragStart, refers to original element being dragged
      this.setState({dragFromIndex: ev.target.dataset.teami });
      ev.dataTransfer.setData("text/plain", ev.target.innerHTML);
      ev.dataTransfer.effectAllowed = "move";
      ev.target.style.backgroundColor = 'rgba(0,0,0,.5)';
  }

  dragEnd(ev) {   //refers to original element being dragged
      ev.target.style.visibility = 'visible';
  }

  // dragenter, dragover, dragleave, drop: refers to droppable zone

  dragEnter(ev) {   //refers to droppable zone
    ev.target.style.border = '1px dashed blue';
  }

  dragLeave(ev) {   //refers to droppable zone
    ev.target.style.border = '1px solid gray';
  }

  allowDrop(ev) {  //on DragOver, //refers to droppable zone
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move"  // Set the dropEffect to move
  }

  drop(ev) {
      ev.preventDefault();
      let defOrder  = parseInt(this.state.dragFromIndex, 10); //number
      let prefOrder = parseInt(ev.target.dataset.preforder, 10); //number
      teamArrObj[defOrder].preferOrder = prefOrder ; // put number into teamArrObject
      // this.setState({team_ArrObj: teamArrObj}); //moved to ClickSave above

      let teamname = ev.dataTransfer.getData("text");
      ev.target.innerHTML= prefOrder + ".  " + teamname + "  " +
      "(OrigOrder: "  + defOrder + ")";

      ev.target.style.color="red";
  }
