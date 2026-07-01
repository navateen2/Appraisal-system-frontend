import { Plus, Pen, Loader2, Trash2 } from 'lucide-react';
import './UserList.css';
import { useDeleteUserMutation, useGetUsersQuery } from '../../api_service/employees/employee.api';
import type { UserResponse } from '../../api_service/employees/types';
import { useNavigate } from 'react-router';

export default function UserList() {
  const navigate=useNavigate()
  const { data: responseData} = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const employees: UserResponse[] = Array.isArray(responseData) 
    ? responseData 
    : responseData?.data || [];

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  return (
    <div className="directory-container">
      <div className="directory-wrapper">
        <div className="directory-header">
          <div className="title-area">
            <h1>Employee Directory</h1>
            <p>View and manage all active team members across departments.</p>
          </div>
          <button className="btn-create" onClick={() => navigate('/hr/createuser')}>
            <Plus size={16} />
            Create Employee
          </button>
        </div>
        <div className="directory-card">
          <div className="table-responsive">
              <table className="directory-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Joining date</th>
                    <th >Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="col-id">
                        {employee.id}
                      </td>
                      <td className="col-name">{employee.name}</td>
                      <td className="col-email">{employee.email}</td>
                      <td>
                        <span className="role-badge">{employee.role}</span>
                      </td>
                      <td>
                        <span className="role-badge">{employee.created_at?.slice(0, 10)}</span>
                      </td>
                      <td>
                        <div className="actions-wrapper" >
                          <button 
                            className="btn-action-trigger" 
                            onClick={() => handleDelete(employee.id)}
                            disabled={isDeleting}
                            title="Soft Delete User"
                          >
                            <Trash2 size={20} style={{ color: '#ef4444'}} />
                          </button>
                          <button className="btn-action-trigger" onClick={() => navigate(`/hr/edituser/${employee.id}`)}>
                            <Pen size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
}