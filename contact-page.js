(() => {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  const fields = [...form.querySelectorAll("input, select, textarea")];
  const status = document.querySelector("#formStatus");
  const submit = form.querySelector(".submit-btn");
  const submitLabel = form.querySelector(".submit-label");
  const message = form.elements.message;
  const counter = document.querySelector("#charCount");
  const menu = document.querySelector("#mb");
  const header = document.querySelector("#hd");
  const messages = {
    valueMissing: "هذا الحقل مطلوب.",
    typeMismatch: "اكتب عنوان بريد إلكتروني صحيحاً.",
    tooShort: "أضف مزيداً من التفاصيل قبل الإرسال.",
    tooLong: "اختصر الرسالة إلى ١٠٠٠ حرف أو أقل.",
  };

  menu?.addEventListener("click", () => {
    menu.setAttribute("aria-expanded", String(header?.classList.contains("op") || false));
    menu.setAttribute("aria-label", header?.classList.contains("op") ? "إغلاق القائمة" : "فتح القائمة");
  });

  const fieldError = (field) => field.closest(".field")?.querySelector(".field-error");
  const getError = (field) => {
    const validity = field.validity;
    if (validity.valueMissing) return messages.valueMissing;
    if (validity.typeMismatch) return messages.typeMismatch;
    if (validity.tooShort) return messages.tooShort;
    if (validity.tooLong) return messages.tooLong;
    return "";
  };

  const validateField = (field) => {
    const error = getError(field);
    const wrapper = field.closest(".field");
    const output = fieldError(field);
    wrapper?.classList.toggle("invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (output) output.textContent = error;
    return !error;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
      if (field === message && counter) counter.textContent = String(message.value.length);
    });
    field.addEventListener("change", () => validateField(field));
  });

  message?.addEventListener("input", () => {
    if (message.value.length > 1000) message.value = message.value.slice(0, 1000);
    if (counter) counter.textContent = String(message.value.length);
  });

  const showStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status visible ${kind}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      showStatus("راجع الحقول المحددة، ثم حاول مرة أخرى.", "error");
      return;
    }

    const endpoint = form.dataset.endpoint.trim();
    if (!endpoint) {
      showStatus("لم تُرسل رسالتك بعد: خدمة استقبال الرسائل غير مهيأة حالياً. بياناتك ما زالت محفوظة في النموذج؛ يمكنك نسخها والعودة لاحقاً.", "info");
      status.focus();
      return;
    }

    let target;
    try {
      target = new URL(endpoint, window.location.href);
      if (target.origin !== window.location.origin || !["http:", "https:"].includes(target.protocol)) {
        showStatus("تعذر الإرسال: إعداد خدمة استقبال الرسائل غير صالح. لم يتم إرسال أي بيانات.", "error");
        return;
      }
    } catch {
      showStatus("تعذر الإرسال: إعداد خدمة استقبال الرسائل غير صالح. لم يتم إرسال أي بيانات.", "error");
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    submit.classList.add("is-loading");
    submit.setAttribute("aria-busy", "true");
    submitLabel.textContent = "جارٍ إرسال الاستفسار...";
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("service-error");
      form.reset();
      fields.forEach((field) => {
        field.closest(".field")?.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
        const output = fieldError(field);
        if (output) output.textContent = "";
      });
      if (counter) counter.textContent = "0";
      showStatus("تم إرسال استفسارك بنجاح. شكراً لتواصلك مع صحصح.", "success");
      status.focus();
    } catch {
      showStatus("لم نتمكن من إرسال رسالتك الآن. لم تُحذف بياناتك؛ حاول مرة أخرى لاحقاً.", "error");
      status.focus();
    } finally {
      submit.disabled = false;
      submit.classList.remove("is-loading");
      submit.removeAttribute("aria-busy");
      submitLabel.textContent = "إرسال الاستفسار";
    }
  });
})();
