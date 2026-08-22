// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   CardActions,
//   Button,
//   Dialog,
//   DialogContent,
//   IconButton,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useNavigate } from "react-router-dom";
// import { makeAuthenticatedRequest } from "../makeauth";
// import server from "../../environment";

// const batches = [
//   {
//     id: "dsa",
//     title: "Dsa Sheet",
//     description: "Ace coding interviews with our 34-day DSA program and master DSA.",
//     imageUrl: "/images/dsa_files/dsa.png",
//     screenshot: "/images/dsa_files/dsass.png",
//     price: 0,
//     isPremium: true,
//     redirectPath: "/dsa",
//     whatYouLearn: [
//       "Master the fundamentals of Data Structures & Algorithms",
//       "Learn with a structured 34-day roadmap",
//       "Most frequent and expected questions",
//       "Solve 200+ curated LeetCode problems",
//       "Prepare for top service-based companies",
//       "Get personalized mentorship & doubt support",
//       "Prepare for top product-based companies",
//     ],
//   },
//   {
//     id: "web",
//     title: "Web Development",
//     description: "Create modern, responsive web apps with our structured fullstack roadmap.",
//     imageUrl: "/images/dsa_files/web.png",
//     screenshot: "/images/dsa_files/webss.png",
//     price: 0,
//     isPremium: true,
//     redirectPath: "/web",
//     whatYouLearn: [
//       "HTML, CSS, and JavaScript (Responsive Web Design)",
//       "Modern frameworks like React or Angular",
//       "Server-side programming (Node.js, Express.js, or others)",
//       "RESTful APIs and routing",
//       "Authentication and Authorization",
//       "CRUD operations",
//       "Hosting (Vercel, render, or traditional servers)",
//       "Relational databases (MySQL, PostgreSQL",
//     ],
//   },
//   {
//     id: "data-analysis",
//     title: "Data Analysis",
//     description: "Learn data analysis, visualization, and business insights.",
//     imageUrl: "/images/dsa_files/data.png",
//     screenshot: "/images/dsa_files/dataanalysisss.png",
//     price: 0,
//     isPremium: true,
//     redirectPath: "/data-analysis",
//     whatYouLearn: [
      // "Python for Data Analysis",
      // "NumPy and Pandas for data manipulation",
      // "Data cleaning and preprocessing",
      // "Data visualization using Matplotlib and Seaborn",
      // "Exploratory Data Analysis (EDA)",
      // "Working with CSV, Excel, and databases",
      // "Statistics and business insights",
      // "Power BI and dashboard creation",
      // "SQL for data querying",
      // "Real-world data analysis projects",
//     ],
//   },
//   {
//     id: "aptitude",
//     title: "Aptitude Preparation",
//     description: "Master quantitative aptitude, logical reasoning, and problem-solving.",
//     imageUrl: "/images/dsa_files/apt.png",
//     screenshot: "/images/dsa_files/aptitudess.png",
//     price: 0,
//     isPremium: true,
//     redirectPath: "/aptitude",
//     whatYouLearn: [
      // "Quantitative Aptitude fundamentals",
      // "Percentage, Profit & Loss, Ratio and Proportion",
      // "Time, Speed and Distance",
      // "Time and Work problems",
      // "Probability and Permutation & Combination",
      // "Logical and Analytical Reasoning",
      // "Verbal Ability and English Grammar",
      // "Data Interpretation",
      // "Short tricks and fast calculation techniques",
      // "Placement and competitive exam practice questions",
//     ],
//   },
// ];

// const CombinedClassPage = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [purchaseInfo, setPurchaseInfo] = useState({});
//   const [openModalId, setOpenModalId] = useState(null);
//   const [openExploreId, setOpenExploreId] = useState(null);

//   useEffect(() => {
//     const fetchPurchases = async () => {
//       try {
//         const data = await makeAuthenticatedRequest(`${server}/api/user-purchases`);

//         const info = {};

//         batches.forEach((batch) => {
//           const purchase = data.find((p) => p.classId === batch.id);

//           if (purchase) info[batch.id] = purchase;
//         });

//         setPurchaseInfo(info);
//       } catch (err) {
//         console.error("Failed to fetch purchases:", err.message);
//       }
//     };

//     fetchPurchases();
//   }, []);

//   const handleBuyRedirect = async (batch) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login first");
//       return;
//     }

//     const purchasePayload = {
//       classId: batch.id,
//       batchTitle: batch.title,
//       price: batch.price,
//       imageUrl: batch.imageUrl,
//       description: batch.description,
//     };

//     if (batch.price === 0) {
//       try {
//         await makeAuthenticatedRequest(
//           `${server}/api/save-purchase`,
//           "POST",
//           purchasePayload
//         );

//         setPurchaseInfo((prev) => ({
//           ...prev,
//           [batch.id]: { expiryDate: new Date().toISOString() },
//         }));

//         navigate(batch.redirectPath);
//       } catch (err) {
//         alert(err.message || "Failed to grant access.");
//       }

//       return;
//     }

//     try {
//       const orderRes = await makeAuthenticatedRequest(
//         `${server}/api/create-order`,
//         "POST",
//         {
//           amount: batch.price,
//           receipt: `receipt_${batch.id}_${Date.now()}`,
//         }
//       );

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_LIVE_KEY,
//         amount: batch.price * 100,
//         currency: "INR",
//         name: "Atom Classes",
//         description: `Payment for ${batch.title}`,
//         order_id: orderRes.id,

//         handler: async function () {
//           try {
//             await makeAuthenticatedRequest(
//               `${server}/api/save-purchase`,
//               "POST",
//               purchasePayload
//             );

//             setPurchaseInfo((prev) => ({
//               ...prev,
//               [batch.id]: { expiryDate: new Date().toISOString() },
//             }));

//             navigate(batch.redirectPath);
//           } catch (err) {
//             alert(err.message || "Error saving your purchase.");
//           }
//         },

//         prefill: { name: "", email: "", contact: "" },

//         notes: { batchId: batch.id },

//         theme: { color: "#1976d2" },
//       };

//       const rzp = new window.Razorpay(options);

//       rzp.open();
//     } catch (err) {
//       alert("Payment initialization failed. Please try again.");
//     }
//   };

//   return (
//     <Box sx={{ flexGrow: 1, py: isMobile ? 2 : 0, px: isMobile ? 1.5 : 5 }}>
//       <Typography
//         variant={isMobile ? "h5" : "h4"}
//         fontWeight={700}
//         mb={4}
//         textAlign="center"
//         color="primary"
//       >
//         DSA to Deployment
//       </Typography>

//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: isMobile ? "column" : "row",
//           alignItems: isMobile ? "center" : "flex-start",
//           justifyContent: isMobile ? "center" : "flex-start",
//           overflowX: isMobile ? "hidden" : "auto",
//           overflowY: isMobile ? "auto" : "hidden",
//           gap: 3,
//           pb: 2,
//           px: isMobile ? 0.5 : 1,
//           scrollSnapType: isMobile ? "none" : "x mandatory",
//           "&::-webkit-scrollbar": { height: 8 },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: "#ccc",
//             borderRadius: 4,
//           },
//         }}
//       >
//         {batches.map((batch) => {
//           const isPurchased = !!purchaseInfo[batch.id];

//           const expiryDate = purchaseInfo[batch.id]?.expiryDate
//             ? new Date(purchaseInfo[batch.id].expiryDate)
//             : null;

//           return (
//             <Box
//               key={batch.id}
//               sx={{
//                 flex: "0 0 auto",
//                 scrollSnapAlign: isMobile ? "none" : "start",
//                 display: "flex",
//                 justifyContent: "center",
//                 width: isMobile ? "100%" : "auto",
//                 px: 0,
//               }}
//             >
//               <Card
//                 sx={{
//                   width: 330,
//                   borderRadius: 4,
//                   overflow: "hidden",
//                   boxShadow: 6,
//                   display: "flex",
//                   flexDirection: "column",
//                   backgroundColor: "#ffffff",
//                   transition: "transform 0.3s ease, box-shadow 0.3s ease",
//                   "&:hover": {
//                     transform: "translateY(-5px)",
//                     boxShadow: 12,
//                   },
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   height="220"
//                   image={batch.imageUrl}
//                   alt={batch.title}
//                   sx={{
//                     objectFit: "cover",
//                     borderBottom: "1px solid #eee",
//                   }}
//                 />

//                 <CardContent sx={{ px: 3, pt: 0 }}>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 700, mb: 1 }}
//                   >
//                     {batch.title}
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ minHeight: 48 }}
//                   >
//                     {batch.description}
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       mt: 2,
//                     }}
//                   >
//                     <Button
//                       variant="contained"
//                       color={batch.price === 0 ? "success" : "warning"}
//                       sx={{
//                         borderRadius: "50px",
//                         pointerEvents: "none",
//                         px: 2,
//                         py: 0.5,
//                         fontWeight: 700,
//                         fontSize: "0.85rem",
//                         minWidth: "80px",
//                         textTransform: "none",
//                       }}
//                     >
//                       {batch.price === 0 ? "FREE" : `₹${batch.price}`}
//                     </Button>

//                     {isPurchased && (
//                       <Box
//                         sx={{
//                           bgcolor: "#1976d2",
//                           color: "#fff",
//                           fontWeight: 500,
//                           px: 1.5,
//                           py: 0.3,
//                           borderRadius: 50,
//                           fontSize: "0.85rem",
//                         }}
//                       >
//                         Purchased
//                       </Box>
//                     )}
//                   </Box>

//                   <Box
//                     sx={{
//                       minHeight: 24,
//                       mt: 1,
//                       display: "flex",
//                       alignItems: "center",
//                     }}
//                   >
//                     {isPurchased && expiryDate && (
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: "gray",
//                           fontWeight: 600,
//                         }}
//                       >
//                         Expires on: {expiryDate.toLocaleDateString()}
//                       </Typography>
//                     )}
//                   </Box>
//                 </CardContent>

//                 <CardActions
//                   sx={{
//                     px: 3,
//                     pb: 3,
//                     pt: 0,
//                     justifyContent: "space-between",
//                     mt: "auto",
//                   }}
//                 >
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => setOpenExploreId(batch.id)}
//                     sx={{
//                       width: "48%",
//                       fontWeight: 600,
//                       borderRadius: 2,
//                       textTransform: "none",
//                     }}
//                   >
//                     Explore
//                   </Button>

//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() =>
//                       isPurchased
//                         ? navigate(batch.redirectPath)
//                         : handleBuyRedirect(batch)
//                     }
//                     sx={{
//                       width: "48%",
//                       fontWeight: 600,
//                       borderRadius: 2,
//                       textTransform: "none",
//                     }}
//                   >
//                     {isPurchased ? "Study" : "Buy Now"}
//                   </Button>
//                 </CardActions>
//               </Card>

//               <Dialog
//                 open={openModalId === batch.id}
//                 onClose={() => setOpenModalId(null)}
//                 maxWidth="sm"
//                 fullWidth
//               >
//                 <DialogContent
//                   sx={{
//                     position: "relative",
//                     p: 3,
//                     textAlign: "center",
//                   }}
//                 >
//                   <IconButton
//                     onClick={() => setOpenModalId(null)}
//                     sx={{ position: "absolute", top: 8, right: 8 }}
//                   >
//                     <CloseIcon />
//                   </IconButton>

//                   <Typography
//                     variant="h6"
//                     sx={{ mb: 2, fontWeight: 600 }}
//                   >
//                     {batch.title} Preview
//                   </Typography>

//                   <Box sx={{ display: "flex", justifyContent: "center" }}>
//                     <img
//                       src={batch.screenshot}
//                       alt={`${batch.title} Preview`}
//                       style={{
//                         maxWidth: "100%",
//                         maxHeight: "400px",
//                         borderRadius: 10,
//                       }}
//                     />
//                   </Box>
//                 </DialogContent>
//               </Dialog>

//               <Dialog
//                 open={openExploreId === batch.id}
//                 onClose={() => setOpenExploreId(null)}
//                 maxWidth="sm"
//                 fullWidth
//               >
//                 <DialogContent sx={{ position: "relative", p: 3 }}>
//                   <IconButton
//                     onClick={() => setOpenExploreId(null)}
//                     sx={{ position: "absolute", top: 8, right: 8 }}
//                   >
//                     <CloseIcon />
//                   </IconButton>

//                   <Typography
//                     variant="h6"
//                     fontWeight={600}
//                     color="primary"
//                     gutterBottom
//                     textAlign="center"
//                   >
//                     What You'll Learn in {batch.title}
//                   </Typography>

//                   <Box component="ul" sx={{ pl: 2, m: 0 }}>
//                     {batch.whatYouLearn.map((point, index) => (
//                       <Typography
//                         key={index}
//                         component="li"
//                         variant="body1"
//                         color="text.secondary"
//                         sx={{
//                           mb: 1.4,
//                           fontSize: "1rem",
//                           listStyle: "none",
//                           pl: 3,
//                           position: "relative",
//                           "&::before": {
//                             content: '"✅"',
//                             position: "absolute",
//                             left: 0,
//                           },
//                         }}
//                       >
//                         {point}
//                       </Typography>
//                     ))}
//                   </Box>

//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => setOpenModalId(batch.id)}
//                     sx={{
//                       mt: 3,
//                       fontWeight: 600,
//                       borderRadius: 2,
//                       display: "block",
//                       mx: "auto",
//                       textTransform: "none",
//                     }}
//                   >
//                     View Screenshot
//                   </Button>
//                 </DialogContent>
//               </Dialog>
//             </Box>
//           );
//         })}
//       </Box>
//     </Box>
//   );
// };

// export default CombinedClassPage;


import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { makeAuthenticatedRequest } from "../makeauth";
import server from "../../environment";
import { reportCheckoutFailure } from "../../recoveryClient";

const CombinedClassPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [purchaseInfo, setPurchaseInfo] = useState({});
  const [openModalId, setOpenModalId] = useState(null);
  const [openExploreId, setOpenExploreId] = useState(null);

  // ── batches now comes from the API (folder="Tech") instead of a hardcoded array ──
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`${server}/api/batches?folder=Tech`);
        const data = await res.json();

        // Map MongoDB fields to match the existing card props exactly
        setBatches(
          data.map((b) => ({
            id: b.batchId,
            title: b.title,
            description: b.description,
            imageUrl: b.imageUrl,
            screenshot: b.screenshot || "",
            price: b.price,
            isPremium: true,
            redirectPath: b.redirectPath,
            whatYouLearn: b.whatYouLearn || [],
          }))
        );
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await makeAuthenticatedRequest(`${server}/api/user-purchases`);

        const info = {};

        // batches may not be loaded yet, so match generically against all purchases
        data.forEach((p) => {
          info[p.classId] = p;
        });

        setPurchaseInfo(info);
      } catch (err) {
        console.error("Failed to fetch purchases:", err.message);
      }
    };

    fetchPurchases();
  }, []);

  const handleBuyRedirect = async (batch) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const purchasePayload = {
      classId: batch.id,
      batchTitle: batch.title,
      price: batch.price,
      imageUrl: batch.imageUrl,
      description: batch.description,
    };

    if (batch.price === 0) {
      try {
        await makeAuthenticatedRequest(
          `${server}/api/save-purchase`,
          "POST",
          purchasePayload
        );

        setPurchaseInfo((prev) => ({
          ...prev,
          [batch.id]: { expiryDate: new Date().toISOString() },
        }));

        navigate(batch.redirectPath);
      } catch (err) {
        alert(err.message || "Failed to grant access.");
      }

      return;
    }

    try {
      const orderRes = await makeAuthenticatedRequest(
        `${server}/api/create-order`,
        "POST",
        {
          amount: batch.price,
          receipt: `receipt_${batch.id}_${Date.now()}`,
          batchId: batch.id,
          batchTitle: batch.title,
        }
      );

      const options = {
        key: orderRes.key || process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: orderRes.amount,
        currency: "INR",
        name: "Atom Classes",
        description: `Payment for ${batch.title}`,
        order_id: orderRes.id,

        handler: async function (response) {
          try {
            await makeAuthenticatedRequest(
              `${server}/api/save-purchase`,
              "POST",
              {
                ...purchasePayload,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            setPurchaseInfo((prev) => ({
              ...prev,
              [batch.id]: { expiryDate: new Date().toISOString() },
            }));

            navigate(batch.redirectPath);
          } catch (err) {
            alert(err.message || "Error saving your purchase.");
          }
        },

        prefill: { name: "", email: "", contact: "" },

        notes: { batchId: batch.id },

        theme: { color: "#1a1a2e" },
        modal: { confirm_close: true, handleback: true },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => reportCheckoutFailure(orderRes.id, response));

      rzp.open();
    } catch (err) {
      alert("Payment initialization failed. Please try again.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: isMobile ? 2 : 0, px: isMobile ? 1.5 : 5 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={700}
        mb={4}
        textAlign="center"
        color="primary"
      >
        DSA to Deployment
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "flex-start",
          justifyContent: isMobile ? "center" : "flex-start",
          overflowX: isMobile ? "hidden" : "auto",
          overflowY: isMobile ? "auto" : "hidden",
          gap: 3,
          pb: 2,
          px: isMobile ? 0.5 : 1,
          scrollSnapType: isMobile ? "none" : "x mandatory",
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 4,
          },
        }}
      >
        {batches.map((batch) => {
          const isPurchased = !!purchaseInfo[batch.id];

          const expiryDate = purchaseInfo[batch.id]?.expiryDate
            ? new Date(purchaseInfo[batch.id].expiryDate)
            : null;

          return (
            <Box
              key={batch.id}
              sx={{
                flex: "0 0 auto",
                scrollSnapAlign: isMobile ? "none" : "start",
                display: "flex",
                justifyContent: "center",
                width: isMobile ? "100%" : "auto",
                px: 0,
              }}
            >
              <Card
                sx={{
                  width: 330,
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 6,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#ffffff",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 12,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={batch.imageUrl}
                  alt={batch.title}
                  sx={{
                    objectFit: "cover",
                    borderBottom: "1px solid #eee",
                  }}
                />

                <CardContent sx={{ px: 3, pt: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {batch.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minHeight: 48 }}
                  >
                    {batch.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color={batch.price === 0 ? "success" : "warning"}
                      sx={{
                        borderRadius: "50px",
                        pointerEvents: "none",
                        px: 2,
                        py: 0.5,
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        minWidth: "80px",
                        textTransform: "none",
                      }}
                    >
                      {batch.price === 0 ? "FREE" : `₹${batch.price}`}
                    </Button>

                    {isPurchased && (
                      <Box
                        sx={{
                          bgcolor: "#1976d2",
                          color: "#fff",
                          fontWeight: 500,
                          px: 1.5,
                          py: 0.3,
                          borderRadius: 50,
                          fontSize: "0.85rem",
                        }}
                      >
                        Purchased
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      minHeight: 24,
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {isPurchased && expiryDate && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "gray",
                          fontWeight: 600,
                        }}
                      >
                        Expires on: {expiryDate.toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    px: 3,
                    pb: 3,
                    pt: 0,
                    justifyContent: "space-between",
                    mt: "auto",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpenExploreId(batch.id)}
                    sx={{
                      width: "48%",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Explore
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      isPurchased
                        ? navigate(batch.redirectPath)
                        : handleBuyRedirect(batch)
                    }
                    sx={{
                      width: "48%",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    {isPurchased ? "Study" : "Buy Now"}
                  </Button>
                </CardActions>
              </Card>

              <Dialog
                open={openModalId === batch.id}
                onClose={() => setOpenModalId(null)}
                maxWidth="sm"
                fullWidth
              >
                <DialogContent
                  sx={{
                    position: "relative",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <IconButton
                    onClick={() => setOpenModalId(null)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    {batch.title} Preview
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={batch.screenshot}
                      alt={`${batch.title} Preview`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        borderRadius: 10,
                      }}
                    />
                  </Box>
                </DialogContent>
              </Dialog>

              <Dialog
                open={openExploreId === batch.id}
                onClose={() => setOpenExploreId(null)}
                maxWidth="sm"
                fullWidth
              >
                <DialogContent sx={{ position: "relative", p: 3 }}>
                  <IconButton
                    onClick={() => setOpenExploreId(null)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary"
                    gutterBottom
                    textAlign="center"
                  >
                    What You'll Learn in {batch.title}
                  </Typography>

                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {batch.whatYouLearn.map((point, index) => (
                      <Typography
                        key={index}
                        component="li"
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          mb: 1.4,
                          fontSize: "1rem",
                          listStyle: "none",
                          pl: 3,
                          position: "relative",
                          "&::before": {
                            content: '"✅"',
                            position: "absolute",
                            left: 0,
                          },
                        }}
                      >
                        {point}
                      </Typography>
                    ))}
                  </Box>

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setOpenModalId(batch.id)}
                    sx={{
                      mt: 3,
                      fontWeight: 600,
                      borderRadius: 2,
                      display: "block",
                      mx: "auto",
                      textTransform: "none",
                    }}
                  >
                    View Screenshot
                  </Button>
                </DialogContent>
              </Dialog>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CombinedClassPage;
