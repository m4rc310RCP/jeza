import { useMAuth } from "@jeza-v2/presentation/jeza/contexts";
import type { FC, HtmlHTMLAttributes } from "react";

export const MAppScreen: FC<HtmlHTMLAttributes<unknown>> = (props) => {
	const {...rest} = props

	const { signout } = useMAuth();

	return (
		<div {...rest}>
			<h1>MAppScreen</h1>

			<button onClick={signout} className="">SIGNOUT</button>
		</div>
	);
};
