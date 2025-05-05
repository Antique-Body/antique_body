import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { MessageIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const NotesCard = ({ notes, onNotesChange, onSaveNotes }) => (
        <Card variant="darkStrong" width="100%" maxWidth="none">
            <h3 className="mb-4 flex items-center text-xl font-semibold">
                <MessageIcon size={20} stroke="#FF6B00" className="mr-2" />
                Notes & Feedback
            </h3>
            <FormField
                type="textarea"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Add notes about this client's progress, challenges, or feedback..."
                className="mb-3"
            />
            <Button onClick={onSaveNotes} variant="orangeFilled">
                Save Notes
            </Button>
        </Card>
    );
