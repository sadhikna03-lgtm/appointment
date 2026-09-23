document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
    }));
  }
 
  // Generate randomized-but-stable waveform bars for any .waveform[data-bars]
  document.querySelectorAll('.waveform[data-bars]').forEach(w => {
    const count = parseInt(w.dataset.bars, 10) || 24;
    const min = parseInt(w.dataset.min, 10) || 10;
    const max = parseInt(w.dataset.max, 10) || 48;
    let frag = '';
    for (let i = 0; i < count; i++) {
      const h = Math.round(min + Math.abs(Math.sin(i * 1.3)) * (max - min));
      const delay = (i % 8) * 0.09;
      frag += `<span style="height:${h}px; animation-delay:${delay}s;"></span>`;
    }
    w.innerHTML = frag;
  });
 
  // Appointment form — sends directly to the Google Sheet via a Google Apps Script Web App.
  // IMPORTANT: replace the placeholder URL below with your own deployed Web App URL
  // (see the deployment instructions provided separately). Until that's done, this
  // form cannot actually deliver submissions anywhere.
  const APPOINTMENT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzWptWzHC4dIu87JB5PtTbapV5eNHIrnGdY0ueR0GLymxEbnBQOwe75k2y99SBReyv7/exec';

  const apptForm = document.getElementById('appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const confirmBox = document.getElementById('appt-confirm');
      const errorBox = document.getElementById('appt-error');
      const submitBtn = apptForm.querySelector('button[type="submit"]');

      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
      };

      const payload = {
        childFirstName: getVal('appt-child-first'),
        childLastName: getVal('appt-child-last'),
        gender: getVal('appt-gender'),
        age: getVal('appt-age'),
        contactName: getVal('appt-contact-name'),
        relationship: getVal('appt-relationship'),
        email: getVal('appt-email'),
        mobile: getVal('appt-mobile'),
        concerns: getVal('appt-concerns')
      };

      if (errorBox) errorBox.classList.remove('show');

      if (!APPOINTMENT_WEBAPP_URL || APPOINTMENT_WEBAPP_URL.indexOf('PASTE_YOUR') === 0) {
        if (errorBox) errorBox.classList.add('show');
        return;
      }

      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'Sending…';
      }

      fetch(APPOINTMENT_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          if (!response.ok) throw new Error('Send failed');
          return response.json();
        })
        .then(() => {
          const summary = document.getElementById('appt-summary');
          if (summary) {
            summary.textContent = `Thanks, ${payload.contactName || 'there'} — we've received the details for ${payload.childFirstName || 'your child'}.`;
          }
          if (confirmBox) {
            confirmBox.classList.add('show');
            confirmBox.setAttribute('tabindex', '-1');
            confirmBox.focus();
          }
          apptForm.querySelectorAll('input, select, textarea').forEach((el) => el.setAttribute('disabled', 'true'));
        })
        .catch(() => {
          if (errorBox) errorBox.classList.add('show');
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.textContent = 'Submit';
          }
        });
    });
  }
 
  // Contact quick-message form — sends directly to sadhikna03@gmail.com via FormSubmit
  // (FormSubmit automatically sets Reply-To to the "email" field below, so
  // replying to the notification email goes straight to the client.)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const confirmBox = document.getElementById('contact-confirm');
      const errorBox = document.getElementById('contact-error');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const nameField = document.getElementById('c-name');
      const emailField = document.getElementById('c-email');
      const topicField = document.getElementById('c-topic');
      const messageField = document.getElementById('c-message');

      if (errorBox) errorBox.classList.remove('show');
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'Sending…';
      }

      fetch('https://formsubmit.co/ajax/sadhikna03@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: nameField ? nameField.value : '',
          email: emailField ? emailField.value : '',
          topic: topicField ? topicField.value : '',
          message: messageField ? messageField.value : '',
          _subject: `New enquiry from ${nameField ? nameField.value : 'website visitor'} — Mr. Speechie website`
        })
      })
        .then((response) => {
          if (!response.ok) throw new Error('Send failed');
          return response.json();
        })
        .then(() => {
          if (confirmBox) {
            confirmBox.classList.add('show');
            confirmBox.setAttribute('tabindex', '-1');
            confirmBox.focus();
          }
          contactForm.querySelectorAll('input, select, textarea').forEach((el) => el.setAttribute('disabled', 'true'));
        })
        .catch(() => {
          if (errorBox) errorBox.classList.add('show');
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.textContent = 'Send message';
          }
        });
    });
  }
 
  // Set min date on date inputs to today
  const dateInput = document.getElementById('appt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
  // ---------- Resource admin generator (resources-admin.html) ----------
  // NOTE: this passcode is stored in plain text in this file and is visible
  // to anyone who views the page source. It is only a mild deterrent against
  // casual visitors, NOT real security. Do not rely on it to protect
  // anything sensitive, and don't reuse a password you care about here.
  const ADMIN_PASSCODE = 'mrspeechie2026';

  const adminUnlockBtn = document.getElementById('admin-unlock-btn');
  if (adminUnlockBtn) {
    adminUnlockBtn.addEventListener('click', () => {
      const input = document.getElementById('admin-passcode');
      const error = document.getElementById('admin-passcode-error');
      if (input && input.value === ADMIN_PASSCODE) {
        document.getElementById('admin-lock').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
      } else if (error) {
        error.style.display = 'block';
      }
    });
  }

  const genBtn = document.getElementById('gen-btn');
  if (genBtn) {
    genBtn.addEventListener('click', () => {
      const title = (document.getElementById('gen-title') || {}).value || 'Resource title';
      const audience = (document.getElementById('gen-audience') || {}).value || 'parents';
      const filetype = (document.getElementById('gen-filetype') || {}).value || 'pdf';
      const desc = (document.getElementById('gen-desc') || {}).value || 'Short description of the resource.';
      const filename = (document.getElementById('gen-filename') || {}).value || 'filename.pdf';

      const badgeClass = filetype === 'ppt' ? 'file-badge-ppt' : 'file-badge-pdf';
      const badgeLabel = filetype === 'ppt' ? 'PPT' : 'PDF';
      const folder = audience === 'professionals' ? 'professionals' : 'parents';

      const escapeHtml = (str) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const snippet = `<div class="card file-resource-card">
  <span class="file-badge ${badgeClass}">${badgeLabel}</span>
  <h3>${escapeHtml(title)}</h3>
  <p>${escapeHtml(desc)}</p>
  <a href="assets/resources/${folder}/${escapeHtml(filename)}" class="card-link" download>Download →</a>
</div>`;

      const output = document.getElementById('gen-output');
      const outputCard = document.getElementById('gen-output-card');
      if (output) output.value = snippet;
      if (outputCard) outputCard.style.display = 'block';
    });
  }

  const genCopyBtn = document.getElementById('gen-copy-btn');
  if (genCopyBtn) {
    genCopyBtn.addEventListener('click', () => {
      const output = document.getElementById('gen-output');
      const note = document.getElementById('gen-copied-note');
      if (!output) return;
      output.select();
      navigator.clipboard.writeText(output.value).then(() => {
        if (note) {
          note.style.display = 'block';
          setTimeout(() => { note.style.display = 'none'; }, 2000);
        }
      }).catch(() => {
        document.execCommand('copy');
      });
    });
  }
});