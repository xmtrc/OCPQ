import { type Edge, type EdgeProps, getBezierPath, useInternalNode } from "@xyflow/react";

import { getEdgeParams } from "./floatingEdgeUtils.ts";
import type React from "react";

const STROKE_WIDTH = 2;

function FloatingEdge({
	id,
	source,
	target,
	selected,
	markerEnd,
}: EdgeProps<Edge<Record<string, unknown>>>) {
	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	if (!sourceNode || !targetNode) {
		return null;
	}

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

	const [edgePath] = getBezierPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetPosition: targetPos,
		targetX: tx,
		targetY: ty,
	});

	const pathStyle: React.CSSProperties = {
		stroke: "#646464",
		strokeWidth: STROKE_WIDTH,
		strokeDasharray: selected === true ? "7 3" : undefined,
	};

	return (
		<path
			id={id}
			className="react-flow__edge-path z-1"
			d={edgePath}
			markerEnd={markerEnd}
			style={pathStyle}
		/>
	);
}

export default FloatingEdge;
