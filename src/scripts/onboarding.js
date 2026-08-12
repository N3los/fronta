export function initOnboardingForm() {
  const form = document.getElementById('onboarding-form');
  if (!form) return;
  if (form.dataset.initialized === 'true') return;
  form.dataset.initialized = 'true';

  const steps = form.querySelectorAll('.form-step');
  const nextBtns = form.querySelectorAll('.next-step-btn');
  const prevBtns = form.querySelectorAll('.prev-step-btn');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  const currentUrlWrapper = form.querySelector('[data-current-url-wrapper]');
  const projectNatureInputs = form.querySelectorAll('input[name="project_nature"]');
  let currentStep = 0;

  const updateProgress = () => {
    const percentage = ((currentStep + 1) / steps.length) * 100;
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    if (progressLabel) {
      progressLabel.textContent = (form.dataset.progressTemplate || '')
        .replace('{current}', String(currentStep + 1))
        .replace('{total}', String(steps.length));
    }
  };

  const showStep = (index) => {
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });
    updateProgress();
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeFieldset = steps[currentStep];
      const inputs = activeFieldset.querySelectorAll('input[required]');
      let isValid = true;

      const radioGroups = new Set(Array.from(inputs).filter(i => i.type === 'radio').map(i => i.name));

      radioGroups.forEach(name => {
        if (!activeFieldset.querySelector(`input[name="${name}"]:checked`)) {
          isValid = false;
        }
      });

      if (!isValid) {
        alert(form.dataset.selectionError || '');
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  const updateCurrentUrlVisibility = () => {
    if (!currentUrlWrapper) return;
    const selectedNature = form.querySelector('input[name="project_nature"]:checked');
    currentUrlWrapper.hidden = selectedNature?.dataset.hasExisting !== 'true';
  };

  projectNatureInputs.forEach(input => {
    input.addEventListener('change', updateCurrentUrlVisibility);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const projectType = data.get('project_type') || form.dataset.emailDefaultSubject || '';
    const name = data.get('name') || '';
    const subject = `${form.dataset.emailSubjectPrefix || ''} — ${projectType}${name ? ` — ${name}` : ''}`;
    const labels = {
      project_type: form.dataset.emailLabelProjectType,
      project_nature: form.dataset.emailLabelContext,
      current_url: form.dataset.emailLabelCurrentUrl,
      timeline: form.dataset.emailLabelTimeline,
      budget: form.dataset.emailLabelBudget,
      name: form.dataset.emailLabelName,
      email: form.dataset.emailLabelEmail,
      company: form.dataset.emailLabelCompany,
      message: form.dataset.emailLabelDetails,
    };
    const body = Array.from(data.entries())
      .filter(([key]) => key !== 'name' && key !== 'email' && key !== 'company')
      .filter(([, value]) => String(value).trim())
      .map(([key, value]) => `${labels[key] || key}: ${value}`)
      .join('\n\n');
    const endpoint = form.dataset.formspreeEndpoint;
    const status = document.getElementById('form-status');
    const successPanel = document.getElementById('form-success');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!endpoint) return;

    const payload = new FormData();
    payload.set('_subject', subject);
    payload.set('name', String(data.get('name') || ''));
    payload.set('email', String(data.get('email') || ''));
    if (String(data.get('company') || '').trim()) {
      payload.set('company', String(data.get('company')));
    }
    payload.set(form.dataset.emailLabelSummary || 'Project inquiry', body);

    if (submitButton) submitButton.disabled = true;
    if (status) {
      status.hidden = false;
      status.dataset.state = 'sending';
      status.textContent = form.dataset.submitSending || '';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error(`Formspree request failed: ${response.status}`);

      form.reset();
      form.hidden = true;
      if (status) status.hidden = true;
      if (successPanel) {
        successPanel.hidden = false;
        successPanel.focus({ preventScroll: true });
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      if (status) {
        status.hidden = false;
        status.dataset.state = 'error';
        status.textContent = form.dataset.submitError || '';
      }
      console.error(error);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  updateProgress();
  updateCurrentUrlVisibility();
}
