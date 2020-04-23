import React from 'react';
import { HistoryItem } from '../components/HistoryItem';

interface Props {
  searchHistory: string[];
}

const HistoryContainer: React.FC<Props> = (props) => {
  return (
    <div className="history-container">
      {props.searchHistory.map((uri: string, idx: number) => (
        <HistoryItem key={`${uri}-${idx}`} uri={uri} />
      ))}
    </div>
  );
};

export default HistoryContainer;
