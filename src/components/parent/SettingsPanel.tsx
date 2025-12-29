import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';

export function SettingsPanel() {
  const {
    childName,
    childAge,
    difficultyBias,
    challengeFrequency,
    voicePromptsEnabled,
    soundEnabled,
    musicEnabled,
    sessionTimeLimit,
    breakReminderInterval,
    updateChildSettings,
    setDifficultyBias,
    setChallengeFrequency,
    setVoicePrompts,
    setSoundEnabled,
    setMusicEnabled,
    setSessionTimeLimit,
    setBreakReminder,
    setPin,
    resetProgress,
  } = useParentStore();

  const [localName, setLocalName] = useState(childName);
  const [localAge, setLocalAge] = useState(childAge);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleSaveChild = () => {
    updateChildSettings(localName, localAge);
  };

  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  const handleChangePin = () => {
    if (newPin.length === 4) {
      setPin(newPin);
      setShowPinChange(false);
      setNewPin('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Child Profile */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>👶</span> Player Profile
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm block mb-1">Name</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleSaveChild}
              placeholder="Child's name"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">Age</label>
            <select
              value={localAge}
              onChange={(e) => {
                const age = Number(e.target.value);
                setLocalAge(age);
                updateChildSettings(localName, age);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
                <option key={age} value={age} className="bg-purple-900">
                  {age} years old
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>🎮</span> Game Settings
        </h3>

        <div className="space-y-4">
          {/* Difficulty Bias */}
          <div>
            <label className="text-white/60 text-sm block mb-2">
              Difficulty Level
            </label>
            <div className="flex gap-2">
              {(['easier', 'normal', 'harder'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyBias(level)}
                  className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                    difficultyBias === level
                      ? 'bg-yellow-400 text-purple-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {level === 'easier' && '🐢 Easier'}
                  {level === 'normal' && '🎯 Normal'}
                  {level === 'harder' && '🚀 Harder'}
                </button>
              ))}
            </div>
          </div>

          {/* Challenge Frequency */}
          <div>
            <label className="text-white/60 text-sm block mb-2">
              Challenge Frequency
            </label>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setChallengeFrequency(freq)}
                  className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                    challengeFrequency === freq
                      ? 'bg-yellow-400 text-purple-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Every {freq === 1 ? 'Level' : `${freq} Levels`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audio */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>🔊</span> Audio Settings
        </h3>

        <div className="space-y-3">
          <ToggleRow
            label="Voice Prompts"
            description="Read challenges aloud for younger children"
            enabled={voicePromptsEnabled}
            onChange={setVoicePrompts}
          />
          <ToggleRow
            label="Sound Effects"
            description="Marble sounds and feedback"
            enabled={soundEnabled}
            onChange={setSoundEnabled}
          />
          <ToggleRow
            label="Background Music"
            description="Relaxing background music"
            enabled={musicEnabled}
            onChange={setMusicEnabled}
          />
        </div>
      </div>

      {/* Session Limits */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>⏰</span> Session Limits
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm block mb-2">
              Session Time Limit
            </label>
            <select
              value={sessionTimeLimit}
              onChange={(e) => setSessionTimeLimit(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
            >
              <option value={0} className="bg-purple-900">
                No limit
              </option>
              <option value={15} className="bg-purple-900">
                15 minutes
              </option>
              <option value={30} className="bg-purple-900">
                30 minutes
              </option>
              <option value={45} className="bg-purple-900">
                45 minutes
              </option>
              <option value={60} className="bg-purple-900">
                1 hour
              </option>
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-2">
              Break Reminders
            </label>
            <select
              value={breakReminderInterval}
              onChange={(e) => setBreakReminder(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
            >
              <option value={0} className="bg-purple-900">
                Disabled
              </option>
              <option value={10} className="bg-purple-900">
                Every 10 minutes
              </option>
              <option value={15} className="bg-purple-900">
                Every 15 minutes
              </option>
              <option value={20} className="bg-purple-900">
                Every 20 minutes
              </option>
              <option value={30} className="bg-purple-900">
                Every 30 minutes
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Security & Reset */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>🔐</span> Security
        </h3>

        <div className="space-y-3">
          {!showPinChange ? (
            <button
              onClick={() => setShowPinChange(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Change PIN
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="tel"
                maxLength={4}
                value={newPin}
                onChange={(e) =>
                  setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                placeholder="New 4-digit PIN"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={handleChangePin}
                disabled={newPin.length !== 4}
                className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-xl font-medium disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowPinChange(false);
                  setNewPin('');
                }}
                className="bg-white/10 text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          )}

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-3 rounded-xl font-medium transition-colors border border-red-500/30"
            >
              Reset All Progress
            </button>
          ) : (
            <motion.div
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <p className="text-white mb-3">
                Are you sure? This will erase all progress data and cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleResetProgress}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-white/10 text-white py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-white font-medium">{label}</div>
        <div className="text-white/50 text-sm">{description}</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-white/20'
        }`}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
          animate={{ left: enabled ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

export default SettingsPanel;
