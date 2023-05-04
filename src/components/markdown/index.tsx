import { FC } from "react";

import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

import styles from "./index.less";

// 创建一个新的渲染器
const renderer = new marked.Renderer();

function codeParse(this: any, code: string, lang: string, escaped: boolean) {
	if (this.options.highlight) {
		const out = this.options.highlight(code, lang);
		if (out != null && out !== code) {
			escaped = true;
			code = out;
		}
	}
	code = code.replace(/\n$/, "") + "\n";
	if (!lang) {
		return `<pre class=${styles.codeBlock}><code class="hljs">${
			escaped ? code : escape(code)
		}</code></pre>\n
		`;
	}
	return `<pre class=${styles.codeBlock}><code class="hljs ${
		this.options.langPrefix
	}${escape(lang)}">${escaped ? code : escape(code)}</code></pre>\n
	`;
}

renderer.code = codeParse;

// 高亮代码
const highlight = (code: string, language: string) => {
	// 尝试使用指定的语言高亮代码
	if (language && hljs.getLanguage(language)) {
		try {
			return hljs.highlight(code, { language }).value;
		} catch (error) {
			console.error("代码高亮错误:", error);
		}
	}

	// 如果没有指定语言或找不到指定语言，则尝试自动检测语言
	try {
		return hljs.highlightAuto(code).value;
	} catch (error) {
		console.error("代码高亮错误:", error);
	}

	// 如果高亮失败，返回未修改的代码
	return code;
};

marked.setOptions({
	renderer,
	highlight,
});

interface MarkDownProps {
	content: string;
}

const MarkDown: FC<MarkDownProps> = ({ content }) => {
	const html = marked(content);

	return (
		<div
			dangerouslySetInnerHTML={{
				__html: html,
			}}
		/>
	);
};

export default MarkDown;
