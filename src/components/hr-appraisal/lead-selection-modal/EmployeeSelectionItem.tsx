import {
    Square,
    SquareCheckBig
} from "lucide-react";

import "./EmployeeSelectionItem.css";

interface EmployeeSelectionItemProps {
    employeeName: string;
    selected: boolean;
    onClick: () => void;
}

function EmployeeSelectionItem({
    employeeName,
    selected,
    onClick
}: EmployeeSelectionItemProps) {

    return (
        <div
            className="employee-selection-item"
            onClick={onClick}
        >

            <div className="employee-selection-name">
                {employeeName}
            </div>

            <div className="employee-selection-icon">

                {selected
                    ? <SquareCheckBig size={18} />
                    : <Square size={18} />
                }

            </div>

        </div>
    );
}

export default EmployeeSelectionItem;