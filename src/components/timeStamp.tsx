import { useEffect, useState } from "react";
import { timeSince } from "../utils/time";

interface TimeStampProps {
  originalDate: Date;
}

export const TimeStamp = (props: TimeStampProps) => {
  const [, setDummy] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setDummy(Date.now()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <time dateTime={props.originalDate.toLocaleString()}>
      {timeSince(props.originalDate)}
    </time>
  );
};
