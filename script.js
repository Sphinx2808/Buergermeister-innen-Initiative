(() => {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const modals = new Map(Array.from(document.querySelectorAll('.video-modal')).map((modal) => [modal.id, modal]));
  const modalTriggers = document.querySelectorAll('[data-modal-open]');
  const modalCloseTargets = document.querySelectorAll('[data-modal-close]');
  const signatureForm = document.getElementById('custom-signature-form');
  const signatureConsent = document.getElementById('signature-consent');
  const signatureConsentValue = document.getElementById('jotform-consent-value');
  const signatureSubmitDate = document.getElementById('jotform-submit-date');
  const signatureHcaptchaVisible = document.getElementById('jotform-hcaptcha-visible');
  const consentBackendValue = 'Ich habe die Datenschutzerklärung zur Kenntniss genommen und ich willige ein, dass meine personenbezogenen Daten zum Zweck der Prüfung meiner Unterstützung verarbeitet werden. Ich bin außerdem damit einverstanden, dass nach erfolgreicher manueller Prüfung mein Name, meine Funktion, meine Kommune und meine Statement auf dieser Website veröffentlicht werden';

  const openModal = (modalId) => {
    const modal = modals.get(modalId);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.video-modal.open')) {
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(trigger.getAttribute('data-modal-open'));
    });
  });

  modalCloseTargets.forEach((target) => {
    target.addEventListener('click', () => {
      const modal = target.closest('.video-modal');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.video-modal.open').forEach((modal) => closeModal(modal));
    }
  });

  const syncConsentValue = () => {
    if (!signatureConsentValue) return;
    signatureConsentValue.value = signatureConsent && signatureConsent.checked ? consentBackendValue : '';
  };

  if (signatureConsent) {
    signatureConsent.addEventListener('change', syncConsentValue);
    syncConsentValue();
  }

  if (signatureForm) {
    signatureForm.addEventListener('submit', () => {
      if (signatureSubmitDate) {
        signatureSubmitDate.value = String(Date.now());
      }
      syncConsentValue();
    });
  }

  window.hcaptchaCallbackCustom = () => {
    if (signatureHcaptchaVisible) {
      signatureHcaptchaVisible.value = '1';
    }
  };

  window.hcaptchaExpiredCallbackCustom = () => {
    if (signatureHcaptchaVisible) {
      signatureHcaptchaVisible.value = '';
    }
  };

  const fixFaqText = (root) => {
    root.querySelectorAll('a[href="/faqs/"], a[href$="faqs/"], .page-hero .eyebrow, .page-hero h1').forEach((node) => {
      if (node.textContent && node.textContent.trim() === 'FAQS') {
        node.textContent = 'FAQs';
      }
    });

    if (document.title.includes('FAQS')) {
      document.title = document.title.replace(/FAQS/g, 'FAQs');
    }
  };

  fixFaqText(document);
})();
