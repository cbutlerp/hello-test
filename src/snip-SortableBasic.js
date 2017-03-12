import React, { Component } from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) =>
  <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value.teamName} />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
  constructor(props) {
    super (props);
    this.state = {
      items: props.teamsArrObj,
    };
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
      this.setState({
        items: arrayMove(this.state.items, oldIndex, newIndex),
      });
    };

  render() {
    return (<SortableList items={this.state.items}
              onSortEnd={this.onSortEnd.bind(this)}
              helperClass="SortableHelper"
              lockAxis="y"
              lockToContainerEdges="true"
            />
          );
  }
}

export {SortableComponent};

//put line below in App file:
//  import {SortableComponent} from './junk';
