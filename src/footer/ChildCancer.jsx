export default function Foundations() {
    const sections = [

        {
            title: "Child Cancer",
            image:
                "https://media.gettyimages.com/id/1388415567/photo/young-cancer-patient-and-her-stuffed-animal.jpg?s=612x612&w=0&k=20&c=6h9BNjiNlYvrVJ50_3GRDCpWmA95pERBr3RpNReIrcc=",
            links: [
                {
                    href: "https://cansa.org.za/types-of-childhood-cancer/",
                    text: "CANSA Childhood Cancer Types",
                },
                {
                    href: "https://www.cancerresearchuk.org/about-cancer/childrens-cancer/symptoms",
                    text: "Cancer Research UK - Childhood Cancer Symptoms",
                },
                {
                    href: "https://www.childrenwithcancer.org.uk/childhood-cancer-info/understanding-cancer/types-of-cancer/",
                    text: "Children with Cancer UK",
                },
                {
                    href: "https://www.cccl.org.lb/donatenow/en?gsource=google&gclid=cjwkcajwnei0bhb-eiwaa2xubj0iceo2mvztmyge8kbftzsod5eaq6tuody_0vfixjmowuogkvbk0rocuwyqavd_bwe",
                    text: "CCCL",
                },
                {
                    href: "https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/cancer-in-children",
                    text: "Better Health - Cancer in Children",
                },
                {
                    href: "https://www.childrenscancercause.org/facts",
                    text: "Children's Cancer Cause",
                },
                {
                    href: "https://www.healthychildren.org/English/health-issues/conditions/cancer/Pages/Childhood-Cancer.aspx",
                    text: "Healthy Children - Childhood Cancer",
                },
                {
                    href: "https://medlineplus.gov/cancerinchildren.html",
                    text: "MedlinePlus - Cancer in Children",
                },
                {
                    href: "https://www.cclg.org.uk/types-of-childhood-cancer",
                    text: "CCLG - Types of Childhood Cancer",
                },
            ],
        },
        {
            title: "Children Cancer Warning Signs",
            image:
                "https://media.gettyimages.com/id/1201308661/photo/nurse-hugging-young-cancer-patient-stock-photo.jpg?s=612x612&w=0&k=20&c=ShZ0w-lk1HbBUapaoeF1z90Dmu3J6DpFd3vi4j4TZlI=",
            links: [
                {
                    href: "https://cansa.org.za/warning-signs-childhood-cancers/",
                    text: "CANSA - Warning Signs of Childhood Cancer",
                },
            ],
        },
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
            title: "Child Cancer for Parents",
            image:
                "https://media.gettyimages.com/id/1307768283/photo/birthday-surprise-for-little-girl-in-hospital-room.jpg?s=612x612&w=0&k=20&c=4aeRk0xBgEDIHVr0m-d-s9_Tl_vTRMnCOdqGwJcmwNc=",
            links: [
                {
                    href: "https://kidshealth.org/en/parents/cancer.html",
                    text: "KidsHealth - Childhood Cancer for Parents",
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
