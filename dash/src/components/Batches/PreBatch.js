import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../makeauth';
import server from '../../environment';

const classList = [
  { id: '1', title: 'Class 10', description: 'Master all subjects with our compreyhensive Class 10 content.', imageUrl: '/images/p10.png', price: 0, isPremium: true },
  { id: '2', title: 'Class 11 (Jee + Boards)', description: 'Strengthen your foundation with advanced concepts.', imageUrl: '/images/p11.png', price: 99, isPremium: true },
  { id: '3', title: 'Class 12 (Jee + Boards)', description: 'Ace your boards and entrance exams with Class 12 content.', imageUrl: '/images/p12.png', price: 99, isPremium: true },
  { id: '14', title: 'HandWritten Notes', description: 'Ace your boards and entrance exams with Best Notes.', imageUrl: '/images/p13.png', price: 0, isPremium: true },

];

const ClassCard = ({ id, title, description, imageUrl, price, isPremium, purchaseInfo, onPurchase }) => {
  const navigate = useNavigate(); // Hook from React Router to navigate between pages
  const isPurchased = !!purchaseInfo; // Checks if purchaseInfo exists (true if user has purchased the class)
  const expiryDate = purchaseInfo?.expiryDate ? new Date(purchaseInfo.expiryDate) : null; 
  // Converts expiryDate from purchaseInfo to a Date object if it exists, else null

  const handleExploreRedirect = () => {
    navigate(`/premium/class/${id}/explore`); 
    // Redirects user to the explore page for this class using its id
  };

  const handleBuyRedirect = async () => {
    const token = localStorage.getItem('token'); 
    // Fetches JWT token from localStorage to check if user is logged in
    if (!token) {
      alert('Please login first'); 
      // Alerts the user if no token found (not logged in)
      return; // Stops the function execution if user is not logged in
    }

    const purchasePayload = {
      classId: id,            // Class ID to identify which class is being purchased
      batchTitle: title,      // Title of the class/batch
      price: price,           // Price of the class
      description: description, // Description of the class
      imageUrl: imageUrl,     // Image URL for the class
      isPremium: isPremium,   // Boolean indicating if this is a premium class
    };

    if (price === 0) {
      // If the class is free (price = 0), directly save the purchase without payment
      try {
        await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', purchasePayload); 
        // Calls backend API to save the purchase for free classes
        onPurchase(id); 
        // Calls the parent component's callback to update UI after purchase
        navigate(`/premium/class/${id}`); 
        // Redirects user to the premium class page
      } catch (err) {
        console.error('Error saving free access:', err); 
        // Logs error in console if saving fails
        alert(err.message || 'Failed to grant access.'); 
        // Alerts user about the failure
      }
      return; 
      // Stops further execution since free class is already handled
    }

    if (!window.Razorpay) {
      alert('Payment gateway not loaded'); 
      // If Razorpay script is not loaded, alert user
      return; // Stop execution if Razorpay is not available
    }

    try {
      const orderResponse = await fetch(`${server}/api/create-order`, {
        method: 'POST', 
        // HTTP method to create a new order
        headers: {
          'Content-Type': 'application/json', 
          // Specify that the body is JSON
          Authorization: `Bearer ${token}`, 
          // Send JWT token in Authorization header for backend authentication
        },
        body: JSON.stringify({ amount: price, receipt: `receipt_${id}_${Date.now()}` }), 
        // Request body with amount and unique receipt id using class id and timestamp
      });

      const order = await orderResponse.json(); 
      // Parse the backend response to get Razorpay order details (id, amount, etc.)

      const options = {
        key: process.env.REACT_APP_RAZORPAY_LIVE_KEY, 
        // Razorpay API key from environment variables
        amount: order.amount, 
        // Amount returned from backend order creation
        currency: 'INR', 
        // Currency for payment
        name: 'Atom Classes', 
        // Business name displayed in payment popup
        description: `Payment for ${title}`, 
        // Description for the payment
        order_id: order.id, 
        // Order ID from Razorpay required for payment
        handler: async function (response) {
          // This function runs after successful payment
          try {
            await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', purchasePayload); 
            // After payment success, save the purchase in backend
            onPurchase(id); 
            // Update UI via callback
            navigate(`/premium/class/${id}`); 
            // Redirect user to the premium class page
          } catch (err) {
            console.error('Error saving purchase:', err); 
            // Logs error if saving purchase fails
            alert(err.message || 'Error saving your purchase.'); 
            // Alert user about the error
          }
        },
        prefill: { name: '', email: '', contact: '' }, 
        // Prefill user details in Razorpay popup (currently empty)
        notes: { batchId: id }, 
        // Custom notes sent to Razorpay (class id)
        theme: { color: '#1976d2' }, 
        // Customize Razorpay popup color theme
      };

      const rzp = new window.Razorpay(options); 
      // Creates a new Razorpay payment instance with the above options
      rzp.open(); 
      // Opens the Razorpay payment popup for user to complete the transaction
    } catch (err) {
      console.error('Failed to create Razorpay order:', err); 
      // Logs error if order creation fails
      alert('Failed to initiate payment. Try again.'); 
      // Alerts user about failure to start payment process
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
          onClick={() =>
            isPurchased ? navigate(`/premium/class/${id}`) : handleBuyRedirect()
          }
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
  const [purchasedBatches, setPurchasedBatches] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await makeAuthenticatedRequest(`${server}/api/user-purchases`);
        const purchasesMap = {};
        data.forEach((purchase) => {
          purchasesMap[purchase.classId] = purchase;
        });
        setPurchasedBatches(purchasesMap);
      } catch (err) {
        console.error('Failed to fetch purchases:', err.message);
        if (!err.message.includes('No authentication token')) {
          alert(`Failed to load purchases: ${err.message}`);
        }
      }
    };

    fetchPurchases();
  }, []);

  const handlePurchaseUpdate = (classId) => {
    setPurchasedBatches((prev) => ({
      ...prev,
      [classId]: prev[classId] || { expiryDate: new Date().toISOString() },
    }));
  };

  return (
    <Box sx={{ py: 0, px: { xs: 1, sm: 5, md: 10, lg: 16 } }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 800, mb: 4, color: '#1976d2' }}
      >
        Select Your Class
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: isMobile ? 'center' : 'flex-start',
          overflowX: isMobile ? 'hidden' : 'auto',
          overflowY: isMobile ? 'auto' : 'hidden',
          gap: isMobile ? 3 : 3,
          pb: 2,
          px: isMobile ? 0.5 : 1,
          scrollSnapType: isMobile ? 'none' : 'x mandatory',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: 4,
          },
        }}
      >
        {classList.map((cls) => (
          <Box
            key={cls.id}
            sx={{
              flex: '0 0 auto',
              scrollSnapAlign: isMobile ? 'none' : 'start',
              display: 'flex',
              justifyContent: 'center',
              width: isMobile ? '100%' : 'auto',
              px: 0,
            }}
          >
            <ClassCard
              {...cls}
              purchaseInfo={purchasedBatches[cls.id]}
              onPurchase={handlePurchaseUpdate}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ClassCardPage;
