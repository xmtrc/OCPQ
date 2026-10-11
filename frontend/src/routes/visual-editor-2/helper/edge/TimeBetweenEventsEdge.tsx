import type { Edge, EdgeProps } from "@xyflow/react";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import { useContext, useState } from "react";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import TimeDurationInput from "@/components/TimeDurationInput.tsx";
import type { TimeBetweenEventsEdgeData } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import PredicateEdge from "@/routes/visual-editor-2/helper/edge/common/PredicateEdge.tsx";
import { defaultEdgeData } from "@/routes/visual-editor-2/helper/const.ts";

export default function TimeBetweenEventsEdge(props: EdgeProps<Edge<TimeBetweenEventsEdgeData>>) {
	const { id, data } = props;
	const { onEdgeDataChange } = useContext(VisualEditorContext);
	const [value, setValue] = useState<TimeBetweenEventsEdgeData>(
		data ?? defaultEdgeData[PredicateType.TimeBetweenEvents](),
	);
	// TODO: Add timeline interface

	return (
		<PredicateEdge
			type={PredicateType.TimeBetweenEvents}
			flavor="tbe"
			edgeProps={props}
			onOpen={() => {
				setValue(data ?? defaultEdgeData[PredicateType.TimeBetweenEvents]());
			}}
			onSave={(mode) => {
				onEdgeDataChange(id, {
					mode: mode,
					isInitialized: true,
					min: value.min,
					max: value.max,
				});
			}}
		>
			<span>Enter the timestamps below.</span>
			<div className="*:my-3">
				<TimeDurationInput
					placeholder="Minimum Duration/Delay (Optional)"
					durationSeconds={value.min ?? Number.NEGATIVE_INFINITY}
					onChange={(newVal) =>
						setValue({
							...value,
							min: newVal,
						})
					}
				/>
				<TimeDurationInput
					placeholder="Maximum Duration/Delay (Optional)"
					durationSeconds={value.max ?? Number.POSITIVE_INFINITY}
					onChange={(newVal) =>
						setValue({
							...value,
							max: newVal,
						})
					}
				/>
			</div>
		</PredicateEdge>
	);
}
