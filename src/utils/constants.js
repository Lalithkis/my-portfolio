import { FaPython, FaReact, FaDatabase, FaCloud, FaRobot, FaChartLine, FaBrain, FaCode, FaChartBar } from 'react-icons/fa';
import { SiTensorflow, SiOpencv, SiFlask, SiPandas, SiNumpy, SiMysql, SiGooglecloud, SiGithub, SiN8N, SiTableau, SiScikitlearn, SiDocker } from 'react-icons/si';

export const NAV_LINKS = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
];

export const HERO_CONTENT = {
    name: "Lalith Kishore V S",
    title: "Machine Learning Engineer • AI Developer • Automation Engineer",
    tagline: "I build intelligent systems, automate workflows, and deliver scalable AI solutions that solve real-world problems.",
};

export const ABOUT_CONTENT = {
    bio: "Final-year B.E. in Artificial Intelligence and Machine Learning student with hands-on expertise in developing intelligent systems using Python, TensorFlow, Flask, OpenCV, LSTM networks, and RAG architectures. Passionate about automation, computer vision, and deploying production-ready AI solutions.",
    education: [
        {
            year: "2022-2026",
            degree: "B.E. in Artificial Intelligence and Machine Learning",
            institution: "K.S.Rangasamy College of Technology,Tiruchengode"
        }
    ],
    stats: [
        { label: "Academic Year", value: "Final Year (2026)" },
        { label: "Projects Completed", value: "6+" },
        { label: "Certifications Earned", value: "4+" },
        { label: "Competitions Won", value: "3" }
    ]
};

export const EXPERIENCE_DATA = [
    {
        role: "AI/ML Drone Engineering Intern",
        company: "CubeAI Solutions Tech Pvt Ltd",
        duration: "March 2025 - April 2025",
        location: "Bengaluru, India",
        description: [
            "Developed autonomous search-and-rescue drone system using YOLOv8 object detection for real-time person identification",
            "Implemented GPS-based navigation and autonomous flight path planning algorithms",
            "Optimized model inference speed to achieve 30+ FPS on embedded hardware (Raspberry Pi)",
            "Integrated computer vision pipeline with flight control systems for seamless operation"
        ],
        tech: ["Python", "YOLOv8", "OpenCV", "ROS", "GPS", "MAV Link"],
        image: "/assets/images/drone-internship.jpg"
    }
];

export const PROJECTS_DATA = [
    {
        title: "Predictive Maintenance System",
        description: "Developed LSTM-based predictive maintenance system for industrial equipment, forecasting failures 72 hours in advance with 87% accuracy.",
        tech: ["Python", "TensorFlow", "LSTM", "Pandas", "Matplotlib"],
        impact: "Reduced unplanned downtime by 35% in test scenarios",
        links: { github: "https://github.com/Lalithkis/Predictive-Maintenance-for-Fleet-Management-using-AI-ML" },
        image: "/assets/images/predictive-maintenance.png"
    },
    {
        title: "Agricultural Commodity Price Prediction",
        description: "Built LSTM neural network to predict crop prices based on historical data, weather patterns, and market indicators.",
        tech: ["Python", "LSTM", "Scikit-learn", "Flask", "Plotly"],
        impact: "Achieved competitive prediction accuracy on test data",
        links: { github: "https://github.com/Lalithkis/Predicting-Agricultural-Commodity-Prices-for-a-Sustainable-Future" },
        image: "/assets/images/agricultural-price-prediction.png"
    },
    {
        title: "N8N Security & Intelligence Dashboard",
        description: "Automated security monitoring and intelligence gathering system using n8n workflows, integrating multiple threat feeds.",
        tech: ["n8n", "Python", "APIs", "Github", "Docker"],
        impact: "Reduced manual monitoring time by 80%",
        links: { github: "https://github.com/Lalithkis/n8n-that-automates-company-security" },
        image: "/assets/images/n8n.png"
    }
];

export const SKILLS_DATA = [
    {
        category: "Programming & Frameworks",
        skills: [
            { name: "Python", icon: FaPython },
            { name: "TensorFlow/Keras", icon: SiTensorflow },
            { name: "Flask", icon: SiFlask }
        ]
    },
    {
        category: "AI/ML & Data Science",
        skills: [
            { name: "LSTM Networks", icon: FaBrain },
            { name: "Computer Vision", icon: SiOpencv },
            { name: "RAG Architectures", icon: FaRobot },
            { name: "Time-Series", icon: FaChartLine },
            { name: "YOLOv8", icon: FaBrain }
        ]
    },
    {
        category: "Data & Databases",
        skills: [
            { name: "Pandas", icon: SiPandas },
            { name: "NumPy", icon: SiNumpy },
            { name: "MySQL", icon: SiMysql },
            { name: "Matplotlib/Seaborn", icon: FaChartLine }
        ]
    },
    {
        category: "Cloud & DevOps",
        skills: [
            { name: "Google Cloud", icon: SiGooglecloud },
            { name: "Git/GitHub", icon: SiGithub }
        ]
    },
    {
        category: "Automation & Tools",
        skills: [
            { name: "n8n", icon: SiN8N },
            { name: "Tableau", icon: SiTableau },
            { name: "Power BI", icon: FaChartBar }
        ]
    }
];

export const CERTIFICATIONS_DATA = [
    {
        title: "Data Analytics with Python",
        issuer: "NPTEL",
        date: "July 2024",
        link: "#",
        image: "/assets/images/data-analytics-cert.png"
    },
    {
        title: "Python for Data Science",
        issuer: "NPTEL",
        date: "September 2023",
        link: "#",
        image: "/assets/images/data-science-cert.png"
    },
    {
        title: "Generative AI Foundations",
        issuer: "IBM",
        date: "November 2024",
        link: "#",
        image: "/assets/images/generative-ai-cert.png"
    },
    {
        title: "Machine Learning for All",
        issuer: "University of London & Coursera",
        date: "November 2024",
        link: "#",
        image: "/assets/images/machine-learning-cert.png"
    }
];

export const ACHIEVEMENTS_DATA = [
    {
        title: "National Level Hackathon 1.0 - First Prize",
        date: "March 2024",
        description: "Secured 1st prize and 30,000 cash award in a 24-hour coding competition.",
        prize: "₹30,000",
        context: "Machine Learning, Problem Solving",
        image: "/assets/images/hackathon-cert.png"
    },
    {
        title: "NAUONMESH 2.0 - Top 15 Finalist",
        date: "DEC 2024",
        description: "Top 15 performer in a national AI hackathon, showcasing a sustainable energy optimization system.",
        context: "National AI Hackathon",
        image: "/assets/images/nauonmesh-cert.png"
    },
    {
        title: "Annual Day National Winner - Innovation Award",
        date: "December 2023",
        description: "Awarded for exceptional innovation and technical excellence.",
        prize: "₹3,000",
        context: "Innovation Award",
        image: "/assets/images/annual-day-cert.png"
    }
];

export const CONTACT_INFO = {
    email: "lalithkishore325@gmail.com",
    github: "https://github.com/Lalithkis",
    linkedin: "https://www.linkedin.com/in/lalith-kishore-v-s-688480272/",
    location: "Salem, Tamil Nadu, India"
};
