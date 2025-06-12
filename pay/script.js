// Loading animation + smooth fade-in
document.addEventListener('DOMContentLoaded', () => {
  // Show loading animation for at least 1 second (even if page loads faster)
  setTimeout(() => {
    const loadingElement = document.getElementById('loading');
    const container = document.querySelector('.container');
    
    if (loadingElement && container) {
      // Fade out loading animation
      loadingElement.style.opacity = '0';
      
      // After fade out completes, hide it and show main content
      setTimeout(() => {
        loadingElement.style.display = 'none';
        container.style.display = 'block';
        
        // Trigger reflow to ensure CSS transition works
        void container.offsetWidth;
        container.style.opacity = '1';
      }, 300); // Match this with your CSS transition duration
    }
  }, 1000);
});

// Tab switching with smooth transitions
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.content');
  const paymentMethodSelect = document.getElementById('paymentMethod');

  if (!tabButtons.length || !contents.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach((b) => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');

      // Hide all contents with fade out
      contents.forEach((content) => {
        content.classList.remove('active', 'fade-in');
      });

      // Show target content with fade in
      const target = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(target);
      
      if (targetContent) {
        targetContent.classList.add('active');
        
        // Small delay to allow display change before fade in
        setTimeout(() => {
          targetContent.classList.add('fade-in');
        }, 50);

        // Update payment method dropdown if exists
        if (paymentMethodSelect) {
          switch(target) {
            case 'qris':
              paymentMethodSelect.value = 'QRIS';
              break;
            case 'ewallet':
              paymentMethodSelect.value = 'E-WALLET';
              break;
            case 'bank':
              paymentMethodSelect.value = 'BANK TRANSFER';
              break;
          }
        }
      }
    });
  });
}

// Enhanced clipboard functionality
function setupClipboard() {
  window.copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy', true);
    }
  };
}

// Improved toast notification system
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast show'; // Reset classes
  if (isError) toast.classList.add('error');

  // Clear any existing timeout
  if (toast.timeoutId) clearTimeout(toast.timeoutId);

  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// QR modal with better accessibility
function setupQRModal() {
  const qrImg = document.getElementById('qrImg');
  const qrModal = document.getElementById('qrModal');
  const qrModalImg = qrModal?.querySelector('img');

  if (!qrImg || !qrModal || !qrModalImg) return;

  qrImg.addEventListener('click', () => {
    qrModalImg.src = qrImg.src;
    qrModal.classList.add('active');
    
    // Small delay for transition
    setTimeout(() => {
      qrModalImg.classList.add('zoom-in');
    }, 10);
  });

  qrModal.addEventListener('click', () => {
    qrModalImg.classList.remove('zoom-in');
    
    // Wait for zoom-out animation before hiding
    setTimeout(() => {
      qrModal.classList.remove('active');
    }, 300);
  });

  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal.classList.contains('active')) {
      qrModal.click();
    }
  });
}

// Scroll reveal with throttling
function setupScrollReveal() {
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  if (!scrollElements.length) return;

  let isScrolling = false;

  function checkElements() {
    const triggerBottom = window.innerHeight * 0.8;
    scrollElements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('visible');
      }
    });
  }

  // Throttled scroll event
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        checkElements();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Initial check
  checkElements();
}

// Form submission with validation
function setupForm() {
  const form = document.getElementById('confirmPayment');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      itemName: form.querySelector('#itemName').value.trim(),
      amount: form.querySelector('#amount').value.trim(),
      paymentMethod: form.querySelector('#paymentMethod').value,
      proofFile: form.querySelector('#proof')?.files[0] // Changed from #paymentProof to #proof to match HTML
    };

    // Validation
    if (!formData.itemName || !formData.amount || !formData.paymentMethod) {
      showToast('Please fill all required fields', true);
      return;
    }

    if (isNaN(formData.amount) {
      showToast('Please enter a valid amount', true);
      return;
    }

    // Prepare WhatsApp message
    const proofText = formData.proofFile 
      ? `Bukti transfer: ${formData.proofFile.name}`
      : 'Tidak ada bukti transfer';

    const waMessage = 
      `*Konfirmasi Pembayaran Skyy Hosting*\n\n` +
      `🔹 Nama Barang: ${formData.itemName}\n` +
      `🔹 Nominal: Rp ${Number(formData.amount).toLocaleString('id-ID')}\n` +
      `🔹 Metode Pembayaran: ${formData.paymentMethod}\n` +
      `🔹 ${proofText}\n\n` +
      `_This message was sent from Skyy Hosting Payment Page_`;

    const waNumber = '628978823447';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
    
    // Open in new tab
    window.open(waUrl, '_blank');
    
    // Show success message
    showToast('Redirecting to WhatsApp...');
    
    // Optional: Reset form
    // form.reset();
  });
}

// Initialize all functionality
function init() {
  setupTabs();
  setupClipboard();
  setupQRModal();
  setupScrollReveal();
  setupForm();
}

// Start the application
init();}
                                                    
