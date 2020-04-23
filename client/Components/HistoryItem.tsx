import React from 'react';

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
