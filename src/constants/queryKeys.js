/**
 * queryKeys.js — React Query key factory.
 *
 * Problem this solves:
 *  Query keys scattered as inline arrays (['biodatas', page]) across
 *  hooks and components cause cache misses when strings drift.
 *
 * Usage:
 *   import { QUERY_KEYS } from '../constants/queryKeys';
 *   useQuery({ queryKey: QUERY_KEYS.biodata.public({ page, search }) });
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.biodata.all });
 *
 * Key structure follows the TkDodo factory pattern:
 *   ['biodata']                        ← scope (invalidates everything in biodata)
 *   ['biodata', 'public']              ← list type
 *   ['biodata', 'public', { page, q }] ← specific query
 *   ['biodata', 'detail', id]          ← single entity
 */

export const QUERY_KEYS = {
  // ── Auth ────────────────────────────────────────────────────────────────
  auth: {
    all:     ['auth'],
    me:      ()  => ['auth', 'me'],
  },

  // ── Biodata ─────────────────────────────────────────────────────────────
  biodata: {
    all:     ['biodata'],
    public:  (params = {}) => ['biodata', 'public', params],
    mine:    ()             => ['biodata', 'mine'],
    detail:  (id)           => ['biodata', 'detail', id],
    private: (id)           => ['biodata', 'private', id],
  },
};

export default QUERY_KEYS;
