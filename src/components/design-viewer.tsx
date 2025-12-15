import { useState } from "react";

interface DesignViewerProps {
	children: React.ReactNode;
}

export const DesignViewer = ({ children }: DesignViewerProps) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	return (
		<div className="relative flex items-center justify-center w-full h-96 rounded-md bg-white dark:bg-gray-950">
			<div className="absolute right-4 top-4">{/* Theme toggle button */}</div>
			{children}
		</div>
	);
};
