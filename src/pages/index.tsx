import { useCallback, useState, Fragment, useEffect, useRef } from "react";

import { Input } from "antd";

import MarkDown from "@/components/markdown";
import SendSVG from "@/components/sendSVG";
import { chat } from "@/utils/chatgpt";
import styles from "./index.less";

const Index = () => {
	const [prompt, setPrompt] = useState("");
	const [qa, setQa] = useState<{ id: string; q: string; a: string }[]>([]);

	const contentRef = useRef<HTMLDivElement>(null);

	const handleChat = useCallback(
		(e?: React.KeyboardEvent<HTMLTextAreaElement>) => {
			e && e.preventDefault();
			if (prompt) {
				setPrompt("");
				const parentMessageId = qa[qa.length - 1]?.id || "";
				setQa((prev) =>
					prev.concat([
						{
							id: "-1",
							q: prompt,
							a: `<p class=${styles.blinkingCursor}></p>`,
						},
					])
				);
				chat({
					prompt,
					parentMessageId,
					onProcess: (res) => {
						setQa((prev) =>
							prev.map((data) => {
								if (data.id === "-1" || data.id === res.id) {
									data.id = res.id;
									data.a = `${res.text}${
										res.done ? "" : `<span class=${styles.blinkingCursor}></span>`
									}`;
								}
								return data;
							})
						);
					},
				});
			}
		},
		[prompt]
	);

	useEffect(() => {
		setTimeout(() => {
			contentRef.current?.scrollIntoView({
				behavior: "smooth",
			});
		}, 0);
	}, [qa]);

	return (
		<div className={styles.main}>
			<div className={styles.left}></div>
			<div className={styles.right}>
				<div className={styles.top}>
					{qa.map((data) => (
						<Fragment key={data.id}>
							<div className={styles.question}>
								<div className={styles.box}>
									<div className={styles.logo}>问</div>
									<p>{data.q}</p>
								</div>
							</div>
							<div className={styles.answer}>
								<div className={styles.box}>
									<div className={styles.logo}>答</div>
									<MarkDown content={data.a} />
								</div>
							</div>
						</Fragment>
					))}
					<div ref={contentRef} />
				</div>
				<div className={styles.bottom}>
					<div className={styles.box}>
						<Input.TextArea
							className={styles.input}
							value={prompt}
							placeholder="Send a message..."
							autoSize
							onChange={(e) => setPrompt(e.target.value)}
							onPressEnter={handleChat}
						/>
						<SendSVG className={styles.send} onClick={handleChat} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
