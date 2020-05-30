import { Component } from 'react';
import { Router } from './routing';
export interface RouterMountProps {
    router: Router;
}
export declare class RouterMount extends Component<RouterMountProps> {
    constructor(props: RouterMountProps);
    componentDidMount(): void;
    render(): import("react").ReactNode;
}
