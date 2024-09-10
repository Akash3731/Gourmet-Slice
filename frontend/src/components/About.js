import React from "react";

const AboutSection = () => {
  return (
    <div id="about" className="flex flex-col items-center">
      <h1 className="text-5xl font-semibold text-custOrange mt-10 underline underline-offset-8">
        About Us
      </h1>
      <div className="mx-20 my-10 flex flex-row items-center justify-around text-custcustBlack">
        <img
          className="w-4/12 rounded-3xl drop-shadow-xl overflow-hidden"
          src="Media/about1.jpg"
          alt=""
        />

        <div className="w-6/12 drop-shadow-lg">
          <p className="text-3xl font-semibold">
            We believe that exceptional pizzas start with the finest
            ingredients.
          </p>
          <br />
          <p className="text-xl">
            That's why we meticulously source the best quality produce, premium
            cheeses, and artisanal meats to ensure every bite is a burst of
            fresh and vibrant flavors.
          </p>
        </div>
      </div>

      <div className="mx-20 my-10 flex flex-row items-center justify-around text-custcustBlack">
        <div className="w-6/12 ">
          <p className="text-3xl font-semibold">
            Authentic Italian Wood Fired Oven
          </p>
          <br />
          <p className="text-xl">
            Our state-of-the-art wood-fired oven; imported directly from Italy,
            brings a unique, smoky flavor and perfect crispiness to our pizzas-
            making every bite a blend of tradition, quality, and culinary
            excellence.
          </p>
        </div>
        <img
          className="w-1/3 rounded-3xl drop-shadow-xl"
          src="Media/about2.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default AboutSection;
