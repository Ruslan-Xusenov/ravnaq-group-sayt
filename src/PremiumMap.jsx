import { useRef } from "react";

export default function PremiumMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden w-full h-full min-h-[180px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.9269878990826!2d69.25207091198719!3d41.28120300245483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b004aff0e59%3A0x6e8f3c52d42b7bf3!2sPiramit%20Tower!5e1!3m2!1sru!2s!4v1788849142086!5m2!1sru!2s"
        style={{ width: "100%", height: "100%", minHeight: "180px", border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Piramit Tower — Ravnaq Group"
      />
    </div>
  );
}
