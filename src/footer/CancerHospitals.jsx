export default function Foundations() {
    const sections = [



        {
            title: "Children Cancer Hospitals",
            image:
                "https://media.gettyimages.com/id/1296945046/photo/i-beat-cancer.jpg?s=612x612&w=0&k=20&c=si_zqwOq3cW5PGpAvejIkabjws-nuiLnuJvLfEAu284=",
            links: [
                {
                    href: "https://www.stjude.org/",
                    text: "St. Jude Children's Research Hospital",
                },
            ],
        },

        {
            title: "Cancer Hospitals",
            image:
                "https://media.gettyimages.com/id/1423758523/photo/oncologist-discussing-medications-with-a-senior-patient.jpg?s=612x612&w=0&k=20&c=ltklVfFtoIXOXSeNN5COXQAgHM4O5qOCslEW3WSwQio=",
            links: [
                {
                    href: "https://www.netcare.co.za/Cancer-Care",
                    text: "Netcare Cancer Care",
                },
                {
                    href: "https://cansa.org.za/cansa-care-centres-contact-details/",
                    text: "CANSA Care Centres",
                },
                {
                    href: "https://www.cancer.gov/research/infrastructure/cancer-centers/find",
                    text: "National Cancer Institute - Cancer Centers",
                },
                {
                    href: "https://www.mdanderson.org/",
                    text: "MD Anderson Cancer Center",
                },
                { href: "https://www.cityofhope.org/", text: "City of Hope" },
                {
                    href: "https://www.mayoclinic.org/departments-centers/mayo-clinic-cancer-center",
                    text: "Mayo Clinic Cancer Center",
                },
                { href: "https://cancercare.co.za/", text: "Cancer Care South Africa" },
            ],
        },
        {
            title: "10 Best Cancer Hospitals",
            image:
                "https://media.gettyimages.com/id/1370321341/photo/radiographer-helping-patient-in-ct-scanner.jpg?s=612x612&w=0&k=20&c=s8WCR35CUa31Trb546dk2QO5QWwMAxKqhNLp98L0Xyo=",
            links: [
                {
                    href: "https://www.asbestos.com/treatment/cancer-centers/high-tech-centers/",
                    text: "Asbestos.com - 10 Best Cancer Hospitals",
                },
            ],
        },
        {
            title: "Choosing a Cancer Hospital",
            image:
                "https://media.gettyimages.com/id/1347591866/photo/woman-walking-on-branching-way-leading-to-multiple-doors-choice-and-decision.jpg?s=612x612&w=0&k=20&c=ymGYB4nVKwGztVNy9M5fdfRGCe8TIG-sT3wjCtfHSHQ=",
            links: [
                {
                    href: "https://www.cancer.org/cancer/managing-cancer/finding-care/where-to-find-cancer-care/choosing-a-cancer-center-or-hospital.html",
                    text: "American Cancer Society - Choosing a Cancer Hospital",
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
