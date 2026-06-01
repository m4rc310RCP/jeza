import { useMAuth } from "@jeza-v2/presentation/jeza/contexts";
import type { FC, HtmlHTMLAttributes } from "react";

interface MSignInScreenProps {}

export const MSignInScreen: FC<HtmlHTMLAttributes<unknown> & MSignInScreenProps> = (props) => {
	const {...rest} = props
	const { signin } = useMAuth();

	return (
		<div {...rest} className={`flex flex-col m-auto  ${rest.className && ''}`}>
			<h1>MSignInScreen</h1>
			<button onClick={()=> {
				signin('03057532900', '..');
			}} className="">TESTE LOGIN</button>
		</div>
	);
};
