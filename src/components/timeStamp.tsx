import React from "react";
import { timeSince } from "../utils/time";

interface TimeStampProps {
  originalDate: Date;
}

interface TimeStampState {
  dummy: number;
}

export class TimeStamp extends React.Component<TimeStampProps, TimeStampState> {
  interval!: NodeJS.Timeout;

  // dummy is just to force a re-render of this component so the time will update
  // using Date.now() because it guarantees the number will be different
  componentDidMount() {
    this.interval = setInterval(
      () => this.setState({ dummy: Date.now() }),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <time dateTime={this.props.originalDate.toLocaleString()}>
        {timeSince(this.props.originalDate)}
      </time>
    );
  }
}
