import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import {
	getDiscoveryResponse,
	withMissingPageRobots,
} from "./content/discovery/response";

export default createServerEntry({
	fetch(request, options) {
		return (
			getDiscoveryResponse(request) ??
			Promise.resolve(handler.fetch(request, options)).then(
				withMissingPageRobots,
			)
		);
	},
});
