import { useEffect } from "react";
import resumeUrl from "../../assets/misc/jason_chen_resume.pdf";

// A stable, shareable alias for the resume.
//
// Vite fingerprints the PDF's filename with a content hash, so its real URL changes
// every time the resume is updated and any previously shared link breaks. Importing
// it here means the build resolves that hashed URL at compile time, so /#/resume
// always lands on the current file and never needs updating by hand.
const ResumeRedirect = () => {
  useEffect(() => {
    window.location.replace(resumeUrl);
  }, []);

  return null;
};

export default ResumeRedirect;
