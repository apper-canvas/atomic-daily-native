import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import HeatmapCell from '@/components/atoms/HeatmapCell';

const ActivityHeatmapCalendar = ({ heatmapData, cellClassName = '', showDaysLabel = true }) => {
  if (!heatmapData || !Array.isArray(heatmapData)) {
    return null;
  }

  return (
    <>
      {showDaysLabel && (
        <div className="grid grid-cols-7 text-xs text-surface-500 dark:text-surface-400 mb-2">
          <span className="text-center">Sun</span>
          <span className="text-center">Mon</span>
          <span className="text-center">Tue</span>
          <span className="text-center">Wed</span>
          <span className="text-center">Thu</span>
          <span className="text-center">Fri</span>
          <span className="text-center">Sat</span>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1">
        {heatmapData.map((day, index) => {
          if (!day || !day.date) {
            return null;
          }

          const safeDate = new Date(day.date);
          const isValidDate = !isNaN(safeDate.getTime());
          
          return (
            <HeatmapCell
              key={day.date}
              intensity={day.intensity || (day.completed ? 1 : 0)}
              title={isValidDate ? `${format(safeDate, 'MMM d')} - ${day.completed ? 'Completed' : 'Not completed'}` : 'Invalid date'}
              className={cellClassName}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
};

ActivityHeatmapCalendar.propTypes = {
  heatmapData: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    completed: PropTypes.bool,
    intensity: PropTypes.number,
  })).isRequired,
  cellClassName: PropTypes.string,
  showDaysLabel: PropTypes.bool,
};

export default ActivityHeatmapCalendar;