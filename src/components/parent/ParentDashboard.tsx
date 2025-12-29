import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';
import { ProgressReport } from './ProgressReport';
import { SettingsPanel } from './SettingsPanel';
import { ContentToggle } from './ContentToggle';
import { SessionHistory } from './SessionHistory';

type Tab = 'progress' | 'settings' | 'content' | 'history';

interface ParentDashboardProps {
  onClose: () => void;
}

export function ParentDashboard({ onClose }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('progress');
  const { childName, childAge } = useParentStore();

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'content', label: 'Subjects', icon: '📚' },
    { id: 'history', label: 'History', icon: '📅' },
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍👩‍👧‍👦</span>
            <div>
              <h1 className="text-white text-xl font-bold">Parent Dashboard</h1>
              <p className="text-white/60 text-sm">
                {childName || 'Player'} • Age {childAge}
              </p>
            </div>
          </div>
          <motion.button
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium transition-colors"
            onClick={onClose}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-yellow-400'
                    : 'text-white/60 hover:text-white/80'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-140px)] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'progress' && <ProgressReport />}
            {activeTab === 'settings' && <SettingsPanel />}
            {activeTab === 'content' && <ContentToggle />}
            {activeTab === 'history' && <SessionHistory />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ParentDashboard;
