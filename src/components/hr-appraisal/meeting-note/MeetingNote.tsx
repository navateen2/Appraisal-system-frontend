import {
    useEffect,
    useState
} from "react";

import {
    NotebookPen,
    Pencil
} from "lucide-react";

import {
    useGetAppraisalMeetingNotesQuery,
    useCreateMeetingNotesMutation,
    useUpdateMeetingNotesMutation,
} from "../../../api_service/appraisal/appraisal.api";

import "./MeetingNotes.css";
import type { AppraisalStatus } from "../../../types/appraisal";

interface MeetingNotesProps {
    appraisalId: number;
    appraisalStatus: AppraisalStatus;
}

function MeetingNotes({
    appraisalId,
    appraisalStatus
}: MeetingNotesProps) {

    const {
        data: meetingNotesData,
        isLoading
    } = useGetAppraisalMeetingNotesQuery(
        appraisalId,
        {
            skip: !appraisalId
        }
    );

    const [
        createMeetingNotes
    ] = useCreateMeetingNotesMutation();

    const [
        updateMeetingNotes
    ] = useUpdateMeetingNotesMutation();

    const [isEditing, setIsEditing] =
        useState(false);

    const [notes, setNotes] =
        useState("");
        
    const existingData =
        meetingNotesData?.meeting_notes != null;

    const isReadOnly =
        appraisalStatus ===
        "APPRAISAL_DONE";

    const canEdit =
        appraisalStatus ===
            "FEEDBACK_SUBMITTED" ||
        appraisalStatus ===
            "MEETING_DONE";

    useEffect(() => {

        setNotes(
            meetingNotesData?.meeting_notes ?? ""
        );

    }, [meetingNotesData]);

    async function handleSave() {

        const trimmedNotes =
            notes.trim();

        const payload = {
            meeting_notes:
                trimmedNotes
        };

        try {

            if (existingData) {

                await updateMeetingNotes({
                    appraisalId,
                    body: payload
                }).unwrap();

            }
            else {

                await createMeetingNotes({
                    appraisalId,
                    body: payload
                }).unwrap();

            }

            setIsEditing(false);

        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="meeting-notes-card">

            <div className="meeting-notes-header">

                <div className="meeting-notes-title">

                    <NotebookPen
                        size={18}
                        strokeWidth={2.3}
                    />

                    Meeting Notes

                </div>

                {canEdit &&
                    !isReadOnly &&
                    !isEditing && (
                        <button
                            className="meeting-edit-button"
                            onClick={() =>
                                setIsEditing(
                                    true
                                )
                            }
                        >
                            <Pencil
                                size={15}
                            />
                        </button>
                    )}

            </div>

            <div className="meeting-divider" />

            {isLoading ? (

                <div className="meeting-placeholder">
                    Loading...
                </div>

            ) : isEditing ? (

                <>
                    <textarea
                        className="meeting-textarea"
                        value={notes}
                        onChange={(event) =>
                            setNotes(
                                event.target.value
                            )
                        }
                        placeholder="Enter meeting notes..."
                    />

                    <div className="meeting-actions">

                        <button
                            className="meeting-save-button"
                            onClick={
                                handleSave
                            }
                        >
                            Done
                        </button>

                    </div>
                </>

            ) : (

                <div className="meeting-content">

                    {notes.trim() ? (
                        notes
                    ) : (
                        <span className="meeting-placeholder">
                            No meeting notes
                            have been added yet.
                        </span>
                    )}

                </div>

            )}

        </div>
    );
}

export default MeetingNotes;