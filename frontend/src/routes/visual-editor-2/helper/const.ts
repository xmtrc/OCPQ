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
	EventNodePredicate,
	EventToObjectEdgeData,
	ObjectAttributeRangeEdgeData,
	ObjectNodeData,
	ObjectNodePredicate,
	ObjectToObjectEdgeData,
	OrAnySatisfiedEdgeData,
	SubqueryNodeData,
	SubqueryNodePredicate,
	TimeBetweenEventsEdgeData,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import {
	type AttributeRange,
	PredicateMode,
	PredicateType,
	RangeType,
	TimeMode,
} from "@/routes/visual-editor-2/helper/types.ts";
import OrAnySatisfiedEdge from "@/routes/visual-editor-2/helper/edge/OrAnySatisfiedEdge.tsx";
import ObjectAttributeRangeEdge from "@/routes/visual-editor-2/helper/edge/ObjectAttributeRangeEdge.tsx";
import { v4 } from "uuid";

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
			predicates: [],
		}) satisfies EventNodeData,
	[OBJECT_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "ObjectNode",
			objectTypes: [],
			predicates: [],
		}) satisfies ObjectNodeData,
	[SUBQUERY_NODE_TYPE]: () =>
		({
			...baseNodeData,
			displayName: "SubqueryNode",
			predicates: [],
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
			objectAttributeTimeMode: { mode: TimeMode.Sometime },
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

export const defaultNodePredicateData = {
	[PredicateType.EventAttributeRange]: () =>
		({
			id: v4(),
			type: PredicateType.EventAttributeRange,
			mode: PredicateMode.Filter,
			attribute: "",
			range: { rangeType: RangeType.String, values: [] },
			isInitialized: false,
		}) satisfies EventNodePredicate,
	[PredicateType.ObjectAttributeRange]: () =>
		({
			id: v4(),
			type: PredicateType.ObjectAttributeRange,
			mode: PredicateMode.Filter,
			attribute: "",
			objectAttributeTimeMode: { mode: TimeMode.Sometime },
			range: { rangeType: RangeType.String, values: [] },
			isInitialized: false,
		}) satisfies ObjectNodePredicate,
	[PredicateType.ChildBindingSetSize]: () =>
		({
			id: v4(),
			type: PredicateType.ChildBindingSetSize,
			mode: PredicateMode.Filter,
			projected: false,
			projectedNodeId: undefined,
			min: null,
			max: null,
			isInitialized: false,
		}) satisfies SubqueryNodePredicate,
	[PredicateType.AllSatisfied]: () =>
		({
			id: v4(),
			type: PredicateType.AllSatisfied,
			mode: PredicateMode.Constraint,
			isInitialized: false,
		}) satisfies SubqueryNodePredicate,
	[PredicateType.AnySatisfied]: () =>
		({
			id: v4(),
			type: PredicateType.AnySatisfied,
			mode: PredicateMode.Constraint,
			isInitialized: false,
		}) satisfies SubqueryNodePredicate,
	[PredicateType.NoneSatisfied]: () =>
		({
			id: v4(),
			type: PredicateType.NoneSatisfied,
			mode: PredicateMode.Constraint,
			isInitialized: false,
		}) satisfies SubqueryNodePredicate,
};

export const defaultAttributeRangeData = {
	[RangeType.Integer]: () =>
		({
			rangeType: RangeType.Integer,
			min: null,
			max: null,
		}) satisfies AttributeRange,
	[RangeType.Float]: () =>
		({
			rangeType: RangeType.Float,
			min: null,
			max: null,
		}) satisfies AttributeRange,
	[RangeType.Boolean]: () =>
		({
			rangeType: RangeType.Boolean,
			value: true,
		}) satisfies AttributeRange,
	[RangeType.String]: () =>
		({
			rangeType: RangeType.String,
			values: [],
		}) satisfies AttributeRange,
	[RangeType.Time]: () =>
		({
			rangeType: RangeType.Time,
			from: null,
			to: null,
		}) satisfies AttributeRange,
};
