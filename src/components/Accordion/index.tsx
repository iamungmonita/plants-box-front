import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  zIndex: 20,
  backgroundColor: "transparent",
  backdropFilter: "blur(8px)",
  fontFamily: "red hat display", // Add blur effect here
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <Image
        src="/assets/watering-can.svg"
        alt="watering can"
        width={20}
        height={20}
        unoptimized
        style={{
          width: "20px",
          height: "20px",
          maxWidth: "20px",
          maxHeight: "20px",
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row-reverse",

  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(45deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const services = [
    {
      id: "accordion1",
      title: "Indoor/Outdoor plants",
      bodyText: "Accordion 1 Text",
    },
    {
      id: "accordion2",
      title: "Cactus and succulents",
      bodyText: "Accordion 1 Text",
    },
    {
      id: "accordion3",
      title: "Customize plant arrangements and terrariums",
      bodyText: "Accordion 2 Text",
    },
    {
      id: "accordion4",
      title: "Live plant bouquets",
      bodyText: "Accordion 3 Text",
    },
    {
      id: "accordion5",
      title: "Terracotta local handmade and ceramic pots",
      bodyText: "Accordion 3 Text",
    },
    {
      id: "accordion6",
      title: "Decoration items (figures and crochets)",
      bodyText: "Accordion 3 Text",
    },
    {
      id: "accordion7",
      title: "Educational workshops (figures and crochets",
      bodyText: "Accordion 3 Text",
    },
    {
      id: "accordion8",
      title:
        "Wedding gifts or corporate gifts for employees or other occasions (wrapping gifts)",
      bodyText: "Accordion 3 Text",
    },
    {
      id: "accordion9",
      title: "Tailoring services to the specific needs of clients",
      bodyText: "Accordion 3 Text",
    },
  ];

  return (
    <div>
      {services.map((service) => (
        <Accordion
          key={service.id}
          expanded={expanded === service.id}
          onChange={handleChange(service.id)}
        >
          <AccordionSummary
            aria-controls={`${service.id}d-content`}
            id={`${service.id}d-header`}
          >
            <Typography
              component="span"
              sx={{ fontFamily: "'Red Hat Display', sans-serif" }}
            >
              {service.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ fontFamily: "'Red Hat Display', sans-serif" }}>
              {service.bodyText}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
