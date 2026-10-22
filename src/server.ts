import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import {
	getDiscoveryResponse,
	getNegotiatedResponse,
	withMissingPageRobots,
} from "./content/discovery/response";

export default createServerEntry({
	fetch(request, options) {
		return (
			getDiscoveryResponse(request) ??
			getNegotiatedResponse(request) ??
			Promise.resolve(handler.fetch(request, options)).then((response) =>
				withMissingPageRobots(request, response),
			)
		);
	},
});
