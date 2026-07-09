import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState, useEffect } from "react";

// CRA env vars must be prefixed REACT_APP_ and read via process.env
// (matches the pattern already used in ChapterDetail.js)
const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

const renderCard = (title, description, link) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "scale(1.03)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        backgroundColor: "#f9f9f9",
      },
    }}
  >
    <Link to={link} style={{ textDecoration: "none" }}>
      <CardContent>
        <Typography
          variant="h6"
          align="center"
          sx={{ textTransform: "capitalize", fontWeight: 600, color: "#333" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 0.5, color: "#555" }}
        >
          {description}
        </Typography>
      </CardContent>
    </Link>
  </Card>
);

const ClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isPremium = location.pathname.includes("/premium");
  const isRevision = location.pathname.includes("/revision");
  const isCollege = location.pathname.includes("/college");

  // ── ONLY CHANGE: subjects now fetched from the batch document
  // instead of the hardcoded `subjects` / `subjectInfo` objects ──
  const [classSubjects, setClassSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/batches/${classId}`);
        const data = await res.json();
        const sorted = (data.subjects || []).slice().sort((a, b) => a.order - b.order);
        setClassSubjects(sorted);
      } catch (err) {
        console.error("Failed to fetch batch subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchBatch();
  }, [classId]);

  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const content = (
    <>
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIosNewIcon />}
        sx={{
          mb: 3,
          backgroundColor: "#fff",
          color: "#333",
          border: "1px solid #ddd",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          py: 1,
          boxShadow: 1,
          "&:hover": {
            backgroundColor: "#f5f5f5",
            boxShadow: 2,
          },
        }}
      >
        Back
      </Button>

      {isPremium && (
        <Box mb={4}>
          {/* Tabs for Desktop */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="standard"
            centered
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Tab label="Subjects" />
            <Tab label="Test Series" />
            <Tab label="PYQ Series" />
            <Tab label="Mentorship" />
          </Tabs>

          {/* Tabs for Mobile */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <Tab label="Subjects" />
            <Tab label="Test Series" />
            <Tab label="PYQ Series" />
            <Tab label="Mentorship" />
          </Tabs>
        </Box>
      )}

      {!isPremium && (
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: 700, mb: 4 }}
        >
          Subjects
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        (tabIndex === 0 || !isPremium) && (
          <Grid container spacing={4} justifyContent="center">
            {classSubjects.map((subject) => (
              <Grid item xs={12} sm={6} md={6} key={subject.slug}>
                <Link
                  to={`${
                    isPremium ? "/premium/class" : isRevision ? "/revision/class" : isCollege ? "/college/class" : "/class"
                  }/${classId}/${subject.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                        backgroundColor: "#f9f9f9",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                          color: "#333",
                        }}
                      >
                        {subject.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 0.5, color: "#555" }}
                      >
                        {subject.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )
      )}

      {isPremium && tabIndex === 1 && (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={6}>
            {renderCard(
              "Full Syllabus Mock Tests",
              "Simulate real exam conditions with full-length mocks.",
              `/premium/class/${classId}/test`
            )}
          </Grid>
        </Grid>
      )}

      {isPremium && tabIndex === 2 && (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={6}>
            {renderCard(
              "Full PYQ Papers",
              "Solve full question papers from previous years.",
              `/premium/class/${classId}/pyq`
            )}
          </Grid>
        </Grid>
      )}

      {isPremium && tabIndex === 3 && (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={6}>
            {renderCard(
              "Book a Session",
              "Connect 1-on-1 with an expert mentor for personalized guidance.",
              `/premium/class/${classId}/mentorship`
            )}
          </Grid>
        </Grid>
      )}
    </>
  );

  return (
    <Box p={isMobile ? 2 : 4} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="center">
        {isMobile ? (
          <Box width="100%">{content}</Box>
        ) : (
          <Card
            sx={{
              width: "95vw",
              minHeight: "85vh",
              borderRadius: 5,
              boxShadow: 10,
              p: 4,
              backgroundColor: "#ffffff",
            }}
          >
            {content}
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ClassPage;