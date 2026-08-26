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
 
  // Appointment form
  const apptForm = document.getElementById('appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const confirmBox = document.getElementById('appt-confirm');
      const name = document.getElementById('appt-name');
      const summary = document.getElementById('appt-summary');
      if (summary) {
        const service = document.getElementById('appt-service');
        const date = document.getElementById('appt-date');
        const time = document.getElementById('appt-time');
        const serviceLabel = service && service.options[service.selectedIndex] ? service.options[service.selectedIndex].text : '';
        summary.textContent = `${serviceLabel} — ${date ? date.value : ''} at ${time ? time.value : ''}`;
      }
      if (confirmBox) {
        confirmBox.classList.add('show');
        confirmBox.setAttribute('tabindex', '-1');
        confirmBox.focus();
      }
      apptForm.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
      apptForm.querySelectorAll('input, select, textarea').forEach(el => el.setAttribute('disabled', 'true'));
    });
  }
 
  // Contact quick-message form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const confirmBox = document.getElementById('contact-confirm');
      if (confirmBox) {
        confirmBox.classList.add('show');
        confirmBox.setAttribute('tabindex', '-1');
        confirmBox.focus();
      }
      contactForm.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
      contactForm.querySelectorAll('input, textarea').forEach(el => el.setAttribute('disabled', 'true'));
    });
  }
 
  // Set min date on date inputs to today
  const dateInput = document.getElementById('appt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});