import { Handle, Position } from "@xyflow/react";

interface NodeHandleProps {
	id: string;
	isOnTop: boolean;
}

export default function NodeHandle(props: NodeHandleProps) {
	return (
		<Handle
			type="source"
			position={Position.Top}
			id={`handle:${props.id}`}
			className="hover:shadow-[inset_0_0_0_8px_rgb(0_0_0/0.12)] transition duration-200"
			style={{
				inset: "-8px",
				width: "auto",
				height: "auto",
				minWidth: 0,
				minHeight: 0,
				transform: "none",
				borderRadius: "14px",
				border: "none",
				background: "transparent",
				zIndex: props.isOnTop ? 2 : -1,
			}}
		/>
	);
}
