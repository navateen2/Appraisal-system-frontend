import { useNavigate } from "react-router";
import "./cycles.css";
import { useAssignEmployeesToCycleMutation, useCreateCycleMutation, useGetCyclesQuery } from "../../api_service/cycle/cycle.api";
import { useState } from "react";
import { useGetUsersQuery } from "../../api_service/employees/employee.api";

function Cycles() {
    const [createFormVisible, setCreateFormVisible] = useState(false);
    return (
        <div className="cycles-page">
            {createFormVisible && <CreateCycle fn={setCreateFormVisible} />}
            <div className="cycles-header">
                <div className="cycles-header-text">
                    <span className="cycles-header-title">Appraisal Cycles</span>
                    <span className="cycles-header-subtitle">Manage Cycles</span>
                </div>

                <button className="cycles-header-button" onClick={() => setCreateFormVisible(true)}>
                    <img src="/src/assets/add.svg" alt="" />
                    New Appraisal Cycle
                </button>
            </div>
            <div className="cycles-table">
                <div className="cycles-row column-names">
                    <span className="column-id">ID</span>
                    <span className="column-name">CYCLE NAME</span>
                    <span className="column-daterange">DATE RANGE</span>
                    <span className="column-status">STATUS</span>
                </div>

                {useGetCyclesQuery().isLoading && <div>Loading...</div>}
                {useGetCyclesQuery().data?.map((cycle: any) => (
                    <CyclesRow
                        key={cycle.id}
                        id={cycle.id}
                        name={cycle.name}
                        dateRange={cycle.start_date.substring(0, 10) + " - " + cycle.end_date.substring(0, 10)}
                        status={cycle.status}
                    />
                ))}
            </div>

        </div>
    )
}

function CyclesRow({ id, name, dateRange, status }: { id: string, name: string, dateRange: string, status: string }) {
    const navigate = useNavigate();
    return (
        <div className="cycles-row" onClick={() => navigate(`/hr/cycles/${id}`)}>
            <span className="column-id">{id}</span>
            <span className="column-name">{name}</span>
            <span className="column-daterange">{dateRange}</span>
            <span className="column-status">
                <StatusBadge status={status} />
            </span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const statusClass: any = {
        "In Progress": "status-in-progress",
        "Completed": "status-completed",
        "Initiated": "status-initiated",
    }
    return (
        <span className={`status-badge ${statusClass[status]}`}> {status} </span>
    )
}

export default Cycles;


function correctDate(date: string) {
    console.log(date);
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
}
function CreateCycle({ fn }: { fn: (arg0: boolean) => void }) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [createCycle,] = useCreateCycleMutation();
    const employees = useGetUsersQuery();
    console.log(employees?.data);
    const [search, setSearch] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
    const [addEmployeesToCycle,] = useAssignEmployeesToCycleMutation()


    const filteredEmployees = employees.data?.filter((employee: any) =>
        employee.name.toLowerCase().includes(search.toLowerCase())
    );
    async function handleSubmit() {
        if (name.length < 3) {
            alert("Name must be at least 3 characters long");
            return;
        }
        if (startDate === "" || endDate === "") {
            alert("Start date and end date must be selected");
            return;
        }
        if (startDate > endDate) {
            alert("Start date cannot be after end date");
            return;
        }
        try{
            const response_cycle= await createCycle({
                "name": name,
                "start_date": startDate,
                "end_date": endDate,
                "status": "Initiated"
            }).unwrap();
            console.log(response_cycle.id);
            await addEmployeesToCycle({
                "cycle_id": response_cycle.id,
                "body": {
                    "employee_ids": selectedEmployees.map((employee) => employee.id)
                }
            }).unwrap();
        } catch (err) {
        console.error(err);
     }
        

        fn(false);
    }
    return (
        <div className="overlay">

            <div className="create-cycle-form">
                <div className="create-cycle-form-header">
                    <span className="create-cycle-form-title">Create Appraisal Cycle</span>
                    <img src="/src/assets/close.svg" alt="" className="create-cycle-form-close" />
                </div>
                <div className="create-cycle-form-body">
                    <span className="create-cycle-form-label">CYCLE DETAILS</span>
                    <div className="form-pair">
                        <span className="form-pair-name">Cycle Name</span>
                        <input type="text" className="form-pair-input" value={name} onChange={(e) => setName(e.target.value)} />
                        {((name.length < 3 || name.length > 50) && name.length != 0) && <span className="validation-error">Name must be between 3 and 50 characters</span>}
                    </div>
                    <div className="date-pair">
                        <div className="form-pair">
                            <span className="form-pair-name" >Start Date</span>
                            <input type="date" className="form-pair-input" onClick={(e) => e.currentTarget.showPicker?.()} onChange={(e) => setStartDate(correctDate(e.currentTarget.value))} />
                        </div>
                        <div className="form-pair">
                            <span className="form-pair-name">End Date</span>
                            <input type="date" className="form-pair-input" onClick={(e) => e.currentTarget.showPicker?.()} onChange={(e) => setEndDate(correctDate(e.currentTarget.value))} />
                        </div>
                    </div>
                    <span className="create-cycle-form-label">ADD EMPLOYEES</span>
                    <div className="form-pair">
                        <input type="text" className="form-pair-input" placeholder="Search Employees" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="form-pair-input filter-list">

                            {
                            filteredEmployees?.map((employee) => (
                                <div key={employee?.id} className="filtered-list-item" onClick={() => {
                                    setSearch("");
                                    selectedEmployees.push(employee);
                                    setSelectedEmployees([...selectedEmployees]);
                                    console.log(selectedEmployees)
                                    }
                                    }>
                                    {employee?.name}
                                </div>
                            )
                        )
                            }

                        </div>
                        <div className="form-pair-input filtered-list">

                            {
                            selectedEmployees?.map((employee: any) => (
                                <div key={employee?.id} className="filtered-list-item" onClick={() => {setSearch("");}}>
                                {employee?.name}
                                <img src="/src/assets/close.svg" alt="" />
                                </div>
                            )
                        )
                            }

                        </div>
                    </div>
                </div>
                <div className="create-cycle-form-footer">
                    <button className="create-cycle-form-cancel" onClick={() => fn(false)}>
                        Cancel
                    </button>
                    <button className="create-cycle-form-submit" onClick={handleSubmit}>Create Cycle</button>
                </div>
            </div>
        </div>
    )
}

