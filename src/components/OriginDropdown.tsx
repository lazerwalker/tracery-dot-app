import * as React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

interface Props {
  nodes: string[];
  origin: string;
}

interface State {
  dropdownOpen: boolean;
}

export default class OriginDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render = () => {
    const items = this.props.nodes.map(n => <DropdownItem key={n}>{n}</DropdownItem>);

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {this.props.origin}
        </DropdownToggle>
        <DropdownMenu>
          {items}
        </DropdownMenu>
      </Dropdown>
    );
  }
}