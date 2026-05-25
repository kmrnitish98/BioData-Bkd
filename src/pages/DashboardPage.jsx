import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Eye, Globe, Lock, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBiodata } from '../hooks/useBiodata';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { fetchByUser, remove, update, loading } = useBiodata();
  const [biodatas, setBiodatas] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    // fetchByUser no longer needs userId — server reads it from JWT
    fetchByUser().then(setBiodatas).catch(() => setBiodatas([]));
  }, [fetchByUser]);

  const handleTogglePublic = async (id, current) => {
    // Optimistic update
    setBiodatas((prev) =>
      prev.map((b) => (b._id === id ? { ...b, isPublic: !current } : b))
    );
    setActionError(null);
    try {
      await update(id, { isPublic: !current });
    } catch (err) {
      // Rollback on failure
      setBiodatas((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isPublic: current } : b))
      );
      setActionError('Failed to update visibility. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setActionError(null);
    try {
      await remove(id);
      setBiodatas((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setActionError('Failed to delete biodata. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-yellow-600" />
              <h1
                className="text-3xl font-light text-white"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                My <span className="text-yellow-400">Biodatas</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Welcome back, {currentUser?.name || 'User'} · {biodatas.length} biodata{biodatas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/create">
            <Button variant="gold" size="md">
              <PlusCircle className="w-4 h-4" />
              Create New
            </Button>
          </Link>
        </motion.div>

        {/* Action error banner */}
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 text-sm"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {actionError}
            <button
              onClick={() => setActionError(null)}
              className="ml-auto text-red-400 hover:text-white transition-colors"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && biodatas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 glass-card rounded-3xl border border-yellow-900/20"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-yellow-900/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute inset-0 border border-yellow-700/20 rounded-full flex items-center justify-center bg-gradient-to-b from-red-950/40 to-transparent">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600/60">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  <path d="M12 8v4" />
                  <path d="M10 10h4" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl text-white font-light mb-3" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.05em' }}>
              Your Journey Begins Here
            </h2>
            <p className="text-yellow-600/70 text-sm mb-8 max-w-md mx-auto italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              "Create a beautiful, print-ready marriage profile that reflects your true essence and family values."
            </p>
            <Link to="/create">
              <Button variant="gold" size="md">
                <PlusCircle className="w-4 h-4" />
                Create Your First Biodata
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-yellow-700/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Biodata List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {biodatas.map((biodata, i) => {
            const name = biodata.personalInfo?.fullName || 'Unnamed';
            const city = biodata.personalInfo?.city || '';
            const education = biodata.educationInfo?.highestQualification || '';
            const initials = name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

            return (
              <motion.div
                key={biodata._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl overflow-hidden border border-yellow-900/10"
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 p-6 border-b border-red-900/20">
                  {biodata.photoURL ? (
                    <img
                      src={biodata.photoURL}
                      alt={name}
                      className="w-12 h-16 rounded-md object-cover border-2 border-yellow-700/30"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-md bg-gradient-to-br from-red-900 to-[#200000] border-2 border-yellow-700/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-yellow-500" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {city && <span>{city}</span>}
                      {city && education && <span>·</span>}
                      {education && <span className="truncate">{education}</span>}
                    </div>
                  </div>
                  <span className={`flex-shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${biodata.isPublic ? 'bg-yellow-900/20 border-yellow-800/40 text-yellow-500' : 'bg-gray-900/40 border-gray-800/40 text-gray-500'}`}>
                    {biodata.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {biodata.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-6 py-4 gap-3">
                  <div className="flex gap-2">
                    <Link to={`/profile/${biodata._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/edit/${biodata._id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublic(biodata._id, biodata.isPublic)}
                    >
                      {biodata.isPublic ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      {biodata.isPublic ? 'Make Private' : 'Make Public'}
                    </Button>
                  </div>

                  {confirmDelete === biodata._id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Confirm?
                      </span>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deletingId === biodata._id}
                        onClick={() => handleDelete(biodata._id)}
                      >
                        Yes, Delete
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(biodata._id)} className="text-red-700 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
