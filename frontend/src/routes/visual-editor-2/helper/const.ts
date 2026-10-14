import EventNode from "./node/EventNode.tsx";
import ObjectNode from "./node/ObjectNode.tsx";
import SubqueryNode from "./node/SubqueryNode.tsx";
import EventToObjectEdge from "./edge/EventToObjectEdge.tsx";
import ObjectToObjectEdge from "./edge/ObjectToObjectEdge.tsx";
import TimeBetweenEventsEdge from "./edge/TimeBetweenEventsEdge.tsx";
import ChildBindingSetEqualsEdge from "./edge/ChildBindingSetEqualsEdge.tsx";
import type {
	ChildBindingSetEqualsEdgeData,
	EventNodeData,
	EventToObjectEdgeData,
	ObjectAttributeRangeEdgeData,
	ObjectNodeData,
	ObjectToObjectEdgeData,
	OrAnySatisfiedEdgeData,
	SubqueryNodeData,
	TimeBetweenEventsEdgeData,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import {
	PredicateMode,
	PredicateType,
	RangeType,
	TimeMode,
} from "@/routes/visual-editor-2/helper/types.ts";
import OrAnySatisfiedEdge from "@/routes/visual-editor-2/helper/edge/OrAnySatisfiedEdge.tsx";
import ObjectAttributeRangeEdge from "@/routes/visual-editor-2/helper/edge/ObjectAttributeRangeEdge.tsx";

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
	[PredicateType.ObjectAttributeRange]: ObjectAttributeRangeEdge,
	[PredicateType.ChildBindingSetEquals]: ChildBindingSetEqualsEdge,
	[PredicateType.OrAnySatisfied]: OrAnySatisfiedEdge,
};

export const edgeTypeLabels = {
	[PredicateType.EventToObject]: "Event to Object",
	[PredicateType.ObjectToObject]: "Object to Object",
	[PredicateType.TimeBetweenEvents]: "Time Between Events",
	[PredicateType.ObjectAttributeRange]: "Object Attribute Range",
	[PredicateType.ChildBindingSetEquals]: "Child Binding Set Equals",
	[PredicateType.OrAnySatisfied]: "Or Any Satisfied",
};

export const edgeTypeShortLabels = {
	[PredicateType.EventToObject]: "E2O",
	[PredicateType.ObjectToObject]: "O2O",
	[PredicateType.TimeBetweenEvents]: "TBE",
	[PredicateType.ObjectAttributeRange]: "OAR",
	[PredicateType.ChildBindingSetEquals]: "CBE",
	[PredicateType.OrAnySatisfied]: "Or Any",
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
	[PredicateType.ObjectAttributeRange]: () =>
		({
			...baseEdgeData,
			type: PredicateType.ObjectAttributeRange,
			attribute: "",
			objectAttributeTimeMode: { mode: TimeMode.Always },
			range: { rangeType: RangeType.String, values: [] },
		}) satisfies ObjectAttributeRangeEdgeData,
	[PredicateType.ChildBindingSetEquals]: () =>
		({
			...baseEdgeData,
			type: PredicateType.ChildBindingSetEquals,
			projected: false,
		}) satisfies ChildBindingSetEqualsEdgeData,
	[PredicateType.OrAnySatisfied]: () =>
		({
			...baseEdgeData,
			type: PredicateType.OrAnySatisfied,
			mode: PredicateMode.Constraint,
		}) satisfies OrAnySatisfiedEdgeData,
};
