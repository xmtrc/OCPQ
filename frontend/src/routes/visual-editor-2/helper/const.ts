import EventNode from "./node/EventNode.tsx";
import ObjectNode from "./node/ObjectNode.tsx";
import SubqueryNode from "./node/SubqueryNode.tsx";
import PlaceholderEdge from "./edge/PlaceholderEdge.tsx";
import EventToObjectEdge from "./edge/EventToObjectEdge.tsx";
import ObjectToObjectEdge from "./edge/ObjectToObjectEdge.tsx";
import TimeBetweenEventsEdge from "./edge/TimeBetweenEventsEdge.tsx";
import ChildBindingSetEqualsEdge from "./edge/ChildBindingSetEqualsEdge.tsx";
import type {
	ChildBindingSetEqualsData,
	EventNodeData,
	EventToObjectEdgeData,
	ObjectNodeData,
	ObjectToObjectEdgeData,
	SubqueryNodeData,
	TimeBetweenEventsEdgeData,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import { PredicateMode, PredicateType } from "@/routes/visual-editor-2/helper/types.ts";

// Nodes
export const EVENT_NODE_TYPE = "eventNodeType";
export const OBJECT_NODE_TYPE = "objectNodeType";
export const SUBQUERY_NODE_TYPE = "subqueryNodeType";

export const nodeTypes = {
	[EVENT_NODE_TYPE]: EventNode,
	[OBJECT_NODE_TYPE]: ObjectNode,
	[SUBQUERY_NODE_TYPE]: SubqueryNode,
};

// Edges
export const edgeTypes = {
	[PredicateType.EventToObject]: EventToObjectEdge,
	[PredicateType.ObjectToObject]: ObjectToObjectEdge,
	[PredicateType.TimeBetweenEvents]: TimeBetweenEventsEdge,
	[PredicateType.EventAttributeRange]: PlaceholderEdge,
	[PredicateType.ObjectAttributeRange]: PlaceholderEdge,
	[PredicateType.ChildBindingSetEquals]: ChildBindingSetEqualsEdge,
	[PredicateType.OrAnySatisfied]: PlaceholderEdge,
};

export const edgeTypeLabels = {
	[PredicateType.EventToObject]: "E2O",
	[PredicateType.ObjectToObject]: "O2O",
	[PredicateType.TimeBetweenEvents]: "TBE",
	[PredicateType.EventAttributeRange]: "",
	[PredicateType.ObjectAttributeRange]: "",
	[PredicateType.ChildBindingSetEquals]: "CBE",
	[PredicateType.OrAnySatisfied]: "",
	undefined: "",
};

const baseNodeData = {
	isDisabled: false,
	isHandleOnTop: false,
};

// Uses a function to create a new objectTypes/eventTypes array instead of using the same
export const defaultNodeData = {
	[OBJECT_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "ObjectNode",
			objectTypes: [],
		}) satisfies ObjectNodeData,
	[EVENT_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "EventNode",
			eventTypes: [],
		}) satisfies EventNodeData,
	[SUBQUERY_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "SubqueryNode",
		}) satisfies SubqueryNodeData,
};

const baseEdgeData = {
	mode: PredicateMode.Filter,
	isInitialized: false,
};

export const defaultEdgeData = {
	[PredicateType.EventToObject]: () =>
		({
			...baseEdgeData,
			type: PredicateType.EventToObject,
		}) satisfies EventToObjectEdgeData,
	[PredicateType.ObjectToObject]: () =>
		({
			...baseEdgeData,
			type: PredicateType.ObjectToObject,
		}) satisfies ObjectToObjectEdgeData,
	[PredicateType.TimeBetweenEvents]: () =>
		({
			...baseEdgeData,
			type: PredicateType.TimeBetweenEvents,
		}) satisfies TimeBetweenEventsEdgeData,
	[PredicateType.EventAttributeRange]: () => ({
		...baseEdgeData,
	}),
	[PredicateType.ObjectAttributeRange]: () => ({
		...baseEdgeData,
	}),
	[PredicateType.ChildBindingSetEquals]: () =>
		({
			...baseEdgeData,
			type: PredicateType.ChildBindingSetEquals,
		}) satisfies ChildBindingSetEqualsData,
	[PredicateType.OrAnySatisfied]: () => ({
		...baseEdgeData,
	}),
};
