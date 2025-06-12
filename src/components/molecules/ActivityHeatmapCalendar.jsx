import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import HeatmapCell from '@/components/atoms/HeatmapCell';

const ActivityHeatmapCalendar = ({ heatmapData, cellClassName = '', showDaysLabel = true }) => {
  return (
    &lt;&gt;
      {showDaysLabel && (
        &lt;div className="grid grid-cols-7 text-xs text-surface-500 dark:text-surface-400 mb-2"&gt;
          &lt;span className="text-center"&gt;Sun&lt;/span&gt;
          &lt;span className="text-center"&gt;Mon&lt;/span&gt;
          &lt;span className="text-center"&gt;Tue&lt;/span&gt;
          &lt;span className="text-center"&gt;Wed&lt;/span&gt;
          &lt;span className="text-center"&gt;Thu&lt;/span&gt;
          &lt;span className="text-center"&gt;Fri&lt;/span&gt;
          &lt;span className="text-center"&gt;Sat&lt;/span&gt;
        &lt;/div&gt;
      )}
      &lt;div className="grid grid-cols-7 gap-1"&gt;
        {heatmapData.map((day, index) => (
          &lt;HeatmapCell
            key={day.date}
            intensity={day.intensity || (day.completed ? 1 : 0)}
            title={`${format(new Date(day.date), 'MMM d')} - ${day.completed ? 'Completed' : 'Not completed'}`}
            className={cellClassName}
            index={index}
          />
        ))}
      &lt;/div&gt;
    &lt;/&gt;
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