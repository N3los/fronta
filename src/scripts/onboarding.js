export function initOnboardingForm() {
  const form = document.getElementById("onboarding-form");
  if (!form || form.dataset.initialized === "true") return;

  form.dataset.initialized = "true";

  const steps = Array.from(form.querySelectorAll(".form-step"));
  const progressFill = form.querySelector("#progress-fill");
  const progressLabel = form.querySelector("#progress-label");
  const currentUrlWrapper = form.querySelector("[data-current-url-wrapper]");
  const projectNatureInputs = form.querySelectorAll('input[name="project_nature"]');
  const successPanel = document.getElementById("form-success");
  const successTitle = document.getElementById("form-success-title");
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector("[data-submit-label]");
  const submitSpinner = form.querySelector(".form-submit-spinner");
  const status = form.querySelector("#form-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const idleSubmitLabel = submitLabel?.textContent ?? "";
  let currentStep = 0;
  let transitionTimer;

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const updateProgress = () => {
    const percentage = ((currentStep + 1) / steps.length) * 100;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressLabel) {
      progressLabel.textContent = (form.dataset.progressTemplate || "")
        .replace("{current}", String(currentStep + 1))
        .replace("{total}", String(steps.length));
    }
  };

  const requiredGroupsAreComplete = (step) => {
    const requiredInputs = Array.from(step.querySelectorAll("input[required], textarea[required]"));

    return requiredInputs.every((input) => {
      if (input.type === "radio") {
        return Boolean(step.querySelector(`input[name="${input.name}"]:checked`));
      }
      return Boolean(input.value.trim());
    });
  };

  const updateStepControls = (step) => {
    const nextButton = step.querySelector(".next-step-btn");
    if (nextButton) nextButton.disabled = !requiredGroupsAreComplete(step);

    const error = step.querySelector("[data-step-error]");
    if (error && requiredGroupsAreComplete(step)) error.hidden = true;
  };

  const focusCurrentHeading = () => {
    const heading = steps[currentStep]?.querySelector("[data-step-heading]");
    heading?.focus({ preventScroll: true });
  };

  const scrollToFormStart = () => {
    form.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const showStep = (index, { direction = "forward", moveFocus = true } = {}) => {
    if (index < 0 || index >= steps.length || index === currentStep) return;

    const previousStep = steps[currentStep];
    const nextStep = steps[index];
    window.clearTimeout(transitionTimer);

    previousStep.classList.remove("is-active");
    if (direction === "back") previousStep.classList.add("is-leaving-back");

    nextStep.hidden = false;
    if (direction === "back") nextStep.classList.add("is-entering-back");

    currentStep = index;
    updateProgress();
    updateStepControls(nextStep);
    scrollToFormStart();

    window.requestAnimationFrame(() => {
      nextStep.classList.add("is-active");
      nextStep.classList.remove("is-entering-back");
    });

    transitionTimer = window.setTimeout(() => {
      previousStep.hidden = true;
      previousStep.classList.remove("is-leaving-back");
      if (moveFocus) focusCurrentHeading();
    }, reducedMotion.matches ? 1 : 230);
  };

  steps.forEach((step) => {
    updateStepControls(step);

    step.addEventListener("change", () => updateStepControls(step));
    step.addEventListener("input", () => updateStepControls(step));

    step.querySelector(".next-step-btn")?.addEventListener("click", () => {
      if (!requiredGroupsAreComplete(step)) {
        const error = step.querySelector("[data-step-error]");
        if (error) {
          error.textContent = form.dataset.selectionError || "";
          error.hidden = false;
        }
        return;
      }

      const nextIndex = currentStep + 1;
      const stepUrl = `${window.location.pathname}${window.location.search}#step-${nextIndex + 1}`;
      window.history.pushState({ ...window.history.state, projectStep: nextIndex }, "", stepUrl);
      showStep(nextIndex);
    });

    step.querySelector(".prev-step-btn")?.addEventListener("click", () => {
      if (currentStep === 0) return;

      window.history.back();
    });
  });

  const updateCurrentUrlVisibility = () => {
    if (!currentUrlWrapper) return;
    const selectedNature = form.querySelector('input[name="project_nature"]:checked');
    currentUrlWrapper.hidden = selectedNature?.dataset.hasExisting !== "true";
  };

  projectNatureInputs.forEach((input) => input.addEventListener("change", updateCurrentUrlVisibility));

  const handlePopState = (event) => {
    const hashStep = window.location.hash.match(/^#step-(\d+)$/)?.[1];
    const step = hashStep ? Number(hashStep) - 1 : 0;
    if (step < 0 || step >= steps.length) return;
    showStep(step, { direction: step < currentStep ? "back" : "forward" });
  };

  if (window.location.hash.startsWith("#step-")) {
    window.history.replaceState(
      { ...window.history.state, projectStep: 0 },
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }
  window.addEventListener("popstate", handlePopState);
  document.addEventListener(
    "astro:before-swap",
    () => window.removeEventListener("popstate", handlePopState),
    { once: true },
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const endpoint = form.dataset.formspreeEndpoint;
    if (!endpoint || form.getAttribute("aria-busy") === "true") return;

    const data = new FormData(form);
    const projectType = data.get("project_type") || form.dataset.emailDefaultSubject || "";
    const name = data.get("name") || "";
    const subject = `${form.dataset.emailSubjectPrefix || ""} — ${projectType}${name ? ` — ${name}` : ""}`;
    const labels = {
      project_type: form.dataset.emailLabelProjectType,
      project_nature: form.dataset.emailLabelContext,
      current_url: form.dataset.emailLabelCurrentUrl,
      timeline: form.dataset.emailLabelTimeline,
      budget: form.dataset.emailLabelBudget,
      message: form.dataset.emailLabelDetails,
    };
    const body = Array.from(data.entries())
      .filter(([key]) => !["name", "email", "company"].includes(key))
      .filter(([, value]) => String(value).trim())
      .map(([key, value]) => `${labels[key] || key}: ${value}`)
      .join("\n\n");
    const payload = new FormData();

    payload.set("_subject", subject);
    payload.set("name", String(data.get("name") || ""));
    payload.set("email", String(data.get("email") || ""));
    if (String(data.get("company") || "").trim()) {
      payload.set("company", String(data.get("company")));
    }
    payload.set(form.dataset.emailLabelSummary || "Project inquiry", body);

    form.setAttribute("aria-busy", "true");
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = form.dataset.submitSending || idleSubmitLabel;
    if (submitSpinner) submitSpinner.hidden = false;
    if (status) {
      status.hidden = false;
      status.dataset.state = "sending";
      status.textContent = form.dataset.submitSending || "";
    }

    const startedAt = performance.now();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Formspree request failed: ${response.status}`);

      const remainingFeedbackTime = Math.max(0, 550 - (performance.now() - startedAt));
      await wait(remainingFeedbackTime);

      if (status) status.hidden = true;
      form.classList.add("is-leaving");
      if (successPanel) {
        successPanel.hidden = false;
        window.requestAnimationFrame(() => successPanel.classList.add("is-active"));
      }

      scrollToFormStart();

      await wait(reducedMotion.matches ? 1 : 260);
      form.hidden = true;
      form.reset();
      successTitle?.focus({ preventScroll: true });
      window.history.replaceState(
        { ...window.history.state, projectStep: "success" },
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    } catch (error) {
      if (status) {
        status.hidden = false;
        status.dataset.state = "error";
        status.textContent = form.dataset.submitError || "";
      }
      console.error(error);
    } finally {
      form.setAttribute("aria-busy", "false");
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = idleSubmitLabel;
      if (submitSpinner) submitSpinner.hidden = true;
    }
  });

  updateProgress();
  updateCurrentUrlVisibility();
}
