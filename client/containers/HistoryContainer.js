import React from 'react';
import HistoryItem from '../components/HistoryItem';

const HistoryContainer = (props) => {
  return (
    <div className="history-container">
      {props.searchHistory.map((uri, idx) => (
        <HistoryItem key={`${uri}-${idx}`} uri={uri} />
      ))}
      <HistoryItem />
    </div>
  );
};

export default HistoryContainer;
