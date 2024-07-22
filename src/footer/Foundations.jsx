export default function Foundations() {
  const sections = [
    {
      title: "Cancer Foundations",
      image:
        "https://images.pexels.com/photos/6984597/pexels-photo-6984597.jpeg?auto=compress&cs=tinysrgb&w=600",
      links: [
        { href: "https://cansa.org.za/", text: "CANSA" },
        {
          href: "https://foundation.petermac.org/",
          text: "Peter Mac Foundation",
        },
        {
          href: "https://preventcancer.org/",
          text: "Prevent Cancer Foundation",
        },
        { href: "https://choc.org.za/", text: "CHOC" },
        {
          href: "https://deainfo.nci.nih.gov/pd/index.htm",
          text: "NCI PD Info",
        },
        { href: "https://www.komen.org/", text: "Susan G. Komen" },
        {
          href: "https://www.nationalbreastcancer.org/",
          text: "National Breast Cancer Foundation",
        },
        {
          href: "https://africacancerfoundation.org/",
          text: "Africa Cancer Foundation",
        },
        {
          href: "https://www.lungcancerresearchfoundation.org/",
          text: "Lung Cancer Research Foundation",
        },
        {
          href: "https://foundationforwomenscancer.org/",
          text: "Foundation for Women's Cancer",
        },
        {
          href: "https://www.internationalcancerfoundation.org/",
          text: "International Cancer Foundation",
        },
        { href: "https://www.skincancer.org/", text: "Skin Cancer Foundation" },
        { href: "https://www.conquer.org/", text: "Conquer Cancer" },
        {
          href: "https://thepmcf.ca/",
          text: "Princess Margaret Cancer Foundation",
        },
        {
          href: "https://www.alexslemonade.org/",
          text: "Alex's Lemonade Stand Foundation",
        },
      ],
    },

  ];

  return (
    <div className="foundations">
      {sections.map((section, index) => (
        <div key={index} className="section">
          <h2 className="section-title zoom rounded-md text-center font-serif text-7xl text-yellow-300">
            {section.title}
          </h2>
          <div className="section-content">
            <img
              className="section-image"
              src={section.image}
              alt={section.title}
            />
            <ul className="section-links text-cyan-500">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex} className="mb-2">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md p-2 transition-colors hover:bg-black hover:text-white"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
