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

export const predicateTypeLabels = {
	[PredicateType.EventToObject]: "Event to Object",
	[PredicateType.ObjectToObject]: "Object to Object",
	[PredicateType.TimeBetweenEvents]: "Time Between Events",
	[PredicateType.EventAttributeRange]: "Event Attribute Range",
	[PredicateType.ObjectAttributeRange]: "Object Attribute Range",
	[PredicateType.ChildBindingSetSize]: "Child Binding Set Size",
	[PredicateType.ChildBindingSetEquals]: "Child Binding Set Equals",
	[PredicateType.AllSatisfied]: "All Satisfied",
	[PredicateType.AnySatisfied]: "Any Satisfied",
	[PredicateType.NoneSatisfied]: "None Satisfied",
	[PredicateType.OrAnySatisfied]: "Or Any Satisfied",
};

export const predicateTypeShortLabels = {
	[PredicateType.EventToObject]: "E2O",
	[PredicateType.ObjectToObject]: "O2O",
	[PredicateType.TimeBetweenEvents]: "TBE",
	[PredicateType.EventAttributeRange]: "EAR",
	[PredicateType.ObjectAttributeRange]: "OAR",
	[PredicateType.ChildBindingSetSize]: "CBS",
	[PredicateType.ChildBindingSetEquals]: "CBE",
	[PredicateType.AllSatisfied]: "SAT",
	[PredicateType.AnySatisfied]: "ANY SAT",
	[PredicateType.NoneSatisfied]: "NONE SAT",
	[PredicateType.OrAnySatisfied]: "OR ANY SAT",
};

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

const baseNodeData = {
	isDisabled: false,
	isHandleOnTop: false,
};

// Uses a function to create a new objectTypes/eventTypes array instead of using the same
export const defaultNodeData = {
	[EVENT_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "EventNode",
			eventTypes: [],
			eventAttributeRangePredicates: [],
		}) satisfies EventNodeData,
	[OBJECT_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "ObjectNode",
			objectTypes: [],
			objectAttributeRangePredicates: [],
		}) satisfies ObjectNodeData,
	[SUBQUERY_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "SubqueryNode",
			subqueryPredicates: [],
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
			objectAttributeTimeMode: { timeMode: TimeMode.Always },
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
