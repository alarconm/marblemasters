import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';

interface ParentGateProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export function ParentGate({ onUnlock, onCancel }: ParentGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { isPinSet, verifyPin, setPin: savePin } = useParentStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDigit = (digit: string) => {
    if (isSettingPin) {
      if (confirmPin.length < 4) {
        const newConfirm = confirmPin + digit;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) {
          if (newConfirm === pin) {
            savePin(pin);
            onUnlock();
          } else {
            setError(true);
            setConfirmPin('');
            setTimeout(() => setError(false), 500);
          }
        }
      }
    } else {
      if (pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) {
          if (!isPinSet) {
            setIsSettingPin(true);
          } else if (verifyPin(newPin)) {
            onUnlock();
          } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 500);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (isSettingPin) {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const currentValue = isSettingPin ? confirmPin : pin;
  const title = !isPinSet
    ? isSettingPin
      ? 'Confirm Your PIN'
      : 'Create a PIN'
    : 'Enter Parent PIN';

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">
            {error ? '🔒' : '👨‍👩‍👧‍👦'}
          </div>
          <h2 className="text-white text-xl font-bold">{title}</h2>
          <p className="text-white/70 text-sm mt-1">
            {!isPinSet && !isSettingPin
              ? 'Set a 4-digit PIN to protect parent settings'
              : isSettingPin
              ? 'Enter the same PIN again'
              : 'Enter your 4-digit PIN'}
          </p>
        </div>

        {/* PIN Display */}
        <motion.div
          className="flex justify-center gap-3 mb-6"
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                i < currentValue.length
                  ? error
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-purple-600'
                  : 'bg-white/20 text-white/50'
              }`}
            >
              {i < currentValue.length ? '●' : '○'}
            </div>
          ))}
        </motion.div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              className="h-14 rounded-xl bg-white/20 text-white text-2xl font-bold hover:bg-white/30 active:bg-white/40 transition-colors"
              onClick={() => handleDigit(String(num))}
              whileTap={{ scale: 0.95 }}
            >
              {num}
            </motion.button>
          ))}
          <motion.button
            className="h-14 rounded-xl bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
            onClick={onCancel}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="h-14 rounded-xl bg-white/20 text-white text-2xl font-bold hover:bg-white/30 active:bg-white/40 transition-colors"
            onClick={() => handleDigit('0')}
            whileTap={{ scale: 0.95 }}
          >
            0
          </motion.button>
          <motion.button
            className="h-14 rounded-xl bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
            onClick={handleBackspace}
            whileTap={{ scale: 0.95 }}
          >
            ⌫
          </motion.button>
        </div>

        {/* Hidden input for keyboard on desktop */}
        <input
          ref={inputRef}
          type="tel"
          className="sr-only"
          value={currentValue}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
            if (isSettingPin) {
              setConfirmPin(val);
            } else {
              setPin(val);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel();
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default ParentGate;
