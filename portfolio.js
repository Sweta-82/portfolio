// locomation
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    lerp:0.03
});

const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });


tl.from(".reveal span", {
  x: 100,
  opacity: 0,
  duration: 2,
  stagger: 0.2
});

tl.to(".reveal", {
  y: -40,
  opacity: 0,
  duration: 1
});

tl.to(".black", {
  yPercent: -100,      // ← moves it −100 % of its own height
  duration: 1.2
}).set(".black", {     // ← turn it off so it never blocks clicks
  display: "none"
});

tl.fromTo(".green-div",{
   height: 0 },
  { height: "100vh", 
    duration: 1 },
  "-=0.8"              // start 0.8 s before the previous tween ends
);

tl.fromTo(".white-div",
  { height: 0 },
  { height: "100%", duration: 1 },
  "-=0.8"
);

tl.from("h1", {
  y: 40,
  opacity: 0,
  duration: 2
});
tl.from('.section-lorem',{
    y: -40,
    opacity:0,
    duration: 2
})


const text = document.querySelector(".animatedText");

// Step 1: Get the word and split into letters
const letters = text.textContent.split(""); // ['b', 'a', 't']

// Step 2: Clear the original text
text.textContent = "";

// Step 3: Loop through each letter and wrap in <span>
for (let i = 0; i < letters.length; i++) {
  let span = document.createElement("span"); // create a new <span>
  span.classList.add("letter"); // add class "letter"
  span.textContent = letters[i]; // set text as the letter
  text.appendChild(span); // add <span> inside the h1
  console.log("Letter span created:", span);
}

tl.from(".letter", {
      opacity: 0,
      y: -30,
      duration: 2,
      stagger: 0.2,
    //   ease: "power2.out"
    });


    // main div animation
    // var main_div=gsap.timeline();
//     gsap.to(".hero-section-body .main-div1",{
//     x:40,
//     rotate:1,
//     // duration:20,
//     scale:1,
//     scrollTrigger:{
//         trigger:".hero-section-body .main-div1",
//         markers:false,
//         start:"top 80%",
//         end:"top 10%",
//         scrub: 3
//     }
// })

// gsap.to(".hero-section-body .main-div2",{
//     x:40,
//     rotate:1,
//     // duration:12,
//     scale:1,
//     scrollTrigger:{
//         trigger:".hero-section-body .main-div2",
//         markers:false,
//         start:"top 100%",
//         end:"top 10%",
//         scrub: 3
//     }
// })
// gsap.to(".hero-section-body .main-div3",{
//     x:40,
//     rotate:1,
//     duration:12,
//     scale:1,
//     scrollTrigger:{
//         trigger:".hero-section-body .main-div3",
//         markers:false,
//         start:"top 120%",
//         end:"top 10%",
//         scrub: 3
//     }
// })
// gsap.from(".text-div .text-div1",{
//     y:40,
//     duration:1,
//     stagger: 0.2,
//     opacity:0,
//     scrollTrigger:".text-div .text-div1"
    
// })



// var img1 = document.querySelector(".img1");
// var cursor = document.querySelector(".cursor");

// img1.addEventListener("mousemove", function (val) {
//     console.log(val);
//     gsap.to(cursor, {
//         x:val.x,
//         y:val.y,
//         scale: 2,
//         duration: 0.3,
        
//     });
// });



var main=document.querySelectorAll(".main");
var cursor= document.querySelector(".cursor");
var  hero=document.querySelector(".sub-hero")


gsap.set(cursor, { opacity: 0, scale: 0.6, pointerEvents: "none" });
main.forEach(e => {
  e.addEventListener("mouseenter", function () {
    gsap.to(hero, {
      backgroundColor: "#86d0c6",
      duration: 2
    });
    gsap.to(cursor, {
      opacity: 1,
      scale: 1,
      duration: 0.3
    });
  });

  e.addEventListener("mouseleave", function () {
    gsap.to(hero, {
      backgroundColor: "#f2f2f2",
      duration: 2
    });
    gsap.to(cursor, {
      opacity: 0,
      scale: 0.6,
      duration: 0.3
    });
  });
});

document.addEventListener("mousemove",function(e){
    console.log(e);
    
    gsap.to(cursor,{
        
        x: e.clientX,
        y: e.clientY,
        duration: 2,
        ease: "power2.out"
    })

})





  


