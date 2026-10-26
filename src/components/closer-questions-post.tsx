import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { questionSets } from "@/lib/closer-questions";

export function QuestionsLaunchCard() {
	return (
		<Link
			to="/36-questions"
			className="group mt-8 flex items-center justify-between gap-5 rounded-xl border border-white/20 bg-white/[0.04] p-5 transition-colors hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:p-6"
		>
			<div>
				<p className="text-xs font-medium uppercase tracking-[0.16em] text-white/55">
					Interactive version
				</p>
				<p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
					Take the questions together
				</p>
				<p className="mt-1 text-sm leading-6 text-white/65">
					One question at a time, with optional timers.
				</p>
			</div>
			<ArrowRight
				className="size-5 shrink-0 text-white/65 transition-transform group-hover:translate-x-1"
				aria-hidden="true"
			/>
		</Link>
	);
}

export function QuestionList({ set }: { set: 1 | 2 | 3 }) {
	const questions = questionSets[set - 1].questions;
	return (
		<ol start={(set - 1) * 12 + 1} className="my-6 ml-6 list-decimal space-y-2">
			{questions.map((question) => (
				<li key={question} className="pl-2 leading-7">
					{question}
				</li>
			))}
		</ol>
	);
}

export function QuestionsDownloads() {
	return (
		<div className="mt-4 text-sm">
			<p className="text-white/65">
				Print at actual size, then cut along the dotted lines.
			</p>
			<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
				<a
					className="inline-flex items-center gap-2 text-white underline underline-offset-4 hover:text-white/70"
					href="/downloads/36-questions-a4.pdf"
					download
				>
					<Download className="size-4" aria-hidden="true" /> A4 cards
				</a>
				<a
					className="inline-flex items-center gap-2 text-white underline underline-offset-4 hover:text-white/70"
					href="/downloads/36-questions-a5.pdf"
					download
				>
					<Download className="size-4" aria-hidden="true" /> A5 cards
				</a>
			</div>
		</div>
	);
}
