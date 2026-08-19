// ============================================
// LA TRIBU — WhatsApp Integration
// ============================================

function generateWhatsAppLink(productName, price) {
  var number = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.whatsapp_number : '5491123456789';
  var message = 'Hola, quiero pedir ' + productName + '.';
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
}

function sendWhatsApp(productName, price) {
  var link = generateWhatsAppLink(productName, price);
  window.open(link, '_blank', 'noopener');
}
