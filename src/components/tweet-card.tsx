"use client";
import { useQuery } from "@tanstack/react-query";
import {
	type EnrichedTweet,
	enrichTweet,
	TweetBody,
	TweetContainer,
	TweetHeader,
	TweetMedia,
	TweetNotFound,
	type TweetProps,
	TweetSkeleton,
} from "react-tweet";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tweetCardVariants = cva("tweet-card-wrapper", {
	variants: {
		size: {
			sm: "",
			md: "",
			lg: "",
		},
	},
	defaultVariants: {
		size: "sm",
	},
});

export interface TweetCardProps extends Omit<TweetProps, "id"> {
	/** The tweet ID (e.g., "1629307668568633344") */
	id: string;
	/** Size of the tweet card */
	size?: VariantProps<typeof tweetCardVariants>["size"];
	/** Optional className for additional styling */
	className?: string;
}

/**
 * A minimal tweet card that displays only the header (user details),
 * body (tweet text), and media (images/videos).
 *
 * Uses React Query for client-side data fetching since TanStack Start
 * doesn't fully support React Server Components yet.
 *
 * Styled to match the website's secondary color scheme.
 *
 * @example
 * ```tsx
 * <TweetCard id="1629307668568633344" />
 * <TweetCard id="1629307668568633344" size="md" />
 * ```
 */
export function TweetCard({
	id,
	onError,
	components,
	apiUrl,
	fetchOptions,
	size = "sm",
	className,
}: TweetCardProps) {
	const {
		data: tweet,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["tweet", id],
		queryFn: async () => {
			const res = await fetch(
				`${apiUrl ? apiUrl : "https://react-tweet.vercel.app"}/api/tweet/${id}`,
				fetchOptions,
			);
			const json = await res.json();

			return json.data || null;
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	// Loading state
	if (isLoading) {
		return <TweetSkeleton />;
	}

	// Error or not found state
	if (error || !tweet) {
		const NotFound = components?.TweetNotFound || TweetNotFound;
		return <NotFound error={onError ? onError(error) : error} />;
	}

	// Enrich the tweet with additional data for easier rendering
	const enrichedTweet: EnrichedTweet = enrichTweet(tweet);

	return (
		<div
			className={cn(tweetCardVariants({ size }), className)}
			data-theme="dark"
		>
			<TweetContainer>
				<TweetHeader tweet={enrichedTweet} />
				<TweetBody tweet={enrichedTweet} />
				{enrichedTweet.mediaDetails?.length ? (
					<TweetMedia tweet={enrichedTweet} />
				) : null}
			</TweetContainer>
		</div>
	);
}
