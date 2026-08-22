


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
import { makeAuthenticatedRequest } from '../makeauth';

// "server" is the base URL of our backend (e.g. "https://our-api.onrender.com")
// imported from a config file so we don't hardcode the URL everywhere
import server from '../../environment';
import { reportCheckoutFailure } from '../../recoveryClient';


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

  // useNavigate gives us the navigate() function to redirect programmatically
  const navigate = useNavigate();

  // !! converts any value to a strict boolean
  // if purchaseInfo is an object (truthy) → isPurchased = true
  // if purchaseInfo is undefined (falsy)  → isPurchased = false
  const isPurchased = !!purchaseInfo;

  // If purchaseInfo exists and has an expiryDate, convert that date string to a Date object
  // The ?. is "optional chaining" — if purchaseInfo is undefined, don't crash, just return null
  const expiryDate = purchaseInfo?.expiryDate ? new Date(purchaseInfo.expiryDate) : null;

  // ── EXPLORE BUTTON HANDLER ──
  // When the user clicks "Explore", go to the explore page for this class
  // e.g. for id='10' → navigates to /class/10/explore
  const handleExploreRedirect = () => {
    navigate(`/class/${id}/explore`);
  };

  // ── BUY / ACCESS BUTTON HANDLER ──
  // Handles both free access and paid purchases
  const handleBuyRedirect = async () => {

    // Check if the user is logged in by looking for their JWT token
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token found, user is not logged in — show alert and stop
      alert('Please login first');
      return;
    }

    // Build the payload (data) we'll send to the backend when saving a purchase
    // This is the same whether the class is free or paid
    const purchasePayload = {
      classId: id,          // which class was purchased
      batchTitle: title,    // the class name
      price: price,         // the price paid (0 for free)
      description: description,
      imageUrl: imageUrl,
    };

    // ── FREE CLASS PATH ──
    // If price is 0, skip payment and directly grant access
    if (price === 0) {
      try {
        // Call backend to record this free "purchase" in the database
        await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', purchasePayload);
        // Tell the parent component to update the purchased state for this class
        onPurchase(id);
        // Redirect the student to the class content page
        navigate(`/class/${id}`);
      } catch (err) {
        console.error('Error saving free access:', err);
        alert(err.message || 'Failed to grant access.');
      }
      return; // stop here — don't fall through to the paid path below
    }

    // ── PAID CLASS PATH ──

    // Check if Razorpay's script has been loaded in the browser
    // Razorpay is loaded via a <script> tag in public/index.html
    // If it hasn't loaded yet, window.Razorpay won't exist
    if (!window.Razorpay) {
      alert('Payment gateway not loaded');
      return;
    }

    try {
      // ── STEP 1: Create a Razorpay order on our backend ──
      // Our backend calls Razorpay's API and returns an order object
      // The order object contains: order.id, order.amount, order.currency
      const order = await makeAuthenticatedRequest(`${server}/api/create-order`, 'POST', {
        amount: price,                          // amount in rupees (backend converts to paise)
        receipt: `receipt_${id}_${Date.now()}`, // unique receipt ID using class id + timestamp
        batchId: id,
        batchTitle: title,
      });

      // ── STEP 2: Configure the Razorpay payment popup ──
      // "options" is the config object that tells Razorpay how to display the payment form
      const options = {
        key: order.key || process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: order.amount,      // amount in paise (as returned by backend)
        currency: order.currency,  // "INR"
        name: 'Atom Classes',      // shown at the top of the payment popup
        description: `Payment for ${title}`, // shown below the name
        order_id: order.id,        // the order ID from Razorpay — links payment to this order

        // handler runs automatically AFTER the student successfully pays
        handler: async function (response) {
          // response contains payment details from Razorpay
          try {
            // Save the purchase record in our database now that payment is confirmed
            await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', {
              ...purchasePayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });            // Update the parent component's state to mark this class as purchased
            onPurchase(id);
            // Redirect to the class content page
            navigate(`/class/${id}`);
          } catch (err) {
            console.error('Error saving purchase:', err);
            alert(err.message || 'Error saving your purchase.');
          }
        },

        // prefill auto-fills the student's details in the payment form
        // left empty here — could be filled from the user's profile
        prefill: { name: '', email: '', contact: '' },

        // notes are extra metadata attached to the order (visible in Razorpay dashboard)
        notes: { batchId: id },

        // theme.color changes the colour of the Razorpay popup header
        theme: { color: '#1976d2' },
      };

      // ── STEP 3: Create a Razorpay instance and open the payment popup ──
      // new window.Razorpay(options) creates the payment modal with our config
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => reportCheckoutFailure(order.id, response));
      // rzp.open() actually shows the payment popup to the student
      rzp.open();

    } catch (err) {
      // If creating the order fails (network issue, server error etc.)
      console.error('Payment error:', err);
      alert('Failed to initiate payment. Try again.');
    }
  };


  // ── JSX: THE CARD UI ──
  return (
    // Card is the white rounded container
    // sx is MUI's way of writing inline CSS using the theme system
    <Card
      sx={{
        width: 330,                    // fixed width for each card
        borderRadius: 4,               // rounded corners
        overflow: 'hidden',            // clip image corners inside the rounded card
        boxShadow: 6,                  // MUI shadow level (1-24)
        display: 'flex',
        flexDirection: 'column',       // stack image → content → buttons vertically
        backgroundColor: '#ffffff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // smooth hover animation
        '&:hover': {
          transform: 'translateY(-5px)', // lift card up by 5px on hover
          boxShadow: 12,                 // deeper shadow to enhance the "lifted" effect
        },
      }}
    >
      {/* CardMedia renders the course thumbnail image */}
      {/* component="img" tells MUI to render an <img> tag */}
      {/* height="220" sets the image height in pixels */}
      <CardMedia
        component="img"
        height="220"
        image={imageUrl}   // path to the image (e.g. /images/10.png)
        alt={title}        // accessibility text if image fails to load
        sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
        // objectFit: 'cover' = fill the box while keeping the image's aspect ratio
        // borderBottom adds a thin separator line between image and content
      />

      {/* CardContent holds the text info below the image */}
      <CardContent sx={{ px: 3, pt: 0 }}>
        {/* Course title in bold */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>

        {/* Course description — lighter grey text */}
        {/* minHeight: 48 keeps all cards the same height even if description length differs */}
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
          {description}
        </Typography>

        {/* Row with price chip on left and "Purchased" chip on right */}
        {/* Stack direction="row" = place children side by side */}
        {/* justifyContent="space-between" = push them to opposite ends */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          {/* Price badge — green if free, orange/yellow if paid */}
          <Chip
            label={price === 0 ? 'FREE' : `₹${price}`} // shows "FREE" or "₹499" etc.
            color={price === 0 ? 'success' : 'warning'} // green for free, amber for paid
            sx={{ fontWeight: 'bold', px: 1.5 }}
          />
          {/* Only show "Purchased" badge if this class was already bought */}
          {isPurchased && <Chip label="Purchased" color="primary" size="small" />}
        </Stack>

        {/* Box reserves space for the expiry date text */}
        {/* minHeight: 24 prevents layout shift when no date is shown */}
        <Box sx={{ minHeight: 24, mt: 1, display: 'flex', alignItems: 'center' }}>
          {/* Only show expiry date if the class is purchased AND has an expiry date */}
          {isPurchased && expiryDate && (
            <Typography variant="caption" sx={{ color: 'gray', fontWeight: 600 }}>
              {/* toLocaleDateString() converts Date object to human-readable format */}
              {/* e.g. "6/16/2026" */}
              Expires on: {expiryDate.toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* CardActions holds the two buttons at the bottom of the card */}
      <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'space-between' }}>

        {/* EXPLORE BUTTON — always visible, takes user to a preview page */}
        <Button
          variant="outlined"           // outlined style = border only, no fill
          onClick={handleExploreRedirect}
          sx={{
            width: '48%',             // takes up almost half the card width
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',    // prevents MUI from auto-uppercasing button text
            '&:hover': { backgroundColor: '#e3f2fd' }, // light blue tint on hover
          }}
        >
          Explore
        </Button>

        {/* BUY / STUDY BUTTON — label and action change based on purchase status */}
        <Button
          variant="contained"          // filled/solid button style
          onClick={() => (isPurchased ? navigate(`/class/${id}`) : handleBuyRedirect())}
          // if already purchased → go directly to the class page
          // if not purchased     → trigger the buy/payment flow
          sx={{
            width: '48%',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {/* Label changes: "Study" if owned, "Buy Now" if not */}
          {isPurchased ? 'Study' : 'Buy Now'}
        </Button>
      </CardActions>
    </Card>
  );
};


// ═════════════════════════════════════════════════════════════
//  ClassCardPage COMPONENT
//  The parent/page component — renders the heading and all class cards
//  Manages which classes the user has purchased
//
//  ── ONLY CHANGE: classList now comes from the API (folder="Jee Mains")
//     instead of being a hardcoded array. Everything else — layout,
//     purchase handling, card rendering — is untouched. ──
// ═════════════════════════════════════════════════════════════

const ClassCardPage = () => {

  // classList now lives in state, populated by the API fetch below,
  // instead of being a hardcoded constant outside the component.
  const [classList, setClassList] = useState([]);

  // purchasedBatches = an object (dictionary) where:
  // key   = classId (e.g. "10", "11")
  // value = the purchase record from the database (contains expiryDate etc.)
  // e.g. { "10": { classId: "10", expiryDate: "2026-12-31" }, "11": {...} }
  // starts as empty {} — filled in after the API call in useEffect
  const [purchasedBatches, setPurchasedBatches] = useState({});

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
        setClassList(data.map((b) => ({
          id: b.batchId,
          title: b.title,
          description: b.description,
          imageUrl: b.imageUrl,
          price: b.price,
        })));
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
    // (prev) is the current value of purchasedBatches before the update
    // We spread all existing entries (...prev) and add/update the newly purchased class
    setPurchasedBatches((prev) => ({
      ...prev, // keep all previously purchased classes
      // If this classId already exists in prev, keep it
      // If not (new purchase), create a minimal entry with today's date as expiry
      [classId]: prev[classId] || { expiryDate: new Date().toISOString() },
    }));
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
