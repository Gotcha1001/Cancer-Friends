export default function Foundations() {
    const sections = [




        {
            title: "Resources",
            image:
                "https://media.gettyimages.com/id/1210710223/photo/two-people-in-the-office.jpg?s=612x612&w=0&k=20&c=Wwi4SA13iHgYUkAiktcDEUj2HCgtWq3DQB9cCP9lM8A=",
            links: [
                { href: "https://www.cancer.org/", text: "American Cancer Society" },
                {
                    href: "https://www.cancercare.org/helpinghand/",
                    text: "CancerCare Helping Hand",
                },
                {
                    href: "https://www.cancer.org/support-programs-and-services.html",
                    text: "American Cancer Society Support Programs",
                },
                {
                    href: "https://cansa.org.za/cansas-care-support/cansas-online-support-resources/",
                    text: "CANSA Online Support Resources",
                },
                {
                    href: "https://www.cancerresearch.org/cancer-patient-resource-websites",
                    text: "Cancer Research Institute - Patient Resources",
                },
                {
                    href: "https://www.cancer.org/cancer/caregivers.html",
                    text: "American Cancer Society - Caregivers",
                },
                {
                    href: "https://www.cancerresearchuk.org/about-cancer/coping/physically/diet-problems/resources-and-support",
                    text: "Cancer Research UK - Resources and Support",
                },
                { href: "https://www.eviq.org.au/", text: "eviQ" },
                {
                    href: "https://www.ohsu.edu/knight-cancer-institute/cancer-patient-and-family-resources",
                    text: "OHSU Knight Cancer Institute - Patient and Family Resources",
                },
                {
                    href: "https://www.nationalbreastcancer.org/about-breast-cancer/early-detection/breast-cancer-resources/",
                    text: "National Breast Cancer Foundation - Resources",
                },
                {
                    href: "https://www.nj.gov/health/ces/public/resources/",
                    text: "NJ Health - Cancer Resources",
                },
                {
                    href: "https://www.vdh.virginia.gov/cancer/resources/",
                    text: "Virginia Department of Health - Cancer Resources",
                },
                {
                    href: "https://medlineplus.gov/ency/article/002166.htm",
                    text: "MedlinePlus - Cancer Resources",
                },
                {
                    href: "https://www.health.ny.gov/diseases/cancer/resources/",
                    text: "NY Health - Cancer Resources",
                },
                {
                    href: "https://www.cancer.org.au/health-professionals/patient-resources",
                    text: "Cancer Council Australia - Patient Resources",
                },
                {
                    href: "https://canceralliance.org.za/cancer-in-sa/useful-cancer-resources/",
                    text: "Cancer Alliance - Useful Resources",
                },
                {
                    href: "https://www.nccn.org/patientresources/patient-resources",
                    text: "NCCN - Patient Resources",
                },
                {
                    href: "https://www.macmillan.org.uk/cancer-information-and-support/stories-and-media",
                    text: "Macmillan Cancer Support - Resources",
                },
            ],
        },
        {
            title: "Downloadable Resources Understanding Cancer",
            image:
                "https://media.gettyimages.com/id/1345282963/photo/education-and-light-bulb-concept.jpg?s=612x612&w=0&k=20&c=1-YYLwnZ97Ek3WBHoPOb1W-MHu5Zy4OTQemJnJ6a1a0=",
            links: [
                {
                    href: "https://www.cancer.org.au/cancer-information/downloadable-resources",
                    text: "Cancer Council Australia - Downloadable Resources",
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
