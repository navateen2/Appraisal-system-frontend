import {
    Info
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import EmployeeSelectionItem
from "./EmployeeSelectionItem";

import "./LeadSelectionModal.css";

export interface EmployeeOption {
    employeeId: string;
    employeeName: string;
}

interface LeadSelectionModalProps {
    open: boolean;

    employees: EmployeeOption[];

    onClose: () => void;

    onDone: (
        employeeIds: string[]
    ) => Promise<void>;
}

function LeadSelectionModal({
    open,
    employees,
    onClose,
    onDone
}: LeadSelectionModalProps) {

    const [selectedIds, setSelectedIds] =
        useState<string[]>([]);

    useEffect(() => {
        if (!open) {
            setSelectedIds([]);
        }
    }, [open]);

    if (!open) {
        return null;
    }

    const toggleEmployee = (
        employeeId: string
    ) => {

        if (
            selectedIds.includes(employeeId)
        ) {
            setSelectedIds(
                selectedIds.filter(
                    id => id !== employeeId
                )
            );

            return;
        }

        setSelectedIds([
            ...selectedIds,
            employeeId
        ]);
    };

    const handleDone = async () => {

        if (selectedIds.length === 0) {
            return;
        }

        await onDone(selectedIds);

        onClose();
    };

    return (
        <div
            className="lead-selection-overlay"
            onClick={onClose}
        >

            <div
                className="lead-selection-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="lead-selection-header">

                    <div className="lead-selection-title">
                        Select Leads
                    </div>

                    <button
                        className="lead-selection-done-button"
                        onClick={handleDone}
                    >
                        Done
                    </button>

                </div>

                <div className="lead-selection-divider" />

                <div className="lead-selection-list">

                    {employees.map(employee => (

                        <EmployeeSelectionItem
                            employeeName={
                                employee.employeeName
                            }
                            selected={
                                selectedIds.includes(
                                    employee.employeeId
                                )
                            }
                            onClick={() =>
                                toggleEmployee(
                                    employee.employeeId
                                )
                            }
                        />

                    ))}

                </div>

                <div className="lead-selection-footer">

                    <Info size={14} />

                    <span>
                        Feedback requests will be sent
                        immediately after clicking
                        Done.
                    </span>

                </div>

            </div>

        </div>
    );
}

export default LeadSelectionModal;