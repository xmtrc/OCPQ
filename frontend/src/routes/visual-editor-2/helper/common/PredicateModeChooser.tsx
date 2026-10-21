import { PredicateMode } from "@/routes/visual-editor-2/helper/types.ts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";

interface PredicateModeChooserProps {
	predicateMode: PredicateMode;
	setPredicateMode: (mode: PredicateMode) => void;
}

export default function PredicateModeChooser({
	predicateMode,
	setPredicateMode,
}: PredicateModeChooserProps) {
	return (
		<ToggleGroup
			className="justify-start mb-3 mt-1"
			type="single"
			value={predicateMode}
			onValueChange={(v) => v && setPredicateMode(v as PredicateMode)}
		>
			<ToggleGroupItem value={PredicateMode.Filter} variant={"outline"}>
				Filter
			</ToggleGroupItem>
			<ToggleGroupItem value={PredicateMode.Constraint} variant={"outline"}>
				Constraint
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
