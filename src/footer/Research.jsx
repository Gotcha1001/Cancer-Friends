export default function Foundations() {
    const sections = [



        {
            title: "Research",
            image:
                "https://media.gettyimages.com/id/1319032445/photo/female-scientist-testing-medical-marijuana-charts-and-models-on-computer-screens-modern.jpg?s=612x612&w=0&k=20&c=WqN5UevDKE-gfbsXFSzDH7bEcSfbT_cx9-tbDi6Bd64=",
            links: [
                {
                    href: "https://www.cancerresearchfdn.org/",
                    text: "Cancer Research Foundation",
                },
                {
                    href: "https://www.cancerresearchuk.org/",
                    text: "Cancer Research UK",
                },
                { href: "https://www.iarc.who.int/", text: "IARC" },
                { href: "https://www.aacr.org/", text: "AACR" },
                {
                    href: "https://health.uct.ac.za/research-research-groupings-cancer-research-initiative/cancer-research-initiative-overview",
                    text: "UCT - Cancer Research Initiative",
                },
                { href: "https://www.cancer.gov/", text: "National Cancer Institute" },
                {
                    href: "https://www.icr.ac.uk/",
                    text: "Institute of Cancer Research",
                },
                { href: "https://www.wcrf.org/", text: "World Cancer Research Fund" },
                {
                    href: "https://aacrjournals.org/clincancerres",
                    text: "Clinical Cancer Research",
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
