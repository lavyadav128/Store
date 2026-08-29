// src/components/PurchaseProtectedRoute.jsx
//
// UNIVERSAL guard for any paid/registered content route.
//
// TWO WAYS to use it, depending on the route shape:
//
//  1. Dynamic routes (URL carries the identifier): /class/:classId, /notes/:batchSlug
//       <Route element={<PurchaseProtectedRoute />}>              (defaults to :classId param)
//       <Route element={<PurchaseProtectedRoute paramName="batchSlug" />}>
//
//  2. Static routes (fixed URL, no identifier in it): /dsa, /web, /data-analysis, /aptitude
//     These are configured with a fixed "redirectPath" on the Batch model in
//     the admin panel — pass that same path here so we can look up which
//     batch it belongs to on the backend.
//       <Route element={<PurchaseProtectedRoute redirectPath="/dsa" />}>
//
// Checks "did this specific person actually register/buy THIS specific
// content?" via the backend's /api/purchase-access route. Works for BOTH
// free registrations and paid purchases, since save-purchase creates a
// Purchase record either way.

import { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from './makeauth';
import server from '../environment';

const PurchaseProtectedRoute = ({ paramName = 'classId', redirectPath }) => {
  const params = useParams();
  const classId = params[paramName]; // present for dynamic routes, undefined for static ones
  const token = localStorage.getItem('token');

  // 'checking' | 'allowed' | 'denied'
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    // Not logged in at all — no point even asking the backend
    if (!token) {
      setStatus('denied');
      return;
    }

    let cancelled = false;

    const checkAccess = async () => {
      try {
        // If this route has a real classId in the URL, use that. Otherwise
        // (static routes like /dsa) fall back to the fixed redirectPath prop,
        // and let the backend resolve which batch owns that path.
        const body = classId ? { classId } : { redirectPath };

        const res = await makeAuthenticatedRequest(
          `${server}/api/purchase-access`,
          'POST',
          body
        );
        if (!cancelled) {
          setStatus(res.access ? 'allowed' : 'denied');
        }
      } catch (err) {
        console.error('Purchase access check failed:', err);
        // Fail CLOSED, not open — if we can't confirm access, don't grant it
        if (!cancelled) setStatus('denied');
      }
    };

    checkAccess();

    // If the user navigates to a different classId while this is still
    // checking, ignore the stale result when it eventually comes back
    return () => { cancelled = true; };
  }, [classId, redirectPath, token]);

  if (status === 'checking') {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        Checking access…
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PurchaseProtectedRoute;