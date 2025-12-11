/**
 * TanStack Router type extensions
 * Extends the StaticDataRouteOption interface to add custom route metadata
 */
declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		/**
		 * Custom metadata for route configuration
		 */
		meta?: {
			/**
			 * Controls whether the route should show the header and footer layout
			 * @default true - Shows header and footer
			 * @example
			 * ```tsx
			 * export const Route = createFileRoute("/links")({
			 *   component: RouteComponent,
			 *   staticData: {
			 *     meta: {
			 *       showLayout: false, // Hides header and footer
			 *     },
			 *   },
			 * });
			 * ```
			 */
			showLayout?: boolean;
		};
	}
}

export {};
