const skills = [
    "Three.js",
    "WebGL",
    "GSAP",
    "Animation",
    "3D UI",
    "Creative Dev",
    "Interaction",
    "Frontend",
    "React",
    "Redux",
    "JavaScript",
    "ES6+",
    "Async JS",
    "Tailwind",
    "UI Systems",
    "Responsive",
    "Layouts",
    "APIs",
    "REST",
    "Node.js",
    "Express",
    "Performance",
    "Optimization",
    "Lazy Load",
    "Git",
    "GitHub",
    "Debugging",
    "Problem Solving",
    "DSA",
    "UX Thinking",
    "Design",
    "Micro UX",
    "Parallax",
    "Scroll",
    "Smooth Scroll",
    "Lenis",
    "Vite",
    "NPM",
    "Components",
    "State Mgmt",
    "Clean Code",
    "Scalable UI",
    "Testing",
    "Deployment",
    "Chrome DevTools"
];

function initSkillsScroller() {
    const track = document.getElementById('skillsTrack');
    if (!track) return;

    // Double the array for seamless infinite loop
    const duplicatedSkills = [...skills, ...skills];

    track.innerHTML = duplicatedSkills
        .map(skill => `<div class="w-full block text-left text-sm font-mono text-primary opacity-70 transition-all duration-300 cursor-default whitespace-nowrap hover:text-[#FF3B00] hover:scale-110 hover:-translate-x-3 hover:opacity-100">${skill}</div>`)
        .join('');
}

document.addEventListener('DOMContentLoaded', initSkillsScroller);
