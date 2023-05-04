import { createAxiosInstance } from "./request";

const client = createAxiosInstance({
	// baseURL: "http://192.168.120.102:2333",
	baseURL: "http://47.96.254.149:2333",
});

interface Chat {
	(params: {
		prompt: string;
		parentMessageId: string;
		onProcess: (res: {
			role: string;
			id: string;
			parentMessageId: string;
			text: string;
			detail: {
				id: string;
				object: string;
				created: number;
				model: string;
				choices: {
					delta: { content?: string };
					index: number;
					finish_reason: string;
				}[];
			};
			done: true;
		}) => void;
	}): Promise<void>;
}

export const chat: Chat = async ({ prompt, parentMessageId, onProcess }) => {
	await client
		.post(
			"/chat",
			{ prompt, parentMessageId },
			{
				onDownloadProgress: ({ event }) => {
					const xhr = event.target;
					const { responseText } = xhr;
					// Always process the final line
					const lastIndex = responseText.lastIndexOf(
						"\n",
						responseText.length - 2
					);
					let chunk = responseText;
					if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
					try {
						const data = JSON.parse(chunk);
						onProcess &&
							onProcess({
								...data,
								done: data.detail.choices[0].finish_reason === "stop",
							});
					} catch (error) {
						//
					}
				},
			}
		)
		.catch((error) => {
			console.log(error);
		});
};

export default client;
