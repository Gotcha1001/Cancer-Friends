import React, { useState, useEffect } from "react";

export default function ContactUs() {
  const [screenSize, setScreenSize] = useState("This is a default screen");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setScreenSize("This is a desktop screen");
      } else if (width >= 1024) {
        setScreenSize("This is a laptop screen");
      } else if (width >= 640) {
        setScreenSize("This is a tablet screen");
      } else {
        setScreenSize("This is a mobile screen");
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="text-center">
      <div className="bg-black p-4">
        <h1 className="tablet:text-xl laptop:text-2xl desktop:text-3xl zoom mb-4 text-lg">
          Contact Us
        </h1>
        <p className="tablet:text-lg laptop:text-xl desktop:text-2xl animate-bounce text-base text-white">
          {screenSize}
        </p>
        <div className="mt-4 bg-white p-4 shadow-neon">
          This box has a neon shadow.
        </div>
        <div className="phone:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 mt-8 grid gap-4">
          {/* Replace with actual image URLs */}
          <img
            src="https://images.pexels.com/photos/4355630/pexels-photo-4355630.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Placeholder"
            className="h-48 w-full object-contain shadow-neon"
          />
          <img
            src="https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Placeholder"
            className="shadow- shadow-sunset h-48 w-full object-contain"
          />
          <img
            src="https://images.pexels.com/photos/5690183/pexels-photo-5690183.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Placeholder"
            className="shadow-sky h-48 w-full object-contain"
          />
          <img
            src="https://images.pexels.com/photos/10877395/pexels-photo-10877395.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Placeholder"
            className="shadow-nature h-48 w-full object-contain"
          />
          <img
            src="https://images.pexels.com/photos/22601522/pexels-photo-22601522/free-photo-of-woman-in-dress-sitting-on-sofa-with-magic-stick-in-hand.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Placeholder"
            className="shadow-teal h-48 w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
