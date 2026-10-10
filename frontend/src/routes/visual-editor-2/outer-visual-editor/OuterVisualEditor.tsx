import {
	type TypedFlowInstance,
	FlowContext,
} from "@/routes/visual-editor-2/helper/FlowContext.tsx";
import { useOcelInfo } from "@/hooks";
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import VisualEditor from "@/routes/visual-editor-2/VisualEditor.tsx";

export default function VisualEditorOuter() {
	const ocelInfo = useOcelInfo();
	const [currentInstance, setCurrentInstance] = useState<TypedFlowInstance | undefined>(undefined);

	return (
		<div className="w-full h-full">
			<FlowContext.Provider
				value={{
					flowInstance: currentInstance,
					setInstance: (i) => setCurrentInstance(i),
				}}
			>
				{ocelInfo !== undefined && (
					<ReactFlowProvider>
						<VisualEditor ocelInfo={ocelInfo} />
					</ReactFlowProvider>
				)}
			</FlowContext.Provider>
		</div>
	);
}
