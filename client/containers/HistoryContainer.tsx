import React, { useContext } from 'react';
import { HistoryItem } from '../components/HistoryItem';
const { UserContext } = require("../context/UserContext");

// interface Props {
//   searchHistory: string[];
// }

const HistoryContainer: React.FC = () => {
  const { searchHistory } = useContext(UserContext);
  return (
    <div className="history-container">
      {searchHistory.map((uri: string, idx: number) => (
        <HistoryItem key={`${uri}-${idx}`} uri={uri} />
      ))}
    </div>
  );
};

export default HistoryContainer;
