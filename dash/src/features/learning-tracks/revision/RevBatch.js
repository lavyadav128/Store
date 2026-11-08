


// ─────────────────────────────────────────────────────────────
// IMPORTS — bring in everything this file needs
// ─────────────────────────────────────────────────────────────

// React is the core library for building UI
// useEffect = run code after component appears on screen
// useState  = create variables that re-render the UI when changed
import React, { useEffect, useState } from 'react';

// MUI (Material UI) components — pre-built, styled UI blocks
import {
  Card,           // the white box/container for each class card
  CardContent,    // the text area inside the card
  CardMedia,      // the image area at the top of the card
  Typography,     // styled text (headings, paragraphs, captions)
  Button,         // clickable button
  CardActions,    // the bottom area of the card that holds buttons
  Box,            // a general-purpose div with MUI styling support
  Chip,           // a small pill/badge (e.g. "FREE", "Purchased")
  Stack,          // a flex container — stacks children in a row or column
  useMediaQuery,  // a hook that returns true/false based on screen size
  useTheme,       // gives access to the MUI theme (breakpoints, colors, etc.)
} from '@mui/material';

// useNavigate lets us redirect the user to a different page/route
import { useNavigate } from 'react-router-dom';

// makeAuthenticatedRequest is a helper function that sends API requests
// with the JWT token automatically attached (so the backend knows who's calling)
import { makeAuthenticatedRequest } from '../../../shared/guards/makeauth';

// "server" is the base URL of our backend (e.g. "https://our-api.onrender.com")
// imported from a config file so we don't hardcode the URL everywhere
import server from '../../../shared/environment';
import { reportCheckoutFailure } from '../../../shared/recoveryClient';


// ═════════════════════════════════════════════════════════════
//  ClassCard COMPONENT
//  Renders a single course card with image, title, price, and buttons
//  Receives all its data as props from the parent (ClassCardPage)
//  ── ZERO CHANGES HERE — identical to your original ──
// ═════════════════════════════════════════════════════════════

// Destructuring the props directly in the function signature
// id, title, description, imageUrl, price → data for this card
// purchaseInfo → object from backend if this class was purchased, otherwise undefined
// onPurchase   → a function passed from the parent to update purchase state after buying
const ClassCard = ({ id, title, description, imageUrl, price, purchaseInfo, onPurchase }) => {
  const navigate = useNavigate();
  const isPurchased = !!purchaseInfo;
  const expiryDate = purchaseInfo?.expiryDate ? new Date(purchaseInfo.expiryDate) : null;

  const handleExploreRedirect = () => {
    navigate(`/class/${id}/explore`);
  };

const handleBuyRedirect = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    const purchasePayload = {
      classId: id,
      batchTitle: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
    };

    if (price === 0) {
      try {
        await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', purchasePayload);
        onPurchase(id);
        navigate(`/class/${id}`);
      } catch (err) {
        console.error('Error saving free access:', err);
        alert(err.message || 'Failed to grant access.');
      }
      return;
    }

    // Check if Razorpay's script has been loaded in the browser
    if (!window.Razorpay) {
      alert('Payment gateway not loaded');
      return;
    }

    try {
      // ── STEP 1: Create a Razorpay order on our backend ──
      const order = await makeAuthenticatedRequest(`${server}/api/create-order`, 'POST', {
        amount: price,
        receipt: `receipt_${id}_${Date.now()}`,
        batchId: id,
        batchTitle: title,
      });

      // ── STEP 2: Configure the Razorpay payment popup ──
      let paymentDone = false;
      const options = {
        key: order.key || process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Atom Classes',
        description: `Payment for ${title}`,
        order_id: order.id,

        // handler runs automatically AFTER the student successfully pays
        handler: async function (response) {
          paymentDone = true;
          try {
            await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', {
              ...purchasePayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onPurchase(id);
            navigate(`/class/${id}`);
          } catch (err) {
            console.error('Error saving purchase:', err);
            alert(err.message || 'Error saving your purchase.');
          }
        },

        prefill: {
          name: order.customer?.name || '',
          email: order.customer?.email || '',
          contact: order.customer?.phone || '',
        },
        notes: { batchId: id },
        theme: { color: '#1a1a2e' },
        modal: {
          confirm_close: true,
          handleback: true,
          ondismiss: () => {
            if (!paymentDone) {
              reportCheckoutFailure(order.id, { error: { reason: 'checkout_dismissed_before_completion' } });
            }
          },
        },
      };

      // ── STEP 3: Create a Razorpay instance and open the payment popup ──
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => reportCheckoutFailure(order.id, response));
      rzp.open();

    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment. Try again.');
    }
  };

    return (
    <Card
      sx={{
        width: 330,
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 6,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 12,
        },
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={imageUrl}
        alt={title}
        sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
      />

      <CardContent sx={{ px: 3, pt: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
          {description}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Chip
            label={price === 0 ? 'FREE' : `₹${price}`}
            color={price === 0 ? 'success' : 'warning'}
            sx={{ fontWeight: 'bold', px: 1.5 }}
          />
          {isPurchased && <Chip label="Purchased" color="primary" size="small" />}
        </Stack>

        <Box sx={{ minHeight: 24, mt: 1, display: 'flex', alignItems: 'center' }}>
          {isPurchased && expiryDate && (
            <Typography variant="caption" sx={{ color: 'gray', fontWeight: 600 }}>
              Expires on: {expiryDate.toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={handleExploreRedirect}
          sx={{
            width: '48%',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#e3f2fd' },
          }}
        >
          Explore
        </Button>

        <Button
          variant="contained"
          onClick={() => (isPurchased ? navigate(`/class/${id}`) : handleBuyRedirect())}
          sx={{
            width: '48%',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {isPurchased ? 'Study' : 'Buy Now'}
        </Button>
      </CardActions>
    </Card>
  );
};

const ClassCardPage = () => {

  // classList now lives in state, populated by the API fetch below,
  // instead of being a hardcoded constant outside the component.
  const [classList, setClassList] = useState(() => {
    try {
      const cached = sessionStorage.getItem('notenova_batches_CDS');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });

  // purchasedBatches = an object (dictionary) where:
  // key   = classId (e.g. "10", "11")
  // value = the purchase record from the database (contains expiryDate etc.)
  // e.g. { "10": { classId: "10", expiryDate: "2026-12-31" }, "11": {...} }
  // starts as empty {} — filled in after the API call in useEffect
  const [purchasedBatches, setPurchasedBatches] = useState(() => {
    try {
      const cached = sessionStorage.getItem('notenova_user_purchases');
      if (!cached) return {};
      const list = JSON.parse(cached);
      const map = {};
      if (Array.isArray(list)) list.forEach(p => { if (p.classId) map[p.classId] = p; });
      return map;
    } catch { return {}; }
  });

  // useTheme gives us access to MUI's theme object (breakpoints, spacing, etc.)
  const theme = useTheme();

  // useMediaQuery checks the screen width and returns true/false
  // theme.breakpoints.down('sm') = true when screen is smaller than 600px (mobile)
  // isMobile is used throughout to switch between mobile and desktop layouts
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ── FETCH BATCHES FOR THIS FOLDER ON PAGE LOAD ──
  // This page corresponds to the "Jee Mains" folder in the Batch Manager
  // (batchId's 10, 11, 12, 111, 121). Only active batches are returned.
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${server}/api/batches?folder=${encodeURIComponent('CDS')}`);
        const data = await res.json();

        // Map MongoDB fields to match ClassCard's existing props exactly
        const mappedClasses = data.map((b) => ({
          id: b.batchId,
          title: b.title,
          description: b.description,
          imageUrl: b.imageUrl,
          price: b.price,
        }));
        try { sessionStorage.setItem('notenova_batches_CDS', JSON.stringify(mappedClasses)); } catch {}
        setClassList(mappedClasses);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
      }
    };

    fetchClasses();
  }, []);

  // ── FETCH PURCHASED CLASSES ON PAGE LOAD ──
  useEffect(() => {
    // Define the async function inside useEffect
    // (useEffect itself can't be async, so we define and immediately call it)
    const fetchPurchases = async () => {
      try {
        // Call backend to get the list of classes this user has purchased
        // makeAuthenticatedRequest automatically adds the JWT token to the request
        // Returns an array like: [{ classId: "10", expiryDate: "..." }, ...]
        const data = await makeAuthenticatedRequest(`${server}/api/user-purchases`);

        // Convert the array into an object for fast lookup by classId
        // Instead of looping through the array every time we need to check a class,
        // we build a map: { "10": { classId: "10", ... }, "11": { ... } }
        const purchasesMap = {};
        data.forEach((purchase) => {
          // Use classId as the key so we can do purchasesMap["10"] instantly
          purchasesMap[purchase.classId] = purchase;
        });

        // Save the map into state — this triggers a re-render
        // All ClassCard components will now know which classes are purchased
        setPurchasedBatches(purchasesMap);
        try { sessionStorage.setItem('notenova_user_purchases', JSON.stringify(data)); } catch {}

      } catch (err) {
        console.error('Failed to fetch purchases:', err.message);
        // If the error is "No authentication token" (user is not logged in),
        // stay silent — no need to alarm a guest visitor with an alert
        // For any other error (server down, network issue etc.), show an alert
        if (!err.message.includes('No authentication token')) {
          alert(`Failed to load purchases: ${err.message}`);
        }
      }
    };

    // Call the function immediately after defining it
    fetchPurchases();
  }, []); // [] = run only once when this page first loads

  // ── HANDLE PURCHASE UPDATE ──
  // Called by ClassCard after a successful purchase
  // Updates the purchasedBatches state without re-fetching from the backend
const handlePurchaseUpdate = (classId) => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1); // 12-month subscription
    const updatedRecord = { classId, expiryDate: expiry.toISOString() };
    setPurchasedBatches((prev) => {
      const next = { ...prev, [classId]: updatedRecord };
      try {
        const list = Object.values(next);
        sessionStorage.setItem('notenova_user_purchases', JSON.stringify(list));
      } catch {}
      return next;
    });
  };

  // ── JSX: THE PAGE LAYOUT ──
  return (
    // Outer Box = page wrapper with top/bottom and responsive side padding
    // px: { xs: 1, sm: 5, md: 10, lg: 5 } = different padding for different screen sizes
    // xs = extra small (phones), sm = small (tablets), md = medium, lg = large
    <Box sx={{ py: 0, px: { xs: 1, sm: 5, md: 10, lg: 5 } }}>

      {/* Page heading */}
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom                          // adds a bottom margin automatically
        sx={{ fontWeight: 800, mb: 4, color: '#1976d2' }}
      >
        Select Your Class
      </Typography>

      {/* Cards container — horizontal scroll on desktop, vertical stack on mobile */}
      <Box
        sx={{
          display: 'flex',
          // On mobile: stack cards vertically | On desktop: place them side by side
          flexDirection: isMobile ? 'column' : 'row',
          // On mobile: centre cards | On desktop: start from the left
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: isMobile ? 'center' : 'flex-start',
          // On mobile: normal vertical scroll | On desktop: horizontal scroll
          overflowX: isMobile ? 'hidden' : 'auto',
          overflowY: isMobile ? 'auto' : 'hidden',
          gap: isMobile ? 3 : 3,   // spacing between cards (3 = 24px in MUI)
          pb: 2,                    // padding at bottom so scrollbar doesn't overlap cards
          px: isMobile ? 0.5 : 1,
          // scrollSnapType on desktop: cards snap cleanly into view when scrolling
          scrollSnapType: isMobile ? 'none' : 'x mandatory',
          // custom scrollbar styling for desktop horizontal scroll
          '&::-webkit-scrollbar': { height: 8 },        // thin scrollbar
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',  // light grey scrollbar handle
            borderRadius: 4,
          },
        }}
      >
        {/* Loop over the classList array and render one ClassCard per entry */}
        {classList.map((cls) => (
          // Box wrapper around each card — controls snapping and width behaviour
          <Box
            key={cls.id}       // React needs a unique key for each item in a list
            sx={{
              flex: '0 0 auto',  // prevent cards from shrinking or growing — fixed size
              // On desktop: snap this card into place when user scrolls to it
              scrollSnapAlign: isMobile ? 'none' : 'start',
              display: 'flex',
              justifyContent: 'center',
              // On mobile: stretch each card to full width of the container
              // On desktop: let each card be its natural width (330px from ClassCard)
              width: isMobile ? '100%' : 'auto',
              px: 0,
            }}
          >
            {/* Render the ClassCard component */}
            {/* ...cls spreads all properties of the class object as individual props */}
            {/* equivalent to: id={cls.id} title={cls.title} price={cls.price} etc. */}
            <ClassCard
              {...cls}
              // Pass the purchase record for this specific class (undefined if not purchased)
              // purchasedBatches[cls.id] looks up "10" → returns the purchase object or undefined
              purchaseInfo={purchasedBatches[cls.id]}
              // Pass the update function so ClassCard can notify us after a purchase
              onPurchase={handlePurchaseUpdate}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Export this component as the default export
// so other files can import it as: import ClassCardPage from './ClassCardPage'
export default ClassCardPage;
