import { createFileRoute, Link } from "@tanstack/react-router";
import { TextMorph } from "torph/react";
import {
	AnimatePresence,
	motion,
	useAnimate,
	useReducedMotion,
} from "motion/react";
import {
	ArrowLeft,
	ArrowRight,
	List,
	Pause,
	Play,
	RotateCcw,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import { allSteps, questionSets } from "@/lib/closer-questions";
import { fitText } from "@/lib/fit-text";
import { head } from "@/lib/head";

const totalQuestions = 36;
const lastIndex = allSteps.length - 1;
const storageKey = "36-questions-current-step";
const boundaries = new Set([0, 11, 23, 35, 36]);
const endingColour = "#f6e7c8";
// Torph morph settings: spring easing at its default speed.
const morphSpring = { stiffness: 200, damping: 20 };

export const Route = createFileRoute("/36-questions")({
	component: QuestionsExperience,
	staticData: { meta: { showLayout: false } },
	head: () =>
		head({
			title: "36 questions to get a little closer",
			description:
				"Take turns with 36 conversation prompts, three gentle sets, and optional four-minute timers.",
			url: "/36-questions",
		}),
});

function colourFor(index: number) {
	return index === totalQuestions
		? endingColour
		: questionSets[allSteps[index].setIndex].colour;
}

function QuestionsExperience() {
	const [stepIndex, setStepIndex] = useState(0);
	const [restored, setRestored] = useState(false);
	const [showDirectory, setShowDirectory] = useState(false);
	const [remaining, setRemaining] = useState(240);
	const [running, setRunning] = useState(false);
	const [stage, setStage] = useState<{
		width: number;
		height: number;
		fontFamily: string;
	} | null>(null);
	const deadline = useRef<number | null>(null);
	const audioContext = useRef<AudioContext | null>(null);
	const stageRef = useRef<HTMLDivElement | null>(null);
	const scroller = useRef<HTMLDivElement | null>(null);
	const activePoint = useRef<HTMLButtonElement | null>(null);
	const reduceMotion = useReducedMotion();
	const [blurScope, animateBlur] = useAnimate();
	const shownText = useRef<string | null>(null);
	const step = allSteps[stepIndex];
	const set = questionSets[step.setIndex];
	const colour = colourFor(stepIndex);
	const isEnding = stepIndex === totalQuestions;
	const setLabel = isEnding ? "Optional ending" : set.name;

	useEffect(() => {
		const saved = Number(window.localStorage.getItem(storageKey));
		if (Number.isInteger(saved) && saved >= 0 && saved < allSteps.length)
			setStepIndex(saved);
		setRestored(true);
	}, []);

	useEffect(() => {
		if (!restored) return;
		window.localStorage.setItem(storageKey, String(stepIndex));
		deadline.current = null;
		setRemaining(step.duration ?? 240);
		setRunning(false);
	}, [restored, stepIndex, step.duration]);

	useEffect(() => {
		if (!running) return;
		const timer = window.setInterval(() => {
			const next = Math.max(
				0,
				Math.ceil(((deadline.current ?? 0) - Date.now()) / 1000),
			);
			setRemaining(next);
			if (next === 0) {
				setRunning(false);
				playChime(audioContext.current);
			}
		}, 250);
		return () => window.clearInterval(timer);
	}, [running, stepIndex]);

	// Keep the active point centred in the timeline. Only the timeline scrolls
	// (never the page), and only when it overflows, which is mobile.
	useEffect(() => {
		const track = scroller.current;
		const point = activePoint.current;
		if (!track || !point || track.scrollWidth <= track.clientWidth) return;
		track.scrollTo({
			left: point.offsetLeft - (track.clientWidth - point.offsetWidth) / 2,
			behavior: reduceMotion ? "instant" : "smooth",
		});
	}, [stepIndex, reduceMotion]);

	useEffect(() => {
		const element = stageRef.current;
		if (!element) return;
		const measure = () =>
			setStage({
				width: element.clientWidth,
				height: element.clientHeight,
				fontFamily: getComputedStyle(element).fontFamily,
			});
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!showDirectory) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setShowDirectory(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [showDirectory]);

	const fitted = useMemo(() => {
		if (!stage) return null;
		const wide = stage.width >= 640;
		return fitText(
			step.text,
			stage.width,
			stage.height - (step.duration ? (wide ? 110 : 96) : 0),
			{
				fontFamily: stage.fontFamily,
				minSize: wide ? 28 : 22,
				maxSize: wide ? 112 : 52,
			},
		);
	}, [stage, step.text, step.duration]);

	// Torph has no blur of its own, so soften the text as each morph begins.
	const questionText = fitted && restored ? fitted.text : null;
	useEffect(() => {
		const previous = shownText.current;
		shownText.current = questionText;
		if (reduceMotion || previous === null || previous === questionText) return;
		if (!blurScope.current) return;
		void animateBlur(
			blurScope.current,
			{ filter: ["blur(0px)", "blur(3px)", "blur(0px)"] },
			{ duration: 0.5, times: [0, 0.3, 1], ease: "easeInOut" },
		);
	}, [questionText, reduceMotion, animateBlur, blurScope]);

	function toggleTimer() {
		if (running) {
			setRemaining(
				Math.max(0, Math.ceil(((deadline.current ?? 0) - Date.now()) / 1000)),
			);
			setRunning(false);
		} else {
			try {
				audioContext.current ??= new AudioContext();
				void audioContext.current.resume();
			} catch {
				/* Timer still works when audio is unavailable. */
			}
			const duration = remaining === 0 ? (step.duration ?? 240) : remaining;
			if (remaining === 0) setRemaining(duration);
			deadline.current = Date.now() + duration * 1000;
			setRunning(true);
		}
	}

	function goTo(index: number) {
		setStepIndex(Math.max(0, Math.min(lastIndex, index)));
		setShowDirectory(false);
	}

	const formattedTime = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
	const transition = reduceMotion
		? { duration: 0 }
		: { type: "spring" as const, stiffness: 320, damping: 34 };

	return (
		<main
			className="relative h-svh overflow-hidden bg-[#1a1a1a] text-white"
			style={{
				backgroundImage: "radial-gradient(#7979792e 1px, transparent 1px)",
				backgroundSize: "16px 16px",
			}}
		>
			<motion.div
				className="pointer-events-none absolute -top-52 -right-32 size-[40rem] rounded-full opacity-[0.08] blur-3xl"
				animate={{ backgroundColor: colour }}
				transition={{ duration: reduceMotion ? 0 : 0.6 }}
			/>
			<AnimatePresence>
				{showDirectory && (
					<motion.div
						layoutId="directory-surface"
						role="dialog"
						aria-modal="true"
						aria-label="All questions"
						className="fixed inset-3 z-30 overflow-y-auto rounded-[2rem] border border-white/15 bg-[#222] shadow-2xl sm:inset-6"
						transition={transition}
						initial={reduceMotion ? false : { opacity: 0.85 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div>
							<div className="mx-auto max-w-4xl px-5 pb-20 pt-2 sm:px-10">
								<p className="flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.17em]">
									All questions
								</p>
								{questionSets.map((questionSet, setIndex) => (
									<section
										key={questionSet.name}
										className="mt-10"
										aria-labelledby={`directory-set-${setIndex}`}
									>
										<h2
											id={`directory-set-${setIndex}`}
											className="mb-4 flex items-center gap-3 text-xl font-semibold"
										>
											<span
												className="size-4 rounded-full border border-white/20"
												style={{ backgroundColor: questionSet.colour }}
											/>
											{questionSet.name}
										</h2>
										<div className="border-t border-white/15">
											{questionSet.questions.map((question, index) => {
												const number = setIndex * 12 + index + 1;
												return (
													<DirectoryItem
														key={number}
														number={number}
														text={question}
														current={stepIndex === number - 1}
														onSelect={() => goTo(number - 1)}
													/>
												);
											})}
										</div>
									</section>
								))}
								<section className="mt-10">
									<h2 className="mb-4 flex items-center gap-3 text-xl font-semibold">
										<span
											className="size-4 rounded-full border border-white/20"
											style={{ backgroundColor: endingColour }}
										/>
										Optional ending
									</h2>
									<div className="border-t border-white/15">
										<DirectoryItem
											number={37}
											text="Four minutes of eye contact"
											current={stepIndex === totalQuestions}
											onSelect={() => goTo(totalQuestions)}
										/>
									</div>
								</section>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* One control that never moves: its pill surface becomes the panel. */}
			<div className="pointer-events-none fixed inset-x-0 top-0 z-40">
				<div className="mx-auto flex max-w-7xl justify-end px-5 pt-5 sm:px-10 sm:pt-8">
					<button
						type="button"
						aria-expanded={showDirectory}
						aria-label={showDirectory ? "Close all questions" : "All questions"}
						onClick={() => setShowDirectory((open) => !open)}
						className="pointer-events-auto relative inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						{!showDirectory && (
							<motion.span
								layoutId="directory-surface"
								className="absolute inset-0 rounded-full border border-white/20 bg-white/[0.04]"
								transition={transition}
							/>
						)}
						<span className="relative">
							{showDirectory ? (
								<X className="size-4" aria-hidden="true" />
							) : (
								<List className="size-4" aria-hidden="true" />
							)}
						</span>
						<TextMorph as="span" ease={morphSpring} className="relative">
							{showDirectory ? "Close" : "All questions"}
						</TextMorph>
					</button>
				</div>
			</div>

			<div
				className="relative mx-auto flex h-svh max-w-7xl flex-col px-5 sm:px-10"
				aria-hidden={showDirectory}
				inert={showDirectory}
			>
				<header className="flex min-h-11 items-center gap-3 pt-5 sm:pt-8">
					<Link
						to="/blog/$postId"
						params={{ postId: "36-questions-to-fall-in-love" }}
						aria-label="About the exercise"
						className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
					>
						<ArrowLeft className="size-5" aria-hidden="true" />
					</Link>
					<div className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em]">
						<motion.span
							className="size-3 rounded-full"
							animate={{ backgroundColor: colour }}
							transition={{ duration: reduceMotion ? 0 : 0.4 }}
						/>
						<TextMorph as="span" ease={morphSpring}>
							{setLabel}
						</TextMorph>
					</div>
				</header>

				<div className="min-h-0 flex-1 pb-36 pt-4 sm:pb-32">
					<div
						ref={stageRef}
						className="relative flex h-full items-center justify-center text-center"
					>
						{fitted && restored ? (
							<div ref={blurScope}>
								<TextMorph
									as="h1"
									ease={morphSpring}
									className="font-semibold tracking-[-0.04em] text-balance"
									style={{
										fontSize: fitted.fontSize,
										lineHeight: fitted.lineHeight,
									}}
								>
									{fitted.text}
								</TextMorph>
							</div>
						) : (
							<h1 className="sr-only">{step.text}</h1>
						)}
						<AnimatePresence>
							{step.duration && (
								<motion.div
									key="timer"
									className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-3"
									initial={reduceMotion ? false : { opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 12 }}
									transition={{ duration: 0.3 }}
								>
									<span
										role="timer"
										aria-live={remaining === 0 ? "polite" : "off"}
										className="flex min-w-20 justify-center font-mono text-2xl tabular-nums text-white/75"
									>
										<TextMorph as="span" ease={morphSpring}>
											{formattedTime}
										</TextMorph>
									</span>
									<button
										type="button"
										onClick={toggleTimer}
										className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-4 text-sm font-medium hover:bg-white/[0.12]"
									>
										{running ? (
											<Pause className="size-4" aria-hidden="true" />
										) : (
											<Play className="size-4" aria-hidden="true" />
										)}
										{running
											? "Pause timer"
											: remaining === 0
												? "Start again"
												: "Start timer"}
									</button>
									<button
										type="button"
										onClick={() => {
											deadline.current = null;
											setRunning(false);
											setRemaining(step.duration ?? 240);
										}}
										className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 hover:bg-white/10"
									>
										<RotateCcw className="size-4" aria-hidden="true" /> Reset
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				<footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#1a1a1a]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8 sm:pt-3">
					<div className="mx-auto max-w-6xl">
						<div className="mb-1 flex justify-center text-sm font-medium tabular-nums tracking-wide text-white/65 sm:mb-2 sm:text-xs sm:text-white/60">
							<TextMorph as="p" ease={morphSpring}>
								{isEnding
									? "Optional ending"
									: `Question ${step.number} of ${totalQuestions} · ${set.name}`}
							</TextMorph>
						</div>
						<div className="flex items-center gap-2 sm:gap-5">
							<button
								type="button"
								onClick={() => goTo(stepIndex - 1)}
								disabled={stepIndex === 0}
								aria-label="Previous question"
								className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/25 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 sm:size-11 sm:w-auto sm:gap-2 sm:px-5"
							>
								<ArrowLeft className="size-5 sm:size-4" aria-hidden="true" />
								<span className="hidden sm:inline">Previous</span>
							</button>
							<div
								ref={scroller}
								role="group"
								aria-label="Question timeline"
								className="min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)] [scrollbar-width:none] sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
							>
								<div className="relative flex min-w-max items-center px-[calc(50%-1rem)] sm:w-full sm:min-w-0 sm:px-2">
									{allSteps.map((item, index) => (
										<TimelinePoint
											key={index}
											index={index}
											label={
												index === totalQuestions
													? "Optional ending"
													: `Question ${item.number}, ${questionSets[item.setIndex].name}`
											}
											stepIndex={stepIndex}
											buttonRef={index === stepIndex ? activePoint : undefined}
											onSelect={() => goTo(index)}
										/>
									))}
								</div>
							</div>
							{stepIndex < lastIndex ? (
								<button
									type="button"
									onClick={() => goTo(stepIndex + 1)}
									aria-label={
										stepIndex === totalQuestions - 1
											? "Optional ending"
											: "Next question"
									}
									className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#1a1a1a] hover:bg-white/85 sm:size-11 sm:w-auto sm:gap-2 sm:px-5"
								>
									<span className="hidden sm:inline">
										{stepIndex === totalQuestions - 1
											? "Optional ending"
											: "Next"}
									</span>
									<ArrowRight className="size-5 sm:size-4" aria-hidden="true" />
								</button>
							) : (
								<Link
									to="/blog/$postId"
									params={{ postId: "36-questions-to-fall-in-love" }}
									aria-label="Finish"
									className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#1a1a1a] hover:bg-white/85 sm:size-11 sm:w-auto sm:gap-2 sm:px-5"
								>
									<span className="hidden sm:inline">Finish</span>
									<ArrowRight className="size-5 sm:size-4" aria-hidden="true" />
								</Link>
							)}
						</div>
					</div>
				</footer>
			</div>
		</main>
	);
}

function DirectoryItem({
	number,
	text,
	current,
	onSelect,
}: {
	number: number;
	text: string;
	current: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-current={current ? "step" : undefined}
			className={`relative flex w-full items-start gap-4 border-b border-white/10 py-4 text-left before:absolute before:inset-x-[-0.75rem] before:inset-y-1 before:rounded-2xl before:bg-white/0 before:transition-colors hover:before:bg-white/[0.07] ${current ? "text-white" : "text-white/80"}`}
		>
			<span className="relative shrink-0 text-sm font-semibold opacity-55">
				{String(number).padStart(2, "0")}
			</span>
			<span className="relative leading-6">{text}</span>
		</button>
	);
}

/**
 * One cell of the timeline. Each cell draws half a line either side of its
 * dot, so the line always runs exactly dot to dot and fills with progress.
 */
function TimelinePoint({
	index,
	label,
	stepIndex,
	buttonRef,
	onSelect,
}: {
	index: number;
	label: string;
	stepIndex: number;
	buttonRef?: Ref<HTMLButtonElement>;
	onSelect: () => void;
}) {
	const colour = colourFor(index);
	const active = index === stepIndex;
	const past = index < stepIndex;
	const boundary = boundaries.has(index);
	return (
		<button
			ref={buttonRef}
			type="button"
			onClick={onSelect}
			aria-label={label}
			aria-current={active ? "step" : undefined}
			className="group relative flex h-12 w-8 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:h-11 sm:w-auto sm:min-w-3 sm:flex-1"
		>
			{index > 0 && (
				<span
					className="absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-white/20 transition-colors duration-300"
					style={index <= stepIndex ? { backgroundColor: colour } : undefined}
				/>
			)}
			{index < lastIndex && (
				<span
					className="absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-white/20 transition-colors duration-300"
					style={index < stepIndex ? { backgroundColor: colour } : undefined}
				/>
			)}
			<span
				className={`relative block rounded-full border transition-[width,height,background-color,box-shadow] duration-300 ${
					active
						? "size-4 border-white bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.15)] sm:size-3.5"
						: boundary
							? "h-5 w-2 sm:h-4 sm:w-1.5"
							: "size-1.5 group-hover:size-2.5 sm:size-1 sm:group-hover:size-2"
				} ${past ? "border-transparent" : active ? "" : "border-white/45 bg-[#646464]"}`}
				style={past && !active ? { backgroundColor: colour } : undefined}
			/>
		</button>
	);
}

function playChime(context: AudioContext | null) {
	if (!context || context.state !== "running") return;
	for (const [index, frequency] of [523.25, 659.25].entries()) {
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		const start = context.currentTime + index * 0.16;
		oscillator.type = "sine";
		oscillator.frequency.value = frequency;
		gain.gain.setValueAtTime(0.0001, start);
		gain.gain.exponentialRampToValueAtTime(0.025, start + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
		oscillator.connect(gain).connect(context.destination);
		oscillator.start(start);
		oscillator.stop(start + 0.46);
	}
}
