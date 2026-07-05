import { createElement, lazy, type ComponentType } from "react";


const designDemos = defineDesignDemos({
	"01-notification": {
		component: lazyDesign(
			() => import("./notification-component"),
			"NotificationComponent",
		),
	},
});


interface DesignDemoDefinition {
	component: ComponentType;
}

function defineDesignDemos<
	const T extends Record<string, DesignDemoDefinition>,
>(demos: T) {
	return demos;
}

function lazyDesign<TModule, TExport extends keyof TModule & string>(
	load: () => Promise<TModule>,
	exportName: TExport,
) {
	return lazy(async () => {
		const module = await load();

		return {
			default: module[exportName] as ComponentType,
		};
	});
}


type DesignDemoSlug = keyof typeof designDemos;

export function hasDesignDemo(slug: string): slug is DesignDemoSlug {
	return Object.hasOwn(designDemos, slug);
}

interface DesignDemoProps {
	slug: string;
}

export function DesignDemo({ slug }: DesignDemoProps) {
	if (!hasDesignDemo(slug)) return null;

	return createElement(designDemos[slug].component);
}
