import type { FC, HtmlHTMLAttributes } from "react";
export const MMainContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
	const {...rest} = props
	return (
		<div {...rest} className={`min-w-screen min-h-screen flex bg-task text-principal ${rest.className ?? ''}`} />
	);
};
