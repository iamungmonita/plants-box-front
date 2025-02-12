import React from "react";

const Footer = () => {
  const getYear = new Date().getFullYear();
  return (
    <footer className="flex justify-center z-30 bg-white items-center text-center min-h-12 border-t max-md:fixed max-md:bottom-0 w-full">
      <p className="text-[12px]">
        &copy; {getYear} Plants Box. All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
