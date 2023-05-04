import { FC } from "react";

import { ConfigProvider } from "antd";
import { Outlet } from "umi";
import local from "antd/locale/zh_CN";

const Basic: FC = () => {
	return (
		<ConfigProvider
			locale={local}
			theme={{
				components: {
					Input: {
						controlHeight: 50,
						colorBorder: "rgba(32,33,35,.5)",
						colorPrimary: "rgba(32,33,35,.5)",
						colorPrimaryHover: "rgba(32,33,35,.5)",
						fontSize: 16,
						colorTextPlaceholder: "#8e8e9f",
					},
				},
			}}
		>
			<Outlet />
		</ConfigProvider>
	);
};

export default Basic;
