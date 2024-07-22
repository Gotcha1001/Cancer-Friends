export default function Foundations() {
    const sections = [







        {
            title: "Children Cancer Homes",
            image:
                "https://media.gettyimages.com/id/1458854569/photo/doctor-examining-a-little-girl-with-stethoscope-female-pediatrician-listening-to-childs.jpg?s=612x612&w=0&k=20&c=DzV-Ov_ogGb5d2DuCaAT9wXbc083kFiejwsa3a-51yQ=",
            links: [
                {
                    href: "https://cancer.org.my/get-involved/childrens-home-of-hope/",
                    text: "Children's Home of Hope",
                },
                {
                    href: "https://childrenscancercenter.org/",
                    text: "Children's Cancer Center",
                },
                { href: "https://www.thebostonhouse.org/", text: "The Boston House" },
                {
                    href: "https://childrenscancerfoundation.org/",
                    text: "Children's Cancer Foundation",
                },
                {
                    href: "https://www.facebook.com/bahayarugainc/",
                    text: "Bahay Aruga",
                },
                {
                    href: "https://www.globalgiving.org/projects/great-against-cancer-family-homes-for-children/",
                    text: "Great Against Cancer Family Homes",
                },
                { href: "https://curesearch.org/", text: "CureSearch" },
            ],
        },

        {
            title: "Cancer Homes",
            image:
                "https://media.gettyimages.com/id/1389278061/photo/woman-with-cancer-after-radiation-therapy-at-home-reading-text-messages.jpg?s=612x612&w=0&k=20&c=gpWsspNdz3g-rXwCX0eqleLDdXSkdDdJCbOyryKo-1A=",
            links: [
                {
                    href: "https://cansa.org.za/cansas-care-support/cansa-care-homes/",
                    text: "CANSA Care Homes",
                },
                {
                    href: "https://littlefighters.org.za/",
                    text: "Little Fighters Cancer Trust",
                },
                {
                    href: "https://www.younglivesvscancer.org.uk/what-we-do/a-free-place-to-stay/",
                    text: "Young Lives vs Cancer",
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
