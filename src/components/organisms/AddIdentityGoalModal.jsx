import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const AddIdentityGoalModal = ({ isOpen, onClose, newGoal, setNewGoal, onCreateGoal, identityExamples, onUseExample }) => {
if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            <div className="bg-white dark:bg-surface-800 rounded-card shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
              <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
                Create Identity Goal
              </Text>
              
              <div className="space-y-4">
                <FormField label="Identity Statement" id="identity-statement">
                  <Input
                    type="textarea"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="I am a person who..."
                    maxLength={150}
                    className="h-20"
                  />
                  <Text as="div" className="text-xs text-surface-500 mt-1">
                    {newGoal.length}/150 characters
                  </Text>
                </FormField>
                
                <div>
                  <Text as="label" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                    Examples to get you started:
                  </Text>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {identityExamples.map((example, index) => (
                      <Button
                        key={index}
                        onClick={() => onUseExample(example)}
                        className="text-left p-3 text-sm bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors text-surface-900 dark:text-surface-50 w-full"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
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
                  onClick={onCreateGoal}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Create Goal
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

AddIdentityGoalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newGoal: PropTypes.string.isRequired,
  setNewGoal: PropTypes.func.isRequired,
  onCreateGoal: PropTypes.func.isRequired,
  identityExamples: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUseExample: PropTypes.func.isRequired,
};

export default AddIdentityGoalModal;