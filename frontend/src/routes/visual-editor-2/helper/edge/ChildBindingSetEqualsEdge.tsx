import { type Node, type Edge, type EdgeProps, useReactFlow } from "@xyflow/react";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import { useContext, useState } from "react";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { EVENT_NODE_TYPE, OBJECT_NODE_TYPE } from "@/routes/visual-editor-2/helper/const.ts";
import { Combobox } from "@/components/ui/combobox.tsx";
import type {
	ChildBindingSetEqualsEdgeData,
	EdgeDataTypes,
	NodeDataTypes,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import PredicateEdge from "@/routes/visual-editor-2/helper/edge/common/PredicateEdge.tsx";

export default function ChildBindingSetEqualsEdge(
	props: EdgeProps<Edge<ChildBindingSetEqualsEdgeData>>,
) {
	const { id, data } = props;
	const { onEdgeDataChange } = useContext(VisualEditorContext);

	const instance = useReactFlow<Node<NodeDataTypes>, Edge<EdgeDataTypes>>();
	// TODO: Only allow nodes in same box or above
	const nodes = instance
		.getNodes()
		.filter((node) => node.type === EVENT_NODE_TYPE || node.type === OBJECT_NODE_TYPE);
	const options = nodes.map((node) => ({ value: node.id, label: node.id }));

	const [value, setValue] = useState<{
		projected: string;
		projectedNodeAId: string | undefined;
		projectedNodeBId: string | undefined;
	}>({
		projected: "false",
		projectedNodeAId: undefined,
		projectedNodeBId: undefined,
	});

	return (
		<PredicateEdge
			type={PredicateType.ChildBindingSetEquals}
			flavor="cbe"
			edgeProps={props}
			onOpen={() =>
				setValue({
					projected: data?.projected ? "true" : "false",
					projectedNodeAId: data?.projected ? data.projectedNodeAId : undefined,
					projectedNodeBId: data?.projected ? data.projectedNodeBId : undefined,
				})
			}
			onSave={(mode) => {
				onEdgeDataChange(id, {
					mode: mode,
					projected: value.projected === "true",
					projectedNodeAId: value.projected === "true" ? value.projectedNodeAId : undefined,
					projectedNodeBId: value.projected === "true" ? value.projectedNodeBId : undefined,
					isInitialized: true,
				});
			}}
		>
			<span>Project this {data?.mode} to a child set.</span>
			<ToggleGroup
				className="justify-start my-3"
				type="single"
				value={value.projected}
				onValueChange={(v) =>
					setValue((oldValue) => ({
						...oldValue,
						projected: v,
					}))
				}
			>
				<ToggleGroupItem value={"true"} variant={"outline"}>
					Projected
				</ToggleGroupItem>
				<ToggleGroupItem value={"false"} variant={"outline"}>
					Not Projected
				</ToggleGroupItem>
			</ToggleGroup>
			<Combobox
				options={options}
				disabled={value.projected !== "true"}
				onChange={(newNode) =>
					setValue((oldValue) => {
						return {
							...oldValue,
							projectedNodeAId: newNode || undefined,
						};
					})
				}
				name={"Project on Source"}
				value={value.projectedNodeAId ?? ""}
			/>
			<Combobox
				options={options}
				disabled={value.projected !== "true"}
				onChange={(newNode) =>
					setValue((oldValue) => {
						return {
							...oldValue,
							projectedNodeBId: newNode || undefined,
						};
					})
				}
				name={"Project on Target"}
				value={value.projectedNodeBId ?? ""}
			/>
		</PredicateEdge>
	);
}
