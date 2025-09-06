// src/components/About.jsx
import React from "react";
import { TypeAnimation } from "react-type-animation";

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-6 py-16"
    >
      {/* Typing animation heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-10">
        <span>
          About Me: 
        </span>
        {/* Typing Effect */}
        <TypeAnimation
          sequence={[
            "FrontEnd Developer",
            3000,
            "BackEnd Developer",
            2900,
            "Software Developer",
            2800,
            "Network Engineer",
            2700,
            "Tech Enthusiast",
            2600,
            "Gearhead",
            2500,
          ]}
          wrapper="span"
          speed={35}
          repeat={Infinity}
          className="text-3xl md:text-3xl font-medium text-red-400"
        />
      </h2>

      <div className="max-w-5xl text-center space-y-6">
        {/* Intro */}
        <p className="text-lg md:text-xl leading-relaxed">
          I’m a{" "}
          <span className="text-green-400 font-semibold">self-taught developer</span>{" "}
          with <span className="text-yellow-600 font-semibold">2 years of hands-on experience</span>{" "}
          building practical and impactful solutions. My journey began as a{" "}
          <span className="text-red-400 font-semibold">Network Engineer</span>, where I delivered{" "}
          <span className="italic">internet installations, CCTV setups, access control systems,</span>{" "}
          and more. It was during this time that I discovered{" "}
          <span className="text-blue-400 font-semibold">Python</span>, and I’ve been hooked ever since.
        </p>

        {/* Transition into dev career */}
        <p className="text-lg md:text-xl leading-relaxed">
          Over time, I transitioned fully into software development, growing into{" "}
          <span className="font-semibold text-green-400">full-stack development</span>.  
          My current stack includes{" "}
          <span className="text-green-400 font-semibold">React</span>,{" "}
          <span className="text-pink-400 font-semibold">Tailwind CSS</span>,{" "}
          <span className="text-blue-400 font-semibold">Django & Django REST Framework</span>, and{" "}
          <span className="text-yellow-400 font-semibold">PostgreSQL</span>.  
          I’m also experienced with{" "}
          <span className="text-orange-400 font-semibold">Docker, Git, REST APIs</span>, and building 
          scalable full-stack apps.
        </p>

        {/* Continuous learning */}
        <p className="text-lg md:text-xl leading-relaxed">
          In my pursuit of continuous learning, I’m currently sharpening my{" "}
          <span className="text-orange-400 font-semibold">AWS Cloud</span> skills while expanding into{" "}
          <span className="text-purple-400 font-semibold">C# and the .NET Framework</span> — pushing myself
          beyond the Python/JavaScript ecosystem to stay versatile.
        </p>

        {/* Mindset */}
        <p className="text-lg md:text-xl leading-relaxed">
          I believe in building{" "}
          <span className="text-green-400 font-semibold">scalable, user-friendly systems</span> and thrive
          in both solo and collaborative environments. I enjoy tackling challenges, experimenting with
          new tools, and delivering impactful digital solutions.
        </p>

        {/* Closing statement */}
        <p className="text-lg md:text-xl font-semibold">
          My goal is to evolve into a{" "}
          <span className="text-green-400">versatile full-stack developer</span>, blending{" "}
          <span className="text-yellow-400">technical expertise</span> with{" "}
          <span className="text-red-400">creative problem-solving</span> to craft
          meaningful software solutions.
        </p>
      </div>
    </section>
  );
};

export default About;
