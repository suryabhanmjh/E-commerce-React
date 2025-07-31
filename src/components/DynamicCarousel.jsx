import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const DynamicCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    axios.get("https://data-json-nwab.onrender.com/banners")
      .then(res => setBanners(res.data))
      .catch(err => console.log("Banner load error", err));
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % banners.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, banners]);

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
      setFade(true);
    }, 400);
  };

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setFade(true);
    }, 400);
  };

  const goTo = (i) => {
    setFade(false);
    setTimeout(() => {
      setIndex(i);
      setFade(true);
    }, 400);
  };

  if (banners.length === 0) return <p className="text-center py-10 text-xl">Loading banners...</p>;

  const banner = banners[index];

  return (
  <>
  
  <div className="relative w-full h-[90vh] overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-200 to-pink-200">
    <div className={`flex flex-col md:flex-row items-center justify-between w-full h-full px-4 md:px-16 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* TEXT Section */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl mb-6 leading-tight">
          {banner.title}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 font-medium mb-8">
          {banner.subtitle}
        </p>
        <button className="bg-white text-indigo-700 px-6 py-3 text-lg font-bold rounded-full shadow hover:scale-105 transition">
          📘 Explore Books
        </button>
      </div>

      {/* IMAGE Section */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src={banner.image}
          alt="Banner"
          className="w-[70vw] max-w-[800px] max-h-[70vh] object-contain drop-shadow-2xl rounded-xl transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>

    {/* Arrows */}
    <button
      onClick={prev}
      className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-white/30 hover:bg-white/50 p-3 rounded-full shadow-lg hidden md:block"
    >
      &#8592;
    </button>
    <button
      onClick={next}
      className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-white/30 hover:bg-white/50 p-3 rounded-full shadow-lg hidden md:block"
    >
      &#8594;
    </button>

    {/* Dots */}
    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
      {banners.map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className={`rounded-full transition-all duration-300 ${
            i === index ? 'w-6 h-3 bg-white' : 'w-3 h-3 bg-white/60'
          }`}
        />
      ))}
    </div>
  </div>


  </>
  );
};

export default DynamicCarousel;
