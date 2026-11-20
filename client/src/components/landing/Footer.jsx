const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-5 text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} LeadDesk Mini. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;