import React from "react";

const ContactSection = () => {
  return (
    <div id="contact" className="bg-custBlack text-custWhite py-20">
      <div className="flex items-center justify-center text-5xl pb-16 underline underline-offset-8">
        Contact Us
      </div>
      <div className="flex items-center justify-evenly">
        <div>
          <p className="text-3xl">Talk To Us</p>
          <br />
          <p className="text-lg">thegourmetslice@example.com</p>
          <p className="text-lg">+91 98765 43210</p>
        </div>
        <div>
          <p className="text-3xl">Opening Hours</p>
          <br />
          <p className="text-lg">Mon-Thu: 9:00am to 10:00pm </p>
          <p className="text-lg">Fri-Sun: 9:00am to 11:00pm </p>
        </div>
        <div>
          <p className="text-3xl">Find Us At</p>
          <br />
          <p className="text-lg">Pune, Maharshtra</p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
