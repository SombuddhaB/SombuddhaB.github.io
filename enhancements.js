/* ==========================================================
   WEBSITE VISUAL ENHANCEMENTS
   Independent of the existing publication search script
   ========================================================== */

(() => {
  "use strict";

  function initialiseEnhancements() {
    // Prevent duplicate initialization.
    if (document.documentElement.dataset.enhanced === "true") {
      return;
    }

    document.documentElement.dataset.enhanced = "true";

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const activeAnimations = new Set();

    /*
      Content remains visible at all times.
      Animations are applied only when supported and permitted.
    */
    function animateElement(element) {
      if (
        motionPreference.matches ||
        typeof element.animate !== "function"
      ) {
        return;
      }

      const animation = element.animate(
        [
          {
            opacity: 0.65,
            transform: "translateY(12px)"
          },
          {
            opacity: 1,
            transform: "translateY(0)"
          }
        ],
        {
          duration: 480,
          easing: "cubic-bezier(0.2, 0.7, 0.2, 1)"
        }
      );

      activeAnimations.add(animation);

      const removeAnimation = () => {
        activeAnimations.delete(animation);
      };

      animation.onfinish = removeAnimation;
      animation.oncancel = removeAnimation;
    }

    /*
      Reveal major content blocks once.
      Individual papers are deliberately not animated,
      avoiding conflicts with publication filtering.
    */
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              return;
            }

            animateElement(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0,
          rootMargin: "0px 0px -24px 0px"
        }
      );

      document.querySelectorAll(
        "main > h1, main > section, main > .search-panel"
      ).forEach(element => {
        observer.observe(element);
      });
    }

    // Stop active effects if reduced motion is enabled.
    const handleMotionChange = event => {
      if (!event.matches) {
        return;
      }

      activeAnimations.forEach(animation => {
        animation.cancel();
      });

      activeAnimations.clear();
    };

    if (typeof motionPreference.addEventListener === "function") {
      motionPreference.addEventListener(
        "change",
        handleMotionChange
      );
    }

    // Create an accessible back-to-top button.
    const backToTop = document.createElement("button");

    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.hidden = true;

    backToTop.setAttribute(
      "aria-label",
      "Back to top"
    );

    backToTop.title = "Back to top";

    backToTop.innerHTML = `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 19V5"></path>
        <path d="m5 12 7-7 7 7"></path>
      </svg>
    `;

    document.body.appendChild(backToTop);

    let scrollFramePending = false;

    function updateBackToTop() {
      /*
        Keep the button available while it has keyboard focus.
        This prevents focus from disappearing after activation.
      */
      const hasFocus = document.activeElement === backToTop;

      backToTop.hidden = window.scrollY < 400 && !hasFocus;
      scrollFramePending = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (scrollFramePending) {
          return;
        }

        scrollFramePending = true;
        window.requestAnimationFrame(updateBackToTop);
      },
      {
        passive: true
      }
    );

    backToTop.addEventListener("blur", updateBackToTop);

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: motionPreference.matches ? "auto" : "smooth"
      });
    });

    updateBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseEnhancements,
      {
        once: true
      }
    );
  } else {
    initialiseEnhancements();
  }
})();