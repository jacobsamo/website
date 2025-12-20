"use client";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
	useTweet,
} from "react-tweet";

/**
 * A minimal tweet card that displays only the header (user details),
 * body (tweet text), and media (images/videos).
 *
 * Uses React Query for client-side data fetching since TanStack Start
 * doesn't fully support React Server Components yet.
 *
 * @example
 * ```tsx
 * <TweetCard id="1629307668568633344" />
 * ```
 */
export function TweetCard({
	id,
	onError,
	components,
	apiUrl,
	fetchOptions,
}: TweetProps) {
	// const { data: tweet, error, isLoading } = useTweet(id);
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
		<TweetContainer>
			<TweetHeader tweet={enrichedTweet} />
			<TweetBody tweet={enrichedTweet} />
			{enrichedTweet.mediaDetails?.length ? (
				<TweetMedia tweet={enrichedTweet} />
			) : null}
		</TweetContainer>
	);
}
