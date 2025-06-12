import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const TinyWinModal = ({ isOpen, onClose, habitName, tinyWin, setTinyWin, onSaveTinyWin }) => {
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
            <div className="bg-white dark:bg-surface-800 rounded-card shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ApperIcon name="Star" className="w-6 h-6 text-accent" />
                <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                  Celebrate Your Tiny Win
                </Text>
              </div>
              
              <Text as="p" className="text-surface-600 dark:text-surface-400 mb-4">
                What went well with "{habitName}" today?
              </Text>
              
              <Input
                type="textarea"
                value={tinyWin}
                onChange={(e) => setTinyWin(e.target.value)}
                placeholder="I felt energized after completing this habit..."
                maxLength={200}
                className="h-24"
              />
              
              <div className="flex justify-between items-center mt-4">
                <Text as="span" className="text-sm text-surface-500">
                  {tinyWin.length}/200
                </Text>
                <div className="flex space-x-3">
                  <Button
                    onClick={onClose}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSaveTinyWin}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Win
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

TinyWinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  habitName: PropTypes.string,
  tinyWin: PropTypes.string.isRequired,
  setTinyWin: PropTypes.func.isRequired,
  onSaveTinyWin: PropTypes.func.isRequired,
};

export default TinyWinModal;