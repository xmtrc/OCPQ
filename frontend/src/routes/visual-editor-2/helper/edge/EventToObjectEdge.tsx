import type { Edge, EdgeProps } from "@xyflow/react";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import { useContext, useRef } from "react";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { EventToObjectEdgeData } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import PredicateEdge from "@/routes/visual-editor-2/helper/edge/common/PredicateEdge.tsx";

export default function EventToObjectEdge(props: EdgeProps<Edge<EventToObjectEdgeData>>) {
	const { id, data } = props;
	const { onEdgeDataChange } = useContext(VisualEditorContext);
	const qualifierRef = useRef<HTMLInputElement>(null);

	return (
		<PredicateEdge
			type={PredicateType.EventToObject}
			label={data?.qualifier}
			flavor="e2o"
			edgeProps={props}
			onSave={(mode) => {
				onEdgeDataChange(id, {
					mode: mode,
					isInitialized: true,
					qualifier: qualifierRef.current?.value.trim() || undefined,
				});
			}}
		>
			<span>Enter the qualifier below.</span>
			<Input
				placeholder="Qualifier"
				className="my-3"
				defaultValue={data?.qualifier ?? ""}
				ref={qualifierRef}
			/>
		</PredicateEdge>
	);
}
