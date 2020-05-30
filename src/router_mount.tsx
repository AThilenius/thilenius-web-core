import { Component } from 'react';
import { Router } from './routing';
import { observer } from 'mobx-react';

export interface RouterMountProps {
  router: Router;
}

@observer
export class RouterMount extends Component<RouterMountProps> {
  public constructor(props: RouterMountProps) {
    super(props);

    // Go to the current URL of the page.
    props.router.gotoUrl(window.location.href);
  }

  public componentDidMount() {
    this.props.router.active?.componentDidMount?.();
  }

  public render() {
    return this.props.router.active?.render();
  }
}
