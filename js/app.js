const wrap = document.querySelector('.wrap'), nav = document.querySelector('header'), tl = gsap.timeline();

tl.set(wrap, {height: "0%"})
    .set(nav, {opacity: 0})
    .to(wrap, 1, {height: "+=100%", autoRound: false, ease: Power2.easeInOut}, "+=1")
    .to(nav, 0.5, {opacity: 1, ease: Power2.easeInOut});