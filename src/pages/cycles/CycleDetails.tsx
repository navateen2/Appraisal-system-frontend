import { useNavigate, useParams } from "react-router";
import "./cycledetails.css";
import { useGetCycleByIdQuery, useGetAppraisalsByCycleIdQuery, useUpdateCycleStatusMutation, useDeleteCycleMutation, useUpdateCycleMutation, useAssignEmployeesToCycleMutation } from "../../api_service/cycle/cycle.api";
import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useGetUsersQuery } from "../../api_service/employees/employee.api";

function correctDate(date: string) {
    console.log(date);
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
}
function CycleDetails() {
  const { id } = useParams()
  const cycle = useGetCycleByIdQuery(id || "0");
  const appraisals = useGetAppraisalsByCycleIdQuery( Number(id) || 0);
  const cycleData = cycle.data;
  const [updateCycleStatus] = useUpdateCycleStatusMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  console.log(cycleData);
  return (
    <div className="cycle-details">
      <div className="cycle-details-header">
        <div className="cycle-details-header-left">
          <div className="cycle-details-header-info">
            {getDateRange(cycleData?.start_date, cycleData?.end_date)}
            {cycleData?.status && getStatus(cycleData.status)}
          </div>
          <span className="cycle-details-header-title">{cycleData?.name || "Developer"} Cycle</span>
        </div>
        {cycleData?.status === 'In Progress' && <MarkCycleCompleteButton fn={() => updateCycleStatus({ body: { status: "Completed" }, cycle_id: parseInt(id || "0") })} />}
        {cycleData?.status === 'Initiated' && <div className="button-pair">
          <StartCycleButton fn={() => updateCycleStatus({ body: { status: "In Progress" }, cycle_id: parseInt(id || "0") })} />
          <ButtonPair fnDelete={setShowDeleteModal} fnEdit={setShowEditModal} />
        </div>
        }
      </div>
      <div className="Appraisals-table">
        <div className="cycles-row column-names">
          <span className="column-id">APPRAISAL ID</span>
          <span className="column-id">EMPLOYEE ID</span>
          <span className="column-name">EMPLOYEE NAME</span>
          <span className="column-status">STATUS</span>
        </div>
        {appraisals.isLoading && <div>Loading...</div>}
        {appraisals.data?.map((appraisal) => (
          <AppraisalRow
            key={appraisal.id}
            id={appraisal.id.toString()}
            emp_id={appraisal.employee_id.toString()}
            name={appraisal.employee_name}
            status={appraisal.status}
          />
        ))}
      </div>
      {showDeleteModal && <DeleteCycleModal fn={setShowDeleteModal}  cycle={cycleData} />}
      {showEditModal && <EditCycle fn={setShowEditModal} cycle={cycleData} />}
    </div>
  );
}

export default CycleDetails;

const getDateRange = (start_date?: string, end_date?: string) => {
  return (
    <div className="status-badge">
      {start_date?.substring(0, 10)} to {end_date?.substring(0, 10)}
    </div>
  )
}

const getStatus = (status: string) => {
  const statusClass: any = {
    "In Progress": "status-in-progress",
    "Completed": "status-completed",
    "Initiated": "status-initiated",
  }
  return (
    <div className={`status-badge ${statusClass[status]}`}>
      {status}
    </div>
  )
}

function AppraisalRow({ id, emp_id, name, status }: { id: string, emp_id: string, name: string, status: string }) {
  const navigate = useNavigate();
  return (
    <div className="cycles-row" onClick={() => navigate(`/hr/appraisals/${id}`)}>
      <span className="column-id">{id}</span>
      <span className="column-id">{emp_id}</span>
      <span className="column-name">{name}</span>
      <span className="column-status">
        <StatusBadge status={status} />
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusClass: any = {
    "IN PROGRESS": "status-in-progress",
    "COMPLETED": "status-completed",
    "INITIATED": "status-initiated",
  }
  return (
    <span className={`status-badge ${statusClass[status]}`}> {status} </span>
  )
}




function MarkCycleCompleteButton({ fn }: { fn: any }) {
  return (
    <button className="mark-cycle-complete-button" onClick={fn}>
      Mark Cycle Complete
    </button>
  )
}

function StartCycleButton({ fn }: { fn: any }) {
  return (
    <button className="start-cycle-button" onClick={fn}>
      Start Cycle
    </button>
  )
}

function ButtonPair({fnDelete,fnEdit}: {fnDelete: any, fnEdit: any}) {
  return (
    <div className="button-pair hover">
      <Trash2 onClick={() => fnDelete(true) } />
      <Pen onClick={() => fnEdit(true)} />
    </div>
  )
}

function DeleteCycleModal({ fn,  cycle }: { fn: any, cycle: any }) {
  const [deleteCycle] = useDeleteCycleMutation();
  const navigate = useNavigate();
  return (
  <div className="overlay" onClick={() => fn(false)}>
    <div className="create-cycle-form" onClick={(e) => e.stopPropagation()}>
      <div className="create-cycle-form-header">
        <span className="create-cycle-form-title">
          Delete Cycle
        </span>
      </div>

      <div className="create-cycle-form-body">
        <span className="create-cycle-form-label">
          Are you sure you want to delete this appraisal cycle?
        </span>

        <span className="cycles-header-subtitle">
          <strong>{cycle?.name}</strong>
        </span>

        <span className="cycles-header-subtitle" style={{ color: "#B42318" }} >
          This action cannot be undone.
        </span>
      </div>

      <div className="create-cycle-form-footer">
        <button className="create-cycle-form-cancel" onClick={() => fn(false)} >
          Cancel
        </button>

        <button
          className="create-cycle-form-submit" style={{ backgroundColor: "#D92D20" }} onClick={()=>{handleDelete(cycle?.id,deleteCycle);navigate("/hr/cycles")}} >
          Delete
        </button>
      </div>
    </div>
  </div>
  )
}


function handleDelete(id:number, deleteCycle: any) {
  // Implement the logic to delete the cycle here
  deleteCycle(id);
  
  console.log("Deleting cycle:", id);
}


function EditCycle({ fn ,cycle }: { fn: (arg0: boolean) => void, cycle: any }) {
    const [name, setName] = useState(cycle?.name || "");
    const [startDate, setStartDate] = useState(cycle?.start_date || "");
    const [endDate, setEndDate] = useState(cycle?.end_date || "");
    const [editCycle,] = useUpdateCycleMutation();

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
            await editCycle({
                "id": cycle?.id,
                "name": name,
                "start_date": correctDate(startDate),
                "end_date": correctDate(endDate),
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
                    <span className="create-cycle-form-title">Edit Appraisal Cycle</span>
                    <img src="/src/assets/close.svg" alt="" className="create-cycle-form-close" onClick={()=>fn(false)}/>
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
                            <input type="date" defaultValue={startDate.substring(0, 10)} className="form-pair-input" onClick={(e) => e.currentTarget.showPicker?.()} onChange={(e) => setStartDate((e.currentTarget.value))} />
                        </div>
                        <div className="form-pair">
                            <span className="form-pair-name">End Date</span>
                            <input type="date" defaultValue={endDate.substring(0, 10)} className="form-pair-input" onClick={(e) => e.currentTarget.showPicker?.()} onChange={(e) => setEndDate((e.currentTarget.value))} />
                        </div>
                    
                    
                    </div>
                </div>
                <div className="create-cycle-form-footer">
                    <button className="create-cycle-form-cancel" onClick={() => fn(false)}>
                        Cancel
                    </button>
                    <button className="create-cycle-form-submit" onClick={handleSubmit}>Edit Cycle</button>
                </div>
            </div>
        </div>
    )
}

// function EditCycleAppraisals({ fn ,cycle }: { fn: (arg0: boolean) => void, cycle: any }) {
//     const [name, setName] = useState(cycle?.name || "");
//     const [startDate, setStartDate] = useState(cycle?.start_date || "");
//     const [endDate, setEndDate] = useState(cycle?.end_date || "");
//     const [editCycle,] = useUpdateCycleMutation();
//     const employees = useGetUsersQuery();
//     // const getAppraisals = useGetAppraisalsByCycleIdQuery(cycle?.id || 0);
//     // console.log(employees?.data);
//     const [search, setSearch] = useState("");
//     const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
//     // selectedEmployees.push();
//     const [addEmployeesToCycle,] = useAssignEmployeesToCycleMutation()


//     const filteredEmployees = employees.data?.filter((employee: any) =>
//         employee.name.toLowerCase().includes(search.toLowerCase())
//     );

//     async function handleSubmit() {
//         if (name.length < 3) {
//             alert("Name must be at least 3 characters long");
//             return;
//         }
//         if (startDate === "" || endDate === "") {
//             alert("Start date and end date must be selected");
//             return;
//         }
//         if (startDate > endDate) {
//             alert("Start date cannot be after end date");
//             return;
//         }
//         try{
//             const response_cycle= await editCycle({
//                 "id": cycle?.id,
//                 "name": name,
//                 "start_date": correctDate(startDate),
//                 "end_date": correctDate(endDate),
//             }).unwrap();
//             console.log(response_cycle.id);
//             await addEmployeesToCycle({
//                 "cycle_id": response_cycle.id,
//                 "body": {
//                     "employee_ids": selectedEmployees.map((employee) => employee.id)
//                 }
//             }).unwrap();
//         } catch (err) {
//         console.error(err);
//      }
        

//         fn(false);
//     }
//     return (
//         <div className="overlay">

//             <div className="create-cycle-form">
//                 <div className="create-cycle-form-header">
//                     <span className="create-cycle-form-title">Edit Appraisal Cycle</span>
//                     <img src="/src/assets/close.svg" alt="" className="create-cycle-form-close" onClick={()=>fn(false)}/>
//                 </div>
//                 <div className="create-cycle-form-body">
//                     <span className="create-cycle-form-label">ADD EMPLOYEES</span>
//                     <div className="form-pair">
//                         <input type="text" className="form-pair-input" placeholder="Search Employees" value={search} onChange={(e) => setSearch(e.target.value)} />
//                         <div className="form-pair-input filter-list">

//                             {
//                             filteredEmployees?.map((employee) => (
//                                 <div key={employee?.id} className="filtered-list-item" onClick={() => {
//                                     setSearch("");
//                                     selectedEmployees.push(employee);
//                                     setSelectedEmployees([...selectedEmployees]);
//                                     console.log(selectedEmployees)
//                                     }
//                                     }>
//                                     {employee?.name}
//                                 </div>
//                             )
//                         )
//                             }

//                         </div>
//                         <div className="form-pair-input filtered-list">

//                             {
//                             selectedEmployees?.map((employee: any) => (
//                                 <div key={employee?.id} className="filtered-list-item" onClick={() => {setSearch("");}}>
//                                 {employee?.name}
//                                 <img src="/src/assets/close.svg" alt="" />
//                                 </div>
//                             )
//                         )
//                             }

//                         </div>
//                     </div>
//                 </div>
//                 <div className="create-cycle-form-footer">
//                     <button className="create-cycle-form-cancel" onClick={() => fn(false)}>
//                         Cancel
//                     </button>
//                     <button className="create-cycle-form-submit" onClick={handleSubmit}>Edit Cycle</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

