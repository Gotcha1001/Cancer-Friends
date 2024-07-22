export default function Foundations() {
    const sections = [

        {
            title: "Cancer Blogs",
            image:
                "https://media.gettyimages.com/id/1352076116/photo/blog-sign-in-neon-lights.jpg?s=612x612&w=0&k=20&c=65FJYntaT9c0h1W0P2MpR_ucskXFIL1Hg6xF0XhyX54=",
            links: [
                {
                    href: "https://www.cancersupportcommunity.org/blog",
                    text: "Cancer Support Community Blog",
                },
                {
                    href: "https://www.mdanderson.org/cancerwise.html",
                    text: "MD Anderson Cancerwise",
                },
                {
                    href: "https://www.cancercenter.com/community/blog",
                    text: "Cancer Treatment Centers of America Blog",
                },
                { href: "https://www.komen.org/blog/", text: "Susan G. Komen Blog" },
                {
                    href: "https://www.webmd.com/breast-cancer/features/breast-cancer-blogs",
                    text: "WebMD Breast Cancer Blogs",
                },
                {
                    href: "https://www.cancer.org.au/about-us/news-and-media/blog?query=&hitsPerPage=9&page=1",
                    text: "Cancer Council Australia Blog",
                },
                {
                    href: "https://cancerblog.mayoclinic.org/",
                    text: "Mayo Clinic Cancer Blog",
                },
                {
                    href: "https://www.roswellpark.org/cancertalk",
                    text: "Roswell Park Cancer Talk",
                },
                {
                    href: "https://www.pennmedicine.org/cancer/about/focus-on-cancer",
                    text: "Penn Medicine Focus on Cancer",
                },
                {
                    href: "https://siteman.wustl.edu/blog/",
                    text: "Siteman Cancer Center Blog",
                },
                { href: "https://blogs.cdc.gov/cancer/", text: "CDC Cancer Blog" },
            ],
        },
        {
            title: "Child Blogs",
            image:
                "https://media.gettyimages.com/id/689231117/photo/wooden-bricks-spelling-the-word-blog.jpg?s=612x612&w=0&k=20&c=eC9ztRwaGNINaj7wgJczEP8rGDUNIu_uOY8NiLUQGfg=",
            links: [
                {
                    href: "https://www.childrenwithcancer.org.uk/category/childhood-cancer-blogs/",
                    text: "Children with Cancer UK Blog",
                },
            ],
        },
        {
            title: "Cancer Patients Stories",
            image:
                "https://media.gettyimages.com/id/1090795958/photo/vintage-typewriter-with-text-whats-your-story.jpg?s=612x612&w=0&k=20&c=Hol8jLA68oMtyPI-z2L7EENs9ZqCJSd5Bl3SFId1xQs=",
            links: [
                {
                    href: "https://www.curetoday.com/news/blogs",
                    text: "CURE Today - Cancer Patients Stories",
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
