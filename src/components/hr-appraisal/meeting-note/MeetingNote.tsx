import {
    useEffect,
    useState
} from "react";

import {
    NotebookPen,
    Pencil
} from "lucide-react";

import {
    useGetAppraisalIdpQuery,
    useCreateIdpTextMutation,
    useUpdateIdpTextMutation
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
        data: idpData,
        isLoading
    } = useGetAppraisalIdpQuery(
        appraisalId,
        {
            skip: !appraisalId
        }
    );

    const [
        createIdpText
    ] = useCreateIdpTextMutation();

    const [
        updateIdpText
    ] = useUpdateIdpTextMutation();

    const [isEditing, setIsEditing] =
        useState(false);

    const [notes, setNotes] =
        useState("");

    const existingData =
        !!idpData?.idp_text?.trim();

    const isReadOnly =
        appraisalStatus ===
        "APPRAISAL_DONE";

    const canEdit =
        appraisalStatus ===
            "FEEDBACK_SUBMITTED" ||
        appraisalStatus ===
            "MEETING_DONE";

    useEffect(() => {

        if (idpData?.idp_text) {
            setNotes(
                idpData.idp_text
            );
        }

    }, [idpData]);

    async function handleSave() {

        const payload = {
            idp_text: notes.trim()
        };

        try {

            if (existingData) {

                await updateIdpText({
                    appraisalId,
                    body: payload
                }).unwrap();

            }
            else {

                await createIdpText({
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
                        onChange={e =>
                            setNotes(
                                e.target.value
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
                            No meeting
                            notes have
                            been added
                            yet.
                        </span>
                    )}

                </div>
            )}

        </div>
    );
}

export default MeetingNotes;