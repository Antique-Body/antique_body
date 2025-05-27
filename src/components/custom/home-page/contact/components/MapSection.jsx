export function MapSection() {
  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden h-96 border border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF9A00]/5 mix-blend-overlay pointer-events-none z-10"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.2681149157487!2d23.724059575847786!3d37.97118677193367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1f067043f1%3A0x18baa02380f7fa2f!2sAcropolis%20of%20Athens!5e0!3m2!1sen!2suk!4v1684931212357!5m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
