export const platforms = [
	"twitter",
	"bluesky",
	"github",
	"youtube",
	"linkedin",
	"instagram",
	"facebook",
	"tiktok",
] as const;

export type Social = {
	platform: (typeof platforms)[number];
	handle: string;
	url: string;
};

export const socials: Social[] = [
	{
		platform: "twitter",
		handle: "@jacobsamorowski",
		url: "https://links.jacobsamo.com/x",
	},
	{
		platform: "github",
		handle: "jacobsamo",
		url: "https://links.jacobsamo.com/github",
	},
	{
		platform: "youtube",
		handle: "jacobsamorowski",
		url: "https://links.jacobsamo.com/youtube",
	},
	{
		platform: "linkedin",
		handle: "jacobsamorowski",
		url: "https://links.jacobsamo.com/linkedin",
	},
	{
		platform: "instagram",
		handle: "jacobsamorowski",
		url: "https://links.jacobsamo.com/instagram",
	},
	{
		platform: "facebook",
		handle: "jacobsamorowski",
		url: "https://links.jacobsamo.com/facebook",
	},
	{
		platform: "tiktok",
		handle: "jacobsamorowski",
		url: "https://links.jacobsamo.com/tiktok",
	},
	{
		platform: "bluesky",
		handle: "jacobsamo.com",
		url: "https://links.jacobsamo.com/bluesky",
	},
];

export const siteConfig = {
	title: "Jacob Samorowski",
	description: "Jacob Samorowski's personal website",
	socials: socials,
	og: {
		url: "/og.jpg",
		alt: "Jacob's profile",
		width: 400,
		height: 400,
	},
	keywords: [
		"jacob",
		"samorowski",
		"jacob samorowski",
		"software developer",
		"photographer",
		"blog",
		"website",
		"portfolio",
		"personal website",
	],
	projects: [
		{
			title: "BuzzTrip",
			description:
				"BuzzTrip is a open source mapping app allowing travelers, event organizes and photographers create and collaborate on custom maps, anywhere on any device, reimagining effortless mapping",
			image: "https://buzztrip.co/assets/open-graph.jpg",
			url: "https://buzztrip.co",
		},
		{
			title: "Mixie Cooking",
			description:
				"Mixie is a community-driven recipe platform where home cooks and food enthusiasts can collaborate on unique and delicious recipes",
			image: "https://www.mixiecooking.com/images/landing-page.jpg",
			url: "https://www.mixiecooking.com",
		},
	],
	work: [
		{
			id: "element-photo-video-productions",
			companyName: "Element Photo & Video Productions",
			jobTitle: "Freelance Photographer & Videographer, Digital Marketing",
			startDate: new Date("2024-02-24"),
			endDate: null,
			present: true,
			description:
				"Worked freelancing as a photographer and videographer, and also did digital marketing for the company",
			skills: [
				"Photography",
				"Videography",
				"Photo Editing",
				"Video Editing",
				"Digital Marketing",
			],
		},
		{
			id: "ambrose-construct-group",
			companyName: "Ambrose Construct Group",
			jobTitle: "Junior Software Developer",
			startDate: new Date("2023-12-22"),
			endDate: new Date("2025-01-24"),
			present: false,
			description:
				"Completed a Cert III in Information, Communication and Technology as part of a school based traineeship, where my job title was Junior Software Developer throughout my training and after finishing in November 2024",
			skills: [
				"Software Development",
				"Web Development",
				"Database Management",
				"Project Management",
			],
		},
		{
			id: "jallas-cafe",
			companyName: "Jalla's Cafe",
			jobTitle: "Kitchen Hand & Barista",
			startDate: new Date("2021-09-02"),
			endDate: new Date("2024-01-19"),
			present: false,
			description:
				"Worked as a dishy and worked my way up to kitchen hand, where i prepared food, and then to barista, where i made coffee",
			skills: ["Barista", "Kitchen Hand", "Customer Service"],
		},
	],
	education: [
		{
			logo: "/assets/bussines-logos/immanuel-lutheran-college-logo.svg",
			schoolName: "Immanuel Lutheran College",
			degree: "High School Certificate",
			startDate: new Date("2019-01-01"),
			endDate: new Date("2024-11-15"),
			present: false,
			description: "",
		},
		{
			logo: "/assets/bussines-logos/tafe-queensland-logo.svg",
			schoolName: "Tafe Queensland",
			degree: "Cert III in Information, Communication and Technology",
			startDate: new Date("2023-12-22"),
			endDate: new Date("2024-11-15"),
			present: false,
			description:
				"School based traineeship, with one day a week on the worksite, completing units online",
		},
	],
};

export const skills = [
	"JavaScript",
	"TypeScript",
	"React",
	"Node.js",
	"Hono",
	"Angular",
	"C#",
	"Python",
	"SQL",
	"Nextjs",
	"Customer Service",
	"Project Management",
	"Web Development",
	"Database Management",
	"Github",
	"Photography",
	"Videography",
	"Photo Editing",
	"Video Editing",
	"Digital Marketing",
	"Barista",
	"Kitchen Hand",
];
