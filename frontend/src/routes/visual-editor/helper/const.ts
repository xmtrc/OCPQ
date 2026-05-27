import EventTypeLink from "./EventTypeLink";
import EventTypeNode from "./node/EventTypeNode";
import GateNode from "./node/GateNode";
import EventNode from "./node/EventNode.tsx";
import ObjectNode from "./node/ObjectNode.tsx";
import SubqueryNode from "./node/SubqueryNode.tsx";

export const EVENT_TYPE_LINK_TYPE = "eventTypeLink";
export const EVENT_TYPE_NODE_TYPE = "eventType";
export const GATE_NODE_TYPE = "gate";
export const EVENT_NODE_TYPE = "eventNodeType"
export const OBJECT_NODE_TYPE = "objectNodeType"
export const SUBQUERY_NODE_TYPE = "subqueryNodeType"

export const nodeTypes = {
	[EVENT_TYPE_NODE_TYPE]: EventTypeNode,
	[GATE_NODE_TYPE]: GateNode,
	[EVENT_NODE_TYPE]: EventNode,
	[OBJECT_NODE_TYPE]: ObjectNode,
	[SUBQUERY_NODE_TYPE]: SubqueryNode,
};
export const edgeTypes = {
	[EVENT_TYPE_LINK_TYPE]: EventTypeLink,
};

export const NODE_TYPE_SIZE = {
	[EVENT_TYPE_NODE_TYPE]: { width: 240, minHeight: 110.58 },
	[GATE_NODE_TYPE]: { width: 128, minHeight: 80 },
};
