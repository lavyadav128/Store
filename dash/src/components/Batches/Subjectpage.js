



import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export const chaptersData = {
  10: {
    mathematics: [
      { title: "Real Numbers", videoUrl: "https://www.youtube.com/live/h3KiqBOpqdE?si=drg2mnc_28i1_YE1" },
      { title: "Polynomials", videoUrl: "https://www.youtube.com/live/M437dqOxJcs?si=5XdIN0orNN5uvOF8" },
      { title: "Pair of Linear Equations in 2 Variables", videoUrl: "https://www.youtube.com/live/TR2xZlHRk8Y?si=VtrmvqgDt5wQwWtv" },
      { title: "Quadratic Equations (10)", videoUrl: "https://www.youtube.com/live/YdQ8MtghPBc?si=fUoB14nSP7gfbwaz" },
      { title: "Arithmetic Progressions", videoUrl: "https://www.youtube.com/live/n82bjaGiMEY?si=O0iieuknIQc0-QwM" },
      { title: "Triangles", videoUrl: "https://www.youtube.com/live/fVeIXpjNO1g?si=JJL7fXredaOFFOe-" },
      { title: "Coordinate Geometry", videoUrl: "https://www.youtube.com/live/aC_vFD0I2Qk?si=SYdpKchlQ4FheCaF" },
      { title: "Circles (10)", videoUrl: "https://www.youtube.com/live/ezsF7bQKnwA?si=2Pffm6KsqGU6Dy4l" },
      { title: "Area Related to Circle", videoUrl: "https://www.youtube.com/live/q1bAZBes1Cw?si=kPjJvxRV0uJF0r73" },
      { title: "Trigonometry (10)", videoUrl: "https://www.youtube.com/live/2pCpA50rylw?si=_Tlx18CCoDvZunTM" },
      { title: "Some Applications of Trigonometry", videoUrl: "https://www.youtube.com/live/Zg1OguVfvR0?si=KNnpQqcuwJnRkLeI" },
      { title: "Surface Areas and Volumes", videoUrl: "https://www.youtube.com/live/xa7_-txJ51c?si=JotR9Dbx7KQtmDki" },
      { title: "statistics", videoUrl: "https://www.youtube.com/live/pgMVLQbu3k4?si=Kxn289dCnXO1R2Eo" },
      { title: "Probability (10)", videoUrl: "https://www.youtube.com/live/yCC8x4fLd30?si=Ccdy8uMvYP70hw-J" },
    ],
    physics: [
      { title: "light", videoUrl: "https://youtu.be/kHVAk96r05Y?si=FBmQfeietg6kPK72" },
      { title: "human-eye", videoUrl: "https://youtu.be/G7zDZwrP6O4?si=oxjVmq_0oFGEsrIi" },
      { title: "electricity", videoUrl: "https://youtu.be/EJcnBv691cY?si=t4d7RPqxxLT5xjea" },
      { title: "magnetic", videoUrl: "https://youtu.be/Ot6A6tlD12U?si=qhp9_0_1oO0TNTRl" },
    ],
    chemistry: [
      { title: "chemical-reaction-and-equation", videoUrl:"https://youtu.be/s0CttpllLxM?si=8ROPBAdZuwZSgnma" },
      { title: "acid-base", videoUrl: "https://youtu.be/5bSXK0QttdY?si=JFfBVqb-S3lkxOZu" },
      { title: "metal-non-metal", videoUrl: "https://youtu.be/YihPV4eSHsQ?si=OeD2mJ8yQ8TZ3q5A" },
      { title: "carbon-compound", videoUrl: "https://youtu.be/iv4kMn_CrhM?si=oX6iED8MHjlsUSmf" },
    ],
    biology: [
      { title: "life-processes", videoUrl: "https://youtu.be/NLv0qeWmBDk?si=K5LSq4He4FJTcDFk" },
      { title: "control-coordination", videoUrl: "https://youtu.be/vKfpJ2QejNA?si=AujGD8s9YTZHG50P" },
      { title: "reproduction", videoUrl: "https://youtu.be/dCAnbdRAsFo?si=49a9wUqQOgQ75sSf" },
      { title: "heredity", videoUrl: "https://youtu.be/0HZbUMx29vE?si=mcRD4Lp0GmxF6oaX" },
    ],
    SST: [
      // History
      { title: "The Rise of Nationalism in Europe", videoUrl: "https://youtu.be/0CsS2zg4Kms?si=OXYyR2Vbd8mkTI-p" },
      { title: "Nationalism in India", videoUrl: "https://youtu.be/RMeyeOt8GTg?si=n50ThS_PSgnBLj6t" },
      { title: "The Making of the Global World", videoUrl: "https://youtu.be/4roZtQeoUDw?si=k2tPUESRQRoxbxTR" },
      { title: "The age of Industrialization", videoUrl: "https://youtu.be/2RqIwjsop6A?si=IPa2wfk-PXFb4YkN" },
      { title: "Print Culture and the modern World", videoUrl: "https://youtu.be/qOWvfRRAFeU?si=av3I96OJejBuDqll" },
  
      // Geography
      { title: "Resources and Development", videoUrl: "https://youtu.be/1LA2-5rEMUE?si=cXPRXOhq86WyPDvh" },
      { title: "Forest and Wildlife Resources", videoUrl: "https://youtu.be/lmi3SAXYRVg?si=_h5Z3xpIgNsNCr6T" },     // project work
      { title: "Water Resources", videoUrl: "https://youtu.be/o4I9505br3M?si=Pu9f8RTyuDeR9uGD" },                   // map work only
      { title: "Agriculture", videoUrl: "https://youtu.be/T9TAhkwufBU?si=fA9N1kZ8KYlZg9RM" },
      { title: "Minerals and Energy Resources", videoUrl: "https://youtu.be/EA0Hv-d5dv0?si=7i75laezrUjBDj8p" },
      { title: "Manufacturing Industries", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
  
      // Political Science (Civics)
      { title: "Power Sharing", videoUrl: "https://youtu.be/A0VUqL7a7zQ?si=V97EyZh164FnV9KC" },
      { title: "Federalism", videoUrl: "https://youtu.be/raX3Da0jsEI?si=KwAJXpop8OIdYr72" },
      { title: "Gender, Religion and Caste", videoUrl: "https://youtu.be/rq8QIxQMVn4?si=w9aQ79qu3CkF4q86" },
      { title: "Political Parties", videoUrl: "https://youtu.be/5eU7uA6v2nE?si=zub8U9AL9x3vsW2F" },
      { title: "Outcomes of Democracy", videoUrl: "https://youtu.be/ITMb6rRkIVo?si=BgzaL2h9Gzmc5gpd" },
  
      // Economics
      { title: "Development", videoUrl: "https://youtu.be/tbDL5j-k-H8?si=Umzwb8r4_3QRQoXX" },
      { title: "Sectors of the Indian Economy", videoUrl: "https://youtu.be/wFH6iGe2vBE?si=NKcrb8rufmOhbbKq" },
      { title: "Money and Credit", videoUrl: "https://youtu.be/T9TAhkwufBU?si=fA9N1kZ8KYlZg9RM" },
      { title: "Globalisation and the Indian Economy", videoUrl: "https://youtu.be/HuEd5_qOsIA?si=yxivspRgI1-xOKQ2" },
      { title: "Consumer Rights", videoUrl: "https://youtu.be/zRrPJxMT8R0?si=7t8cP5gfhTIgFqOg" },                   // project work
    ],
  },
  



  11: {
    mathematics: [
      { title: "sets", videoUrl: "https://www.youtube.com/live/0KCLAfpZ2zY?si=1klXGV5Ym_2W8qX6" },
      { title: "functions", videoUrl: "https://www.youtube.com/live/qgk0a-W0LQ4?si=ZJ4h0jy0GbZFb9fT" },
      { title: "inequalities", videoUrl: "https://www.youtube.com/live/BVNaeS8T5uQ?si=Hv1XOFsvIqqfN3nI" },
      { title: "quadratic-equations", videoUrl: "https://www.youtube.com/live/mv4mVz_ccWk?si=X4dd6jaWIBb0PHJN"},
      { title: "Trigonometry", videoUrl: "https://www.youtube.com/live/FTai93ssi1Q?si=ONfRZNMlizMswCXW" },
      { title: "trigonometric-equations", videoUrl: "https://www.youtube.com/live/HmStb2FSRyw?si=mU9GIJje5GqDyXoc" },
      { title: "sequence-series", videoUrl: "https://www.youtube.com/live/-rgM3Z2zF18?si=GwBs8_yh83ZWb9UC" },
      { title: "permutation-combination", videoUrl: "https://www.youtube.com/live/lmk1sJo0728?si=wiq5EpXnqj3KKDZ6" },
      { title: "binomial-theorem", videoUrl: "https://www.youtube.com/live/eAMCL-mMmcY?si=ctble2k9k_cicfA0" },
      { title: "complex-number", videoUrl: "https://www.youtube.com/live/b7HhgvaFF5Q?si=xp6z8olvVm6oAqVW" },
      { title: "straight-line", videoUrl: "https://www.youtube.com/live/Ah-JjIq2bQk?si=0Z02q8wkFpMKJkj_" },
      { title: "circle", videoUrl: "https://www.youtube.com/live/qv7YTq5THew?si=Q0HQo_BrA3UFGe5s" },
      { title: "parabola", videoUrl: "https://www.youtube.com/live/LsYvJc56yag?si=OOWKavhDmgJO2ppF" },
      { title: "ellipse", videoUrl: "https://www.youtube.com/live/8asqPexzYzc?si=OaxbXzBcmZHurILc" },
      { title: "hyperbola", videoUrl: "https://www.youtube.com/live/Es6IoDqItuc?si=K2LvYH36ErbduvBG" },
      { title: "mathematical-reasoning ", videoUrl: "https://www.youtube.com/live/zbxVS7Y5NZc?si=5pAu8GNEjVbZVZ6V" },
      { title: "statistics", videoUrl: "https://www.youtube.com/live/fjgu_j2Xvjo?si=NmmXL-Bc7WhGvMs9" },

    ],
    physics: [
      { title: "unit-measurements", videoUrl: "https://youtu.be/YX5sLwRtULk?si=uzJGkLFKwh4r5p_-" },
      { title: "motion-in-straightline", videoUrl: "https://www.youtube.com/live/hY9zZrYuDVk?si=NCwTc5n2uwV3z0Rt" },
      { title: "motion-in-plane", videoUrl: "https://www.youtube.com/live/hY9zZrYuDVk?si=NCwTc5n2uwV3z0Rt" },
      { title: "laws-of-motion", videoUrl: "https://www.youtube.com/live/2i0p2tidN88?si=UxzUmI1iMCSl4sox" },
      { title: "work-energy-and-power", videoUrl: "https://www.youtube.com/live/M6R4bWT-eOU?si=DWrjqqtrew-oJ2BE" },
      { title: "circular-motion", videoUrl: "https://www.youtube.com/live/nsSeTLT3UF8?si=T9Cc5c2uaREwopJA" },
      { title: "center-of-mass", videoUrl: "https://www.youtube.com/live/1VIEL84kl7I?si=Y958jfYb9FXBh5rc" },
      { title: "rotational-motion", videoUrl: "https://www.youtube.com/live/UsHUxG90f_4?si=11CmldsLsdwepLRk" },
      { title: "gravitation", videoUrl: "https://www.youtube.com/live/Rgsg4NgwrXI?si=ZMLeb2ELXtQqkf39" },
      { title: "properties-of-matter", videoUrl: "https://www.youtube.com/live/9VBYO4it3ik?si=imMm24EoKwad8MIf" },
      { title: "properties-of-solids", videoUrl: "https://www.youtube.com/live/FCByCwnj_J0?si=bEzU0S9LnzZihi8m" },
      { title: "fluids", videoUrl: "https://www.youtube.com/live/8_KVbLZlCjM?si=esW9ZEMPNya5JSpN" },
      { title: "ktg-and-thermodynamics", videoUrl: "https://www.youtube.com/live/JAvi2K_DbbI?si=B41GsuvtXfRCbWm0" },
      { title: "oscillation", videoUrl: "https://youtu.be/urEsdx9xfKI?si=GMPwjqENWW_wR5rh" },
      { title: "wave-motion", videoUrl: "https://www.youtube.com/live/853QJObBo74?si=Nt2I_RHF-_WGmIx4" },
    ],
    chemistry: [
      { title: "mole-concept", videoUrl: "https://www.youtube.com/live/g50vTY3ot_M?si=uoIKykR8DPs_RJxG" },
      { title: "redox-reactions", videoUrl: "https://www.youtube.com/live/E_W8Q7RnfgU?si=fAK9dlHzWAokSl7u" },
      { title: "atomic-structure", videoUrl: "https://www.youtube.com/live/RCzzG8VnOl4?si=tydu7DDv7JUuVdoB" },
      { title: "gaseous-state-of-matter", videoUrl: "https://www.youtube.com/live/Ng6Y1HOxRDY?si=0h_6FoEDYN9LhGjv" },
      { title: "thermodynamics", videoUrl: "https://www.youtube.com/live/V77wZfttfYE?si=2-tqUqNSb30e7JCL" },
      { title: "thermo-chemistry", videoUrl: "https://www.youtube.com/live/IdZaa50B0hQ?si=ojjSgJkzFbR2pmbk" },
      { title: "chemical-equilibrium", videoUrl: "https://www.youtube.com/live/ZGbDYoVozYc?si=SU0iD-RgoFNoWFTU" },
      { title: "ionic-equilibrium", videoUrl: "https://www.youtube.com/live/QGg0vAqqQ2Q?si=wosBidzo-O-jwBss" },
      { title: "periodic-table", videoUrl: "https://www.youtube.com/live/-ozqtaSoMW0?si=oOeajFz62Zgp3X45" },
      { title: "chemical-bonding", videoUrl: "https://www.youtube.com/live/BGNQNaeUGQc?si=taY6Bj95gAMPQl8T" },
      { title: "hydrogen", videoUrl: "https://youtu.be/FdmETHB1mjE?si=TEgxEBWbrfQOUD2W" },
      { title: "s-block", videoUrl: "https://www.youtube.com/live/G4c5v97ExSM?si=kyj9m8tu7nvI60RR" },
      { title: "nomenclature", videoUrl: "https://www.youtube.com/live/-x505wUMqsI?si=ugPweYWQB_fY64G0" },
      { title: "isomerism", videoUrl: "https://www.youtube.com/live/wSXjjieuBWA?si=muHNd1EI-zb2DaTy" },
      { title: "general-organic-chemistry", videoUrl: "https://www.youtube.com/live/1vxoueq2jP0?si=eFH9P2znPoFK4M08" },
      { title: "hydrocarbon", videoUrl: "https://youtu.be/jD-amjIWlJg?si=zUKaxzpv-AXXEV0_" },
      { title: "practical-organic-chemistry", videoUrl: "https://www.youtube.com/live/9ldKfnFH9L8?si=IBbP_VWPLqy29zYo" },
      { title: "qualitative-analyses", videoUrl: null },
      { title: "environmental-chemistry", videoUrl: null },
    ],
  },
  




  111: {
    physics: [
      { title: "unit-measurements", videoUrl: "https://youtu.be/YX5sLwRtULk?si=uzJGkLFKwh4r5p_-" },
      { title: "motion-in-straightline", videoUrl: "https://www.youtube.com/live/hY9zZrYuDVk?si=NCwTc5n2uwV3z0Rt" },
      { title: "motion-in-plane", videoUrl: "https://www.youtube.com/live/hY9zZrYuDVk?si=NCwTc5n2uwV3z0Rt" },
      { title: "laws-of-motion", videoUrl: "https://www.youtube.com/live/2i0p2tidN88?si=UxzUmI1iMCSl4sox" },
      { title: "work-energy-and-power", videoUrl: "https://www.youtube.com/live/M6R4bWT-eOU?si=DWrjqqtrew-oJ2BE" },
      { title: "circular-motion", videoUrl: "https://www.youtube.com/live/nsSeTLT3UF8?si=T9Cc5c2uaREwopJA" },
      { title: "center-of-mass", videoUrl: "https://www.youtube.com/live/1VIEL84kl7I?si=Y958jfYb9FXBh5rc" },
      { title: "rotational-motion", videoUrl: "https://www.youtube.com/live/UsHUxG90f_4?si=11CmldsLsdwepLRk" },
      { title: "gravitation", videoUrl: "https://www.youtube.com/live/Rgsg4NgwrXI?si=ZMLeb2ELXtQqkf39" },
      { title: "properties-of-matter", videoUrl: "https://www.youtube.com/live/9VBYO4it3ik?si=imMm24EoKwad8MIf" },
      { title: "properties-of-solids", videoUrl: "https://www.youtube.com/live/FCByCwnj_J0?si=bEzU0S9LnzZihi8m" },
      { title: "fluids", videoUrl: "https://www.youtube.com/live/8_KVbLZlCjM?si=esW9ZEMPNya5JSpN" },
      { title: "ktg-and-thermodynamics", videoUrl: "https://www.youtube.com/live/JAvi2K_DbbI?si=B41GsuvtXfRCbWm0" },
      { title: "oscillation", videoUrl: "https://youtu.be/urEsdx9xfKI?si=GMPwjqENWW_wR5rh" },
      { title: "wave-motion", videoUrl: "https://www.youtube.com/live/853QJObBo74?si=Nt2I_RHF-_WGmIx4" },
    ],
    chemistry: [
      { title: "mole-concept", videoUrl: "https://www.youtube.com/live/g50vTY3ot_M?si=uoIKykR8DPs_RJxG" },
      { title: "redox-reactions", videoUrl: "https://www.youtube.com/live/E_W8Q7RnfgU?si=fAK9dlHzWAokSl7u" },
      { title: "atomic-structure", videoUrl: "https://www.youtube.com/live/RCzzG8VnOl4?si=tydu7DDv7JUuVdoB" },
      { title: "gaseous-state-of-matter", videoUrl: "https://www.youtube.com/live/Ng6Y1HOxRDY?si=0h_6FoEDYN9LhGjv" },
      { title: "thermodynamics", videoUrl: "https://www.youtube.com/live/V77wZfttfYE?si=2-tqUqNSb30e7JCL" },
      { title: "thermo-chemistry", videoUrl: "https://www.youtube.com/live/IdZaa50B0hQ?si=ojjSgJkzFbR2pmbk" },
      { title: "chemical-equilibrium", videoUrl: "https://www.youtube.com/live/ZGbDYoVozYc?si=SU0iD-RgoFNoWFTU" },
      { title: "ionic-equilibrium", videoUrl: "https://www.youtube.com/live/QGg0vAqqQ2Q?si=wosBidzo-O-jwBss" },
      { title: "periodic-table", videoUrl: "https://www.youtube.com/live/-ozqtaSoMW0?si=oOeajFz62Zgp3X45" },
      { title: "chemical-bonding", videoUrl: "https://www.youtube.com/live/BGNQNaeUGQc?si=taY6Bj95gAMPQl8T" },
      { title: "hydrogen", videoUrl: "https://youtu.be/FdmETHB1mjE?si=TEgxEBWbrfQOUD2W" },
      { title: "s-block", videoUrl: "https://www.youtube.com/live/G4c5v97ExSM?si=kyj9m8tu7nvI60RR" },
      { title: "nomenclature", videoUrl: "https://www.youtube.com/live/-x505wUMqsI?si=ugPweYWQB_fY64G0" },
      { title: "isomerism", videoUrl: "https://www.youtube.com/live/wSXjjieuBWA?si=muHNd1EI-zb2DaTy" },
      { title: "general-organic-chemistry", videoUrl: "https://www.youtube.com/live/1vxoueq2jP0?si=eFH9P2znPoFK4M08" },
      { title: "hydrocarbon", videoUrl: "https://youtu.be/jD-amjIWlJg?si=zUKaxzpv-AXXEV0_" },
      { title: "practical-organic-chemistry", videoUrl: "https://www.youtube.com/live/9ldKfnFH9L8?si=IBbP_VWPLqy29zYo" },
      { title: "qualitative-analyses", videoUrl: null },
      { title: "environmental-chemistry", videoUrl: null },
    ],
    botany: [
      { title: "the-living-world", videoUrl: null },
      { title: "biological-classification", videoUrl: null },
      { title: "plant-kingdom", videoUrl: null },
      { title: "morphology-of-flowering-plants", videoUrl: null },
      { title: "anatomy-of-flowering-plants", videoUrl: null },
      { title: "cell-the unit of life", videoUrl: null },
      { title: "cell-cycle-and-cell-division", videoUrl: null },
      { title: "photosynthesis-in-higher-plants", videoUrl: null },
      { title: "respiration-in-plants", videoUrl: null },
      { title: "plant-growth-and-development", videoUrl: null },
    ],
    zoology: [
      { title: "animal-kingdom", videoUrl: null },
      { title: "structural-organization-in-animals", videoUrl: null },
      { title: "biomolecules", videoUrl: null },
      { title: "body-fluids-and-circulation", videoUrl: null },
      { title: "excretory products and their elimation", videoUrl: null },
      { title: "locomotion-and-movement", videoUrl: null },
      { title: "neural-control-and-coordination", videoUrl: null },
      { title: "chemical-control-and-integration", videoUrl: null },
    ],
  },
  



  12: {
    mathematics: [
      { title: "relations-and-functions", videoUrl: "https://www.youtube.com/live/__XBcqZl5oQ?si=YI7sCza9s6uLf0TT" },
      { title: "inverse-trigonometric-functions", videoUrl: "https://www.youtube.com/live/03GvcVZM1kU?si=7F4j6pwmGqS51cV5" },
      { title: "matrices", videoUrl: "https://www.youtube.com/live/yXJJGyHELz8?si=zkgnWi6u_YzkyiH-" },
      { title: "determinants", videoUrl: "https://www.youtube.com/live/orc2FHIKZA8?si=NZN3iyCZ3P6Ifd4m" },
      { title: "differentiation", videoUrl: "https://www.youtube.com/live/gf0-OEvLHG4?si=SUWriV1bt9sadxXH" },
      { title: "limits", videoUrl: "https://www.youtube.com/live/2kWgjIYNeCg?si=ZzE3Zv6pzNrN0vjH" },
      { title: "continuity-and-differentiability", videoUrl: "https://www.youtube.com/live/dvzXDXDagaQ?si=5xODagNGa6tfC58L" },
      { title: "applications-of-derivatives", videoUrl: "https://www.youtube.com/live/jVeCha6iI84?si=PvYMFzlM0AEEBPgw" },
      { title: "definite-integration", videoUrl: "https://www.youtube.com/live/xeEjV7YAo1M?si=gGTs1J_oqZjTlICY" },
      { title: "indefinite-integration", videoUrl: "https://www.youtube.com/live/kNusX-7Nhm0?si=WARp8ViP9YxsWiYO" },
      { title: "differential-equations", videoUrl: "https://www.youtube.com/live/JdzU63Oe4Wg?si=7NbeaXTiXJWvbZ5k" },
      { title: "area-under-curve", videoUrl: "https://www.youtube.com/live/T7UYxyYOLOY?si=FxMInIiZZrb9SLUy" },
      { title: "Vector Algebra", videoUrl: "https://www.youtube.com/live/AuU-tUqZuC8?si=qQpj2EJ38jz8JFf7" },
      { title: "3D-geometry", videoUrl: "https://www.youtube.com/live/t_ABiQEA4c8?si=V5t86LY-CBaaG9Ea" },
      { title: "probability", videoUrl: "https://www.youtube.com/live/sZSwBOMtChA?si=sEHEohz0KnvDOFtz" },
    ],
    physics: [
      { title: "electric-charges-and-field", videoUrl: "https://www.youtube.com/live/Rgsg4NgwrXI?si=ZMLeb2ELXtQqkf39" },
      { title: "electrostatic-potential-and-dipole", videoUrl: "https://www.youtube.com/live/sGb3VLDvNRU?si=WtAmMa8_jhn2eo3D" },
      { title: "capacitor", videoUrl: "https://www.youtube.com/live/EJJGEpGFzQs?si=PpHTIRR6Bz8Gox8-" },
      { title: "current-electricity", videoUrl: "https://www.youtube.com/live/JY24andAvME?si=2qGajQl_1arV8up_" },
      { title: "moving-charges-and-magnetism", videoUrl: "https://www.youtube.com/live/cahO3_JAAoc?si=05IBlU4zTy7SX1XQ" },
      { title: "magnetism", videoUrl: "https://www.youtube.com/live/I4kB3onwjpw?si=tZCdM817_GIlsJ9K" },
      { title: "electromagnetic-induction", videoUrl: "https://www.youtube.com/live/I4kB3onwjpw?si=tZCdM817_GIlsJ9K" },
      { title: "alternating-current", videoUrl: "https://www.youtube.com/live/n1xuq76ChYk?si=BzKI8CgL9VbGTbjn" },
      { title: "inductors", videoUrl: "https://www.youtube.com/live/n1xuq76ChYk?si=BzKI8CgL9VbGTbjn" },
      { title: "emw-and-communication", videoUrl: "https://www.youtube.com/live/cM25p1HE71Y?si=o6ymh5jCeWEiXVX8" },
      { title: "ray-optics", videoUrl: "https://www.youtube.com/live/72T8RfBU0ME?si=y4kHtmyoe3ceB0AK" },
      { title: "wave-optics", videoUrl: "https://www.youtube.com/live/k8IyQgwDdUk?si=MTEInOtBihOEPwjj" },
      { title: "modern-physics", videoUrl: "https://www.youtube.com/live/vP9LzR8zupE?si=O0qm0IHMHX83H6oA" },
      { title: "semiconductor", videoUrl: "https://www.youtube.com/live/YTmtAuItIfY?si=bSWKj_np_2xqDt5R" },
    ],
    chemistry: [
      { title: "solid-state", videoUrl: "https://www.youtube.com/live/r3w9iwWRThM?si=_27A5b4k3vlI-TXj" },
      { title: "solutions", videoUrl: "https://www.youtube.com/live/V7IhNvWMO0A?si=xjfZ2Ih05aI6AY4q" },
      { title: "electro-chemistry", videoUrl: "https://www.youtube.com/live/u9Oxgid_aaU?si=-IVYI4bCkf32d9s0" },
      { title: "chemical-kinetics", videoUrl: "https://www.youtube.com/live/T0LFfBuifjk?si=MaAJSu_sbwuowhU7" },
      { title: "surface-chemistry", videoUrl: "https://www.youtube.com/live/dvKO5_6xkSg?si=05rFc4rORB5p_Ixf" },
      { title: "metallurgy", videoUrl: "https://www.youtube.com/live/_s9tTXvhkHM?si=PsfA0z4uyRD3848z" },
      { title: "p-block", videoUrl: "https://www.youtube.com/live/G4c5v97ExSM?si=kyj9m8tu7nvI60RR" },
      { title: "d-and-f-block", videoUrl: "https://www.youtube.com/live/fVVJVlnSmn0?si=0Z9oWfl4RmzV7pPy" },
      { title: "coordination-compounds", videoUrl: "https://www.youtube.com/live/MA_te6P44dM?si=ygxobL-uuNZtCtHM" },
      { title: "haloalkane-and-haloarene", videoUrl: "https://youtu.be/jD-amjIWlJg?si=zUKaxzpv-AXXEV0_" },
      { title: "alcohol-phenol-ether", videoUrl: "https://youtu.be/vJIUOCilzxA?si=LmNYSGUuItUnw9iU" },
      { title: "aldehyde-ketone-carboxylic-acids", videoUrl: "https://youtu.be/jY4vxCf3yzs?si=GZdUFpqXRusSWb-g" },
      { title: "amines", videoUrl: "https://www.youtube.com/live/EOj1-kOWHT8?si=YMBWvJbv6yEeSF55" },
      { title: "biomolecules", videoUrl: "https://www.youtube.com/live/SNwenidZ1ek?si=J449PQbakvvvI9jC" },
      { title: "polymers", videoUrl: "https://youtu.be/iPOxMOCOIpY?si=PEmZCQyAmmZLk0QY" },
      { title: "chemistry-in-everyday-life", videoUrl: "https://youtu.be/DfB6JQ8weHc?si=FBIEOltTdg966Iae" },
      { title: "salt-analyses", videoUrl: "https://youtu.be/PrL4OovGWkM?si=UY5bnl02ufTZepvY" },
      { title: "environmental-chemistry", videoUrl: "https://youtu.be/FfRmhuVS57A?si=RogGLg7VI16nK_pk" },
    ],
  },




  121: {
    physics: [
      { title: "electric-charges-and-field", videoUrl: "https://www.youtube.com/live/Rgsg4NgwrXI?si=ZMLeb2ELXtQqkf39" },
      { title: "electrostatic-potential-and-dipole", videoUrl: "https://www.youtube.com/live/sGb3VLDvNRU?si=WtAmMa8_jhn2eo3D" },
      { title: "capacitor", videoUrl: "https://www.youtube.com/live/EJJGEpGFzQs?si=PpHTIRR6Bz8Gox8-" },
      { title: "current-electricity", videoUrl: "https://www.youtube.com/live/JY24andAvME?si=2qGajQl_1arV8up_" },
      { title: "moving-charges-and-magnetism", videoUrl: "https://www.youtube.com/live/cahO3_JAAoc?si=05IBlU4zTy7SX1XQ" },
      { title: "magnetism", videoUrl: "https://www.youtube.com/live/I4kB3onwjpw?si=tZCdM817_GIlsJ9K" },
      { title: "electromagnetic-induction", videoUrl: "https://www.youtube.com/live/I4kB3onwjpw?si=tZCdM817_GIlsJ9K" },
      { title: "alternating-current", videoUrl: "https://www.youtube.com/live/n1xuq76ChYk?si=BzKI8CgL9VbGTbjn" },
      { title: "inductors", videoUrl: "https://www.youtube.com/live/n1xuq76ChYk?si=BzKI8CgL9VbGTbjn" },
      { title: "emw-and-communication", videoUrl: "https://www.youtube.com/live/cM25p1HE71Y?si=o6ymh5jCeWEiXVX8" },
      { title: "ray-optics", videoUrl: "https://www.youtube.com/live/72T8RfBU0ME?si=y4kHtmyoe3ceB0AK" },
      { title: "wave-optics", videoUrl: "https://www.youtube.com/live/k8IyQgwDdUk?si=MTEInOtBihOEPwjj" },
      { title: "modern-physics", videoUrl: "https://www.youtube.com/live/vP9LzR8zupE?si=O0qm0IHMHX83H6oA" },
      { title: "semiconductor", videoUrl: "https://www.youtube.com/live/YTmtAuItIfY?si=bSWKj_np_2xqDt5R" },
    ],
    chemistry: [
      { title: "solid-state", videoUrl: "https://www.youtube.com/live/r3w9iwWRThM?si=_27A5b4k3vlI-TXj" },
      { title: "solutions", videoUrl: "https://www.youtube.com/live/V7IhNvWMO0A?si=xjfZ2Ih05aI6AY4q" },
      { title: "electro-chemistry", videoUrl: "https://www.youtube.com/live/u9Oxgid_aaU?si=-IVYI4bCkf32d9s0" },
      { title: "chemical-kinetics", videoUrl: "https://www.youtube.com/live/T0LFfBuifjk?si=MaAJSu_sbwuowhU7" },
      { title: "surface-chemistry", videoUrl: "https://www.youtube.com/live/dvKO5_6xkSg?si=05rFc4rORB5p_Ixf" },
      { title: "metallurgy", videoUrl: "https://www.youtube.com/live/_s9tTXvhkHM?si=PsfA0z4uyRD3848z" },
      { title: "p-block", videoUrl: "https://www.youtube.com/live/G4c5v97ExSM?si=kyj9m8tu7nvI60RR" },
      { title: "d-and-f-block", videoUrl: "https://www.youtube.com/live/fVVJVlnSmn0?si=0Z9oWfl4RmzV7pPy" },
      { title: "coordination-compounds", videoUrl: "https://www.youtube.com/live/MA_te6P44dM?si=ygxobL-uuNZtCtHM" },
      { title: "haloalkane-and-haloarene", videoUrl: "https://youtu.be/jD-amjIWlJg?si=zUKaxzpv-AXXEV0_" },
      { title: "alcohol-phenol-ether", videoUrl: "https://youtu.be/vJIUOCilzxA?si=LmNYSGUuItUnw9iU" },
      { title: "aldehyde-ketone-carboxylic-acids", videoUrl: "https://youtu.be/jY4vxCf3yzs?si=GZdUFpqXRusSWb-g" },
      { title: "amines", videoUrl: "https://www.youtube.com/live/EOj1-kOWHT8?si=YMBWvJbv6yEeSF55" },
      { title: "biomolecules", videoUrl: "https://www.youtube.com/live/SNwenidZ1ek?si=J449PQbakvvvI9jC" },
      { title: "polymers", videoUrl: "https://youtu.be/iPOxMOCOIpY?si=PEmZCQyAmmZLk0QY" },
      { title: "chemistry-in-everyday-life", videoUrl: "https://youtu.be/DfB6JQ8weHc?si=FBIEOltTdg966Iae" },
      { title: "salt-analyses", videoUrl: "https://youtu.be/PrL4OovGWkM?si=UY5bnl02ufTZepvY" },
      { title: "environmental-chemistry", videoUrl: "https://youtu.be/FfRmhuVS57A?si=RogGLg7VI16nK_pk" },
    ],
    botany: [
      { title: "sexual-reproduction-in-flowering-plants", videoUrl: null },
      { title: "principle-of-inheritance-and-variation", videoUrl: null },
      { title: "molecular-basis-of-inheritance", videoUrl: null },
      { title: "molecular-basis-of-inheritance(2)", videoUrl: null },
      { title: "microbes-in-human-welfare", videoUrl: null },
      { title: "organisms-and-population", videoUrl: null },
      { title: "ecosystem", videoUrl: null },
      { title: "biodiversity-and-conservation", videoUrl: null },
    ],
    zoology: [
      { title: "human-reproduction", videoUrl: null },
      { title: "reproductive-health", videoUrl: null },
      { title: "human-health-and-diseases", videoUrl: null },
      { title: "evolution", videoUrl: null },
      { title: "biotechnology-principles-and-processes", videoUrl: null },
      { title: "biotechnology-and-its-applications", videoUrl: null },
    ],
  },


  //  Premium  Batches


  1: {
    mathematics: [
      { title: "Real Numbers", videoUrl: "https://www.youtube.com/live/h3KiqBOpqdE?si=drg2mnc_28i1_YE1" },
      { title: "Polynomials", videoUrl: "https://www.youtube.com/live/M437dqOxJcs?si=5XdIN0orNN5uvOF8" },
      { title: "Pair of Linear Equations in 2 Variables", videoUrl: "https://www.youtube.com/live/TR2xZlHRk8Y?si=VtrmvqgDt5wQwWtv" },
      { title: "Quadratic Equations (10)", videoUrl: "https://www.youtube.com/live/YdQ8MtghPBc?si=fUoB14nSP7gfbwaz" },
      { title: "Arithmetic Progressions", videoUrl: "https://www.youtube.com/live/n82bjaGiMEY?si=O0iieuknIQc0-QwM" },
      { title: "Triangles", videoUrl: "https://www.youtube.com/live/fVeIXpjNO1g?si=JJL7fXredaOFFOe-" },
      { title: "Coordinate Geometry", videoUrl: "https://www.youtube.com/live/aC_vFD0I2Qk?si=SYdpKchlQ4FheCaF" },
      { title: "Circles (10)", videoUrl: "https://www.youtube.com/live/ezsF7bQKnwA?si=2Pffm6KsqGU6Dy4l" },
      { title: "Area Related to Circle", videoUrl: "https://www.youtube.com/live/q1bAZBes1Cw?si=kPjJvxRV0uJF0r73" },
      { title: "Trigonometry (10)", videoUrl: "https://www.youtube.com/live/2pCpA50rylw?si=_Tlx18CCoDvZunTM" },
      { title: "Some Applications of Trigonometry", videoUrl: "https://www.youtube.com/live/Zg1OguVfvR0?si=KNnpQqcuwJnRkLeI" },
      { title: "Surface Areas and Volumes", videoUrl: "https://www.youtube.com/live/xa7_-txJ51c?si=JotR9Dbx7KQtmDki" },
      { title: "statistics", videoUrl: "https://www.youtube.com/live/pgMVLQbu3k4?si=Kxn289dCnXO1R2Eo" },
      { title: "Probability (10)", videoUrl: "https://www.youtube.com/live/yCC8x4fLd30?si=Ccdy8uMvYP70hw-J" },
    ],
    physics: [
      { title: "light", videoUrl: "https://youtu.be/kHVAk96r05Y?si=FBmQfeietg6kPK72" },
      { title: "human-eye", videoUrl: "https://youtu.be/G7zDZwrP6O4?si=oxjVmq_0oFGEsrIi" },
      { title: "electricity", videoUrl: "https://youtu.be/EJcnBv691cY?si=t4d7RPqxxLT5xjea" },
      { title: "magnetic", videoUrl: "https://youtu.be/Ot6A6tlD12U?si=qhp9_0_1oO0TNTRl" },
    ],
    chemistry: [
      { title: "chemical-reaction-and-equation", videoUrl:"https://youtu.be/s0CttpllLxM?si=8ROPBAdZuwZSgnma" },
      { title: "acid-base", videoUrl: "https://youtu.be/5bSXK0QttdY?si=JFfBVqb-S3lkxOZu" },
      { title: "metal-non-metal", videoUrl: "https://youtu.be/YihPV4eSHsQ?si=OeD2mJ8yQ8TZ3q5A" },
      { title: "carbon-compound", videoUrl: "https://youtu.be/iv4kMn_CrhM?si=oX6iED8MHjlsUSmf" },
    ],
    biology: [
      { title: "life-processes", videoUrl: "https://youtu.be/NLv0qeWmBDk?si=K5LSq4He4FJTcDFk" },
      { title: "control-coordination", videoUrl: "https://youtu.be/vKfpJ2QejNA?si=AujGD8s9YTZHG50P" },
      { title: "reproduction", videoUrl: "https://youtu.be/dCAnbdRAsFo?si=49a9wUqQOgQ75sSf" },
      { title: "heredity", videoUrl: "https://youtu.be/0HZbUMx29vE?si=mcRD4Lp0GmxF6oaX" },
    ],
    SST: [
      // History
      { title: "The Rise of Nationalism in Europe", videoUrl: "https://youtu.be/0CsS2zg4Kms?si=OXYyR2Vbd8mkTI-p" },
      { title: "Nationalism in India", videoUrl: "https://youtu.be/RMeyeOt8GTg?si=n50ThS_PSgnBLj6t" },
      { title: "The Making of the Global World", videoUrl: "https://youtu.be/4roZtQeoUDw?si=k2tPUESRQRoxbxTR" },
      { title: "The age of Industrialization", videoUrl: "https://youtu.be/2RqIwjsop6A?si=IPa2wfk-PXFb4YkN" },
      { title: "Print Culture and the modern World", videoUrl: "https://youtu.be/qOWvfRRAFeU?si=av3I96OJejBuDqll" },
  
      // Geography
      { title: "Resources and Development", videoUrl: "https://youtu.be/1LA2-5rEMUE?si=cXPRXOhq86WyPDvh" },
      { title: "Forest and Wildlife Resources", videoUrl: "https://youtu.be/lmi3SAXYRVg?si=_h5Z3xpIgNsNCr6T" },     // project work
      { title: "Water Resources", videoUrl: "https://youtu.be/o4I9505br3M?si=Pu9f8RTyuDeR9uGD" },                   // map work only
      { title: "Agriculture", videoUrl: "https://youtu.be/T9TAhkwufBU?si=fA9N1kZ8KYlZg9RM" },
      { title: "Minerals and Energy Resources", videoUrl: "https://youtu.be/EA0Hv-d5dv0?si=7i75laezrUjBDj8p" },
      { title: "Manufacturing Industries", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
  
      // Political Science (Civics)
      { title: "Power Sharing", videoUrl: "https://youtu.be/A0VUqL7a7zQ?si=V97EyZh164FnV9KC" },
      { title: "Federalism", videoUrl: "https://youtu.be/raX3Da0jsEI?si=KwAJXpop8OIdYr72" },
      { title: "Gender, Religion and Caste", videoUrl: "https://youtu.be/rq8QIxQMVn4?si=w9aQ79qu3CkF4q86" },
      { title: "Political Parties", videoUrl: "https://youtu.be/5eU7uA6v2nE?si=zub8U9AL9x3vsW2F" },
      { title: "Outcomes of Democracy", videoUrl: "https://youtu.be/ITMb6rRkIVo?si=BgzaL2h9Gzmc5gpd" },
  
      // Economics
      { title: "Development", videoUrl: "https://youtu.be/tbDL5j-k-H8?si=Umzwb8r4_3QRQoXX" },
      { title: "Sectors of the Indian Economy", videoUrl: "https://youtu.be/wFH6iGe2vBE?si=NKcrb8rufmOhbbKq" },
      { title: "Money and Credit", videoUrl: "https://youtu.be/T9TAhkwufBU?si=fA9N1kZ8KYlZg9RM" },
      { title: "Globalisation and the Indian Economy", videoUrl: "https://youtu.be/HuEd5_qOsIA?si=yxivspRgI1-xOKQ2" },
      { title: "Consumer Rights", videoUrl: "https://youtu.be/zRrPJxMT8R0?si=7t8cP5gfhTIgFqOg" },                   // project work
    ],
  },



  2: {
    mathematics: [
      { title: "sets", videoUrl: "https://www.youtube.com/live/0KCLAfpZ2zY?si=1klXGV5Ym_2W8qX6" },
      { title: "functions", videoUrl: "https://www.youtube.com/live/qgk0a-W0LQ4?si=ZJ4h0jy0GbZFb9fT" },
      { title: "inequalities", videoUrl: "https://www.youtube.com/live/BVNaeS8T5uQ?si=Hv1XOFsvIqqfN3nI" },
      { title: "quadratic-equations", videoUrl: "https://www.youtube.com/live/mv4mVz_ccWk?si=X4dd6jaWIBb0PHJN"},
      { title: "Trigonometry", videoUrl: "https://www.youtube.com/live/FTai93ssi1Q?si=ONfRZNMlizMswCXW" },
      { title: "trigonometric-equations", videoUrl: "https://www.youtube.com/live/HmStb2FSRyw?si=mU9GIJje5GqDyXoc" },
      { title: "sequence-series", videoUrl: "https://www.youtube.com/live/-rgM3Z2zF18?si=GwBs8_yh83ZWb9UC" },
      { title: "permutation-combination", videoUrl: "https://www.youtube.com/live/lmk1sJo0728?si=wiq5EpXnqj3KKDZ6" },
      { title: "binomial-theorem", videoUrl: "https://www.youtube.com/live/eAMCL-mMmcY?si=ctble2k9k_cicfA0" },
      { title: "complex-number", videoUrl: "https://www.youtube.com/live/b7HhgvaFF5Q?si=xp6z8olvVm6oAqVW" },
      { title: "straight-line", videoUrl: "https://www.youtube.com/live/Ah-JjIq2bQk?si=0Z02q8wkFpMKJkj_" },
      { title: "circle", videoUrl: "https://www.youtube.com/live/qv7YTq5THew?si=Q0HQo_BrA3UFGe5s" },
      { title: "parabola", videoUrl: "https://www.youtube.com/live/LsYvJc56yag?si=OOWKavhDmgJO2ppF" },
      { title: "ellipse", videoUrl: "https://www.youtube.com/live/8asqPexzYzc?si=OaxbXzBcmZHurILc" },
      { title: "hyperbola", videoUrl: "https://www.youtube.com/live/Es6IoDqItuc?si=K2LvYH36ErbduvBG" },
      { title: "mathematical-reasoning ", videoUrl: "https://www.youtube.com/live/zbxVS7Y5NZc?si=5pAu8GNEjVbZVZ6V" },
      { title: "statistics", videoUrl: "https://www.youtube.com/live/fjgu_j2Xvjo?si=NmmXL-Bc7WhGvMs9" },
    ],
    physics: [
      { title: "unit-measurements", videoUrl: "https://youtu.be/YX5sLwRtULk?si=uzJGkLFKwh4r5p_-" },
      { title: "motion-in-straightline", videoUrl: "https://www.youtube.com/live/hY9zZrYuDVk?si=NCwTc5n2uwV3z0Rt" },
      { title: "motion-in-plane", videoUrl: "https://www.youtube.com/live/hY9zZrYuDVk?si=NCwTc5n2uwV3z0Rt" },
      { title: "laws-of-motion", videoUrl: "https://www.youtube.com/live/2i0p2tidN88?si=UxzUmI1iMCSl4sox" },
      { title: "work-energy-and-power", videoUrl: "https://www.youtube.com/live/M6R4bWT-eOU?si=DWrjqqtrew-oJ2BE" },
      { title: "circular-motion", videoUrl: "https://www.youtube.com/live/nsSeTLT3UF8?si=T9Cc5c2uaREwopJA" },
      { title: "center-of-mass", videoUrl: "https://www.youtube.com/live/1VIEL84kl7I?si=Y958jfYb9FXBh5rc" },
      { title: "rotational-motion", videoUrl: "https://www.youtube.com/live/UsHUxG90f_4?si=11CmldsLsdwepLRk" },
      { title: "gravitation", videoUrl: "https://www.youtube.com/live/Rgsg4NgwrXI?si=ZMLeb2ELXtQqkf39" },
      { title: "properties-of-matter", videoUrl: "https://www.youtube.com/live/9VBYO4it3ik?si=imMm24EoKwad8MIf" },
      { title: "properties-of-solids", videoUrl: "https://www.youtube.com/live/FCByCwnj_J0?si=bEzU0S9LnzZihi8m" },
      { title: "fluids", videoUrl: "https://www.youtube.com/live/8_KVbLZlCjM?si=esW9ZEMPNya5JSpN" },
      { title: "ktg-and-thermodynamics", videoUrl: "https://www.youtube.com/live/JAvi2K_DbbI?si=B41GsuvtXfRCbWm0" },
      { title: "oscillation", videoUrl: "https://youtu.be/urEsdx9xfKI?si=GMPwjqENWW_wR5rh" },
      { title: "wave-motion", videoUrl: "https://www.youtube.com/live/853QJObBo74?si=Nt2I_RHF-_WGmIx4" },
    ],
    chemistry: [
      { title: "mole-concept", videoUrl: "https://www.youtube.com/live/g50vTY3ot_M?si=uoIKykR8DPs_RJxG" },
      { title: "redox-reactions", videoUrl: "https://www.youtube.com/live/E_W8Q7RnfgU?si=fAK9dlHzWAokSl7u" },
      { title: "atomic-structure", videoUrl: "https://www.youtube.com/live/RCzzG8VnOl4?si=tydu7DDv7JUuVdoB" },
      { title: "gaseous-state-of-matter", videoUrl: "https://www.youtube.com/live/Ng6Y1HOxRDY?si=0h_6FoEDYN9LhGjv" },
      { title: "thermodynamics", videoUrl: "https://www.youtube.com/live/V77wZfttfYE?si=2-tqUqNSb30e7JCL" },
      { title: "thermo-chemistry", videoUrl: "https://www.youtube.com/live/IdZaa50B0hQ?si=ojjSgJkzFbR2pmbk" },
      { title: "chemical-equilibrium", videoUrl: "https://www.youtube.com/live/ZGbDYoVozYc?si=SU0iD-RgoFNoWFTU" },
      { title: "ionic-equilibrium", videoUrl: "https://www.youtube.com/live/QGg0vAqqQ2Q?si=wosBidzo-O-jwBss" },
      { title: "periodic-table", videoUrl: "https://www.youtube.com/live/-ozqtaSoMW0?si=oOeajFz62Zgp3X45" },
      { title: "chemical-bonding", videoUrl: "https://www.youtube.com/live/BGNQNaeUGQc?si=taY6Bj95gAMPQl8T" },
      { title: "hydrogen", videoUrl: "https://youtu.be/FdmETHB1mjE?si=TEgxEBWbrfQOUD2W" },
      { title: "s-block", videoUrl: "https://www.youtube.com/live/G4c5v97ExSM?si=kyj9m8tu7nvI60RR" },
      { title: "nomenclature", videoUrl: "https://www.youtube.com/live/-x505wUMqsI?si=ugPweYWQB_fY64G0" },
      { title: "isomerism", videoUrl: "https://www.youtube.com/live/wSXjjieuBWA?si=muHNd1EI-zb2DaTy" },
      { title: "general-organic-chemistry", videoUrl: "https://www.youtube.com/live/1vxoueq2jP0?si=eFH9P2znPoFK4M08" },
      { title: "hydrocarbon", videoUrl: "https://youtu.be/jD-amjIWlJg?si=zUKaxzpv-AXXEV0_" },
      { title: "practical-organic-chemistry", videoUrl: "https://www.youtube.com/live/9ldKfnFH9L8?si=IBbP_VWPLqy29zYo" },
      { title: "qualitative-analyses", videoUrl: null },
      { title: "environmental-chemistry", videoUrl: null },
    ],
  },


  3: {
    mathematics: [
      { title: "relations-and-functions", videoUrl: "https://www.youtube.com/live/__XBcqZl5oQ?si=YI7sCza9s6uLf0TT" },
      { title: "inverse-trigonometric-functions", videoUrl: "https://www.youtube.com/live/03GvcVZM1kU?si=7F4j6pwmGqS51cV5" },
      { title: "matrices", videoUrl: "https://www.youtube.com/live/yXJJGyHELz8?si=zkgnWi6u_YzkyiH-" },
      { title: "determinants", videoUrl: "https://www.youtube.com/live/orc2FHIKZA8?si=NZN3iyCZ3P6Ifd4m" },
      { title: "differentiation", videoUrl: "https://www.youtube.com/live/gf0-OEvLHG4?si=SUWriV1bt9sadxXH" },
      { title: "limits", videoUrl: "https://www.youtube.com/live/2kWgjIYNeCg?si=ZzE3Zv6pzNrN0vjH" },
      { title: "continuity-and-differentiability", videoUrl: "https://www.youtube.com/live/dvzXDXDagaQ?si=5xODagNGa6tfC58L" },
      { title: "applications-of-derivatives", videoUrl: "https://www.youtube.com/live/jVeCha6iI84?si=PvYMFzlM0AEEBPgw" },
      { title: "definite-integration", videoUrl: "https://www.youtube.com/live/xeEjV7YAo1M?si=gGTs1J_oqZjTlICY" },
      { title: "indefinite-integration", videoUrl: "https://www.youtube.com/live/kNusX-7Nhm0?si=WARp8ViP9YxsWiYO" },
      { title: "differential-equations", videoUrl: "https://www.youtube.com/live/JdzU63Oe4Wg?si=7NbeaXTiXJWvbZ5k" },
      { title: "area-under-curve", videoUrl: "https://www.youtube.com/live/T7UYxyYOLOY?si=FxMInIiZZrb9SLUy" },
      { title: "Vector Algebra", videoUrl: "https://www.youtube.com/live/AuU-tUqZuC8?si=qQpj2EJ38jz8JFf7" },
      { title: "3D-geometry", videoUrl: "https://www.youtube.com/live/t_ABiQEA4c8?si=V5t86LY-CBaaG9Ea" },
      { title: "probability", videoUrl: "https://www.youtube.com/live/sZSwBOMtChA?si=sEHEohz0KnvDOFtz" },
    ],
    physics: [
      { title: "electric-charges-and-field", videoUrl: "https://www.youtube.com/live/Rgsg4NgwrXI?si=ZMLeb2ELXtQqkf39" },
      { title: "electrostatic-potential-and-dipole", videoUrl: "https://www.youtube.com/live/sGb3VLDvNRU?si=WtAmMa8_jhn2eo3D" },
      { title: "capacitor", videoUrl: "https://www.youtube.com/live/EJJGEpGFzQs?si=PpHTIRR6Bz8Gox8-" },
      { title: "current-electricity", videoUrl: "https://www.youtube.com/live/JY24andAvME?si=2qGajQl_1arV8up_" },
      { title: "moving-charges-and-magnetism", videoUrl: "https://www.youtube.com/live/cahO3_JAAoc?si=05IBlU4zTy7SX1XQ" },
      { title: "magnetism", videoUrl: "https://www.youtube.com/live/I4kB3onwjpw?si=tZCdM817_GIlsJ9K" },
      { title: "electromagnetic-induction", videoUrl: "https://www.youtube.com/live/I4kB3onwjpw?si=tZCdM817_GIlsJ9K" },
      { title: "alternating-current", videoUrl: "https://www.youtube.com/live/n1xuq76ChYk?si=BzKI8CgL9VbGTbjn" },
      { title: "inductors", videoUrl: "https://www.youtube.com/live/n1xuq76ChYk?si=BzKI8CgL9VbGTbjn" },
      { title: "emw-and-communication", videoUrl: "https://www.youtube.com/live/cM25p1HE71Y?si=o6ymh5jCeWEiXVX8" },
      { title: "ray-optics", videoUrl: "https://www.youtube.com/live/72T8RfBU0ME?si=y4kHtmyoe3ceB0AK" },
      { title: "wave-optics", videoUrl: "https://www.youtube.com/live/k8IyQgwDdUk?si=MTEInOtBihOEPwjj" },
      { title: "modern-physics", videoUrl: "https://www.youtube.com/live/vP9LzR8zupE?si=O0qm0IHMHX83H6oA" },
      { title: "semiconductor", videoUrl: "https://www.youtube.com/live/YTmtAuItIfY?si=bSWKj_np_2xqDt5R" },
    ],
    chemistry: [
      { title: "solid-state", videoUrl: "https://www.youtube.com/live/r3w9iwWRThM?si=_27A5b4k3vlI-TXj" },
      { title: "solutions", videoUrl: "https://www.youtube.com/live/V7IhNvWMO0A?si=xjfZ2Ih05aI6AY4q" },
      { title: "electro-chemistry", videoUrl: "https://www.youtube.com/live/u9Oxgid_aaU?si=-IVYI4bCkf32d9s0" },
      { title: "chemical-kinetics", videoUrl: "https://www.youtube.com/live/T0LFfBuifjk?si=MaAJSu_sbwuowhU7" },
      { title: "surface-chemistry", videoUrl: "https://www.youtube.com/live/dvKO5_6xkSg?si=05rFc4rORB5p_Ixf" },
      { title: "metallurgy", videoUrl: "https://www.youtube.com/live/_s9tTXvhkHM?si=PsfA0z4uyRD3848z" },
      { title: "p-block", videoUrl: "https://www.youtube.com/live/G4c5v97ExSM?si=kyj9m8tu7nvI60RR" },
      { title: "d-and-f-block", videoUrl: "https://www.youtube.com/live/fVVJVlnSmn0?si=0Z9oWfl4RmzV7pPy" },
      { title: "coordination-compounds", videoUrl: "https://www.youtube.com/live/MA_te6P44dM?si=ygxobL-uuNZtCtHM" },
      { title: "haloalkane-and-haloarene", videoUrl: "https://youtu.be/jD-amjIWlJg?si=zUKaxzpv-AXXEV0_" },
      { title: "alcohol-phenol-ether", videoUrl: "https://youtu.be/vJIUOCilzxA?si=LmNYSGUuItUnw9iU" },
      { title: "aldehyde-ketone-carboxylic-acids", videoUrl: "https://youtu.be/jY4vxCf3yzs?si=GZdUFpqXRusSWb-g" },
      { title: "amines", videoUrl: "https://www.youtube.com/live/EOj1-kOWHT8?si=YMBWvJbv6yEeSF55" },
      { title: "biomolecules", videoUrl: "https://www.youtube.com/live/SNwenidZ1ek?si=J449PQbakvvvI9jC" },
      { title: "polymers", videoUrl: "https://youtu.be/iPOxMOCOIpY?si=PEmZCQyAmmZLk0QY" },
      { title: "chemistry-in-everyday-life", videoUrl: "https://youtu.be/DfB6JQ8weHc?si=FBIEOltTdg966Iae" },
      { title: "salt-analyses", videoUrl: "https://youtu.be/PrL4OovGWkM?si=UY5bnl02ufTZepvY" },
      { title: "environmental-chemistry", videoUrl: "https://youtu.be/FfRmhuVS57A?si=RogGLg7VI16nK_pk" },
    ],
  },


  14:{
    handwritten_notes:[
      {title:"Maths_11"},
      {title:"Maths_12"},
      {title:"physics_11"},
      {title:"Physics_12"},
      {title:"physical"},
      {title:"Inorganic"},
      {title:"organic"},

    ],
  },
  




  // College Batches

  7: {
    "Semester (1)":[
      { title: "Mathematics 1", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Physics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (2)":[
      { title: "Mathematics 2", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Chemistry", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Man Pro", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (3)":[
      { title: "SOM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "BMCM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Environmental Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Surveying", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],




    "Semester (4)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (6)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (7)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],



    "Semester (8)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (5)":[
      { title: "Foundation Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses II", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
    ]
  },




  8: {
    "Semester (1)":[
      { title: "Mathematics 1", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Physics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (2)":[
      { title: "Mathematics 2", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Chemistry", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Man Pro", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (3)":[
      { title: "SOM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "BMCM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Environmental Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Surveying", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],




    "Semester (4)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (6)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (7)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],



    "Semester (8)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (5)":[
      { title: "Foundation Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses II", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
    ]
  },






  9: {
    "Semester (1)":[
      { title: "Mathematics 1", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Physics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (2)":[
      { title: "Mathematics 2", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Chemistry", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Man Pro", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (3)":[
      { title: "SOM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "BMCM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Environmental Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Surveying", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],




    "Semester (4)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (6)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (7)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],



    "Semester (8)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (5)":[
      { title: "Foundation Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses II", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
    ]
  },






    13: {
      "Semester (1)":[
        { title: "Mathematics 1", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
        { title: "Physics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
        { title: "Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
  
      ],
  
  
      "Semester (2)":[
        { title: "Mathematics 2", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
        { title: "Chemistry", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
        { title: "Man Pro", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
  
      ],


    "Semester (3)":[
      { title: "SOM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "BMCM", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Environmental Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Surveying", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],




    "Semester (4)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (6)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],





    "Semester (7)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],



    "Semester (8)":[
      { title: "Fluid Mechanics", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses I", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "RCC Concrete", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Geotechnical Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },

    ],


    "Semester (5)":[
      { title: "Foundation Engineering", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
      { title: "Structural Analyses II", videoUrl: "https://youtu.be/RBE-C-b86-Y?si=hhEIbGZfjBxQpVcJ" },
    ]
  },

  // CDS Batches
  31:{

    english: [
      { title: "spotting-errors", videoUrl: null },
      { title: "sentence-improvement", videoUrl: null },
      { title: "fill-in-the-blanks", videoUrl: null },
      { title: "synonyms", videoUrl: null },
      { title: "antonyms", videoUrl: null },
      { title: "ordering-of-words", videoUrl: null },
      { title: "ordering-of-sentences", videoUrl: null },
      { title: "comprehension", videoUrl: null },
      { title: "cloze-test", videoUrl: null },
      { title: "idioms-and-phrases", videoUrl: null },
      { title: "active-passive-voice", videoUrl: null },
      { title: "direct-indirect-speech", videoUrl: null },
    ],

    physics: [
      { title: "unit-and-measurement-and-laws-of-motion", videoUrl: null },
      { title: "kinematics-wpe-gravitation", videoUrl: null },
      { title: "sound-and-wave", videoUrl: null },
      { title: "electricity-and-magnetism", videoUrl: null },
      { title: "light", videoUrl: null },
 
    ],
    
    
    chemistry: [
      { title: "states-of-matter-and-atomic-structure", videoUrl: null },
      { title: "electronic-configuration-and-metal-and-non-metal", videoUrl: null },
      { title: "acid-bases-and-salts", videoUrl: null },
      { title: "chemistry-in-everyday-life", videoUrl: null },
      { title: "carbon-and-its-compount", videoUrl: null },
      { title: "periodic-table", videoUrl: null },

    ],
    
    
    biology: [
      { title: "cell-structure", videoUrl: null },
      { title: "tissues", videoUrl: null },
      { title: "life-processes", videoUrl: null },
      { title: "human-health-and-diseases", videoUrl: null },
      { title: "diversity", videoUrl: null },
      { title: "genetics", videoUrl: null },

    ],
    
    polity: [
      { title: "constitution-introduction", videoUrl: null },
      { title: "fundamental-rights-duties", videoUrl: null },
      { title: "directive-principles", videoUrl: null },
      { title: "parliament", videoUrl: null },
      { title: "president-vice-president-and-judiciary", videoUrl: null },
      { title: "important-amendments-and-judgements", videoUrl: null },
      { title: "constitutional-and-non-constitutional-bodies", videoUrl: null },

    ],
    
    
    history: [
      { title: "harappan-civilisation-and-vedic-period", videoUrl: null },
      { title: "mahajanpadas-to-maurya-period", videoUrl: null },
      { title: "post-mauryan-to-gupta-phase", videoUrl: null },
      { title: "sangam-age-and-post-gupta-phase", videoUrl: null },
      { title: "tripartite-struggle-and-south-indian-kingdom", videoUrl: null },
      { title: "rise-of-rajput-kingdoms-and-arab-invasion", videoUrl: null },
      { title: "delhi-sultanate-vijaynagae-empire-and-bhakti", videoUrl: null },
      { title: "mughal-empire-maratha", videoUrl: null },
      { title: "arrival-of-europeans-and-establishment-of-british-rule", videoUrl: null },
    ],
    
    
    geography: [
      { title: "geomorphology", videoUrl: null },
      { title: "climatology", videoUrl: null },
      { title: "ocenography", videoUrl: null },
      { title: "indian-geography", videoUrl: null },
      { title: "world-geography", videoUrl: null },
    ],
    
    
    economics: [
      { title: "basics-and-national-income-banking-and-finance", videoUrl: null },
      { title: "money-policy", videoUrl: null },
      { title: "fiscal-policy-and-budget", videoUrl: null },
    ],
    
    

    maths: [
      { title: "number-system", videoUrl: null },
      { title: "set-statistics-lagorithm", videoUrl: null },
      { title: "mensuration", videoUrl: null },
      { title: "geometry", videoUrl: null },
      { title: "arithmetic", videoUrl: null },
      { title: "algebra", videoUrl: null },
      { title: "height-and-distance", videoUrl: null },
      { title: "trigonometry", videoUrl: null },
    
    ],
  },

  32: {
    "day (1)": [
      { title: "all about (day 1) SSB" },
    ],
    "day (2)": [
      { title: "all about (day 2) SSB"},
    ],
    "day (3)": [
      { title: "all about (day 3) SSB"}
    ],
    "day (4)": [
      { title: "all about (day 4) SSB"}
    ],
    "day (5)": [
      { title: "all about (day 5) SSB"}
    ]
  }

};

const SubjectPage = () => {
  const { classId, subject } = useParams();
  const formattedSubject =
  subject.toLowerCase().includes("semester") && !subject.includes("(")
    ? `semester(${subject.replace(/\D/g, "")})`
    : subject;

  const chapters = chaptersData[classId]?.[formattedSubject] || [];


  const subjectFormatted = subject.charAt(0).toUpperCase() + subject.slice(1);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isPremium = location.pathname.includes("/premium");
  const isRevision = location.pathname.includes("/revision");
  const isCollege = location.pathname.includes("/college");
  const isCds= location.pathname.includes("/cds");

  const handleBack = () => {
    navigate(-1);
  };

  const Content = (
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

      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ fontWeight: 700, mb: 4 }}
      >
        {subjectFormatted}
      </Typography>

      {chapters.length === 0 ? (
        <Typography color="error" textAlign="center">
          No chapters found for this subject.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {chapters.map((chapter) => (
            <Grid item xs={12} sm={6} md={3} key={chapter.title}>
              <Link
                to={
                  isRevision
                  ? `/revision/${classId}/${subject}/${chapter.title}`
                  // : isCds
                  // ? `/cds/${classId}/${subject}/${chapter.title}`
                  : isCollege
                  ? `/college/${classId}/${subject}/${chapter.title}`
                  : `/${isPremium ? "premium/class" : "class"}/${classId}/${subject}/${chapter.title}`
                }
                style={{ textDecoration: "none" }}
              >

                <Card
                  sx={{
                    height: { xs: 60, sm: 80, md: 100 },
                    minHeight: 100,
                    borderRadius: 3,
                    boxShadow:
                      "0 4px 12px rgba(25, 118, 210, 0.15), 0 6px 20px rgba(25, 118, 210, 0.25)",
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow:
                        "0 10px 25px rgba(25, 118, 210, 0.3), 0 12px 30px rgba(25, 118, 210, 0.4)",
                      backgroundColor: "#f9f9f9",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {chapter.title.replace(/-/g, " ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );

  return (
    <Box p={isMobile ? 2 : 4} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {isMobile ? (
        <Box>{Content}</Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Card
            sx={{
              width: "100vw",
              maxWidth: 12000,
              borderRadius: 4,
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.15)",
              p: 4,
              backgroundColor: "#ffffff",
            }}
          >
            {Content}
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default SubjectPage;
