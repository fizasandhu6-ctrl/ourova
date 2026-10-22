/* =====================================================
   OUROVA
   MAIN JAVASCRIPT
===================================================== */

/* =========================================
   MOBILE NAV TOGGLE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    const navbar = document.querySelector(".navbar");

    if (!navToggle || !navLinks || !navbar) {
        return;
    }

    navToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("is-open");

        navToggle.classList.toggle("is-open", isOpen);
        navbar.classList.toggle("menu-open", isOpen);

        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("is-open");
            navToggle.classList.remove("is-open");
            navbar.classList.remove("menu-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

});




document.addEventListener("DOMContentLoaded", () => {

    console.log("OUROVA system initialized.");

    const narrative = document.querySelector(".narrative");
    const ring = document.querySelector(".ouro-draw");
    const halo = document.querySelector(".ouro-halo");
    const head = document.querySelector(".ouro-head");
    const flash = document.querySelector(".ouro-flash");
    const nodes = document.querySelectorAll(".ouro-node");

    if (!narrative || !ring || !halo || !head || typeof gsap === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const cx = 200;
    const cy = 200;
    const r = 150;
    const circumference = 2 * Math.PI * r;

    
    [ring, halo].forEach((el) => {
        el.style.strokeDasharray = String(circumference);
        el.style.strokeDashoffset = String(circumference);
    });

    function pointOnRing(fraction) {
        const angleRad = -Math.PI / 2 + fraction * Math.PI * 2;
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad),
            angleDeg: (angleRad * 180) / Math.PI
        };
    }

  
    nodes.forEach((node) => {
        const frac = parseFloat(node.dataset.frac);
        const pos = pointOnRing(frac);
        const w = parseFloat(node.getAttribute("width"));
        const h = parseFloat(node.getAttribute("height"));

        node.setAttribute("x", String(pos.x - w / 2));
        node.setAttribute("y", String(pos.y - h / 2));
    });

    let wasComplete = false;

    ScrollTrigger.create({

        trigger: narrative,

        start: "top top",
        end: "bottom bottom",

        scrub: 0.4,

        onUpdate: (self) => {

            const progress = self.progress;
            const dashOffset = String(circumference * (1 - progress));

            ring.style.strokeDashoffset = dashOffset;
            halo.style.strokeDashoffset = dashOffset;

            const tip = pointOnRing(progress);
            head.setAttribute(
                "transform",
                `translate(${tip.x} ${tip.y}) rotate(${tip.angleDeg + 90})`
            );
            head.style.opacity = progress > 0.01 ? "1" : "0";

            nodes.forEach((node) => {
                const frac = parseFloat(node.dataset.frac);
                node.classList.toggle("is-active", progress >= frac - 0.004);
            });

            const isComplete = progress >= 0.995;
            if (isComplete && !wasComplete && flash) {
                flash.classList.remove("is-complete");
                void flash.offsetWidth;
                flash.classList.add("is-complete");
            }
            wasComplete = isComplete;

        }

    });

});





/* =========================================
   OUROVA — INTERACTIVE NETWORK
========================================= */

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

const servicesSection = document.querySelector(".services");


/* =========================================
   CANVAS
========================================= */

let width = 0;
let height = 0;


/* =========================================
   MOUSE
========================================= */

const mouse = {

    x: -1000,
    y: -1000,

    targetX: -1000,
    targetY: -1000,

    active: false

};


/* =========================================
   SETTINGS
========================================= */

const settings = {

    
    nodeCount: 65,

   
    connectionDistance: 145,

    
    mouseRadius: 220,

    
    maxMouseConnections: 6,

    
    nodeSize: 2,

    
    lineWidth: 0.7,

    
    movementSpeed: 0.22

};


let nodes = [];


/* =========================================
   RESIZE
========================================= */

function resizeCanvas() {

    const rect =
        servicesSection.getBoundingClientRect();

    width = rect.width;
    height = rect.height;


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;


    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    createNodes();
}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   CREATE NETWORK NODES
========================================= */

function createNodes() {

    nodes = [];


    for (
        let i = 0;
        i < settings.nodeCount;
        i++
    ) {

        

        const x =
            width * 0.35 +
            Math.random() *
            width * 0.75;


        const y =
            Math.random() *
            height;


        nodes.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5)
                * settings.movementSpeed,

            vy:
                (Math.random() - 0.5)
                * settings.movementSpeed,


            size:
                settings.nodeSize +
                Math.random() * 1.5,


            pulse:
                Math.random() *
                Math.PI *
                2

        });

    }

}


/* =========================================
   MOUSE MOVE
========================================= */

servicesSection.addEventListener(
    "mousemove",
    (event) => {

        const rect =
            servicesSection.getBoundingClientRect();


        mouse.targetX =
            event.clientX -
            rect.left;


        mouse.targetY =
            event.clientY -
            rect.top;


        mouse.active = true;

    }
);


/* =========================================
   MOUSE LEAVE
========================================= */

servicesSection.addEventListener(
    "mouseleave",
    () => {

        mouse.active = false;

        mouse.targetX = -1000;
        mouse.targetY = -1000;

    }
);


/* =========================================
   SMOOTH MOUSE
========================================= */

function updateMouse() {

    mouse.x +=
        (mouse.targetX - mouse.x)
        * 0.12;


    mouse.y +=
        (mouse.targetY - mouse.y)
        * 0.12;

}


/* =========================================
   UPDATE NODES
========================================= */

function updateNodes() {

    nodes.forEach(node => {

        node.x += node.vx;
        node.y += node.vy;

        node.pulse += 0.025;


        

        if (
            node.x < width * 0.25 ||
            node.x > width + 50
        ) {

            node.vx *= -1;

        }


        if (
            node.y < -30 ||
            node.y > height + 30
        ) {

            node.vy *= -1;

        }

    });

}


/* =========================================
   DISTANCE
========================================= */

function distanceBetween(a, b) {

    const dx =
        a.x - b.x;

    const dy =
        a.y - b.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =========================================
   MOUSE DISTANCE
========================================= */

function mouseDistance(node) {

    const dx =
        node.x - mouse.x;

    const dy =
        node.y - mouse.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =========================================
   NODE INTERACTION
========================================= */

function getNodeInteraction(node) {

    if (!mouse.active) {

        return 0;

    }


    const distance =
        mouseDistance(node);


    if (
        distance >
        settings.mouseRadius
    ) {

        return 0;

    }


    return (
        1 -
        distance /
        settings.mouseRadius
    );

}


/* =========================================
   DRAW NODE
========================================= */

function drawNode(node) {

    const interaction =
        getNodeInteraction(node);


    const pulse =
        Math.sin(node.pulse)
        * 0.5
        + 0.5;


    const radius =
        node.size
        + pulse * 0.8
        + interaction * 2.8;


    

    const glowRadius =
        radius *
        (
            4 +
            interaction * 7
        );


    const gradient =
        ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            glowRadius
        );


    gradient.addColorStop(
        0,
        `rgba(
            212,
            168,
            88,
            ${0.25 + interaction * 0.55}
        )`
    );


    gradient.addColorStop(
        1,
        "rgba(212,168,88,0)"
    );


    ctx.beginPath();

    ctx.arc(
        node.x,
        node.y,
        glowRadius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        gradient;

    ctx.fill();


   

    ctx.beginPath();

    ctx.arc(
        node.x,
        node.y,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#d4a858";


    ctx.shadowBlur =
        7 +
        interaction * 20;


    ctx.shadowColor =
        "#d4a858";


    ctx.fill();


    ctx.shadowBlur = 0;

}


/* =========================================
   DRAW PERMANENT CONNECTION
========================================= */

function drawPermanentConnection(
    a,
    b,
    distance
) {

    const opacity =
        1 -
        distance /
        settings.connectionDistance;




    const distanceToMouseA =
        mouseDistance(a);


    const distanceToMouseB =
        mouseDistance(b);


    const closest =
        Math.min(
            distanceToMouseA,
            distanceToMouseB
        );


    let interaction = 0;


    if (
        mouse.active &&
        closest <
        settings.mouseRadius
    ) {

        interaction =
            1 -
            closest /
            settings.mouseRadius;

    }


    const finalOpacity =
        opacity *
        (
            0.18 +
            interaction * 0.9
        );


    ctx.beginPath();

    ctx.moveTo(
        a.x,
        a.y
    );

    ctx.lineTo(
        b.x,
        b.y
    );


    ctx.strokeStyle =
        `rgba(
            212,
            168,
            88,
            ${Math.min(
                finalOpacity,
                0.75
            )}
        )`;


    ctx.lineWidth =
        settings.lineWidth
        +
        interaction * 1.2;


    ctx.shadowBlur =
        interaction * 7;


    ctx.shadowColor =
        "#d4a858";


    ctx.stroke();


    ctx.shadowBlur = 0;

}


/* =========================================
   FIND CLOSEST MOUSE NODES
========================================= */

function getMouseConnections() {

    if (!mouse.active) {

        return [];

    }


    const nearbyNodes =
        nodes
            .map(node => ({

                node: node,

                distance:
                    mouseDistance(node)

            }))


            .filter(item =>

                item.distance <
                settings.mouseRadius

            )


            .sort(
                (a, b) =>
                    a.distance -
                    b.distance
            )


            .slice(
                0,
                settings.maxMouseConnections
            );


    return nearbyNodes;

}


/* =========================================
   DRAW MOUSE CONNECTIONS
========================================= */

function drawMouseConnections() {

    if (!mouse.active) {

        return;

    }


    const connections =
        getMouseConnections();


    connections.forEach(
        ({ node, distance }) => {

            const strength =
                1 -
                distance /
                settings.mouseRadius;


            

            ctx.beginPath();

            ctx.moveTo(
                mouse.x,
                mouse.y
            );

            ctx.lineTo(
                node.x,
                node.y
            );


            ctx.strokeStyle =
                `rgba(
                    212,
                    168,
                    88,
                    ${0.15 + strength * 0.75}
                )`;


            ctx.lineWidth =
                0.7 +
                strength * 1.6;


            ctx.shadowBlur =
                strength * 10;


            ctx.shadowColor =
                "#d4a858";


            ctx.stroke();


            ctx.shadowBlur = 0;

        }
    );

}


/* =========================================
   MOUSE NODE
========================================= */

function drawMouseNode() {

    if (!mouse.active) {

        return;

    }


    

    const glow =
        ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            35
        );


    glow.addColorStop(
        0,
        "rgba(212,168,88,0.55)"
    );


    glow.addColorStop(
        0.35,
        "rgba(212,168,88,0.15)"
    );


    glow.addColorStop(
        1,
        "rgba(212,168,88,0)"
    );


    ctx.beginPath();

    ctx.arc(
        mouse.x,
        mouse.y,
        35,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        glow;

    ctx.fill();


    

    ctx.beginPath();

    ctx.arc(
        mouse.x,
        mouse.y,
        3.5,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#f1c66f";


    ctx.shadowBlur =
        20;


    ctx.shadowColor =
        "#d4a858";


    ctx.fill();


    ctx.shadowBlur = 0;

}


/* =========================================
   ANIMATION
========================================= */

function animate() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );




    const rect =
        servicesSection.getBoundingClientRect();


    const visible =
        rect.top <
        window.innerHeight &&
        rect.bottom > 0;


    if (visible) {

        updateMouse();

        updateNodes();


        

        for (
            let i = 0;
            i < nodes.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < nodes.length;
                j++
            ) {

                const a =
                    nodes[i];

                const b =
                    nodes[j];


                const distance =
                    distanceBetween(a, b);


                if (
                    distance <
                    settings.connectionDistance
                ) {

                    drawPermanentConnection(
                        a,
                        b,
                        distance
                    );

                }

            }

        }


        
        drawMouseConnections();


       

        nodes.forEach(
            drawNode
        );


        

        drawMouseNode();

    }


    requestAnimationFrame(
        animate
    );

}


/* =========================================
   START
========================================= */

resizeCanvas();

animate();


/* =========================================
   AI AGENT CHAT ANIMATION
========================================= */

const aiSection = document.querySelector(".ai-section");

const customerMessage =
    document.querySelector(".chat-message.customer");

const agentMessage =
    document.querySelector(".chat-message.agent");

const agentStatus =
    document.querySelector(".agent-active");


if (
    aiSection &&
    customerMessage &&
    agentMessage &&
    agentStatus
) {

    const chatTimeline = gsap.timeline({
        paused: true
    });


    /* =====================================
       CUSTOMER MESSAGE
    ===================================== */

    chatTimeline.to(
        customerMessage,
        {
            opacity: 1,
            y: 0,
            scale: 1,

            duration: 0.8,

            ease: "power3.out"
        }
    );


    /* =====================================
       SMALL PAUSE
    ===================================== */

    chatTimeline.to(
        {},
        {
            duration: 0.7
        }
    );


    chatTimeline.to(
    ".typing-indicator",
    {
        opacity: 1,
        duration: 0.3
    }
);

chatTimeline.to(
    {},
    {
        duration: 1
    }
);

chatTimeline.to(
    ".typing-indicator",
    {
        opacity: 0,
        duration: 0.25
    }
);

chatTimeline.to(
    agentMessage,
    {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out"
    }
);




    /* =====================================
       AI STATUS
    ===================================== */

    chatTimeline.to(
        agentStatus,
        {
            opacity: 1,
            y: 0,

            duration: 0.6,

            ease: "power2.out"
        }
    );


    /* =====================================
       SCROLL TRIGGER
    ===================================== */

    ScrollTrigger.create({

        trigger: aiSection,

        start: "top 70%",

        once: true,

        onEnter: () => {

            chatTimeline.play();

        }

    });

}


/* =========================================
   SERVICE ITEM → CONTACT FORM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const serviceItems = document.querySelectorAll(".service-item");
    const serviceSelect = document.getElementById("service-select");
    const contactSection = document.getElementById("contact");

    if (!serviceItems.length || !serviceSelect || !contactSection) {
        return;
    }

    serviceItems.forEach((item) => {

        item.addEventListener("click", () => {

            const service = item.dataset.service;

            if (service) {
                serviceSelect.value = service;
            }

            contactSection.scrollIntoView({ behavior: "smooth" });

        });

    });

});



/* =========================================
   OPEN CONTACT FORM ON CLICK
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const openFormBtn = document.getElementById("open-contact-form");
    const form = document.getElementById("contact-form");

    if (!openFormBtn || !form) {
        return;
    }

    openFormBtn.addEventListener("click", () => {

        form.classList.add("is-open");
        openFormBtn.style.display = "none";

        form.scrollIntoView({ behavior: "smooth", block: "start" });

    });

});


