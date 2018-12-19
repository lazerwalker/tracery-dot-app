import * as React from 'react';
import * as _ from 'lodash';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

interface Props {
  nodes: string[];
  origin: string;
  onChange?: (origin: string) => void;
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

  handleClick = (e: any) => {
    const node = e.target.innerText; // TODO: lol.
    if (this.props.onChange) {
      this.props.onChange(node);
    }
  }

  render = () => {
    const rawNodes = _(this.props.nodes).without(this.props.origin).sort().value();
    const items = rawNodes.map(n => <DropdownItem key={n} onClick={this.handleClick}>{n}</DropdownItem>);

    const current = <DropdownItem key={this.props.origin}>{this.props.origin}</DropdownItem>;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {this.props.origin}
        </DropdownToggle>
        <DropdownMenu>
          {items}
          <DropdownItem divider />
          {current}
        </DropdownMenu>
      </Dropdown>
    );
  }
}