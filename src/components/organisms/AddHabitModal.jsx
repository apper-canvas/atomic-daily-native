import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const AddHabitModal = ({ isOpen, onClose, newHabit, setNewHabit, onCreateHabit, identityGoals }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        &lt;&gt;
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-surface-800 rounded-card shadow-xl max-w-md w-full p-6">
              <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
                Create New Habit
              </Text>
              
              <div className="space-y-4">
                <FormField label="Habit Name" id="habit-name">
                  <Input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                    placeholder="e.g., Drink 8 glasses of water"
                  />
                </FormField>
                
                <FormField label="Identity Goal" id="identity-goal">
                  <Input
                    type="select"
                    value={newHabit.identityGoalId}
                    onChange={(e) => setNewHabit({...newHabit, identityGoalId: e.target.value})}
                  >
                    &lt;option value=""&gt;Select an identity goal&lt;/option&gt;
                    {identityGoals.map(goal => (
                      &lt;option key={goal.id} value={goal.id}&gt;
                        {goal.statement}
                      &lt;/option&gt;
                    ))}
                  </Input>
                </FormField>
                
                <FormField label="Reminder Time" id="reminder-time">
                  <Input
                    type="time"
                    value={newHabit.reminderTime}
                    onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={onClose}
                  className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCreateHabit}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Create Habit
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

AddHabitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newHabit: PropTypes.object.isRequired,
  setNewHabit: PropTypes.func.isRequired,
  onCreateHabit: PropTypes.func.isRequired,
  identityGoals: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddHabitModal;