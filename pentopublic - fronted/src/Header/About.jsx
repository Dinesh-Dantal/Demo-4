import React from "react";

const About = () => {
  return (
    <div className="bg-slate-900 text-slate-100 py-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          About PenToPublic
        </h1>
        <p className="text-lg md:text-xl leading-8 text-slate-300">
          PenToPublic is your creative publishing platform, designed to empower
          authors and readers alike. Whether you're a budding writer or an
          enthusiastic reader, our platform connects words to hearts.
        </p>
        <p className="mt-6 text-lg md:text-xl text-slate-400">
          We believe in giving everyone the power to share their voice with the
          world — be it through stories, poems, or knowledge.
        </p>
      </div>
    </div>
  );
};

export default About;
