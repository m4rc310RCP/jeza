import type { FC, HtmlHTMLAttributes } from "react";
import { GiRadarSweep } from "react-icons/gi";

export const MPartNone: FC<HtmlHTMLAttributes<unknown>> = (props) => {
	const {...rest} = props

	return (
		<div className="flex w-full h-full" {...rest}>
			<GiRadarSweep className="m-auto text-9xl text-zinc-600" />
		</div>
	);
};
