import React from 'react';
import { AlertDialog } from './AlertDialog';

interface DialogDispatchProps {
  getGreeting: () => string;
  doneReading: boolean;
  isDoneReading: (done: boolean) => void;
  topArtistsDisplay: JSX.Element;
  statsState: boolean;
  statsRequested: (requested: boolean) => void;
}

export const AlertDialogDispatcher: React.FC<DialogDispatchProps> = ({
  getGreeting,
  doneReading,
  isDoneReading,
  topArtistsDisplay,
  statsState,
  statsRequested,
}): JSX.Element => {
  return (
    <div>
      <AlertDialog
        title={getGreeting()}
        content={<p>Click any location on the map to see nearby concerts.</p>}
        open={doneReading}
        close={() => {
          isDoneReading(false);
        }}
        fullWidth={false}
        maxWidth={false}
      />
      <AlertDialog
        title="Your top artists over the past 6 months: 💘"
        content={topArtistsDisplay}
        open={statsState}
        close={() => {
          statsRequested(false);
        }}
        fullWidth={true}
        maxWidth={'md'}
      />
    </div>
  );
};
