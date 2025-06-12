import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';

const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
      <Button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          viewMode === 'list'
            ? 'bg-white dark:bg-surface-600 text-primary shadow-sm'
            : 'text-surface-600 dark:text-surface-400'
        }`}
      >
        List
      </Button>
      <Button
        onClick={() => setViewMode('calendar')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          viewMode === 'calendar'
            ? 'bg-white dark:bg-surface-600 text-primary shadow-sm'
            : 'text-surface-600 dark:text-surface-400'
        }`}
      >
        Calendar
      </Button>
    </div>
  );
};

ViewModeToggle.propTypes = {
  viewMode: PropTypes.oneOf(['list', 'calendar']).isRequired,
  setViewMode: PropTypes.func.isRequired,
};

export default ViewModeToggle;