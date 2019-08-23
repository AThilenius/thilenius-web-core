import * as _ from 'lodash';

export class Event<TArgs = void> {
  private handlers: ((args: TArgs) => void)[] = [];

  public add(handler: (args: TArgs) => void) {
    if (this.handlers.indexOf(handler) < 0) {
      this.handlers.push(handler);
    }
  }

  public remove(handler: (args: TArgs) => void) {
    this.handlers = _.without(this.handlers, handler);
  }

  public fire(args: TArgs) {
    for (let i = 0; i < this.handlers.length; i++) {
      this.handlers[i](args);
    }
  }
}
