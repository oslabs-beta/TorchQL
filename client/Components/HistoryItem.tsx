import React from './node_modules/react';

interface Props {
  uri: string;
}

export const HistoryItem: React.FC<Props> = (props) => {
  return (
    <div>
      <p>{props.uri}</p>
    </div>
  );
};
