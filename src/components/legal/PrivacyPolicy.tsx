import { motion } from 'framer-motion';

// ============================================
// PRIVACY POLICY
// COPPA-compliant privacy policy for kids app
// ============================================

interface PrivacyPolicyProps {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500">
          <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
          <button
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] prose prose-sm">
          <p className="text-gray-500 text-sm mb-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Our Commitment to Children's Privacy
          </h2>
          <p className="text-gray-600 mb-4">
            Marble Masters is designed for children ages 3-10. We take children's privacy very seriously
            and are committed to complying with the Children's Online Privacy Protection Act (COPPA)
            and similar regulations worldwide.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Information We Collect
          </h2>
          <p className="text-gray-600 mb-2">
            <strong>We do NOT collect any personal information from children.</strong>
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>No names, emails, or contact information</li>
            <li>No photos, videos, or audio recordings</li>
            <li>No location data</li>
            <li>No device identifiers for tracking</li>
            <li>No social media connections</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Data Stored Locally
          </h2>
          <p className="text-gray-600 mb-4">
            Game progress (levels completed, scores, badges earned) is stored only on your device
            using your browser's local storage. This data:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Never leaves your device</li>
            <li>Is not shared with anyone</li>
            <li>Can be deleted by clearing browser data</li>
            <li>Is used only to save game progress</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            No Advertising
          </h2>
          <p className="text-gray-600 mb-4">
            Marble Masters does not contain any advertisements. We do not use advertising
            networks or show any third-party ads to children.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            No In-App Purchases
          </h2>
          <p className="text-gray-600 mb-4">
            There are no in-app purchases in Marble Masters. All features are available
            without any payment.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            No Internet Required
          </h2>
          <p className="text-gray-600 mb-4">
            After the initial download, Marble Masters works completely offline. No internet
            connection is required to play, and no data is transmitted to our servers.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Parental Controls
          </h2>
          <p className="text-gray-600 mb-4">
            We provide parental controls that allow parents to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Set session time limits</li>
            <li>Enable break reminders</li>
            <li>View learning progress</li>
            <li>Customize educational content</li>
            <li>Reset all game data</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Parent controls are protected by a PIN that only parents should know.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Third-Party Services
          </h2>
          <p className="text-gray-600 mb-4">
            Marble Masters does not use any third-party analytics, tracking, or data collection
            services. We do not share any information with third parties.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Changes to This Policy
          </h2>
          <p className="text-gray-600 mb-4">
            If we make changes to this privacy policy, we will update the "Last updated" date
            at the top. We encourage parents to review this policy periodically.
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this privacy policy or our practices, please
            contact us at:
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Email:</strong> privacy@marblemasters.app
          </p>

          <div className="mt-8 p-4 bg-green-50 rounded-xl">
            <p className="text-green-700 text-sm font-medium">
              ✅ COPPA Compliant • No Data Collection • Child-Safe
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PrivacyPolicy;
