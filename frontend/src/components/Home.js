import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/order-food");
  };

  return (
    <div
      id="home"
      className="h-screen bg-custWhite flex justify-start mx-20 rounded-3xl"
      style={{ backgroundImage: "url(Media/landing3.jpg)" }}
    >
      <div className="relative top-1/4 left-16">
        <h1 className="text-5xl text-custOrange font-bold">
          <span className="text-3xl"> Welcome to</span> <br /> The Gourmet Slice
        </h1>
        <p className="text-xl text-white">
          Indulge in the finest gourmet pizzas, crafted with premium ingredients
          and a passion for perfection. <br /> Experience the art of
          pizza-making with every delicious slice.
        </p>
        <button
          onClick={handleClick}
          className="  text-custcustBlack bg-custOrange py-3 px-5 rounded-full font-bold mt-10 hover:scale-110 transition-all duration-300"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default Home;
