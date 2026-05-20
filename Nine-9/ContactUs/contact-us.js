const CONTACT_CONFIG = {
  toEmail: "trade@jimmore.com.tw",
  subject: "Nine9 Contact Us Request"
};

const CONTACT_FIELDS = [
  { id: "company", label: "Company" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "country", label: "Country" },
  { id: "tel", label: "Tel" },
  { id: "productInterest", label: "Product interest" },
  { id: "comments", label: "Comments" }
];

function getFieldValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function buildContactMailto() {
  const bodyLines = CONTACT_FIELDS.flatMap(field => [
    `${field.label}:`,
    getFieldValue(field.id),
    ""
  ]);

  const query = new URLSearchParams({
    subject: CONTACT_CONFIG.subject,
    body: bodyLines.join("\r\n")
  });

  return `mailto:${CONTACT_CONFIG.toEmail}?${query.toString()}`;
}

function bindContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    window.location.href = buildContactMailto();
  });
}

document.addEventListener("DOMContentLoaded", bindContactForm);
