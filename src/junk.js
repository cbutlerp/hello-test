// Draggable List Item Component
let DraggableListItem = React.createClass({
  getInitialState() {
    return {
      isDragging: false,
      isDragOver: false,
    };
  },
  propTypes: {
    title:        React.PropTypes.string.isRequired,
    isDraggable:  React.PropTypes.bool,
    isDroppable:  React.PropTypes.bool,
    replaceList:  React.PropTypes.func,
  },
  onDragStart(e){
    let newState = Object.assign(
      this.state, { isDragging : true });
    this.setState(newState);

    // dataTransferプロパティ:ドラッグ操作で送信されたデータが保存されます。
    // dragstartイベントで設定し、dropイベントで読み取りと処理を行います。
    // e.dataTransfer.setData(format, data) を呼び出すと、オブジェクトのコンテンツがMIMEタイプに設定され、データ ペイロードが引数として渡されます。
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.props.title);
  },
  onDragEnter(e){
    if( !this.props.isDraggable ){
      return true;
    }
    let newState = Object.assign(
      this.state, { isDragOver : true });
    this.setState(newState);
  },
  onDragOver(e){
    if( !this.props.isDroppable ){
      return true;
    }
    // リンクをドラッグする場合、そのリンク先に移動するというブラウザのデフォルト動作を回避する必要がある。かつ戻り値でfalseを返す
    if (e.preventDefault) { e.preventDefault(); }

    e.dataTransfer.dropEffect = 'move';
    return false;
  },
  onDragLeave(e){
    let newState = Object.assign(
      this.state, { isDragOver : false });
    this.setState(newState);
  },
  onDrop(e){
    let newState = Object.assign(
      this.state, {
        isDragging : false,
        isDragOver : false
      });
    this.setState(newState);

    // デフォルト動作では、一般的に何らかの不要なリダイレクトが行われます。
    // dropイベントによってDOM を起動しないようにするには、e.stopPropagation() を呼び出します。
    if (e.stopPropagation) { e.stopPropagation(); }
    const dragSourceTitle = e.dataTransfer.getData('text/html');
    this.props.replaceList( dragSourceTitle, this.props.title );

    return false;
  },
  onDragEnd(e){
    let newState = Object.assign(
      this.state, {
        isDragging : false,
        isDragOver : false
      });
    this.setState(newState);
  },
  render: function() {
    // ** ClassName
    const arrClassName = [
      this.state.isDragging   ? 'dragging'    : '',
      this.props.isDroppable && this.state.isDragOver   ? 'dragover'    : '',
      !this.props.isDroppable  ? 'undroppable' : '',
    ];
    const strClassName = arrClassName.join(' ');
    // ** Draggable
    const isDraggable = this.props.isDraggable ? 'true' : 'false';

    return (
      <li draggable={isDraggable}
          className={strClassName}
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onDragEnd={this.onDragEnd}
        >{this.props.title}</li>
    );
  }
});

// Draggable List Component
let DraggableList = React.createClass({
  getInitialState() {
    return {
      list : [
        { title: 'A', isDraggable : true , isDroppable : true  },
        { title: 'B', isDraggable : true , isDroppable : false },
        { title: 'C', isDraggable : false, isDroppable : true  },
        { title: 'D', isDraggable : true , isDroppable : true  },
      ]
    };
  },
  replaceList(dragSourceTitle, dropTargetTitle){
    let dragSourceIndex = this.state.list.findIndex((o) => o.title == dragSourceTitle);
    let dropTargetIndex = this.state.list.findIndex((o) => o.title == dropTargetTitle);
    if( dragSourceIndex == dropTargetIndex ){
      return;
    }

    // Array list index replace
    let list = this.state.list;
    let removed = list.splice( dragSourceIndex, 1, this.state.list[dropTargetIndex] );
    list.splice( dropTargetIndex, 1, removed[0] );

    // Update State
    let newState = Object.assign(
      this.state,
      { list : list });
    this.setState(newState);
  },
  render: function() {
    let li = [];
    for( let item of this.state.list ){
      li.push(
        <DraggableListItem
          key={item.title}
          title={item.title}
          isDraggable={item.isDraggable}
          isDroppable={item.isDroppable}
          replaceList={this.replaceList} />
      );
    }
    return (
      <div>
        <ul className="draggable-list">{li}</ul>
      </div>
    );
  }
});

// Render Dom
ReactDOM.render(
  <DraggableList/>,
  document.getElementById('app')
);
