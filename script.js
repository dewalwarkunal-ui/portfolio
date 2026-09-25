/* ============================================================
   KUNAL DEWALWAR — PORTFOLIO
   Phase 1 behaviour: running-header section locator, and the
   mobile index panel toggle. No scroll-triggered fade/slide
   effects — motion is reserved for direct user actions only.
   ============================================================ */

(function () {
  "use strict";

  /* ---- Index panel toggle ---- */
  var toggle = document.getElementById("indexToggle");
  var index = document.getElementById("recordIndex");

  if (toggle && index) {
    toggle.addEventListener("click", function () {
      var isOpen = index.getAttribute("data-open") === "true";
      index.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.textContent = isOpen ? "Index" : "Close";
    });

    /* Close the index after choosing a link */
    index.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        index.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Index";
      });
    });
  }

  /* ---- Running-header locator ----
     Updates the header label to the section currently in view,
     the way a document footer states which page you're on. */
  var locator = document.getElementById("locator");
  var sections = document.querySelectorAll("[data-locator]");

  if (locator && sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            locator.textContent = entry.target.getAttribute("data-locator");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();

/* ---- Testimonials: show more ---- */
(function () {
  "use strict";
  var toggle = document.getElementById("testimonialToggle");
  var list = document.getElementById("testimonialList");

  if (toggle && list) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      var extras = list.querySelectorAll(".testimonial--extra");
      extras.forEach(function (item) {
        item.hidden = isOpen;
      });
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.textContent = isOpen ? "Show more testimonials" : "Show fewer testimonials";
    });
  }
})();

/* ---- Contact form: basic client-side handling ----
   Formspree handles the actual submission; this just gives
   the person feedback without leaving the page. */
(function () {
  "use strict";
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var submitBtn = form.querySelector("button[type='submit']");
    var originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          form.innerHTML = "<p>Thank you — your message has been sent. I'll get back to you shortly.</p>";
        } else {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          alert("Something went wrong sending your message. Please try emailing directly instead.");
        }
      })
      .catch(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert("Something went wrong sending your message. Please try emailing directly instead.");
      });
  });
})();
