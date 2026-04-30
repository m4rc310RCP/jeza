import type { FC, HtmlHTMLAttributes } from "react";

interface MMainScreenProps {}

export const MMainScreen: FC<HtmlHTMLAttributes<unknown> & MMainScreenProps> = (props) => {
	const {...rest} = props

	return (
		<div {...rest}>
			<h1>MMainScreen</h1>
		</div>
	);
};
