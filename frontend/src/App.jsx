import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [profile, setProfile] = useState({
    name: "",
    subtitle: "",
    description: "",
    profile_image: "",
    page_image: "",
  });

  const [about, setAbout] = useState({
    title: "",
    description: "",
    tags: "",
    image: "",
  });

  const [skills, setSkills] = useState([
    {
      title: 'Django',
      description: '',
      tags: [],
      image: '',
    },
    {
      title: 'Bootstrap',
      description: '',
      tags: [],
      image: '',
    },
    {
      title: 'JavaScript',
      description: 'Build like a modern developer using JavaScript to create responsive and professional web applications.',
      tags: ['JavaScript', 'Frontend', 'Development'],
      image: '',
    },
  ]);

  const [projects, setProjects] = useState([
    // {
    //   title: 'Portfolio Website',
    //   description: 'A modern, responsive portfolio website built with Django and Bootstrap.',
    //   tags: ['React', 'Django', 'Bootstrap'],
    //   image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    // },
    // {
    //   title: 'E-Commerce Platform',
    //   description: 'Full-stack e-commerce application with payment integration and admin dashboard.',
    //   tags: ['Next.js', 'Django', 'Bootstrap'],
    //   image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    // },
    // {
    //   title: 'Task Management App',
    //   description: 'Real-time task management application with user authentication and team collaboration.',
    //   tags: ['Node.js', 'Django', 'Bootstrap'],
    //   image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    // },
  ]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    fetch("https://portfolio-web-j58z.onrender.com/api/profile/")
      .then((res) => res.json())
      .then((data) => {
        setProfile(prev => ({
          ...prev,
          name: data.name || prev.name,
          subtitle: data.subtitle || prev.subtitle,
          description: data.description || prev.description,
          profile_image: data.profile_image || prev.profile_image,
          page_image: data.page_image || prev.page_image,
        }));
      })
      .catch(() => {
        // Use defaults on error
      });

      // backend connection test
        useEffect(() => {
    fetch("https://portfolio-web-j58z.onrender.com/api/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

    // Fetch resume availability
    fetch("https://portfolio-web-j58z.onrender.com/api/resume/")
      .then((res) => res.json())
      .then((data) => {
        setResumeAvailable(Boolean(data.has_resume));
      })
      .catch(() => {
        setResumeAvailable(false);
      });
    
    // Fetch about data from separate endpoint
    fetch("https://portfolio-web-j58z.onrender.com/api/about/")
      .then((res) => res.json())
      .then((data) => {
        setAbout((prev) => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          tags: data.tags || prev.tags,
          image: data.image || prev.image,
        }));
      })
      .catch(() => {
        // keep defaults
      });

    // Fetch skills from backend
    fetch("https://portfolio-web-j58z.onrender.com/api/skills/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data.map((skill) => ({
            ...skill,
            tags: Array.isArray(skill.tags) ? skill.tags : (skill.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
          })));
        }
      })
      .catch(() => {
        // keep defaults
      });

    // Fetch projects from backend
    fetch("https://portfolio-web-j58z.onrender.com/api/projects/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data.map((project) => ({
            ...project,
            tags: Array.isArray(project.tags) ? project.tags : (project.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
          })));
        }
      })
      .catch(() => {
        // keep defaults
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'qualifications', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const downloadResume = async () => {
    try {
      const response = await fetch("https://portfolio-web-j58z.onrender.com/api/resume/download/");
      if (!response.ok) {
        throw new Error("Resume download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const disposition = response.headers.get("content-disposition") || "";
      const matches = disposition.match(/filename\*=UTF-8''(.+)|filename="?([^";]+)"?/);
      link.download = matches ? decodeURIComponent(matches[1] || matches[2]) : "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      setMessage("Unable to download resume right now.");
    }
  };

  const handleContactChange = (field) => (event) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const submitContactForm = async (event) => {
    event.preventDefault();
    setMessage("");

    const response = await fetch("https://portfolio-web-j58z.onrender.com/api/contact/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactForm),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      setMessage(errorData?.detail || "Failed to send message. Please try again.");
      return;
    }

    setContactForm({ name: "", email: "", subject: "", message: "" });
    setMessage("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(20,195,139,0.18),_transparent_30%),linear-gradient(180deg,#e4f2f0_0%,#ffbffa_100%)] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={profile.profile_image}
              alt={profile.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <span className="text-xl font-semibold tracking-tight">{profile.name.split(' ')[0]}</span>
          </div>
          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#home" className={`text-sm font-medium transition ${activeSection === 'home' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-900 hover:text-emerald-500'}`}>Home</a>
            <a href="#about" className={`text-sm font-medium transition ${activeSection === 'about' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-900 hover:text-emerald-500'}`}>About</a>
            <a href="#skills" className={`text-sm font-medium transition ${activeSection === 'skills' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-900 hover:text-emerald-500'}`}>Skills</a>
            <a href="#projects" className={`text-sm font-medium transition ${activeSection === 'projects' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-900 hover:text-emerald-500'}`}>Projects</a>
            <a href="#contact" className={`text-sm font-medium transition ${activeSection === 'contact' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-900 hover:text-emerald-500'}`}>Contact</a>
          </nav>
        </div>
      </header>

      <div className="fixed right-4 top-1/2 z-30 -translate-y-1/2 flex flex-col items-center gap-3  p-2 backdrop-blur-md">
        <a href="https://www.linkedin.com/in/muhindi-john-29a297360/" target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-white transition hover:-translate-x-2">
          <span className="sr-only">LinkedIn</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.28 8.5h4.4v12H0.28zM7.5 8.5h4.22v1.7h.06c.59-1.1 2.04-2.24 4.2-2.24 4.5 0 5.33 3 5.33 6.9v7.6h-4.4v-6.74c0-1.61-.03-3.68-2.24-3.68-2.24 0-2.58 1.75-2.58 3.56v6.86H7.5z" />
          </svg>
        </a>
        <a href="https://github.com/muhindi001" target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white transition hover:-translate-x-2">
          <span className="sr-only">GitHub</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.8-1.5-3.8-1.5-.5-1.1-1.3-1.4-1.3-1.4-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1 1.8 2.6 1.3 3.3 1 .1-.8.4-1.3.7-1.6-2.5-.3-5-1.3-5-5.8 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.4.1-2.9 0 0 1-.3 3.3 1.2.9-.3 1.8-.4 2.7-.4.9 0 1.8.1 2.7.4 2.3-1.5 3.3-1.2 3.3-1.2.7 1.5.2 2.6.1 2.9.8.9 1.3 2 1.3 3.2 0 4.5-2.6 5.5-5 5.8.4.3.8 1 .8 2V23c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z" />
          </svg>
        </a>
        <a href="https://wa.me/254700000000?text=Hello%20Izengo" target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-green-500 text-white transition hover:-translate-x-2">
          <span className="sr-only">WhatsApp</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a10 10 0 0 0-8.1 15.8L2 22l4.5-1.2A10 10 0 1 0 12 2zm5.4 13.5c-.2.6-1.1 1.1-1.7 1.2-.5.1-1.2.2-4.1-1.3-3.4-1.7-5.6-5.8-5.7-6-.1-.2 0-.7.3-1 .2-.2.5-.4.7-.4.2 0 .4 0 .6.1.2.1.7.3.9.4.2.1.4.1.7 0 .2 0 .5-.1.7-.1.2 0 .6 0 .9.7.3.8 1.1 2.6 1.2 2.8.1.2.1.4 0 .6-.1.2-.2.4-.3.6-.1.2-.3.5-.4.7-.1.2-.2.4.1.7.2.2.6.6 1.3 1 .9.5 1.7.7 2 .8.3.1.5.1.7-.1.2-.2.9-1 1-1.2.1-.2.2-.4.1-.6-.1-.2-.2-.4-.4-.6-.2-.2-.4-.4-.6-.6-.2-.2-.2-.4-.3-.6-.1-.2 0-.4.1-.5.1-.1.8-1.1.9-1.3.1-.2.1-.4 0-.6-.1-.2-.4-.6-.6-.8-.3-.2-.6-.4-.9-.6-.2-.1-.5-.1-.7-.1-.2 0-.4 0-.6 0-.2 0-.5.1-.7.2-.2.1-.5.3-.7.4-.2.1-.4.3-.5.5-.1.2-.1.4-.1.6 0 .2.1.4.2.6.1.2.3.4.5.5.3.2.7.4 1.1.6.4.2.9.6 1.1.8.2.2.4.5.3.8-.1.3-.4.6-.7.8z" />
          </svg>
        </a>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <section id="home" className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center py-14">
          <div className="space-y-8">
            <p className="text-3xl font-bold tracking-[0.35em] text-emerald-500">Hi, I'm</p>
            <h1 className="max-w-3xl text-[clamp(2.75rem,5vw,4.75rem)] font-black tracking-[-0.05em] text-slate-950">{profile.name}</h1>
            <p className="text-4xl font-bold text-slate-900">{profile.subtitle}</p>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              {profile.description}
            </p>
            {message && (
              <p className="text-sm font-medium text-emerald-600">{message}</p>
            )}
            <div className="flex flex-wrap gap-4">
              <a href="#/view-project" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(16,185,129,0.18)] transition hover:-translate-y-0.5">View My Work</a>
              {resumeAvailable ? (
                <button onClick={downloadResume} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 cursor-pointer">Download CV</button>
              ) : (
                <button type="button" disabled className="inline-flex items-center justify-center rounded-full bg-slate-400 px-7 py-3 text-sm font-semibold text-white opacity-80 cursor-not-allowed">Resume Unavailable</button>
              )}
            </div>
          </div>

          <div className="grid place-items-center gap-6">
            <div className="grid place-items-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 p-1 shadow-[0_28px_60px_rgba(15,23,42,0.14)]">
              <img src={profile.page_image} alt={profile.name} className="h-[min(360px,90vw)] w-[min(360px,90vw)] rounded-full object-cover shadow-xl" />
            </div>
          </div>
        </section>

        <section id="about" className="space-y-12 py-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">About Me</h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-emerald-500"></div>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
              These are the tools and technologies with experience building modern, responsive web applications, data analysis, data report and big data pre-processing
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] items-center">
              <div className="space-y-6">
                    <h3 className="text-4xl font-bold text-slate-950">{about.title}</h3>
                    <p className="max-w-2xl text-base leading-8 text-slate-600">
                      {about.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {(about.tags || '').split(',').map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                        <span key={skill} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">{skill}</span>
                      ))}
                    </div>
                  </div>
              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] border-4 border-emerald-500 shadow-[0_24px_54px_rgba(15,23,42,0.14)]">
                  <img
                    src={about.image}
                    alt="Hands on laptop"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="space-y-12 py-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">My Skills</h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-emerald-500"></div>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
              These are the tools and technologies skills I have learned and used to build responsive websites and analyze data.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {skills.map((skill) => (
              <article key={skill.title} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                <div className="h-64 overflow-hidden">
                  <img
                    src={skill.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}
                    alt={`${skill.title} illustration`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-6 p-8">
                  <h3 className="text-2xl font-bold text-slate-950">{skill.title}</h3>
                  <p className="text-slate-600">{skill.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {skill.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">{tag}</span>
                    ))}
                  </div>
                  <button className="w-full rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                    Learn More
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="space-y-12 py-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">My Projects</h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-emerald-500"></div>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
              These are some of the recent projects I built using analysis tools that help to analyze and integrate dashboard report
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                <div className="h-64 overflow-hidden rounded-t-[2rem]">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'}
                    alt={`${project.title} screenshot`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-6 p-8">
                  <h3 className="text-2xl font-bold text-slate-950">{project.title}</h3>
                  <p className="text-slate-600">{project.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">{tag}</span>
                    ))}
                  </div>
                  <a href="#/view-project" className="w-full inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                    View Project
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="qualifications" className="space-y-8 py-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">Qualifications</h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-emerald-500"></div>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
              Education, certifications, technical trainings, and professional experience that support my work as a developer and data scientist.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
            <article className="rounded-[1.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
              <div className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-950">
                Education
              </div>
              <div className="space-y-5 text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                  <p className="text-sm font-semibold text-slate-950">Primary School: <span className="font-normal text-slate-600">Kiara Primary School — 2009–2015</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                  <p className="text-sm font-semibold text-slate-950">Secondary School: <span className="font-normal text-slate-600">kiara Secondary School — 2016–2019</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                  <p className="text-sm font-semibold text-slate-950">Advanced Level: <span className="font-normal text-slate-600">Minaki Boys High School — 2021–2023</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                  <p className="text-sm font-semibold text-slate-950">Bachelor's Degree: <span className="font-normal text-slate-600">Data Science — Eastern Africa Statistical Training Centre (2022–2026)</span></p>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              <article className="rounded-[1.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                <div className="mb-5 text-2xl font-semibold text-slate-950">Certifications</div>
                <div className="space-y-4 text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                    <p className="text-sm">Python Programming Certificate</p>
                  </div>
                </div>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                <div className="mb-5 text-2xl font-semibold text-slate-950">Technical Training</div>
                <div className="space-y-4 text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                    <p className="text-sm">Git &amp; GitHub</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                    <p className="text-sm">Database Management</p>
                  </div>
                </div>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                <div className="mb-5 text-2xl font-semibold text-slate-950">Professional Experience</div>
                <div className="space-y-4 text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500"></span>
                    <p className="text-sm">Field — Apotek Company (2024)</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="space-y-12 py-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">Contact Me</h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-emerald-500"></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-8 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-950">Get In Touch</h3>
                <p className="max-w-xl text-base leading-8 text-slate-600">
                  Feel free to contact me for web development, projects, collaborations or any opportunity.
                </p>
              </div>
              <div className="space-y-5">
                {[
                  {
                    label: 'Location',
                    value: 'Dar es Salaam, Tanzania',
                    icon: (
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M12 2c-3.314 0-6 2.686-6 6 0 4.806 6 12 6 12s6-7.194 6-12c0-3.314-2.686-6-6-6zm0 8.5c-1.379 0-2.5-1.121-2.5-2.5s1.121-2.5 2.5-2.5 2.5 1.121 2.5 2.5-1.121 2.5-2.5 2.5z"/></svg>
                      </span>
                    ),
                  },
                  {
                    label: 'Email',
                    value: 'muhindijohn128@gmail.com',
                    icon: (
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 4.236l-8 4.941-8-4.941V6l8 4.941L20 6v2.236z"/></svg>
                      </span>
                    ),
                  },
                  {
                    label: 'Phone',
                    value: '+255 693 944 046',
                    icon: (
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M20.487 17.14l-4.083-1.03a1.002 1.002 0 0 0-1.052.355l-1.957 2.633a16.01 16.01 0 0 1-7.196-7.196l2.633-1.957a1.002 1.002 0 0 0 .355-1.052L6.86 3.513A1.002 1.002 0 0 0 5.895 3H4.005C3.45 3 3 3.45 3 4.005 3 14.493 9.507 21 19.995 21c.555 0 1.005-.45 1.005-1.005V18.1c0-.51-.34-.96-.813-1.11z"/></svg>
                      </span>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className="grid grid-cols-[auto_1fr] items-center gap-5 rounded-[1.5rem] bg-slate-50 p-5">
                    {item.icon}
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{item.label}</p>
                      <p className="text-sm text-slate-600">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={submitContactForm} className="grid gap-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-4 lg:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleContactChange('name')}
                  className="rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleContactChange('email')}
                  className="rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={handleContactChange('subject')}
                className="rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
              />
              <textarea
                rows="6"
                placeholder="Your Message"
                value={contactForm.message}
                onChange={handleContactChange('message')}
                className="rounded-[2rem] border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Send Message
              </button>
              {message && (
                <span className="mt-2 inline-block text-sm font-medium text-emerald-900">
                  {message}
                </span>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Portfolio</h3>
              <p className="max-w-sm text-sm leading-7 text-slate-300">
                A compact showcase of skills, experience and services designed for quick access and easy browsing.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Quick Access</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                    <a href={`#${item.toLowerCase()}`} className="transition hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Services</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {['Web Design & Development', 'Data Analysis', 'Responsive Websites'].map((service) => (
                  <li key={service} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2026 Mr.muhindi Portfolio
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
