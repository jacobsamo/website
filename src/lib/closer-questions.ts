/** Paraphrased from the task slips in Aron et al. (1997), Appendix. */
export const questionSets = [
	{
		name: "Set 1",
		colour: "#f5dfd8",
		questions: [
			"If you could invite anyone in the world to dinner, who would you choose?",
			"Would you want to be famous? What would you want to be known for?",
			"Do you practise what you will say before making a phone call? Why or why not?",
			"What would your ideal day look like?",
			"When did you last sing while alone? When did you last sing for someone else?",
			"Imagine living to 90 while keeping either the mind or the body of a 30-year-old from age 30 onward. Which would you keep?",
			"Do you have a private guess about how you might die?",
			"What are three things you and your partner seem to have in common?",
			"What are you most grateful for in your life?",
			"What would you change about how you were brought up, if you could?",
			"Spend four minutes telling your partner the story of your life, with as much detail as you can.",
			"If you could wake up tomorrow with one new ability or personal quality, what would you choose?",
		],
	},
	{
		name: "Set 2",
		colour: "#e0e9df",
		questions: [
			"If you could learn one completely truthful thing about yourself, your life, or the future, what would you ask?",
			"What have you wanted to do for a long time, and what has kept you from doing it?",
			"What achievement are you proudest of?",
			"What matters most to you in a friendship?",
			"Which memory do you treasure most?",
			"Which memory is the hardest for you?",
			"If you knew you had one year left to live, would you change how you live now? Why?",
			"What does friendship mean to you?",
			"How do love and affection fit into your life?",
			"Take turns naming positive qualities you see in your partner, sharing five in total.",
			"How close is your family? Do you think your childhood was happier than most?",
			"How do you feel about your relationship with your mother?",
		],
	},
	{
		name: "Set 3",
		colour: "#e6e1f3",
		questions: [
			"Each make three true statements that begin with ‘We’. For example, ‘We are both feeling …’",
			"Finish this sentence: ‘I wish I had someone I could share … with.’",
			"If you were becoming close friends, what would your partner need to know about you?",
			"Tell your partner what you like about them, including something you might hesitate to say to someone you just met.",
			"Tell your partner about a time you felt embarrassed.",
			"When did you last cry with someone present? When did you last cry alone?",
			"Tell your partner something you already like about them.",
			"Is anything too serious to joke about? If so, what?",
			"If you died tonight, what would you most regret leaving unsaid? What has stopped you from saying it?",
			"After getting loved ones and pets to safety in a house fire, which one possession would you save? Why?",
			"Whose death in your family would affect you most deeply? Why?",
			"Share a personal problem and ask how your partner might handle it. Then ask them to describe how you seem to feel about it.",
		],
	},
] as const;

export const questions = questionSets.flatMap((set, setIndex) =>
	set.questions.map((text, index) => ({
		text,
		number: setIndex * 12 + index + 1,
		setIndex,
		duration: setIndex === 0 && index === 10 ? 240 : undefined,
	})),
);

export const eyeContact = {
	text: "If you both feel comfortable, spend four minutes looking into each other’s eyes.",
	number: 37,
	setIndex: 3,
	duration: 240,
} as const;

export const allSteps = [...questions, eyeContact];
