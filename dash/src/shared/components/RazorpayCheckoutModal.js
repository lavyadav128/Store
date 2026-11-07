import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

export default function RazorpayCheckoutModal({
  open,
  onClose,
  order,
  batchTitle,
  batchPrice,
  onSuccess,
  onFailure,
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [upiId, setUpiId] = useState('student@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const price = batchPrice || (order ? order.amount / 100 : 0);
  const orderId = order?.id || `order_sim_${Date.now()}`;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      setIsSuccess(true);

      const fakePaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const fakeSignature = `sig_sim_${Date.now()}`;

      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) {
          onSuccess({
            razorpay_order_id: orderId,
            razorpay_payment_id: fakePaymentId,
            razorpay_signature: fakeSignature,
          });
        }
      }, 700);
    }, 1100);
  };

  const handleSimulateFailure = () => {
    if (onFailure) {
      onFailure(orderId, {
        error: {
          code: 'BAD_REQUEST_ERROR',
          description: 'Payment was canceled or declined by user in test mode.',
          source: 'customer',
          step: 'payment_authentication',
          reason: 'payment_cancelled',
        },
      });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isProcessing && onClose()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(12, 35, 64, 0.28)',
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    >
      {/* ── HEADER ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0c2340 0%, #1e3a8a 100%)',
          color: '#fff',
          p: 2.5,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          disabled={isProcessing}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: '#fff' },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '7px',
              background: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            R
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.3px' }}>
            Razorpay <span style={{ opacity: 0.7, fontWeight: 500, fontSize: 13 }}>Trusted Business</span>
          </Typography>
          <Chip
            label="TEST MODE"
            size="small"
            sx={{
              height: 20,
              fontSize: 10,
              fontWeight: 800,
              background: 'rgba(255,255,255,0.18)',
              color: '#38bdf8',
              ml: 'auto',
              mr: 4,
            }}
          />
        </Box>

        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', mb: 0.4 }}>
          EduPortal • Atom Classes
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {batchTitle || 'Course Batch'}
          </Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#38bdf8' }}>
            ₹{price}
          </Typography>
        </Box>
      </Box>

      {/* ── BODY / PAYMENT METHODS ── */}
      <DialogContent sx={{ p: 2.5, pb: 2 }}>
        {isSuccess ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#16a34a', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', mb: 0.5 }}>
              Payment Successful!
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#666' }}>
              Enrolling you into your batch now…
            </Typography>
          </Box>
        ) : (
          <>
            <Tabs
              value={tabIndex}
              onChange={(_, v) => setTabIndex(v)}
              variant="fullWidth"
              sx={{
                minHeight: 38,
                borderBottom: '1px solid #eee',
                mb: 2,
                '& .MuiTab-root': {
                  minHeight: 38,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'none',
                  color: '#666',
                  '&.Mui-selected': { color: '#0284c7' },
                },
                '& .MuiTabs-indicator': { backgroundColor: '#0284c7' },
              }}
            >
              <Tab icon={<QrCode2Icon sx={{ fontSize: 16 }} />} iconPosition="start" label="UPI / QR" />
              <Tab icon={<CreditCardIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Card" />
              <Tab icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Net Banking" />
            </Tabs>

            {/* TAB 0: UPI */}
            {tabIndex === 0 && (
              <Box>
                <Typography sx={{ fontSize: 12, color: '#666', mb: 1.2, fontWeight: 600 }}>
                  Choose UPI App:
                </Typography>
                <RadioGroup value={selectedUpiApp} onChange={(e) => setSelectedUpiApp(e.target.value)}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm', icon: '🔵' },
                      { id: 'bhim', name: 'BHIM UPI', icon: '🟠' },
                    ].map((app) => (
                      <Box
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id)}
                        sx={{
                          p: 1.2,
                          borderRadius: '10px',
                          border: selectedUpiApp === app.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: selectedUpiApp === app.id ? '#f0f9ff' : '#fafafa',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Radio size="small" checked={selectedUpiApp === app.id} sx={{ p: 0 }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                          {app.icon} {app.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </RadioGroup>

                <TextField
                  fullWidth
                  size="small"
                  label="UPI ID / VPA"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  sx={{ mt: 0.5, '& input': { fontSize: 13, fontFamily: "'DM Sans', sans-serif" } }}
                />
              </Box>
            )}

            {/* TAB 1: CARD */}
            {tabIndex === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  sx={{ '& input': { fontSize: 13, fontFamily: "'DM Sans', sans-serif" } }}
                />
                <Box sx={{ display: 'flex', gap: 1.2 }}>
                  <TextField
                    size="small"
                    label="Valid Thru"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    sx={{ width: '50%', '& input': { fontSize: 13 } }}
                  />
                  <TextField
                    size="small"
                    label="CVV"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    sx={{ width: '50%', '& input': { fontSize: 13 } }}
                  />
                </Box>
              </Box>
            )}

            {/* TAB 2: NET BANKING */}
            {tabIndex === 2 && (
              <Box>
                <Typography sx={{ fontSize: 12, color: '#666', mb: 1, fontWeight: 600 }}>
                  Select Your Bank:
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                    <Box
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      sx={{
                        p: 1.2,
                        borderRadius: '10px',
                        border: selectedBank === bank ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        background: selectedBank === bank ? '#f0f9ff' : '#fafafa',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: 12.5,
                        color: selectedBank === bank ? '#0284c7' : '#333',
                      }}
                    >
                      {bank} Bank
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* PAY NOW BUTTON */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              startIcon={isProcessing ? <CircularProgress size={18} color="inherit" /> : <FlashOnIcon />}
              sx={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                py: 1.3,
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: 14.5,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
                },
              }}
            >
              {isProcessing ? 'Authorizing Payment…' : `Pay ₹${price}`}
            </Button>

            {/* SIMULATE FAILURE SHORTCUT */}
            <Button
              fullWidth
              variant="text"
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              sx={{
                mt: 1,
                fontSize: 11,
                color: '#ef4444',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { background: '#fef2f2' },
              }}
            >
              Simulate Failed Transaction (Test Recovery)
            </Button>
          </>
        )}
      </DialogContent>

      {/* ── FOOTER ── */}
      <Box
        sx={{
          background: '#f8fafc',
          px: 2.5,
          py: 1.2,
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <ShieldOutlinedIcon sx={{ fontSize: 15, color: '#16a34a' }} />
        <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
          Secured with 256-bit SSL encryption by Razorpay
        </Typography>
      </Box>
    </Dialog>
  );
}
